--[[
    SimLife Needs & Wants System
    Client-Side Prop Interactions (ox_target)
]]

-- Cooldown tracking
local Cooldowns = {} -- categoryId -> timestamp

-- ═══════════════════════════════════════════════════════════════════════════
-- COOLDOWN MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════════

---Check if interaction is on cooldown
---@param categoryId string Category ID
---@return boolean True if can use
local function CanUseInteraction(categoryId)
    local lastUse = Cooldowns[categoryId]
    if not lastUse then return true end
    
    local currentTime = GetGameTimer()
    local cooldownMs = Config.Interactions.cooldown * 1000
    
    return (currentTime - lastUse) >= cooldownMs
end

---Set cooldown for category
---@param categoryId string Category ID
local function SetCooldown(categoryId)
    Cooldowns[categoryId] = GetGameTimer()
end

---Get remaining cooldown time
---@param categoryId string Category ID
---@return number Seconds remaining
local function GetCooldownRemaining(categoryId)
    local lastUse = Cooldowns[categoryId]
    if not lastUse then return 0 end
    
    local currentTime = GetGameTimer()
    local cooldownMs = Config.Interactions.cooldown * 1000
    local elapsed = currentTime - lastUse
    
    if elapsed >= cooldownMs then return 0 end
    
    return math.ceil((cooldownMs - elapsed) / 1000)
end

-- ═══════════════════════════════════════════════════════════════════════════
-- GENDER CHECK
-- ═══════════════════════════════════════════════════════════════════════════

---Check if player can use gender-restricted prop
---@param category table Category config
---@return boolean Can use
local function CanUseGenderRestricted(category)
    if not category.maleOnly and not category.femaleOnly then
        return true
    end
    
    local ped = cache.ped
    local model = GetEntityModel(ped)
    local isMale = model == `mp_m_freemode_01`
    
    if category.maleOnly and not isMale then
        return false
    end
    
    if category.femaleOnly and isMale then
        return false
    end
    
    return true
end

-- ═══════════════════════════════════════════════════════════════════════════
-- INTERACTION EXECUTION
-- ═══════════════════════════════════════════════════════════════════════════

---Execute the need action
---@param categoryId string Category ID
---@param entity number Entity handle
local function StartNeedAction(categoryId, entity)
    local category = Config.InteractableProps[categoryId]
    if not category then return end
    
    -- Check cooldown
    if not CanUseInteraction(categoryId) then
        local remaining = GetCooldownRemaining(categoryId)
        lib.notify({
            title = 'Aguarde',
            description = 'Disponível em ' .. remaining .. ' segundos',
            type = 'error',
            duration = 3000
        })
        return
    end
    
    -- Check gender restriction
    if not CanUseGenderRestricted(category) then
        lib.notify({
            title = 'Não disponível',
            description = 'Você não pode usar isso',
            type = 'error',
            duration = 3000
        })
        return
    end
    
    -- Check money requirement
    if category.requiresMoney then
        local canAfford = lib.callback.await('viccs_needs:server:canAfford', false, category.requiresMoney)
        if not canAfford then
            lib.notify({
                title = 'Sem dinheiro',
                description = 'Você precisa de $' .. category.requiresMoney,
                type = 'error',
                duration = 3000
            })
            return
        end
    end
    
    local ped = cache.ped
    local success = false
    
    -- Freeze player if configured
    if Config.Interactions.freezePlayer then
        FreezeEntityPosition(ped, true)
    end
    
    -- Use pcall to safely handle animation loading errors
    local animLoaded = pcall(function()
        lib.requestAnimDict(category.animation.dict)
    end)
    
    if not animLoaded then
        -- Animation failed to load - unfreeze and notify
        FreezeEntityPosition(ped, false)
        lib.notify({
            title = 'Erro',
            description = 'Animação não disponível',
            type = 'error',
            duration = 3000
        })
        Utils.DebugPrint('Failed to load animation:', category.animation.dict)
        return
    end
    
    -- Play animation
    TaskPlayAnim(ped, category.animation.dict, category.animation.clip,
        8.0, 8.0, -1, category.animation.flag, 0, false, false, false)
    
    -- Apply screen effect if enabled
    if Config.Interactions.screenEffect and Config.Interactions.screenEffect.enabled then
        AnimpostfxPlay(Config.Interactions.screenEffect.effect, 0, false)
    end
    
    -- Show progress bar (wrapped in pcall for safety)
    local progressOk, progressResult = pcall(function()
        return lib.progressBar({
            duration = category.duration,
            label = category.progressLabel,
            useWhileDead = false,
            canCancel = true,
            disable = {
                car = true,
                move = true,
                combat = true,
                mouse = false
            }
        })
    end)
    
    success = progressOk and progressResult
    
    -- ALWAYS stop screen effect
    if Config.Interactions.screenEffect and Config.Interactions.screenEffect.enabled then
        AnimpostfxStop(Config.Interactions.screenEffect.effect)
    end
    
    -- ALWAYS clear animation and unfreeze (critical to prevent stuck)
    ClearPedTasks(ped)
    FreezeEntityPosition(ped, false)
    
    if success then
        -- Deduct money if required
        if category.requiresMoney then
            lib.callback.await('viccs_needs:server:payForInteraction', false, category.requiresMoney)
        end
        
        -- Restore primary need
        TriggerServerEvent('viccs_needs:server:restoreNeed', category.need, category.fillAmount)
        
        -- Restore secondary needs
        if category.alsoRestores then
            for needName, amount in pairs(category.alsoRestores) do
                TriggerServerEvent('viccs_needs:server:restoreNeed', needName, amount)
            end
        end
        
        -- Drain needs (negative effects)
        if category.alsoDrains then
            for needName, amount in pairs(category.alsoDrains) do
                TriggerServerEvent('viccs_needs:server:drainNeed', needName, amount)
            end
        end
        
        -- Set cooldown
        SetCooldown(categoryId)
        
        -- Success notification
        lib.notify({
            title = 'SimLife',
            description = 'Você se sente melhor!',
            type = 'success',
            duration = 3000
        })
        
        Utils.DebugPrint('Completed interaction:', categoryId)
    else
        -- Cancelled or error notification
        lib.notify({
            title = 'Cancelado',
            description = 'Ação interrompida',
            type = 'error',
            duration = 2000
        })
    end
