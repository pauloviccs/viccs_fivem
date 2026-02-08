--[[
    SimLife Needs & Wants System
    Server-Side Wants Manager
]]

local Database = require 'server.database'

local WantsManager = {}

-- ═══════════════════════════════════════════════════════════════════════════
-- WANTS GENERATION
-- ═══════════════════════════════════════════════════════════════════════════

---Check if a want should be triggered based on player needs
---@param needs table Player's current needs
---@param wantConfig table Want configuration from catalog
---@return boolean Should trigger
local function ShouldTriggerWant(needs, wantConfig)
    if not wantConfig.triggers then return false end
    
    for needName, condition in pairs(wantConfig.triggers) do
        local currentValue = needs[needName]
        if not currentValue then return false end
        
        if condition.below and currentValue >= condition.below then
            return false
        end
        
        if condition.above and currentValue <= condition.above then
            return false
        end
    end
    
    return true
end

---Get potential wants for player based on their needs
---@param needs table Player's current needs
---@param activeWants table Currently active wants
---@return table Array of potential want IDs
local function GetPotentialWants(needs, activeWants)
    local potentialWants = {}
    local activeWantIds = {}
    
    -- Build lookup of active want IDs
    for _, want in ipairs(activeWants) do
        activeWantIds[want.want_id] = true
    end
    
    -- Check each want in catalog
    for wantId, wantConfig in pairs(Config.Wants.catalog) do
        -- Skip if already active
        if activeWantIds[wantId] then
            goto continue
        end
        
        -- Check if should trigger
        if ShouldTriggerWant(needs, wantConfig) then
            potentialWants[#potentialWants + 1] = {
                id = wantId,
                config = wantConfig,
                priority = CalculateWantPriority(needs, wantConfig)
            }
        end
        
        ::continue::
    end
    
    -- Sort by priority (highest first)
    table.sort(potentialWants, function(a, b)
        return a.priority > b.priority
    end)
    
    return potentialWants
end

---Calculate priority score for a want
---@param needs table Player's current needs
---@param wantConfig table Want configuration
---@return number Priority score (higher = more urgent)
function CalculateWantPriority(needs, wantConfig)
    local priority = 0
    
    if wantConfig.triggers then
        for needName, condition in pairs(wantConfig.triggers) do
            local currentValue = needs[needName] or 100
            local threshold = condition.below or 50
            
            -- Higher priority when need is further below threshold
            local urgency = threshold - currentValue
            if urgency > 0 then
                priority = priority + urgency
            end
        end
    end
    
    -- Boost priority based on mood bonus
    priority = priority + (wantConfig.moodBonus or 0) * 0.5
    
    return priority
end

-- ═══════════════════════════════════════════════════════════════════════════
-- WANTS MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════════

---Generate new wants for player based on their current needs
---@param source number Player server ID
---@param citizenid string Player's citizen ID
---@param needs table Player's current needs
---@param activeWants table Currently active wants
RegisterNetEvent('viccs_needs:server:checkWants', function()
    local source = source
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    local needs = exports.viccs_needs:GetPlayerNeeds(citizenid)
    if not needs then return end
    
    local activeWants = Database.LoadPlayerWants(citizenid)
    
    -- Check if we have room for more wants
    if #activeWants >= Config.Wants.maxActiveWants then return end
    
    -- Get potential wants
    local potentialWants = GetPotentialWants(needs, activeWants)
    
    -- Add new wants up to the limit
    local slotsAvailable = Config.Wants.maxActiveWants - #activeWants
    local newWants = {}
    
    for i = 1, math.min(slotsAvailable, #potentialWants) do
        local want = potentialWants[i]
        local priority = i == 1 and 'primary' or 'secondary'
        
        Database.AddPlayerWant(citizenid, want.id, priority, Config.Wants.expirationTime)
        
        newWants[#newWants + 1] = {
            want_id = want.id,
            priority = priority,
            config = want.config
        }
    end
    
    -- Update active wants and sync to client
    if #newWants > 0 then
        activeWants = Database.LoadPlayerWants(citizenid)
        TriggerClientEvent('viccs_needs:client:syncWants', source, activeWants)
        
        Utils.DebugPrint('Generated', #newWants, 'new wants for', citizenid)
    end
end)

---Complete a want and apply rewards
RegisterNetEvent('viccs_needs:server:completeWant', function(wantId)
    local source = source
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    local wantConfig = Config.Wants.catalog[wantId]
    
    if not wantConfig then return end
    
    -- Apply need restoration
    if wantConfig.affects then
        for needName, amount in pairs(wantConfig.affects) do
            if amount > 0 then
                TriggerEvent('viccs_needs:server:restoreNeed', needName, amount)
            else
                TriggerEvent('viccs_needs:server:drainNeed', needName, math.abs(amount))
            end
        end
    end
    
    -- Move want to history
    Database.CompleteWant(citizenid, wantId)
    
    -- Get updated wants
    local activeWants = Database.LoadPlayerWants(citizenid)
    
    -- Sync to client
    TriggerClientEvent('viccs_needs:client:syncWants', source, activeWants)
    TriggerClientEvent('viccs_needs:client:wantCompleted', source, wantId, wantConfig.moodBonus or 0)
    
    Utils.DebugPrint('Completed want', wantId, 'for', citizenid)
end)

---Dismiss (cancel) a want without completing
RegisterNetEvent('viccs_needs:server:dismissWant', function(wantId)
    local source = source
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    
    -- Delete the want
    MySQL.update.await(
        'DELETE FROM player_wants WHERE citizenid = ? AND want_id = ?',
        { citizenid, wantId }
    )
    
    -- Get updated wants
    local activeWants = Database.LoadPlayerWants(citizenid)
    
    -- Sync to client
    TriggerClientEvent('viccs_needs:client:syncWants', source, activeWants)
    
    Utils.DebugPrint('Dismissed want', wantId, 'for', citizenid)
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPORTS
-- ═══════════════════════════════════════════════════════════════════════════

exports('TriggerWantCheck', function(source)
    TriggerEvent('viccs_needs:server:checkWants')
end)

exports('CompleteWant', function(citizenid, wantId)
    local wantConfig = Config.Wants.catalog[wantId]
    if not wantConfig then return false end
    
    Database.CompleteWant(citizenid, wantId)
    return true
end)

Utils.DebugPrint('Wants manager loaded')
