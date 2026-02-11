import React, { useState, useEffect } from 'react';
import { Signal, Wifi } from 'lucide-react';

export const StatusBar: React.FC = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const date = new Date();
            setTime(date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-[54px] px-8 flex justify-between items-center text-white z-50 pointer-events-none select-none">
            {/* Left: Time */}
            <div className="font-semibold text-[15px] tracking-wide w-[80px] flex justify-start pl-1">
                {time}
            </div>

            {/* Middle: Dynamic Island Place (Handled in PhoneFrame/DynamicIsland component) */}

            {/* Right: Status Icons */}
            <div className="flex items-center gap-2 w-[80px] justify-end pr-1">
                <Signal size={16} strokeWidth={2.5} className="text-white" />
                <Wifi size={16} strokeWidth={2.5} className="text-white" />

                {/* Battery Icon - Custom CSS for realism */}
                <div className="relative w-[24px] h-[12px] border-[1.5px] border-white/40 rounded-[3px] flex items-center justify-start p-[1px]">
                    <div className="h-full w-[80%] bg-white rounded-[1px]" />
                    <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white/40 rounded-r-[1px]" />
                </div>
            </div>
        </div>
    );
};
