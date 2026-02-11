import { create } from 'zustand';
import { PhoneState } from '../types';

export const usePhoneStore = create<PhoneState>((set) => ({
    visible: false,
    locked: false,
    appStack: [], // Stack of open apps/screens. Empty = Home.
    notifications: [],
    wallpaper: 'https://images.unsplash.com/photo-1696424263690-0f8a3c9b3e1f?q=80&w=1000&auto=format&fit=crop',

    setVisible: (visible) => set({ visible }),
    setLocked: (locked) => set({ locked }),
    setWallpaper: (wallpaper) => {
        set({ wallpaper });
        // Persist to backend
        import('../utils/fetchNui').then(({ fetchNui }) => {
            fetchNui('saveSettings', { key: 'wallpaper', value: wallpaper });
        }).catch(err => console.error('Failed to save wallpaper', err));
    },

    // Open an app (Pushes to stack)
    openApp: (app) => set((state) => ({
        appStack: [...state.appStack, app]
    })),

    // Close current app (Pops from stack) aka "Back"
    goBack: () => set((state) => {
        if (state.appStack.length === 0) return {}; // Already home
        const newStack = [...state.appStack];
        newStack.pop();
        return { appStack: newStack };
    }),

    // Go Home (Clears stack)
    goHome: () => set({ appStack: [] }),

    addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
    clearNotifications: () => set({ notifications: [] }),

    initSettings: async () => {
        try {
            // Import fetchNui dynamically to avoid circular dependency issues if any, or just use it ensuring import is clean.
            // Assuming fetchNui is imported at top.
            const settings = await (await import('../utils/fetchNui')).fetchNui('getSettings');
            if (settings && settings.wallpaper) {
                set({ wallpaper: settings.wallpaper });
            }
        } catch (error) {
            console.error('Failed to init settings', error);
        }
    }
}));
