--[[
    SimLife Needs & Wants System
    Server-Side Main Controller
]]

local Database = require 'server.database'
local PlayerNeeds = {} -- Cache: citizenid -> needs table
local PlayerWants = {} -- Cache: citizenid -> wants array

-- ═══════════════════════════════════════════════════════════════════════════
-- PLAYER LIFECYCLE
-- ═══════════════════════════════════════════════════════════════════════════

---Initialize player needs on load
---@param source number Player server ID
local function InitializePlayer(source)
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    
    -- Try to load from database
    local needs = Database.LoadPlayerNeeds(citizenid)
    
    if not needs then
        -- Create new record with defaults
        Database.CreatePlayerNeeds(citizenid)
        needs = Utils.GetDefaultNeeds()
    end
    
    -- Cache player needs
    PlayerNeeds[citizenid] = needs
    
    -- Load wants
    PlayerWants[citizenid] = Database.LoadPlayerWants(citizenid)
    
    -- Send to client
    TriggerClientEvent('viccs_needs:client:initNeeds', source, needs)
    TriggerClientEvent('viccs_needs:client:syncWants', source, PlayerWants[citizenid])
    
    Utils.DebugPrint('Player initialized:', citizenid)
end

---Save and cleanup player data on disconnect
---@param source number Player server ID
local function CleanupPlayer(source)
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    local needs = PlayerNeeds[citizenid]
    
    if needs then
        Database.SavePlayerNeeds(citizenid, needs)
        Utils.DebugPrint('Player saved:', citizenid)
    end
    
    -- Clear cache
    PlayerNeeds[citizenid] = nil
    PlayerWants[citizenid] = nil
end

-- ═══════════════════════════════════════════════════════════════════════════
-- EVENT HANDLERS
-- ═══════════════════════════════════════════════════════════════════════════

-- QBX player loaded
RegisterNetEvent('QBCore:Server:OnPlayerLoaded', function()
    local source = source
    Wait(1000) -- Wait for player data to be fully loaded
    InitializePlayer(source)
end)

-- Player dropped
AddEventHandler('playerDropped', function()
    local source = source
    CleanupPlayer(source)
end)

