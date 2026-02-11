import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { usePhoneStore } from '../../../store/phoneStore';
import { fetchNui } from '../../../utils/fetchNui';

export const WallpaperPicker: React.FC = () => {
    const { wallpaper, setWallpaper, goBack } = usePhoneStore();
    const [inputUrl, setInputUrl] = useState('');

    const handleSave = () => {
        if (inputUrl) {
            setWallpaper(inputUrl);
            fetchNui('saveSettings', { key: 'wallpaper', value: inputUrl });
            goBack();
        }
    };

    const presets = [
        'https://images.unsplash.com/photo-1696424263690-0f8a3c9b3e1f?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full h-full bg-[#1c1c1e] flex flex-col z-20 absolute inset-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
                <button onClick={goBack} className="flex items-center text-blue-500 gap-1 active:opacity-50">
                    <ChevronLeft size={24} />
                    <span className="text-lg">Settings</span>
                </button>
                <h2 className="text-white font-semibold text-lg">Wallpaper</h2>
                <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">

                {/* Current Preview */}
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-32 h-64 rounded-xl overflow-hidden border-4 border-white/10 shadow-xl mb-3 relative">
                        <img src={wallpaper} className="w-full h-full object-cover" alt="Current" />
                    </div>
                    <span className="text-white/50 text-sm">Current Wallpaper</span>
                </div>

                {/* URL Input */}
                <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-md">
                    <label className="text-white/70 text-xs font-semibold uppercase mb-2 block ml-1">Custom Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="https://imgur.com/..."
                            className="flex-1 bg-black/20 text-white p-3 rounded-lg border border-white/10 focus:border-blue-500 outline-none text-sm placeholder-white/30"
                        />
                        <button
                            onClick={handleSave}
                            disabled={!inputUrl}
                            className="bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50 active:scale-95 transition-all"
                        >
                            <Check size={20} />
                        </button>
                    </div>
                </div>

                {/* Presets Grid */}
                <h3 className="text-white/40 text-xs font-semibold uppercase mb-3 ml-1">Included Wallpapers</h3>
                <div className="grid grid-cols-2 gap-4">
                    {presets.map((url, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setWallpaper(url);
                                fetchNui('saveSettings', { key: 'wallpaper', value: url });
                            }}
                            className="aspect-[9/19] rounded-xl overflow-hidden relative cursor-pointer active:scale-95 transition-transform border-2 border-transparent hover:border-blue-500/50"
                        >
                            <img src={url} className="w-full h-full object-cover" alt={`Preset ${index}`} />
                            {wallpaper === url && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="bg-white rounded-full p-1">
                                        <Check size={16} className="text-blue-500" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
