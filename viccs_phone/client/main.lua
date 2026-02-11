local phoneOpen = false

local function togglePhone()
    phoneOpen = not phoneOpen
    SetNuiFocus(phoneOpen, phoneOpen)
    SendNUIMessage({
        action = "setVisible",
        data = phoneOpen
    })
end

RegisterCommand('phone', function()
    togglePhone()
end, false)

RegisterKeyMapping('phone', 'Open Phone', 'keyboard', 'F1')

-- Close phone callback from NUI
RegisterNUICallback('hideFrame', function(_, cb)
    togglePhone()
    cb({})
end)

-- Ensure phone is closed on resource start
CreateThread(function()
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = "setVisible",
        data = false
    })
end)

-- Wrapper to safe handle callbacks
local function RegisterCallback(name, serverEvent)
    RegisterNUICallback(name, function(data, cb)
        print('[Viccs Phone] NUI Callback Triggered: ' .. name)
        -- Use false for delay argument in lib.callback.await
        local success, result = pcall(function()
            return lib.callback.await(serverEvent, false, data)
        end)
        
        if not success then
            print('^1Error in NUI Callback ' .. name .. ': ' .. tostring(result) .. '^7')
            cb({ success = false, message = "Internal Error" })
        else
            print('[Viccs Phone] Callback ' .. name .. ' success')
            cb(result)
        end
    end)
end

-- Settings
RegisterNUICallback('saveSettings', function(data, cb)
    TriggerServerEvent('phone:server:SaveSettings', data)
    cb('ok')
end)

RegisterNUICallback('getSettings', function(_, cb)
    local settings = lib.callback.await('phone:server:GetSettings', false)
    cb(settings)
end)
