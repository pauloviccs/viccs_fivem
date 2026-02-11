import React, { useEffect, useState, useMemo } from 'react';

import { fetchNui } from '../../utils/fetchNui';
import { useNuiEvent } from '../../hooks/usePhoneVisibility';
import { Search, Edit, Send, ChevronLeft, User, Phone as PhoneIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    sender: string;
    receiver: string;
    message: string;
    date: string;
    isRead: number;
}

// Group messages by conversation (other participant's number)
interface Conversation {
    number: string;
    name?: string; // We'll need contacts for this later
    lastMessage: Message;
    messages: Message[];
    unreadCount: number;
}

export const Messages: React.FC = () => {
    // Mock own number for dev - in prod we'd fetch this
    const myNumber = "555-0100";

    // State
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');

    const fetchData = () => {
        fetchNui('getMessages').then((res) => {
            if (Array.isArray(res)) setMessages(res);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useNuiEvent('receiveMessage', (newMessage: Message) => {
        setMessages((prev) => [newMessage, ...prev]);
    });

    const conversations = useMemo(() => {
        const convs: Record<string, Conversation> = {};

        // Ensure messages are valid before processing
        if (!Array.isArray(messages)) return [];

        messages.forEach(msg => {
            const otherPerson = msg.sender === myNumber ? msg.receiver : msg.sender;

            if (!convs[otherPerson]) {
                convs[otherPerson] = {
                    number: otherPerson,
                    lastMessage: msg,
                    messages: [],
                    unreadCount: 0
                };
            }

            convs[otherPerson].messages.push(msg);

            // Check for newer last message
            if (new Date(msg.date) > new Date(convs[otherPerson].lastMessage.date)) {
                convs[otherPerson].lastMessage = msg;
            }
        });

        // Convert to array and sort by last msg date
        return Object.values(convs).sort((a, b) =>
            new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime()
        );
    }, [messages, myNumber]);

    const activeConversation = selectedConvId ? conversations.find(c => c.number === selectedConvId) : null;

    const handleSend = async () => {
        if (!inputText.trim() || !selectedConvId) return;

        const tempMsg: Message = {
            id: Date.now(),
            sender: myNumber,
            receiver: selectedConvId,
            message: inputText,
            date: new Date().toISOString(),
            isRead: 1
        };

        setMessages(prev => [tempMsg, ...prev]);
        setInputText('');

        await fetchNui('sendMessage', {
            receiverNumber: selectedConvId,
            message: tempMsg.message
        });
    };

    if (loading) return <div className="text-white p-4">Loading messages...</div>;

    return (
        <div className="h-full w-full bg-black text-white overflow-hidden relative">
            <AnimatePresence mode="wait" initial={false}>
                {!selectedConvId ? (
                    <motion.div
                        key="list"
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="h-full flex flex-col"
                    >
                        {/* Header */}
                        <div className="pt-2 px-4 pb-2 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-10">
                            <button className="text-blue-500 text-sm">Edit</button>
                            <h1 className="font-bold text-xl">Messages</h1>
                            <button className="text-blue-500"><Edit size={22} /></button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-4 mb-4">
                            <div className="bg-[#1c1c1e] rounded-lg flex items-center px-3 py-2 gap-2">
                                <Search size={16} className="text-gray-500" />
                                <input type="text" placeholder="Search" className="bg-transparent text-sm w-full focus:outline-none placeholder:text-gray-600" />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto px-4">
                            {conversations.length === 0 && <div className="text-gray-500 text-center mt-10">No messages yet</div>}

                            {conversations.map((conv) => (
                                <div
                                    key={conv.number}
                                    onClick={() => setSelectedConvId(conv.number)}
                                    className="flex gap-3 py-3 border-b border-white/10 cursor-pointer active:bg-white/5"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <span className="font-semibold truncate">{conv.number}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(conv.lastMessage.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 truncate mt-0.5">
                                            {conv.lastMessage.sender === myNumber && "You: "}{conv.lastMessage.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="h-full flex flex-col bg-black"
                    >
                        {/* Chat Header */}
                        <div className="pt-2 px-2 pb-2 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md z-10">
                            <button
                                onClick={() => setSelectedConvId(null)}
                                className="flex items-center text-blue-500 gap-1"
                            >
                                <ChevronLeft size={24} />
                                <span className="text-base">Back</span>
                            </button>

                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                                    <User size={14} className="text-gray-400" />
                                </div>
                                <span className="text-[10px] text-gray-300">{selectedConvId}</span>
                            </div>

                            <div className="flex gap-4 pr-2">
                                <Video size={22} className="text-blue-500" />
                                <PhoneIcon size={20} className="text-blue-500" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-2">
                            {/* Note: reverse mapping or flex-col-reverse for chat feeling */}
                            {[...(activeConversation?.messages || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((msg) => {
                                const isMe = msg.sender === myNumber;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words
                                            ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-[#262628] text-white rounded-tl-sm'}
                                        `}>
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="pb-8 pt-2 px-2 bg-black flex items-center gap-2 border-t border-white/10">
                            <div className="w-8 h-8 rounded-full bg-[#262628] flex items-center justify-center text-blue-500 shrink-0">
                                <span className="text-xl leading-none mb-1">+</span>
                            </div>
                            <div className="flex-1 bg-[#1c1c1e] rounded-full px-4 py-1.5">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="iMessage"
                                    className="bg-transparent text-white w-full focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            {inputText && (
                                <button onClick={handleSend} className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                                    <Send size={14} className="text-white ml-0.5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