end

-- ═══════════════════════════════════════════════════════════════════════════
-- OX_TARGET REGISTRATION
-- ═══════════════════════════════════════════════════════════════════════════

---Register all prop targets
local function RegisterPropTargets()
    for categoryId, category in pairs(Config.InteractableProps) do
        -- Skip if no models defined
        if not category.models or #category.models == 0 then
            goto continue
        end
        
        -- Build label without "..."
        local label = category.progressLabel:gsub('%.%.%.', ''):gsub('%s+$', '')
        
        -- Register with ox_target
        exports.ox_target:addModel(category.models, {
            {
                name = 'simlife_' .. categoryId,
                icon = category.icon or 'fas fa-hand-pointer',
                label = label,
                distance = Config.Interactions.targetDistance,
                onSelect = function(data)
                    StartNeedAction(categoryId, data.entity)
                end,
                canInteract = function(entity, distance, coords, name)
                    -- Check cooldown
                    if not CanUseInteraction(categoryId) then
                        return false
                    end
                    
                    -- Check gender
                    if not CanUseGenderRestricted(category) then
                        return false
                    end
                    
                    return true
                end
            }
        })
        
        Utils.DebugPrint('Registered', #category.models, 'props for', categoryId)
        
        ::continue::
    end
end

-- ═══════════════════════════════════════════════════════════════════════════
-- INITIALIZATION
-- ═══════════════════════════════════════════════════════════════════════════

CreateThread(function()
    -- Wait for ox_target to be ready
    while GetResourceState('ox_target') ~= 'started' do
        Wait(500)
    end
    
    Wait(1000) -- Extra buffer
    
    RegisterPropTargets()
    
    Utils.DebugPrint('Prop interactions initialized')
end)

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPORTS
-- ═══════════════════════════════════════════════════════════════════════════

exports('GetCooldownRemaining', GetCooldownRemaining)
exports('CanUseInteraction', CanUseInteraction)
exports('ClearCooldown', function(categoryId)
    Cooldowns[categoryId] = nil
end)

exports('TriggerInteraction', function(categoryId, entity)
    StartNeedAction(categoryId, entity)
end)

Utils.DebugPrint('Interactions module loaded')
