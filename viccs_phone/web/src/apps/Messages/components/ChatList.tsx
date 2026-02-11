import React from 'react';
import { useMessagesStore } from '../../../store/messagesStore';

export const ChatList: React.FC = () => {
    const { chats, openChat } = useMessagesStore();

    return (
        <div className="flex flex-col">
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    onClick={() => openChat(chat.id)}
                    className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                >
                    <img src={chat.avatar} alt={chat.contactName} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                            <h3 className="font-semibold text-gray-900 truncate">{chat.contactName}</h3>
                            <span className={`text-xs ${chat.unread > 0 ? 'text-green-500 font-bold' : 'text-gray-400'}`}>{chat.lastMessageTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 truncate pr-2">{chat.lastMessage}</p>
                            {chat.unread > 0 && (
                                <div className="min-w-[20px] h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold px-1">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