-- Resource start - initialize already connected players
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    
    local players = GetPlayers()
    for _, playerId in ipairs(players) do
        InitializePlayer(tonumber(playerId))
    end
    
    Utils.DebugPrint('Resource started, initialized', #players, 'players')
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- NEEDS MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════════

---Restore a need for player
RegisterNetEvent('viccs_needs:server:restoreNeed', function(needName, amount)
    local source = source
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    local needs = PlayerNeeds[citizenid]
    
    if not needs or not needs[needName] then return end
    
    -- Validate amount (anti-cheat)
    amount = Utils.Clamp(amount, 0, 100)
    
    -- Apply restoration
    needs[needName] = Utils.Clamp(needs[needName] + amount, 0, 100)
    
    -- Sync to client
    TriggerClientEvent('viccs_needs:client:updateNeed', source, needName, needs[needName])
    
    Utils.DebugPrint('Restored', needName, 'by', amount, 'for', citizenid)
end)

---Drain a need for player
RegisterNetEvent('viccs_needs:server:drainNeed', function(needName, amount)
    local source = source
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    local needs = PlayerNeeds[citizenid]
    
    if not needs or not needs[needName] then return end
    
    -- Validate amount (anti-cheat)
    amount = Utils.Clamp(amount, 0, 100)
    
    -- Apply drain
    needs[needName] = Utils.Clamp(needs[needName] - amount, 0, 100)
    
    -- Sync to client
    TriggerClientEvent('viccs_needs:client:updateNeed', source, needName, needs[needName])
    
    Utils.DebugPrint('Drained', needName, 'by', amount, 'for', citizenid)
end)

---Sync all needs from client (with validation)
RegisterNetEvent('viccs_needs:server:syncNeeds', function(clientNeeds)
    local source = source
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return end
    
    local citizenid = Player.PlayerData.citizenid
    local serverNeeds = PlayerNeeds[citizenid]
    
    if not serverNeeds then return end
    
    -- Validate and apply client needs (anti-cheat: only allow decrease)
    for needName, clientValue in pairs(clientNeeds) do
        if serverNeeds[needName] then
            -- Only allow client to decrease needs (decay)
            -- Increases must come through restoreNeed event OR External Bridge
            if clientValue < serverNeeds[needName] then
                serverNeeds[needName] = Utils.Clamp(clientValue, 0, 100)
            end
        end
    end
    
    -- Sync back to QBX Metadata (so other scripts know we are hungry/thirsty)
    if serverNeeds.hunger then
        Player.Functions.SetMetaData('hunger', serverNeeds.hunger)
    end
    
    if serverNeeds.thirst then
        Player.Functions.SetMetaData('thirst', serverNeeds.thirst)
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- CALLBACKS
-- ═══════════════════════════════════════════════════════════════════════════

lib.callback.register('viccs_needs:server:getNeeds', function(source)
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return nil end
    
    local citizenid = Player.PlayerData.citizenid
    return PlayerNeeds[citizenid] or Utils.GetDefaultNeeds()
end)

lib.callback.register('viccs_needs:server:getWants', function(source)
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return {} end
    
    local citizenid = Player.PlayerData.citizenid
    return PlayerWants[citizenid] or {}
end)

lib.callback.register('viccs_needs:server:canAfford', function(source, amount)
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return false end
    
    return Player.PlayerData.money.cash >= amount
end)

lib.callback.register('viccs_needs:server:payForInteraction', function(source, amount)
    local Player = exports.qbx_core:GetPlayer(source)
    if not Player then return false end
    
    if Player.PlayerData.money.cash >= amount then
        Player.Functions.RemoveMoney('cash', amount, 'simlife-needs-interaction')
        return true
    end
    
    return false
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- ADMIN COMMANDS
-- ═══════════════════════════════════════════════════════════════════════════

lib.addCommand('fullneeds', {
    help = 'Preencher todas as necessidades (Admin)',
    params = {
        {
            name = 'target',
            type = 'playerId',
            help = 'ID do jogador (Opcional)',
            optional = true,
        },
    },
    restricted = 'group.admin',
}, function(source, args)
    local targetSource = args.target or source
    local targetPlayer = exports.qbx_core:GetPlayer(targetSource)

    if not targetPlayer then
        if source > 0 then
            lib.notify(source, { title = 'Erro', description = 'Jogador não encontrado.', type = 'error' })
        end
        return
    end

    local citizenid = targetPlayer.PlayerData.citizenid
    local needs = PlayerNeeds[citizenid]

    if not needs then return end

    -- Reset all configured needs to 100
    for needName, _ in pairs(Config.Needs) do
        needs[needName] = 100.0
        
        -- Sync metadata for core needs (Hunger/Thirst)
        if needName == 'hunger' or needName == 'thirst' then
            targetPlayer.Functions.SetMetaData(needName, 100)
        end
    end

    -- Trigger client update (Uses initNeeds to refresh everything at once)
    TriggerClientEvent('viccs_needs:client:initNeeds', targetSource, needs)
    
    -- Notify Admin
    if source > 0 then 
        lib.notify(source, {
            title = 'SimLife Needs',
            description = 'Necessidades restauradas para ' .. targetPlayer.PlayerData.charinfo.firstname,
            type = 'success'
        })
    end
    
    -- Notify Target
    if targetSource ~= source then
        lib.notify(targetSource, {
            title = 'SimLife Needs',
            description = 'Suas necessidades foram restauradas pela administração.',
            type = 'success'
        })
    end
    
    Utils.DebugPrint('Admin restored needs for', citizenid)
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- AUTO-SAVE LOOP
-- ═══════════════════════════════════════════════════════════════════════════

CreateThread(function()
    while true do
        Wait(Config.SaveInterval)
        
        local savedCount = 0
        for citizenid, needs in pairs(PlayerNeeds) do
            Database.SavePlayerNeeds(citizenid, needs)
            savedCount = savedCount + 1
        end
        
        -- Clean up expired wants
        local expiredCount = Database.CleanupExpiredWants()
        
        if savedCount > 0 or expiredCount > 0 then
            Utils.DebugPrint('Auto-save: saved', savedCount, 'players, cleaned', expiredCount, 'expired wants')
        end
    end
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPORTS
-- ═══════════════════════════════════════════════════════════════════════════

exports('GetPlayerNeeds', function(citizenid)
    return PlayerNeeds[citizenid]
end)

exports('SetPlayerNeed', function(citizenid, needName, value)
    if PlayerNeeds[citizenid] and PlayerNeeds[citizenid][needName] then
        PlayerNeeds[citizenid][needName] = Utils.Clamp(value, 0, 100)
        return true
    end
    return false
end)

exports('RestorePlayerNeed', function(citizenid, needName, amount)
    if PlayerNeeds[citizenid] and PlayerNeeds[citizenid][needName] then
        PlayerNeeds[citizenid][needName] = Utils.Clamp(PlayerNeeds[citizenid][needName] + amount, 0, 100)
        return true
    end
    return false
end)

exports('DrainPlayerNeed', function(citizenid, needName, amount)
    if PlayerNeeds[citizenid] and PlayerNeeds[citizenid][needName] then
        PlayerNeeds[citizenid][needName] = Utils.Clamp(PlayerNeeds[citizenid][needName] - amount, 0, 100)
        return true
    end
    return false
end)

Utils.DebugPrint('Server main loaded')
