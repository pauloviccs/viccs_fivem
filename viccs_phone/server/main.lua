local function log(msg)
    print("^5[Viccs Phone]^7 " .. msg)
end

-- Check dependencies
if not GetResourceState('qbx_core'):find('start') then
    log("^1Error: qbx_core is not started! Phone will not work.^7")
    return
end



-- Save Settings
RegisterNetEvent('phone:server:SaveSettings', function(data)
    local src = source
    local player = exports.qbx_core:GetPlayer(src)
    if not player then return end
    
    local citizenid = player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_settings (citizenid, `key`, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?', {
        citizenid, data.key, data.value, data.value
    })
end)

-- Get Settings
lib.callback.register('phone:server:GetSettings', function(source)
    local player = exports.qbx_core:GetPlayer(source)
    if not player then return {} end

    local citizenid = player.PlayerData.citizenid
    local rows = MySQL.query.await('SELECT `key`, value FROM phone_settings WHERE citizenid = ?', { citizenid })
    
    local settings = {}
    if rows then
        for _, row in ipairs(rows) do
            settings[row.key] = row.value
        end
    end
    
    return settings
end)

