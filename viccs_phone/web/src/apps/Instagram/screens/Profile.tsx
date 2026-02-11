import React, { useEffect, useState } from 'react';
import { useInstagramStore } from '../store';
import { fetchNui } from '../../../utils/fetchNui';
import { Settings, Grid, Tag } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
    const { account } = useInstagramStore();
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        // In reality we would fetch posts by account.id
        // For now using the feed mock or a new endpoint if needed.
        // Let's assume we fetch feed but filter in backend or just show all for demo
        fetchNui('getInstagramPosts').then((res) => {
            if (Array.isArray(res)) setPosts(res.filter(p => p.username === account?.username));
        });
    }, [account]);

    if (!account) return null;

    return (
        <div className="h-full w-full bg-black flex flex-col overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 sticky top-0 bg-black/90 z-10">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                    {account.username}
                    {account.verified === 1 && (
                        <span className="text-blue-500 text-[10px]">✔</span>
                    )}
                </span>
                <div className="flex gap-4">
                    <Settings size={20} className="text-white" />
                </div>
            </div>

            {/* Profile Info */}
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden">
                        <img src={account.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-4 text-white text-center">
                        <div>
                            <div className="font-bold text-lg">{posts.length}</div>
                            <div className="text-xs">Posts</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">1.2M</div>
                            <div className="text-xs">Followers</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg">108</div>
                            <div className="text-xs">Following</div>
                        </div>
                    </div>
                </div>

                <div className="text-white text-sm mb-4">
                    <div className="font-bold">{account.username}</div>
                    <div className="whitespace-pre-wrap text-sm">{account.bio || "No bio yet."}</div>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 bg-[#1c1c1e] text-white py-1.5 rounded-md text-sm font-semibold">Edit Profile</button>
                    <button className="flex-1 bg-[#1c1c1e] text-white py-1.5 rounded-md text-sm font-semibold">Share Profile</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-t border-white/10">
                <div className="flex-1 flex justify-center py-2 border-b border-white">
                    <Grid size={24} className="text-white" />
                </div>
                <div className="flex-1 flex justify-center py-2">
                    <Tag size={24} className="text-white/50" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-0.5 pb-16">
                {posts.map((post) => (
                    <div key={post.id} className="aspect-square bg-gray-900 relative group overflow-hidden">
                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
};
