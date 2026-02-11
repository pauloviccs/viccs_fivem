import React from 'react';
import { Play, SkipBack, SkipForward, Heart, Repeat, Shuffle, ChevronDown } from 'lucide-react';

export const Spotify: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#535353] to-[#121212] text-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 pt-6">
                <ChevronDown size={24} />
                <span className="text-xs font-bold tracking-widest uppercase opacity-80">Playing from playlist</span>
                <div className="w-6" /> {/* Spacer */}
            </div>
            <div className="text-center text-xs font-bold mb-4">Discover Weekly</div>

            {/* Album Art */}
            <div className="px-6 py-2">
                <div className="w-full aspect-square bg-[#282828] shadow-2xl rounded-md overflow-hidden relative group">
                    <img
                        src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop"
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Track Info */}
            <div className="px-6 mt-8 flex justify-between items-center">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">Midnight City</h2>
                    <span className="text-white/60">M83</span>
                </div>
                <Heart size={24} className="text-green-500 fill-green-500" />
            </div>

            {/* Progress */}
            <div className="px-6 mt-6">
                <div className="w-full h-1 bg-white/20 rounded-full mb-2 relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-white rounded-full"></div>
                    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
                </div>
                <div className="flex justify-between text-xs text-white/50 font-medium">
                    <span>1:23</span>
                    <span>4:03</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col justify-center gap-8 px-6 pb-8">
                <div className="flex justify-between items-center px-2">
                    <Shuffle size={20} className="text-green-500" />
                    <SkipBack size={28} className="fill-white" />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform cursor-pointer">
                        <Play size={28} className="fill-black ml-1" />
                    </div>
                    <SkipForward size={28} className="fill-white" />
                    <Repeat size={20} className="text-white/70" />
                </div>
            </div>
        </div>
    );
};
