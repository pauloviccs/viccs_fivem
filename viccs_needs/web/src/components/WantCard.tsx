import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Want } from '../types';

interface WantCardProps {
    want: Want;
}

export const WantCard: React.FC<WantCardProps> = ({ want }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Dynamic Icon
    const IconComponent = (LucideIcons as any)[want.config.icon] || LucideIcons.HelpCircle;

    // Priority Colors (Subtle backgrounds)
    const priorityColor = want.priority === 'primary'
        ? 'bg-yellow-500/10 border-yellow-500/30'
        : 'bg-white/5 border-white/10';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`
                relative mb-2 p-3 rounded-xl border 
                ${priorityColor} shadow-lg transition-all duration-300
                hover:bg-white/10 hover:border-white/20
                flex items-center gap-3 cursor-default group overflow-hidden
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glossy Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Icon Container with Glow */}
            <div className={`
                p-2 rounded-lg bg-black/20 text-white/90 
                ${want.priority === 'primary' ? 'shadow-[0_0_15px_rgba(234,179,8,0.2)] text-yellow-100' : ''}
            `}>
                <IconComponent size={20} strokeWidth={2} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-white/90 truncate leading-tight">
                    {want.config.label}
                </h4>

                {/* Description / Reward Toggle */}
                <div className="h-4 relative overflow-hidden mt-0.5">
                    <AnimatePresence mode='wait'>
                        {!isHovered ? (
                            <motion.p
                                key="desc"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-xs text-white/60 truncate absolute inset-0"
                            >
                                {want.config.description}
                            </motion.p>
                        ) : (
                            <motion.div
                                key="reward"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2 text-xs absolute inset-0"
                            >
                                {/* Rewards Badge */}
                                {want.config.moodBonus > 0 && (
                                    <span className="text-emerald-300 font-medium">
                                        +{want.config.moodBonus} Mood
                                    </span>
                                )}
                                {Object.entries(want.config.affects || {}).map(([need, val]) => (
                                    <span key={need} className={val > 0 ? 'text-green-300' : 'text-red-300'}>
                                        {val > 0 ? '+' : ''}{val} {need.charAt(0).toUpperCase() + need.slice(1)}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Priority Indicator Dot */}
            {want.priority === 'primary' && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse" />
            )}
        </motion.div>
    );
};
