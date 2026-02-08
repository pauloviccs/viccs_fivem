print('[VICCS_NEEDS] Loading client/vehicle.lua...')

local seatbeltOn = false
local cruiseOn = false

-- Seatbelt Command
RegisterCommand('seatbelt', function()
    if not cache.vehicle then return end
    
    seatbeltOn = not seatbeltOn
    -- Play sound?
    -- TriggerEvent('interact-sound:client:PlayOnOne', seatbeltOn and 'buckle' or 'unbuckle', 0.5)
    
    lib.notify({
        title = 'Cinto de Segurança',
        description = seatbeltOn and 'Colocado' or 'Retirado',
        type = seatbeltOn and 'success' or 'warning'
    })
    
    -- Ejection Logic handled here or external? 
    -- For now, let's keep it simple visual. If user needs ejection logic, we can add.
    -- Usually qbx_smallresources handles ejection. We just visualize.
    -- But qbx_hud reads LocalPlayer.state.seatbelt. 
    -- We can set it for compatibility.
    LocalPlayer.state:set('seatbelt', seatbeltOn, true)
end, false)

RegisterKeyMapping('seatbelt', 'Toggle Seatbelt', 'keyboard', 'B')

-- HUD Loop
CreateThread(function()
    print('[VICCS_NEEDS] Vehicle HUD thread started')
    local wasInVehicle = false
    
    while true do
        local sleep = 1000
        -- Simplify cache access for debugging
        local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
        if vehicle == 0 then vehicle = nil end
        
        -- If ox_lib cache is working, we can use it, but let's be safe for now
        if cache and cache.vehicle then
            vehicle = cache.vehicle
        end
        
        if vehicle then
            sleep = 50 -- 20fps update for smooth speedometer
            
            if not wasInVehicle then
                wasInVehicle = true
                SendNUIMessage({
                    action = 'TOGGLE_VEHICLE_HUD',
                    data = { visible = true }
                })
                DisplayRadar(true) -- Show minimap
            end
            
            local speed = GetEntitySpeed(vehicle) * 3.6 -- km/h
            local fuel = GetVehicleFuelLevel(vehicle)
            local rpm = GetVehicleCurrentRpm(vehicle)
            local gear = GetVehicleCurrentGear(vehicle)
            local engineHealth = GetVehicleEngineHealth(vehicle)
            
            -- Send Data
            SendNUIMessage({
                action = 'UPDATE_VEHICLE',
                data = {
                    speed = math.floor(speed),
                    fuel = fuel,
                    rpm = rpm,
                    gear = gear,
                    engineHealth = engineHealth,
                    seatbelt = seatbeltOn or LocalPlayer.state.seatbelt -- Fallback to state if set externally
                }
            })
            
        else
            if wasInVehicle then
                wasInVehicle = false
                SendNUIMessage({
                    action = 'TOGGLE_VEHICLE_HUD',
                    data = { visible = false }
                })
                DisplayRadar(false) -- Hide minimap
            end
        end
        
        Wait(sleep)
    end
end)
