import React from 'react';

import { Phone as PhoneIcon, Star, Clock, User, Delete } from 'lucide-react';

export const Phone: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col bg-black">
            {/* Keypad View */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center px-8">
                    <span className="text-4xl text-white font-light tracking-wider">
                        (555) 019-283
                    </span>
                </div>

                <div className="pb-12 px-8 grid grid-cols-3 gap-6 place-items-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                        <button key={key} className="w-16 h-16 rounded-full bg-[#333333] active:bg-[#555] flex flex-col items-center justify-center transition-colors">
                            <span className="text-2xl text-white font-medium mb-[-2px]">{key}</span>
                            {/* Letters would go here */}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center pb-8 gap-8 items-center">
                    <div className="w-16 h-16" /> {/* Spacer */}
                    <button className="w-16 h-16 rounded-full bg-[#2ecc71] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                        <PhoneIcon size={28} className="text-white fill-white" />
                    </button>
                    <button className="w-16 h-16 flex items-center justify-center text-gray-400 active:text-white">
                        <Delete size={24} />
                    </button>
                </div>
            </div>

            {/* Bottom Tabs */}
            <div className="h-16 bg-[#121212] flex items-center justify-around border-t border-white/10 text-white/50">
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white">
                    <Star size={20} />
                    <span className="text-[10px]">Favorites</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white">
                    <Clock size={20} />
                    <span className="text-[10px]">Recents</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white">
                    <User size={20} />
                    <span className="text-[10px]">Contacts</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#2ecc71] cursor-pointer">
                    <div className="grid grid-cols-3 gap-[2px] w-5 h-5">
                        {[...Array(9)].map((_, i) => <div key={i} className="bg-current rounded-[1px]" />)}
                    </div>
                    <span className="text-[10px]">Keypad</span>
                </div>
            </div>
        </div>
    );
};
