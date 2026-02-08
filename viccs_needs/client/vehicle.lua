print('[VICCS_NEEDS] Loading client/vehicle.lua...')

local seatbeltOn = false
local cruiseOn = false

-- Config defaults (km/h)
local minSpeeds = {
    unbuckled = 30.0,
    buckled = 200.0
}

local function updateSeatbeltPhysics()
    local limit = (seatbeltOn or LocalPlayer.state.harness) and minSpeeds.buckled or minSpeeds.unbuckled
    -- SetFlyThroughWindscreenParams(minSpeed, epsilon, minDamage, minDuration)
    -- Native expects Meters Per Second
    SetFlyThroughWindscreenParams(limit / 3.6, 1.0, 17.0, 10.0)
end

-- Seatbelt Command
RegisterCommand('seatbelt', function()
    local vehicle = cache.vehicle or GetVehiclePedIsIn(PlayerPedId(), false)
    if not vehicle or vehicle == 0 then return end
    
    local class = GetVehicleClass(vehicle)
    if class == 8 or class == 13 or class == 14 then return end -- Bikes, Cycles, Boats

    if LocalPlayer.state.harness then return end -- Harness overrides

    seatbeltOn = not seatbeltOn
    
    -- Update Physics
    updateSeatbeltPhysics()
    
    -- Visual feedback
    lib.notify({
        title = 'Cinto de Segurança',
        description = seatbeltOn and 'Colocado' or 'Retirado',
        type = seatbeltOn and 'success' or 'warning'
    })
    
    -- Sync state for others/HUD
    LocalPlayer.state:set('seatbelt', seatbeltOn, true)
    
    -- Sound (Optional, if interact-sound is installed)
    -- TriggerEvent('interact-sound:client:PlayOnOne', seatbeltOn and 'buckle' or 'unbuckle', 0.5)
end, false)

RegisterKeyMapping('seatbelt', 'Toggle Seatbelt', 'keyboard', 'B')

-- Disable Vehicle Exit Loop (Immersive Constraint)
CreateThread(function()
    while true do
        local sleep = 1000
        if (seatbeltOn or LocalPlayer.state.harness) and (cache.vehicle or IsPedInAnyVehicle(PlayerPedId(), false)) then
            sleep = 0
            DisableControlAction(0, 75, true) -- EXIT_VEHICLE
            DisableControlAction(27, 75, true) -- INPUT_VEH_EXIT
        end
        Wait(sleep)
    end
end)

-- Initial Physics Setup
CreateThread(function()
    updateSeatbeltPhysics()
end)

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
                
                -- Reset seatbelt on new entry (Optional, but safer for logic state)
                seatbeltOn = false
                LocalPlayer.state:set('seatbelt', false, true)
                updateSeatbeltPhysics()

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
                -- Reset seatbelt logic on exit
                seatbeltOn = false
                updateSeatbeltPhysics()

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
