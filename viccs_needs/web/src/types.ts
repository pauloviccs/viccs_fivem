// Need states
export type NeedState = 'healthy' | 'warning' | 'critical';

// Single need data
export interface Need {
    value: number;
    state: NeedState;
}

// All needs
export interface NeedsData {
    hunger: Need;
    energy: Need;
    hygiene: Need;
    bladder: Need;
    social: Need;
    fun: Need;
    comfort: Need;
}

// Need configuration from Lua
export interface NeedConfig {
    label: string;
    icon: string;
    color: {
        healthy: string;
        warning: string;
        critical: string;
    };
    criticalThreshold: number;
    warningThreshold: number;
}

export type NeedsConfig = Record<string, NeedConfig>;

// Want data
export interface Want {
    want_id: string;
    priority: 'primary' | 'secondary';
    created_at?: string;
    expires_at?: string;
}

// Want catalog item
export interface WantCatalogItem {
    label: string;
    description: string;
    icon: string;
    affects: Record<string, number>;
    moodBonus: number;
}

export type WantsCatalog = Record<string, WantCatalogItem>;

// NUI message actions
export type NUIAction =
    | 'INIT_NEEDS'
    | 'INIT_CONFIG'
    | 'UPDATE_NEED'
    | 'UPDATE_ALL_NEEDS'
    | 'SYNC_WANTS'
    | 'WANT_COMPLETED'
    | 'TOGGLE_VISIBILITY'
    | 'SET_MINIMIZED'
    | 'SET_PAUSED'
    | 'NEED_CRITICAL';

// NUI message format
export interface NUIMessage {
    action: NUIAction;
    data?: unknown;
}
