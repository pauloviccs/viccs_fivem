import React, { useState } from 'react';
import { useInstagramStore } from '../store';
import { fetchNui } from '../../../utils/fetchNui';
import { Camera, X } from 'lucide-react';

export const CreatePostScreen: React.FC = () => {
    const { account, setTab } = useInstagramStore();
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTakePhoto = async () => {
        // Here we would trigger the NUI screenshot callback
        // For current scope, we mock it or ask user for URL
        const url = prompt("Enter Image URL (mock camera):");
        if (url) setImage(url);
    };

    const handlePost = async () => {
        if (!image || !account) return;
        setLoading(true);
        const res = await fetchNui('instagramPost', {
            accountId: account.id,
            image,
            caption
        });
        setLoading(false);
        if (res.success) {
            setTab('home'); // Go back to feed
        }
    };

    return (
        <div className="h-full w-full bg-black flex flex-col text-white">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
                <button onClick={() => setTab('home')}><X size={24} /></button>
                <span className="font-bold text-lg">New Post</span>
                <button
                    onClick={handlePost}
                    className={`font-semibold text-blue-500 ${!image ? 'opacity-50' : ''}`}
                    disabled={!image || loading}
                >
                    {loading ? 'Posting...' : 'Share'}
                </button>
            </div>

            {!image ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <button
                        onClick={handleTakePhoto}
                        className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <Camera size={32} />
                    </button>
                    <span className="text-white/50">Take a photo or choose from gallery</span>
                </div>
            ) : (
                <div className="flex-1 flex flex-col p-4 gap-4">
                    <div className="w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <textarea
                        className="w-full bg-[#1c1c1e] rounded-lg p-3 text-white placeholder:text-white/30 resize-none focus:outline-none"
                        placeholder="Write a caption..."
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
