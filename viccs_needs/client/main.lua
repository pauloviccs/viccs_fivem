--[[
    SimLife Needs & Wants System
    Client-Side Main Controller
]]

-- Local state
PlayerNeeds = {} -- Global for resource scripts (decay.lua needs sync access)
local PlayerWants = {}
local IsInitialized = false
local HudVisible = true
local CurrentActivity = Enums.ActivityState.IDLE

-- ═══════════════════════════════════════════════════════════════════════════
-- INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════════

print('[VICCS_NEEDS] client/main.lua loaded')

---Initialize needs from server
RegisterNetEvent('viccs_needs:client:initNeeds', function(needs)
    PlayerNeeds = needs
    IsInitialized = true
    
    -- Build needs with state for UI
    local needsWithState = {}
    for needName, value in pairs(PlayerNeeds) do
        local config = Config.Needs[needName]
        if config then
            needsWithState[needName] = {
                value = value,
                state = Utils.GetNeedState(value, config)
            }
        end
    end
    
    -- Send to HUD
    SendNUIMessage({
        action = 'INIT_NEEDS',
        data = {
            needs = needsWithState,
            config = Config.Needs
        }
    })
    
    -- Also send config immediately
    SendNUIMessage({
        action = 'INIT_CONFIG',
        data = {
            hudConfig = Config.HUD,
            needsConfig = Config.Needs,
            wantsConfig = Config.Wants
        }
    })
    
    Utils.DebugPrint('Client initialized with needs')
end)

