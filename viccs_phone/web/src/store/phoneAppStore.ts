import { create } from 'zustand';

interface Contact {
    id: string;
    name: string;
    number: string;
    avatar?: string;
}

interface RecentCall {
    id: string;
    contactId: string;
    type: 'incoming' | 'outgoing' | 'missed';
    date: string;
    isVideo: boolean;
}

interface PhoneAppState {
    activeTab: 'keypad' | 'contacts' | 'recents';
    contacts: Contact[];
    recents: RecentCall[];
    dialedNumber: string;

    setActiveTab: (tab: 'keypad' | 'contacts' | 'recents') => void;
    setDialedNumber: (number: string) => void;
    addDigit: (digit: string) => void;
    deleteDigit: () => void;
}

export const usePhoneAppStore = create<PhoneAppState>((set) => ({
    activeTab: 'keypad',
    contacts: [
        { id: '1', name: 'Mãe', number: '555-0100', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: '2', name: 'Amor', number: '555-0123', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: '3', name: 'Chefe', number: '555-0999', avatar: 'https://i.pravatar.cc/150?u=3' },
    ],
    recents: [
        { id: '1', contactId: '2', type: 'incoming', date: 'Yesterday', isVideo: true },
        { id: '2', contactId: '3', type: 'missed', date: 'Sunday', isVideo: false },
    ],
    dialedNumber: '',

    setActiveTab: (tab) => set({ activeTab: tab }),
    setDialedNumber: (number) => set({ dialedNumber: number }),
    addDigit: (digit) => set((state) => ({ dialedNumber: state.dialedNumber + digit })),
    deleteDigit: () => set((state) => ({ dialedNumber: state.dialedNumber.slice(0, -1) })),
}));
