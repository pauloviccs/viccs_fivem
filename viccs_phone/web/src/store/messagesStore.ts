import { create } from 'zustand';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    time: string;
    read: boolean;
}

interface Chat {
    id: string;
    contactName: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
    messages: Message[];
}

interface MessagesState {
    chats: Chat[];
    activeChatId: string | null;
    openChat: (id: string) => void;
    closeChat: () => void;
    sendMessage: (chatId: string, text: string) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
    chats: [
        {
            id: '1',
            contactName: 'Mãe',
            avatar: 'https://i.pravatar.cc/150?u=1',
            lastMessage: 'Vem jantar hoje?',
            lastMessageTime: '10:45',
            unread: 2,
            messages: [
                { id: '1', text: 'Oi mãe', sender: 'me', time: '10:40', read: true },
                { id: '2', text: 'Vem jantar hoje?', sender: 'other', time: '10:45', read: false },
            ]
        },
        {
            id: '2',
            contactName: 'Grupo da Firma',
            avatar: 'https://i.pravatar.cc/150?u=5',
            lastMessage: 'Reunião cancelada',
            lastMessageTime: 'Yesterday',
            unread: 0,
            messages: []
        },
    ],
    activeChatId: null,

    openChat: (id) => set({ activeChatId: id }),
    closeChat: () => set({ activeChatId: null }),
    sendMessage: (chatId, text) => set((state) => ({
        chats: state.chats.map(chat =>
            chat.id === chatId
                ? { ...chat, messages: [...chat.messages, { id: Date.now().toString(), text, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false }], lastMessage: text, lastMessageTime: 'Now' }
                : chat
        )
    })),
}));