---Sync wants from server
RegisterNetEvent('viccs_needs:client:syncWants', function(wants)
    PlayerWants = wants
    
    -- Send to HUD
    SendNUIMessage({
        action = 'SYNC_WANTS',
        data = {
            wants = PlayerWants,
            catalog = Config.Wants.catalog
        }
    })
    
    Utils.DebugPrint('Synced', #wants, 'wants')
end)

---Update single need
RegisterNetEvent('viccs_needs:client:updateNeed', function(needName, value)
    if PlayerNeeds[needName] then
        PlayerNeeds[needName] = value
        
        SendNUIMessage({
            action = 'UPDATE_NEED',
            data = {
                name = needName,
                value = value,
                state = Utils.GetNeedState(value, Config.Needs[needName])
            }
        })
    end
end)

---Want completed notification
RegisterNetEvent('viccs_needs:client:wantCompleted', function(wantId, moodBonus)
    local wantConfig = Config.Wants.catalog[wantId]
    if wantConfig then
        lib.notify({
            title = 'Desejo Realizado!',
            description = wantConfig.label,
            type = 'success',
            duration = 5000
        })
        
        SendNUIMessage({
            action = 'WANT_COMPLETED',
            data = {
                wantId = wantId,
                moodBonus = moodBonus
            }
        })
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- HUD COMMANDS
-- ═══════════════════════════════════════════════════════════════════════════

RegisterCommand('hudhide', function()
    HudVisible = not HudVisible
    
    SendNUIMessage({
        action = 'TOGGLE_VISIBILITY',
        data = {
            visible = HudVisible
        }
    })
    
    lib.notify({
        title = 'SimLife HUD',
        description = HudVisible and 'HUD visível' or 'HUD oculta',
        type = 'inform',
        duration = 2000
    })
end, false)

-- ═══════════════════════════════════════════════════════════════════════════
-- ACTIVITY DETECTION
-- ═══════════════════════════════════════════════════════════════════════════

---Detect current player activity for decay multipliers
local function DetectActivity()
    local ped = cache.ped
    
    if IsPedRunning(ped) or IsPedSprinting(ped) then
        return Enums.ActivityState.RUNNING
    elseif IsPedWalking(ped) then
        return Enums.ActivityState.WALKING
    elseif IsPedInAnyVehicle(ped, false) then
        return Enums.ActivityState.DRIVING
    elseif IsPedSittingInAnyVehicle(ped) or GetPedConfigFlag(ped, 415, true) then
        return Enums.ActivityState.SITTING
    else
        return Enums.ActivityState.STANDING
    end
end

-- Activity detection loop
CreateThread(function()
    while true do
        Wait(1000)
        
        if IsInitialized then
            CurrentActivity = DetectActivity()
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- SYNC LOOP
-- ═══════════════════════════════════════════════════════════════════════════

-- Sync needs to server periodically
CreateThread(function()
    while true do
        Wait(Config.SaveInterval)
        
        if IsInitialized then
            TriggerServerEvent('viccs_needs:server:syncNeeds', PlayerNeeds)
        end
    end
end)

-- Check for new wants periodically
CreateThread(function()
    while true do
        Wait(60000) -- Check every minute
        
        if IsInitialized then
            TriggerServerEvent('viccs_needs:server:checkWants')
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- HUD UPDATE LOOP
-- ═══════════════════════════════════════════════════════════════════════════

CreateThread(function()
    while true do
        Wait(Config.HUD.updateInterval)
        
        if IsInitialized and HudVisible then
            -- Build needs update with states
            local needsUpdate = {}
            for needName, value in pairs(PlayerNeeds) do
                local config = Config.Needs[needName]
                if config then
                    needsUpdate[needName] = {
                        value = value,
                        state = Utils.GetNeedState(value, config)
                    }
                end
            end
            
            SendNUIMessage({
                action = 'UPDATE_ALL_NEEDS',
                data = {
                    needs = needsUpdate,
                    activity = CurrentActivity
                }
            })
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- SOCIAL NEED - NEARBY PLAYERS DETECTION
-- ═══════════════════════════════════════════════════════════════════════════

local NearbyPlayersCount = 0

CreateThread(function()
    while true do
        Wait(5000) -- Check every 5 seconds
        
        if IsInitialized then
            local playerPed = cache.ped
            local playerCoords = GetEntityCoords(playerPed)
            local nearbyCount = 0
            
            for _, playerId in ipairs(GetActivePlayers()) do
                if playerId ~= PlayerId() then
                    local targetPed = GetPlayerPed(playerId)
                    local targetCoords = GetEntityCoords(targetPed)
                    local distance = #(playerCoords - targetCoords)
                    
                    if distance < 10.0 then
                        nearbyCount = nearbyCount + 1
                    end
                end
            end
            
            NearbyPlayersCount = nearbyCount
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPORTS
-- ═══════════════════════════════════════════════════════════════════════════

exports('GetNeeds', function()
    return PlayerNeeds
end)

exports('GetNeed', function(needName)
    return PlayerNeeds[needName]
end)

exports('GetWants', function()
    return PlayerWants
end)

exports('IsHudVisible', function()
    return HudVisible
end)

exports('GetCurrentActivity', function()
    return CurrentActivity
end)

exports('GetNearbyPlayersCount', function()
    return NearbyPlayersCount
end)

Utils.DebugPrint('Client main loaded')
-- ═══════════════════════════════════════════════════════════════════════════
-- BRIDGE & METADATA SYNC (Compatibilidade com ox_inventory/qbx_medical)
-- ═══════════════════════════════════════════════════════════════════════════

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    if not PlayerNeeds or not next(PlayerNeeds) then return end
    
    if val.metadata then
        -- Detect external increases (Eating/Drinking)
        -- Only update local if external value is HIGHER (restoration)
        -- Ignore lower values to prevent fighting with our decay
        
        if val.metadata.hunger and PlayerNeeds.hunger and val.metadata.hunger > PlayerNeeds.hunger then
            PlayerNeeds.hunger = val.metadata.hunger
            if Config.Debug then print('[Bridge] Synced Hunger from QBX:', val.metadata.hunger) end
        end
        
        if val.metadata.thirst and PlayerNeeds.thirst and val.metadata.thirst > PlayerNeeds.thirst then
            PlayerNeeds.thirst = val.metadata.thirst
            if Config.Debug then print('[Bridge] Synced Thirst from QBX:', val.metadata.thirst) end
        end
    end
end)

-- Initial Sync on Load
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    local PlayerData = exports.qbx_core:GetPlayerData()
    if PlayerData.metadata then
        if PlayerData.metadata.hunger then PlayerNeeds.hunger = PlayerData.metadata.hunger end
        if PlayerData.metadata.thirst then PlayerNeeds.thirst = PlayerData.metadata.thirst end
    end
end)

-- Loop to send Health/Armor to NUI
CreateThread(function()
    while true do
        Wait(500) -- Update Health HUD every 500ms
        
        if HudVisible then
            local ped = PlayerPedId()
            local data = {
                health = GetEntityHealth(ped) - 100, -- GTA health is 100-200 usually
                armor = GetPedArmour(ped)
            }
            if data.health < 0 then data.health = 0 end
            
            SendNUIMessage({
                action = 'UPDATE_STATUS',
                data = data
            })
        end
    end
end)
