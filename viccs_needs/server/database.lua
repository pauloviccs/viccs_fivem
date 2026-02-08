--[[
    SimLife Needs & Wants System
    Server-Side Database Layer
]]

local Database = {}

---Load player needs from database
---@param citizenid string Player's citizen ID
---@return table|nil Needs data or nil if not found
function Database.LoadPlayerNeeds(citizenid)
    local result = MySQL.query.await('SELECT * FROM player_needs WHERE citizenid = ?', { citizenid })
    
    if result and result[1] then
        local row = result[1]
        return {
            hunger = row.hunger or 100.0,
            thirst = row.thirst or 100.0,
            energy = row.energy or 100.0,
            hygiene = row.hygiene or 100.0,
            bladder = row.bladder or 100.0,
            social = row.social or 100.0,
            fun = row.fun or 100.0,
            comfort = row.comfort or 100.0
        }
    end
    
    return nil
end

---Create new player needs record
---@param citizenid string Player's citizen ID
---@return boolean Success
function Database.CreatePlayerNeeds(citizenid)
    local success = MySQL.insert.await(
        'INSERT INTO player_needs (citizenid) VALUES (?) ON DUPLICATE KEY UPDATE citizenid = citizenid',
        { citizenid }
    )
    
    return success ~= nil
end

---Save player needs to database
---@param citizenid string Player's citizen ID
---@param needs table Needs data
---@return boolean Success
function Database.SavePlayerNeeds(citizenid, needs)
    local affectedRows = MySQL.update.await([[
        UPDATE player_needs SET
            hunger = ?,
            thirst = ?,
            energy = ?,
            hygiene = ?,
            bladder = ?,
            social = ?,
            fun = ?,
            comfort = ?
        WHERE citizenid = ?
    ]], {
        needs.hunger,
        needs.thirst,
        needs.energy,
        needs.hygiene,
        needs.bladder,
        needs.social,
        needs.fun,
        needs.comfort,
        citizenid
    })
    
    return affectedRows > 0
end

---Load active wants for player
---@param citizenid string Player's citizen ID
---@return table Array of active wants
function Database.LoadPlayerWants(citizenid)
    local result = MySQL.query.await([[
        SELECT * FROM player_wants 
        WHERE citizenid = ? AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY priority DESC, created_at ASC
    ]], { citizenid })
    
    return result or {}
end

---Add a want for player
---@param citizenid string Player's citizen ID
---@param wantId string Want ID from config
---@param priority string 'primary' or 'secondary'
---@param expiresMinutes number|nil Minutes until expiration
---@return number|nil Insert ID
function Database.AddPlayerWant(citizenid, wantId, priority, expiresMinutes)
    local expiresAt = nil
    if expiresMinutes then
        expiresAt = os.date('%Y-%m-%d %H:%M:%S', os.time() + (expiresMinutes * 60))
    end
    
    local insertId = MySQL.insert.await([[
        INSERT INTO player_wants (citizenid, want_id, priority, expires_at)
        VALUES (?, ?, ?, ?)
    ]], { citizenid, wantId, priority or 'secondary', expiresAt })
    
    return insertId
end

---Remove a want
---@param wantRowId number Database row ID
---@return boolean Success
function Database.RemovePlayerWant(wantRowId)
    local affectedRows = MySQL.update.await(
        'DELETE FROM player_wants WHERE id = ?',
        { wantRowId }
    )
    
    return affectedRows > 0
end

---Complete a want (move to history)
---@param citizenid string Player's citizen ID
---@param wantId string Want ID
---@return boolean Success
function Database.CompleteWant(citizenid, wantId)
    -- Add to history
    MySQL.insert.await([[
        INSERT INTO player_wants_history (citizenid, want_id)
        VALUES (?, ?)
    ]], { citizenid, wantId })
    
    -- Remove from active wants
    local affectedRows = MySQL.update.await([[
        DELETE FROM player_wants WHERE citizenid = ? AND want_id = ?
    ]], { citizenid, wantId })
    
    return affectedRows > 0
end

---Clean up expired wants
---@return number Number of deleted records
function Database.CleanupExpiredWants()
    local affectedRows = MySQL.update.await([[
        DELETE FROM player_wants WHERE expires_at IS NOT NULL AND expires_at < NOW()
    ]])
    
    return affectedRows or 0
end

---Get want completion count for player
---@param citizenid string Player's citizen ID
---@return number Total completed wants
function Database.GetWantCompletionCount(citizenid)
    local result = MySQL.scalar.await(
        'SELECT COUNT(*) FROM player_wants_history WHERE citizenid = ?',
        { citizenid }
    )
    
    return result or 0
end

-- Export database functions
exports('Database', function()
    return Database
end)

return Database
