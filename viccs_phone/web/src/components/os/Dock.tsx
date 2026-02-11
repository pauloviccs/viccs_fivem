import React from 'react';
import { usePhoneStore } from '../../store/phoneStore';
import { Phone, MessageSquare, Instagram, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppId } from '../../types';

// Interface removed because it was unused

// Simplified Dock implementation for Liquid Glass
export const Dock: React.FC = () => {
    // Removed unused openApp hook

    return (
        <div className="w-full flex justify-center pb-6">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                // LIQUID GLASS DOCK: slightly more opaque than apps for contrast
                className="flex items-center gap-6 px-6 py-5 bg-glass-200/40 backdrop-blur-2xl rounded-[35px] border border-white/10 shadow-glass ring-1 ring-white/5"
            >
                <DockItem icon={Phone} appId="phone" color="bg-green-500" />
                <DockItem icon={MessageSquare} appId="messages" color="bg-blue-500" />
                <DockItem icon={Instagram} appId="instagram" color="bg-pink-500" />
                <DockItem icon={Music} appId="spotify" color="bg-green-600" />
            </motion.div>
        </div>
    );
};

const DockItem: React.FC<{ icon: any; appId: AppId; color: string }> = ({ icon: Icon, appId, color }) => {
    const openApp = usePhoneStore((state) => state.openApp);

    return (
        <motion.button
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openApp(appId)}
            className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shadow-lg relative group overflow-hidden ${color} shadow-${color}/30`}
        >
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-50 pointer-events-none" />
            <Icon size={26} className="text-white drop-shadow-sm relative z-10" />
        </motion.button>
    )
}
