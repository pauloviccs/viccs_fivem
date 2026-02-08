--[[
    SimLife Needs & Wants System
    Shared Utilities
]]

Utils = {}

---Get the state of a need based on its value
---@param value number Current need value (0-100)
---@param config table Need config with thresholds
---@return string State ('healthy', 'warning', 'critical')
function Utils.GetNeedState(value, config)
    if value <= config.criticalThreshold then
        return Enums.NeedState.CRITICAL
    elseif value <= config.warningThreshold then
        return Enums.NeedState.WARNING
    else
        return Enums.NeedState.HEALTHY
    end
end

---Clamp a value between min and max
---@param value number Value to clamp
---@param min number Minimum value
---@param max number Maximum value
---@return number Clamped value
function Utils.Clamp(value, min, max)
    if value < min then return min end
    if value > max then return max end
    return value
end

---Linear interpolation
---@param a number Start value
---@param b number End value
---@param t number Interpolation factor (0-1)
---@return number Interpolated value
function Utils.Lerp(a, b, t)
    return a + (b - a) * t
end

---Get table of all need names
---@return table Array of need names
function Utils.GetNeedNames()
    local names = {}
    for name, _ in pairs(Config.Needs) do
        names[#names + 1] = name
    end
    return names
end

---Create default needs table with all values at 100
---@return table Default needs
function Utils.GetDefaultNeeds()
    local needs = {}
    for name, _ in pairs(Config.Needs) do
        needs[name] = 100.0
    end
    return needs
end

---Deep copy a table
---@param orig table Original table
---@return table Copied table
function Utils.DeepCopy(orig)
    local orig_type = type(orig)
    local copy
    if orig_type == 'table' then
        copy = {}
        for orig_key, orig_value in next, orig, nil do
            copy[Utils.DeepCopy(orig_key)] = Utils.DeepCopy(orig_value)
        end
        setmetatable(copy, Utils.DeepCopy(getmetatable(orig)))
    else
        copy = orig
    end
    return copy
end

---Debug print (only if Config.Debug is true)
---@param ... any Values to print
function Utils.DebugPrint(...)
    if Config.Debug then
        print('[SimLife Needs]', ...)
    end
end

---Format need value for display
---@param value number Need value
---@return string Formatted string
function Utils.FormatNeedValue(value)
    return string.format('%.0f%%', value)
end

---Check if a prop model is in a category
---@param model number|string Model hash or name
---@param categoryId string Category ID from Config.InteractableProps
---@return boolean True if model is in category
function Utils.IsModelInCategory(model, categoryId)
    local category = Config.InteractableProps[categoryId]
    if not category then return false end
    
    local modelHash = type(model) == 'string' and joaat(model) or model
    
    for _, propModel in ipairs(category.models) do
        local propHash = type(propModel) == 'string' and joaat(propModel) or propModel
        if propHash == modelHash then
            return true
        end
    end
    
    return false
end

return Utils
