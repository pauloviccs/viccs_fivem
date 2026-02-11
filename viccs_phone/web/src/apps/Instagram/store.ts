import { create } from 'zustand';

interface InstagramAccount {
    id: number;
    username: string;
    avatar: string;
    bio: string;
    verified: number;
}

interface InstagramState {
    account: InstagramAccount | null;
    activeTab: 'home' | 'search' | 'create' | 'likes' | 'profile';
    login: (account: InstagramAccount) => void;
    logout: () => void;
    setTab: (tab: InstagramState['activeTab']) => void;
}

export const useInstagramStore = create<InstagramState>((set) => ({
    account: null,
    activeTab: 'home',
    login: (account) => set({ account }),
    logout: () => set({ account: null }),
    setTab: (tab) => set({ activeTab: tab }),
}));
