--[[
    SimLife Needs & Wants System
    Client-Side Decay System
]]

-- ═══════════════════════════════════════════════════════════════════════════
-- NON-LINEAR DECAY CALCULATION
-- ═══════════════════════════════════════════════════════════════════════════

---Calculate decay speed factor based on current value
---Higher values decay slower, critical values decay faster
---@param currentValue number Current need value (0-100)
---@return number Speed factor multiplier
local function GetDecaySpeedFactor(currentValue)
    if currentValue > 70 then
        return 0.7  -- Slower when healthy
    elseif currentValue > 40 then
        return 1.0  -- Normal speed
    elseif currentValue > 20 then
        return 1.3  -- Faster when low
    else
        return 1.5  -- Very fast when critical (urgency!)
    end
end

---Get multiplier based on current activity
---@param needName string Need name
---@param activity string Current activity state
---@return number Activity multiplier
local function GetActivityMultiplier(needName, activity)
    local needConfig = Config.Needs[needName]
    if not needConfig or not needConfig.decayMultipliers then
        return 1.0
    end
    
    return needConfig.decayMultipliers[activity] or 1.0
end

---Get social multiplier based on nearby players
---@param needName string Need name
---@return number Social multiplier
local function GetSocialMultiplier(needName)
    if needName ~= 'social' then
        return 1.0
    end
    
    local nearbyPlayers = exports.viccs_needs:GetNearbyPlayersCount()
    
    if nearbyPlayers > 0 then
        -- More players = slower social decay (you're socializing!)
        return math.max(0.3, 1.0 - (nearbyPlayers * 0.15))
    else
        -- Alone = faster social decay
        return 1.5
    end
end

---Calculate total decay for a need
---@param needName string Need name
---@param currentValue number Current value
---@param activity string Current activity
---@param deltaTime number Time since last tick in minutes
---@return number Amount to decay
local function CalculateDecay(needName, currentValue, activity, deltaTime)
    local needConfig = Config.Needs[needName]
    if not needConfig then return 0 end
    
    local baseRate = needConfig.decayRate
    local speedFactor = GetDecaySpeedFactor(currentValue)
    local activityMultiplier = GetActivityMultiplier(needName, activity)
    local socialMultiplier = GetSocialMultiplier(needName)
    local globalMultiplier = Config.GlobalDecayMultiplier or 1.0
    
    local totalDecay = baseRate * speedFactor * activityMultiplier * socialMultiplier * globalMultiplier * deltaTime
    
    return totalDecay
end

-- ═══════════════════════════════════════════════════════════════════════════
-- DECAY LOOP
-- ═══════════════════════════════════════════════════════════════════════════

local LastTickTime = GetGameTimer()

CreateThread(function()
    -- Wait for initialization
    while not PlayerNeeds or not next(PlayerNeeds) do
        Wait(1000)
    end
    
    while true do
        Wait(Config.DecayTickInterval)
        
        local currentTime = GetGameTimer()
        local deltaMs = currentTime - LastTickTime
        local deltaMinutes = deltaMs / 60000 -- Convert to minutes
        LastTickTime = currentTime
        
        -- Use global PlayerNeeds directly (reference)
        local needs = PlayerNeeds
        if not needs then 
            print('[Decay] PlayerNeeds is nil')
            goto continue 
        end
        
        -- DEBUG: Print needs count
        if Config.Debug then
            -- local count = 0
            -- for _ in pairs(needs) do count = count + 1 end
            -- print('[Decay] Tick. Needs count:', count, 'DeltaMin:', deltaMinutes)
        end
        
        local activity = exports.viccs_needs:GetCurrentActivity()
        local needsUpdated = false
        
        for needName, currentValue in pairs(needs) do
            local decay = CalculateDecay(needName, currentValue, activity, deltaMinutes)
            
            if decay > 0 then
                local newValue = Utils.Clamp(currentValue - decay, 0, 100)
                
                -- Update directly
                needs[needName] = newValue
                needsUpdated = true
                
                if Config.Debug then
                    print(string.format('[Decay] Updated %s: %.2f -> %.2f', needName, currentValue, newValue))
                end

                -- Check for critical state
                local config = Config.Needs[needName]
                if config then
                    local oldState = Utils.GetNeedState(currentValue, config)
                    local newState = Utils.GetNeedState(newValue, config)
                    
                    -- Notify when entering critical state
                    if oldState ~= Enums.NeedState.CRITICAL and newState == Enums.NeedState.CRITICAL then
                        OnNeedCritical(needName, config)
                    end
                end
            end
        end
        
        -- Trigger want check if any need changed significantly
        if needsUpdated then
            CheckForWantTriggers(needs)
        end
        
        ::continue::
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- CRITICAL STATE HANDLING
-- ═══════════════════════════════════════════════════════════════════════════

---Handle when a need enters critical state
---@param needName string Need name
---@param config table Need config
function OnNeedCritical(needName, config)
    -- Notification
    lib.notify({
        title = 'Atenção!',
        description = config.label .. ' está em nível crítico!',
        type = 'error',
        duration = 5000
    })
    
    -- Send to HUD for pulse animation
    SendNUIMessage({
        action = 'NEED_CRITICAL',
        data = {
            name = needName,
            label = config.label
        }
    })
    
    Utils.DebugPrint('Need critical:', needName)
end

-- ═══════════════════════════════════════════════════════════════════════════
-- WANT TRIGGER CHECK
-- ═══════════════════════════════════════════════════════════════════════════

local LastWantCheck = 0
local WANT_CHECK_COOLDOWN = 30000 -- 30 seconds

---Check if any needs warrant generating new wants
---@param needs table Current needs
function CheckForWantTriggers(needs)
    local currentTime = GetGameTimer()
    
    -- Cooldown to avoid spamming server
    if currentTime - LastWantCheck < WANT_CHECK_COOLDOWN then
        return
    end
    
    -- Check if any need is below threshold
    local shouldCheck = false
    for needName, value in pairs(needs) do
        if value < Config.Wants.triggerThreshold then
            shouldCheck = true
            break
        end
    end
    
    if shouldCheck then
        LastWantCheck = currentTime
        TriggerServerEvent('viccs_needs:server:checkWants')
    end
end

-- ═══════════════════════════════════════════════════════════════════════════
-- DECAY MODIFIERS (for external scripts)
-- ═══════════════════════════════════════════════════════════════════════════

local DecayModifiers = {}

exports('AddDecayModifier', function(id, needName, multiplier, duration)
    DecayModifiers[id] = {
        needName = needName,
        multiplier = multiplier,
        expiresAt = duration and (GetGameTimer() + duration) or nil
    }
end)

exports('RemoveDecayModifier', function(id)
    DecayModifiers[id] = nil
end)

exports('GetDecayModifiers', function()
    return DecayModifiers
end)

-- Clean up expired modifiers
CreateThread(function()
    while true do
        Wait(10000)
        
        local currentTime = GetGameTimer()
        for id, modifier in pairs(DecayModifiers) do
            if modifier.expiresAt and currentTime > modifier.expiresAt then
                DecayModifiers[id] = nil
            end
        end
    end
end)

Utils.DebugPrint('Decay system loaded')
