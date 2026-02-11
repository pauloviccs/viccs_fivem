import React from 'react';
import { usePhoneStore } from '../../store/phoneStore';

import { Settings, Sun, Battery, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const AppIcon: React.FC<{ icon: React.ElementType; label: string; color: string; onClick: () => void }> = ({ icon: Icon, label, color, onClick }) => (
    <motion.div
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1"
        onClick={onClick}
    >
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group"
            style={{ background: color }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
            <Icon className="w-7 h-7 text-white drop-shadow-md" />
        </div>
        <span className="text-[11px] font-medium text-white drop-shadow-md">{label}</span>
    </motion.div>
);

const WidgetSmall: React.FC<{ title: string; children: React.ReactNode; gradient: string }> = ({ title, children, gradient }) => (
    <div className={`w-[155px] h-[155px] rounded-[25px] p-4 flex flex-col justify-between shadow-lg text-white relative overflow-hidden ${gradient}`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">{title}</span>
            {children}
        </div>
    </div>
);

export const Home: React.FC = () => {
    const openApp = usePhoneStore((state) => state.openApp);

    return (
        <div className="w-full h-full pt-2 flex flex-col gap-6 overflow-y-auto hide-scrollbar">

            {/* Widgets Row */}
            <div className="flex gap-4 px-2">
                <WidgetSmall title="Weather" gradient="bg-gradient-to-br from-blue-400 to-blue-600">
                    <div className="flex flex-col">
                        <Sun className="w-8 h-8 mb-2" />
                        <span className="text-2xl font-bold">72°</span>
                        <span className="text-xs opacity-90">Sunny</span>
                    </div>
                </WidgetSmall>
                <WidgetSmall title="Calendar" gradient="bg-gradient-to-br from-red-400 to-orange-500">
                    <div className="flex flex-col items-end">
                        <Calendar className="w-6 h-6 mb-2" />
                        <span className="text-3xl font-bold">10</span>
                        <span className="text-xs">Tuesday</span>
                    </div>
                </WidgetSmall>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-4 gap-y-6 px-2">
                <AppIcon icon={Settings} label="Settings" color="#95a5a6" onClick={() => openApp('settings')} />

                {/* Placeholders for visual Grid balance */}
                <AppIcon icon={Battery} label="Tips" color="#f1c40f" onClick={() => { }} />
                {/* Add more apps here */}
            </div>
        </div>
    );
};
