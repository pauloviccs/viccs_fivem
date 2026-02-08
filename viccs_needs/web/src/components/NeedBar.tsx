import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Utensils,
    Zap,
    Droplet,
    ShowerHead,
    Users,
    Gamepad2,
    Sofa,
    GlassWater,
    Heart,
    Shield,
    type LucideIcon
} from 'lucide-react';
import type { Need, NeedConfig } from '../types';

// Icon mapping based on config.icon values
const iconMap: Record<string, LucideIcon> = {
    utensils: Utensils,
    bolt: Zap,
    droplet: Droplet,
    shower: ShowerHead,
    users: Users,
    'gamepad-2': Gamepad2,
    sofa: Sofa,
    'glass-water': GlassWater,
    heart: Heart,
    shield: Shield,
};

interface NeedBarProps {
    need: Need;
    config: NeedConfig;
}

export function NeedBar({ need, config }: NeedBarProps) {
    const Icon = iconMap[config.icon] || Utensils;

    // Determine color based on state
    const color = useMemo(() => {
        switch (need.state) {
            case 'critical':
                return config.color.critical;
            case 'warning':
                return config.color.warning;
            default:
                return config.color.healthy;
        }
    }, [need.state, config.color]);

    const isCritical = need.state === 'critical';

    // Spring animation config for iOS-like physics
    const springTransition = {
        type: 'spring' as const,
        stiffness: 400,
        damping: 30,
        mass: 1
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={springTransition}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isCritical ? 'critical-pulse' : ''
                }`}
        >
            {/* Icon Bubble - Glass Effect */}
            <div
                className={`icon-bubble ${isCritical ? 'icon-critical' : ''}`}
                style={{
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                    borderColor: `${color}40`,
                }}
            >
                <Icon
                    size={16}
                    style={{ color }}
                    strokeWidth={2.5}
                />
            </div>

            {/* Bar Container */}
            <div className="flex-1 need-bar-container">
                <motion.div
                    className="need-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, need.value))}%` }}
                    transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 20
                    }}
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 12px ${color}60`,
                    }}
                />
            </div>
        </motion.div>
    );
}
