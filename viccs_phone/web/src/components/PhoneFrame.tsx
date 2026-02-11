import React, { ReactNode } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import { motion } from 'framer-motion';
import { StatusBar } from './os/StatusBar';
import { DynamicIsland } from './os/DynamicIsland';

interface PhoneFrameProps {
    children: ReactNode;
    isAppOpen?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isAppOpen = false }) => {
    const { goHome, wallpaper } = usePhoneStore();

    return (
        <div className="flex items-center justify-end w-full h-full pointer-events-none select-none pr-[3vw] pb-[3vh]">
            {/* 
                DEVICE BEZEL 
                - Modeled after iPhone 15 Pro Max dimensions
                - Titanium-like border finish
            */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                // REMOVED bg-black here. Kept border and shape. added bg-zinc-900/90 as extreme fallback if needed but goal is transparency
                className="relative w-[400px] h-[830px] rounded-[60px] shadow-2xl overflow-hidden pointer-events-auto border-[6px] border-[#1a1a1a] ring-1 ring-white/20 bg-[#050505]"
                style={{
                    boxShadow: '0 0 0 2px #222, 0 25px 50px -12px rgba(0,0,0,0.7)'
                }}
            >
                {/* 
                    DYNAMIC WALLPAPER LAYER 
                    - Shows user-selected wallpaper OR Mesh Gradient fallback
                    - strictly behind content
                */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 z-0"
                    style={{
                        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined
                    }}
                >
                    {/* Mesh Gradient Fallback (Active if no wallpaper) */}
                    {!wallpaper && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
                            <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[50%] rounded-full bg-indigo-500/30 mix-blend-screen filter blur-[90px] animate-blob" />
                            <div className="absolute top-[20%] right-[-10%] w-[90%] h-[50%] rounded-full bg-blue-500/30 mix-blend-screen filter blur-[90px] animate-blob animation-delay-2000" />
                            <div className="absolute bottom-[-10%] left-[10%] w-[90%] h-[50%] rounded-full bg-purple-500/30 mix-blend-screen filter blur-[90px] animate-blob animation-delay-4000" />
                        </div>
                    )}
                </div>

                {/* 
                    OS-LEVEL SHADOW & VIGNETTE
                    - Adds depth to the edges regardless of wallpaper
                */}
                <div className="absolute inset-0 pointer-events-none z-1 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

                {/* CONTENT LAYER */}
                <div className="relative z-10 w-full h-full flex flex-col">
                    {/* Status Bar & Dynamic Island */}
                    <div className="absolute top-0 w-full z-50 pointer-events-none">
                        <StatusBar />
                        <div className="pointer-events-auto">
                            <DynamicIsland />
                        </div>
                    </div>

                    {/* App Content Area - Flexible container */}
                    <div className="w-full h-full flex flex-col relative z-20 pt-[70px] pb-[34px]">
                        {/* APP OPEN DARKEN OVERLAY: Improves text legibility when an app is active */}
                        <div
                            className={`absolute inset-0 bg-black/40 transition-opacity duration-500 rounded-[50px] ${isAppOpen ? 'opacity-100' : 'opacity-0'}`}
                            style={{ pointerEvents: 'none', zIndex: -1 }}
                        />
                        {children}
                    </div>

                    {/* Home Indicator */}
                    <div
                        onClick={() => goHome()}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/40 hover:bg-white/70 rounded-full backdrop-blur-md cursor-pointer transition-colors z-50 pointer-events-auto"
                    />
                </div>
            </motion.div>
        </div>
    );
};
