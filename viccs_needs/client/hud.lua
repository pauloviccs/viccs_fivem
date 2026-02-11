--[[
    SimLife Needs & Wants System
    Client-Side HUD Integration
]]

local HudReady = false

-- ═══════════════════════════════════════════════════════════════════════════
-- HIDE VANILLA GTA RADAR/HUD
-- ═══════════════════════════════════════════════════════════════════════════

CreateThread(function()
    while true do
        Wait(0)
        -- Hide the vanilla minimap/radar completely unless in vehicle
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            DisplayRadar(true)
        else
            DisplayRadar(false)
        end
        
        HideHudComponentThisFrame(6) -- Vehicle name
        HideHudComponentThisFrame(7) -- Area name
        HideHudComponentThisFrame(8) -- Vehicle class
        HideHudComponentThisFrame(9) -- Street name
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- NUI FOCUS MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════════

---The HUD doesn't need focus - it's always visible but non-interactive
---Focus is only needed for specific interactions (like wants menu)

-- ═══════════════════════════════════════════════════════════════════════════
-- NUI CALLBACKS
-- ═══════════════════════════════════════════════════════════════════════════

RegisterNUICallback('hudReady', function(_, cb)
    HudReady = true
    Utils.DebugPrint('HUD ready')
    
    -- Send initial config
    SendNUIMessage({
        action = 'INIT_CONFIG',
        data = {
            hudConfig = Config.HUD,
            needsConfig = Config.Needs,
            wantsConfig = Config.Wants
        }
    })
    
    cb({ ok = true })
end)

RegisterNUICallback('dismissWant', function(data, cb)
    if data.wantId then
        TriggerServerEvent('viccs_needs:server:dismissWant', data.wantId)
    end
    cb({ ok = true })
end)

RegisterNUICallback('requestWantInfo', function(data, cb)
    local wantId = data.wantId
    local wantConfig = Config.Wants.catalog[wantId]
    
    if wantConfig then
        cb({
            ok = true,
            want = {
                id = wantId,
                label = wantConfig.label,
                description = wantConfig.description,
                icon = wantConfig.icon,
                affects = wantConfig.affects,
                moodBonus = wantConfig.moodBonus
            }
        })
    else
        cb({ ok = false })
    end
end)

RegisterNUICallback('getConfig', function(_, cb)
    cb({
        ok = true,
        config = {
            hud = Config.HUD,
            needs = Config.Needs,
            wants = Config.Wants
        }
    })
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- HUD STATE MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════════

local IsHudMinimized = false

---Toggle HUD minimized state
RegisterCommand('hudmin', function()
    IsHudMinimized = not IsHudMinimized
    
    SendNUIMessage({
        action = 'SET_MINIMIZED',
        data = {
            minimized = IsHudMinimized
        }
    })
end, false)

-- ═══════════════════════════════════════════════════════════════════════════
-- VEHICLE HUD HIDING (Optional)
-- ═══════════════════════════════════════════════════════════════════════════

local WasInVehicle = false

CreateThread(function()
    while true do
        Wait(500)
        
        local inVehicle = IsPedInAnyVehicle(cache.ped, false)
        
        if inVehicle ~= WasInVehicle then
            WasInVehicle = inVehicle
            
            -- Could optionally minimize HUD in vehicle
            -- SendNUIMessage({
            --     action = 'SET_VEHICLE_MODE',
            --     data = { inVehicle = inVehicle }
            -- })
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- PAUSE MENU HANDLING
-- ═══════════════════════════════════════════════════════════════════════════

local WasPaused = false

CreateThread(function()
    while true do
        Wait(200)
        
        local isPaused = IsPauseMenuActive()
        
        if isPaused ~= WasPaused then
            WasPaused = isPaused
            
            SendNUIMessage({
                action = 'SET_PAUSED',
                data = {
                    paused = isPaused
                }
            })
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPORTS
-- ═══════════════════════════════════════════════════════════════════════════

exports('IsHudReady', function()
    return HudReady
end)

exports('SendHudMessage', function(action, data)
    if HudReady then
        SendNUIMessage({
            action = action,
            data = data
        })
        return true
    end
    return false
end)

exports('MinimizeHud', function(minimize)
    IsHudMinimized = minimize
    SendNUIMessage({
        action = 'SET_MINIMIZED',
        data = { minimized = minimize }
    })
end)

Utils.DebugPrint('HUD integration loaded')
