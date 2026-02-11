export type AppId = 'bank' | 'phone' | 'messages' | 'instagram' | 'spotify' | 'settings' | 'wallpaper-picker' | null;

export interface PhoneState {
    visible: boolean;
    locked: boolean;
    appStack: AppId[]; // Stack of apps/screens
    notifications: Notification[];
    wallpaper: string;

    setVisible: (visible: boolean) => void;
    setLocked: (locked: boolean) => void;
    setWallpaper: (url: string) => void;
    openApp: (app: AppId) => void;
    goBack: () => void;
    goHome: () => void;
    addNotification: (notification: Notification) => void;
    clearNotifications: () => void;
    initSettings: () => Promise<void>;
}

export interface Notification {
    id: string;
    app: AppId;
    title: string;
    message: string;
    time: string;
}
