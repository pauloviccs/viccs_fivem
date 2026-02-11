import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { usePhoneStore } from '../../store/phoneStore';

export const DynamicIsland: React.FC = () => {
    const notifications = usePhoneStore((state) => state.notifications);
    const [expanded, setExpanded] = useState(false);
    const activeNotification = notifications[0];

    useEffect(() => {
        if (activeNotification) {
            setExpanded(true);
            const timer = setTimeout(() => setExpanded(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [activeNotification]);

    return (
        <div className="w-full flex justify-center pt-2">
            <motion.div
                layout
                initial={false}
                animate={{
                    width: expanded ? 360 : 120,
                    height: expanded ? 80 : 35,
                    borderRadius: expanded ? 24 : 20,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-black flex items-center justify-between px-3 relative z-50 shadow-lg"
            >
                <AnimatePresence mode="wait">
                    {expanded ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex items-center justify-between px-2"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/60 font-medium">Notification</span>
                                    <span className="text-sm text-white font-bold">{activeNotification?.title || 'System'}</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex justify-between items-center"
                        >
                            {/* FaceID / Camera Area Placeholder */}
                            <div className="w-full h-full absolute inset-0 flex justify-center items-center pointer-events-none">
                                <div className="w-16 h-4 bg-black rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
