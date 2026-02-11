import React from 'react';
import { motion } from 'framer-motion';
import { usePhoneStore } from '../../store/phoneStore';

export const LockScreen: React.FC = () => {
    const { setLocked } = usePhoneStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full h-full flex flex-col items-center pt-20 text-white z-50"
        >
            <div className="flex flex-col items-center">
                <i className="fas fa-lock text-xs mb-4 opacity-70"></i>
                <h1 className="text-7xl font-thin tracking-tighter">9:41</h1>
                <p className="text-xl font-medium mt-1 opacity-90">Monday, June 5</p>
            </div>

            {/* Notifications Area */}
            <div className="flex-1 w-full mt-8 px-4 flex flex-col gap-2">
                {/* Mock Notification */}
                <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-3 flex gap-3 border border-white/10 shadow-sm">
                    <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center text-xl">
                        <i className="fab fa-whatsapp text-white"></i>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-between items-center w-56">
                            <span className="font-bold text-sm">WhatsApp</span>
                            <span className="text-[10px] text-gray-300">now</span>
                        </div>
                        <span className="text-xs text-gray-200">New message from Mom</span>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="w-full flex justify-between px-12 mb-10">
                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center active:bg-white/40 transition-colors">
                    <i className="fas fa-flashlight"></i>
                </button>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center active:bg-white/40 transition-colors">
                    <i className="fas fa-camera"></i>
                </button>
            </div>

            {/* Swipe Indicator */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.y < -50) {
                        setLocked(false);
                    }
                }}
                className="absolute bottom-2 w-32 h-1.5 bg-white/50 rounded-full mb-2 cursor-grab active:cursor-grabbing"
            />
            <p className="absolute bottom-8 text-xs font-medium opacity-60">Swipe up to unlock</p>
        </motion.div>
    );
};
