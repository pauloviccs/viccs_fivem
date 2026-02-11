import React from 'react';
import { motion } from 'framer-motion';
// import { cn } from '../../utils/cn'; // Removed unused import

interface GlassPageProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export const GlassPage: React.FC<GlassPageProps> = ({ children, className, noPadding = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
            }}
            className={`
                w-full h-full 
                flex flex-col 
                bg-transparent 
                overflow-hidden 
                relative 
                z-10
                ${!noPadding ? 'pt-[54px] pb-[34px]' : ''}
                ${className || ''}
            `}
        >
            {children}
        </motion.div>
    );
};
