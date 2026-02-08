import React from 'react';
import { useNeedsStore } from '../store';
import { WantCard } from './WantCard';
import { AnimatePresence, motion } from 'framer-motion';

export const WantsPanel: React.FC = () => {
    const { wants, visible, minimized } = useNeedsStore();

    // Hide if HUD is hidden, minimized, or if in vehicle (optional design choice, usually wants are less important while driving)
    // Actually, keeping them visible in vehicle might be distracting, so let's hide them if vehicle HUD is visible OR if main HUD is hidden
    if (!visible || minimized) return null;

    // Optional: Hide wants while driving to reduce clutter
    // if (vehicle.visible) return null;

    return (
        <div className="flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {wants.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-64 flex flex-col items-end pointer-events-auto"
                    >
                        <h3 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2 mr-1 text-right drop-shadow-md">
                            Desejos
                        </h3>
                        <div className="flex flex-col w-full">
                            {wants.map((want) => (
                                <WantCard key={want.want_id} want={want} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
