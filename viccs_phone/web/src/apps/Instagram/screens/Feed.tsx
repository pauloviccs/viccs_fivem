import React, { useEffect, useState } from 'react';
import { fetchNui } from '../../../utils/fetchNui';
import { Heart, MessageCircle, Send, Bookmark, PlusSquare } from 'lucide-react';

interface Post {
    id: number;
    username: string;
    avatar: string;
    image: string;
    caption: string;
    likes: number;
    date: string;
}

export const FeedScreen: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNui('getInstagramPosts').then((res) => {
            if (Array.isArray(res)) setPosts(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-white p-4">Loading Feed...</div>;

    return (
        <div className="h-full w-full bg-black flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-10">
                <span className="text-xl font-bold font-serif italic text-white">Instagram</span>
                <div className="flex gap-4">
                    <PlusSquare size={24} className="text-white" />
                    <Heart size={24} className="text-white" />
                    <Send size={24} className="text-white -rotate-45 mb-1" />
                </div>
            </div>

            {/* Stories List */}
            <div className="flex gap-4 p-4 overflow-x-auto hide-scrollbar border-b border-white/5">
                {['Your Story', 'mechanic', 'police', 'ems', 'gang'].map((name, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                        <div className={`w-16 h-16 rounded-full p-[2px] ${i === 0 ? 'bg-transparent border border-white/20' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
                            <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-xs text-white truncate w-16 text-center">{name}</span>
                    </div>
                ))}
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                {posts.map((post) => (
                    <div key={post.id} className="mb-4">
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                                    <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-semibold text-white">{post.username}</span>
                            </div>
                            <span className="text-white font-bold tracking-widest text-xs">...</span>
                        </div>

                        {/* Image */}
                        <div className="w-full aspect-square bg-gray-900">
                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                        </div>

                        {/* Actions */}
                        <div className="p-3">
                            <div className="flex justify-between mb-2">
                                <div className="flex gap-4">
                                    <Heart size={24} className="text-white hover:text-red-500 cursor-pointer transition-colors" />
                                    <MessageCircle size={24} className="text-white -scale-x-100" />
                                    <Send size={24} className="text-white -rotate-45 mt-0.5" />
                                </div>
                                <Bookmark size={24} className="text-white" />
                            </div>

                            <div className="text-sm text-white font-semibold mb-1">{post.likes.toLocaleString()} likes</div>

                            <div className="text-sm text-white">
                                <span className="font-semibold mr-2">{post.username}</span>
                                {post.caption}
                            </div>

                            <div className="text-xs text-gray-400 mt-1 uppercase">{post.date}</div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};
