import { motion, AnimatePresence } from 'framer-motion';
import { useNeedsStore } from '../store';
import { NeedBar } from './NeedBar';

// Order of needs display (matches Sims 4 style)
const needsOrder = ['hunger', 'thirst', 'energy', 'hygiene', 'bladder', 'social', 'fun', 'comfort'];

export function NeedsPanel() {
    const { needs, config, visible, minimized, paused, stats, vehicle } = useNeedsStore();

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
                className={`fixed left-6 pointer-events-auto transition-all duration-500 ease-in-out ${vehicle.visible ? 'bottom-[250px]' : 'bottom-8'}`}
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
                    {/* Health & Armor Stats */}
                    <div className="flex flex-col gap-1.5 mb-3 border-b border-white/10 pb-3">
                        {/* Health */}
                        {stats && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <NeedBar
                                    need={{
                                        value: stats.health,
                                        state: stats.health < 25 ? 'critical' : stats.health < 50 ? 'warning' : 'healthy'
                                    }}
                                    config={{
                                        label: 'Saúde',
                                        icon: 'heart', // Defined in NeedBar iconMap
                                        color: { healthy: '#ef4444', warning: '#ef4444', critical: '#991b1b' },
                                        criticalThreshold: 25,
                                        warningThreshold: 50
                                    }}
                                />
                            </motion.div>
                        )}

                        {/* Armor (Only if > 0) */}
                        {stats && stats.armor > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <NeedBar
                                    need={{
                                        value: stats.armor,
                                        state: 'healthy'
                                    }}
                                    config={{
                                        label: 'Colete',
                                        icon: 'shield',
                                        color: { healthy: '#3b82f6', warning: '#3b82f6', critical: '#1e40af' },
                                        criticalThreshold: 0,
                                        warningThreshold: 0
                                    }}
                                />
                            </motion.div>
                        )}
                    </div>

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
