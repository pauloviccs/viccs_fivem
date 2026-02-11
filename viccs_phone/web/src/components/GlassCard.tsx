import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
    return (
        <motion.div
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
                bg-white/5 
                backdrop-blur-md 
                border border-white/10 
                rounded-2xl 
                shadow-lg 
                p-4 
                relative 
                overflow-hidden 
                ${className}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            {children}
        </motion.div>
    );
};
