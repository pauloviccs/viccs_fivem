import { motion, AnimatePresence } from 'framer-motion';
import { useNeedsStore } from '../store';
import { NeedBar } from './NeedBar';

// Order of needs display (matches Sims 4 style)
const needsOrder = ['hunger', 'energy', 'hygiene', 'bladder', 'social', 'fun', 'comfort'];

export function NeedsPanel() {
    const { needs, config, visible, minimized, paused } = useNeedsStore();

    // Don't render if paused or not visible
    if (paused || !visible) return null;

    // Check if we have any needs to display
    const hasNeeds = Object.keys(needs).length > 0 && Object.keys(config).length > 0;

    // Spring animation for iOS-like physics
    const springTransition = {
        type: 'spring' as const,
        stiffness: 400,
        damping: 30,
        mass: 1
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{
                    opacity: minimized ? 0.7 : 1,
                    x: 0,
                    scale: minimized ? 0.85 : 1,
                }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={springTransition}
                className="fixed bottom-8 left-6 pointer-events-auto"
            >
                {/* Liquid Glass Container */}
                <div
                    className={`
            liquid-glass
            p-4
            min-w-[220px] max-w-[280px]
            ${minimized ? 'opacity-70' : ''}
          `}
                >
                    {/* Needs list */}
                    {hasNeeds ? (
                        <div className="flex flex-col gap-1.5">
                            {needsOrder.map((needName, index) => {
                                const need = needs[needName];
                                const needConfig = config[needName];

                                if (!need || !needConfig) return null;

                                return (
                                    <motion.div
                                        key={needName}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            ...springTransition,
                                            delay: index * 0.05
                                        }}
                                    >
                                        <NeedBar
                                            need={need}
                                            config={needConfig}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Loading state */
                        <div className="flex items-center justify-center py-4">
                            <div className="text-glass-muted text-sm">Carregando...</div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
