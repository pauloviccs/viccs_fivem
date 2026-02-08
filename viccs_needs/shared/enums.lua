--[[
    SimLife Needs & Wants System
    Shared Enums
]]

Enums = {}

-- Need states
Enums.NeedState = {
    HEALTHY = 'healthy',
    WARNING = 'warning',
    CRITICAL = 'critical'
}

-- Player activity states (affects decay multipliers)
Enums.ActivityState = {
    IDLE = 'idle',
    WALKING = 'walking',
    RUNNING = 'running',
    DRIVING = 'driving',
    WORKING = 'working',
    SLEEPING = 'sleeping',
    SITTING = 'sitting',
    STANDING = 'standing'
}

-- Want priorities
Enums.WantPriority = {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

-- Animation flags
Enums.AnimFlags = {
    NORMAL = 1,
    LOOP = 1,
    STOP_LAST_FRAME = 2,
    UPPERBODY = 16,
    ENABLE_PLAYER_CONTROL = 32,
    CANCELABLE = 120
}

return Enums
