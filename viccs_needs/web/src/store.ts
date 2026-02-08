import { create } from 'zustand';
import type { Need, NeedsConfig, Want, WantsCatalog } from './types';

interface NeedsStore {
    // State
    needs: Record<string, Need>;
    config: NeedsConfig;
    wants: Want[];
    wantsCatalog: WantsCatalog;
    visible: boolean;
    minimized: boolean;
    paused: boolean;
    stats: { health: number; armor: number };

    // Actions
    setNeeds: (needs: Record<string, Need>) => void;
    setConfig: (config: NeedsConfig) => void;
    updateNeed: (name: string, value: number, state: 'healthy' | 'warning' | 'critical') => void;
    updateStats: (health: number, armor: number) => void;
    setWants: (wants: Want[]) => void;
    setWantsCatalog: (catalog: WantsCatalog) => void;
    setVisible: (visible: boolean) => void;
    setMinimized: (minimized: boolean) => void;
    setPaused: (paused: boolean) => void;
}

// Default needs (fallback)
const defaultNeeds: Record<string, Need> = {
    hunger: { value: 100, state: 'healthy' },
    energy: { value: 100, state: 'healthy' },
    hygiene: { value: 100, state: 'healthy' },
    bladder: { value: 100, state: 'healthy' },
    social: { value: 100, state: 'healthy' },
    fun: { value: 100, state: 'healthy' },
    comfort: { value: 100, state: 'healthy' },
};

// Default config (fallback)
const defaultConfig: NeedsConfig = {
    hunger: { label: 'Fome', icon: 'utensils', color: { healthy: '#4ade80', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 20, warningThreshold: 40 },
    energy: { label: 'Energia', icon: 'bolt', color: { healthy: '#60a5fa', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 15, warningThreshold: 35 },
    hygiene: { label: 'Higiene', icon: 'shower', color: { healthy: '#34d399', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 25, warningThreshold: 45 },
    bladder: { label: 'Bexiga', icon: 'droplet', color: { healthy: '#a78bfa', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 10, warningThreshold: 30 },
    social: { label: 'Social', icon: 'users', color: { healthy: '#fb923c', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 20, warningThreshold: 40 },
    fun: { label: 'Diversão', icon: 'gamepad-2', color: { healthy: '#f472b6', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 25, warningThreshold: 45 },
    comfort: { label: 'Conforto', icon: 'sofa', color: { healthy: '#22d3ee', warning: '#facc15', critical: '#f87171' }, criticalThreshold: 20, warningThreshold: 40 },
};

export const useNeedsStore = create<NeedsStore>((set) => ({
    needs: defaultNeeds,
    config: defaultConfig,
    wants: [],
    wantsCatalog: {},
    visible: true,
    minimized: false,
    paused: false,

    stats: { health: 100, armor: 0 },
    updateStats: (health: number, armor: number) => set({ stats: { health, armor } }),

    setNeeds: (needs) => set({ needs }),

    setConfig: (config) => set({ config }),

    updateNeed: (name, value, state) =>
        set((prev) => ({
            needs: {
                ...prev.needs,
                [name]: { value, state },
            },
        })),

    setWants: (wants) => set({ wants }),

    setWantsCatalog: (catalog) => set({ wantsCatalog: catalog }),

    setVisible: (visible) => set({ visible }),

    setMinimized: (minimized) => set({ minimized }),

    setPaused: (paused) => set({ paused }),
}));
