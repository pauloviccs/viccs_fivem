import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    icon: string;
    label: string;
    onClick?: () => void;
}

export const ActionButton: React.FC<Props> = ({ icon, label, onClick }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center gap-2 min-w-[72px]"
        >
            <div className="w-[72px] h-[72px] bg-white/10 rounded-full flex items-center justify-center text-white text-2xl">
                <i className={icon}></i>
            </div>
            <span className="text-sm font-medium text-white/90 whitespace-nowrap">{label}</span>
        </motion.button>
    );
};
