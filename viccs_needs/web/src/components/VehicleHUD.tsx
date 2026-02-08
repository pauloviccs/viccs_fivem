import { motion } from 'framer-motion';
import { Gauge, Fuel, CarFront, Armchair } from 'lucide-react';
import { useNeedsStore } from '../store';

export function VehicleHUD() {
    const { vehicle, visible, paused } = useNeedsStore();
    const { data } = vehicle;

    // Don't render if not in vehicle or HUD hidden
    if (!vehicle.visible || !visible || paused) return null;

    // Calculations
    const fuelPercentage = Math.min(100, Math.max(0, data.fuel));
    const rpmPercentage = Math.min(100, Math.max(0, data.rpm * 100)); // RPM is usually 0.0-1.0
    const engineHealthPercentage = Math.min(100, Math.max(0, (data.engineHealth / 1000) * 100));

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-4"
        >
            {/* Speedometer Main Circle */}
            <div className="liquid-glass p-1 rounded-full w-32 h-32 flex items-center justify-center relative">
                {/* RPM Ring (SVG) */}
                <svg className="absolute w-full h-full -rotate-90 p-2">
                    <circle
                        cx="50%" cy="50%" r="45%"
                        fill="transparent"
                        stroke="#ffffff20"
                        strokeWidth="6"
                    />
                    <motion.circle
                        cx="50%" cy="50%" r="45%"
                        fill="transparent"
                        stroke={rpmPercentage > 85 ? '#ef4444' : '#60a5fa'}
                        strokeWidth="6"
                        strokeDasharray="283" // 2 * PI * r (approx)
                        strokeDashoffset={283 - (283 * rpmPercentage) / 100}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="flex flex-col items-center z-10">
                    <span className="text-4xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
                        {data.speed}
                    </span>
                    <span className="text-xs font-medium text-white/60">KM/H</span>
                </div>
            </div>

            {/* Side Stats Panel */}
            <div className="liquid-glass p-3 rounded-2xl flex flex-col gap-2 min-w-[120px]">
                {/* Fuel */}
                <div className="flex items-center gap-2">
                    <Fuel size={16} className={fuelPercentage < 20 ? "text-red-400 animate-pulse" : "text-blue-400"} />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${fuelPercentage < 20 ? 'bg-red-500' : 'bg-blue-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${fuelPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-white/80 w-8 text-right">{Math.floor(data.fuel)}%</span>
                </div>

                {/* Engine Health */}
                <div className="flex items-center gap-2">
                    <CarFront size={16} className={engineHealthPercentage < 40 ? "text-orange-400 animate-pulse" : "text-emerald-400"} />
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${engineHealthPercentage < 40 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${engineHealthPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                    {/* Gear */}
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                        <Gauge size={14} className="text-purple-400" />
                        <span className="font-mono font-bold text-sm text-white">
                            {data.gear === 0 ? 'R' : data.gear}
                        </span>
                    </div>

                    {/* Seatbelt */}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${data.seatbelt
                            ? 'bg-green-500/20 border-green-500/30'
                            : 'bg-red-500/20 border-red-500/30 animate-pulse'
                        }`}>
                        <Armchair size={14} className={data.seatbelt ? "text-green-400" : "text-red-400"} />
                        <span className={`text-[10px] font-bold uppercase ${data.seatbelt ? "text-green-200" : "text-red-200"}`}>
                            {data.seatbelt ? 'ON' : 'OFF'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
