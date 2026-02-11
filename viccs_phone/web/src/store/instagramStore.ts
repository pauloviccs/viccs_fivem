import { create } from 'zustand';

interface User {
    id: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
}

interface Story {
    id: string;
    userId: string;
    image: string;
    viewed: boolean;
}

interface Post {
    id: string;
    userId: string;
    image: string;
    likes: number;
    caption: string;
    comments: number;
    timeAgo: string;
    liked?: boolean;
}

interface InstagramState {
    user: User;
    stories: Story[];
    posts: Post[];
    toggleLike: (postId: string) => void;
}

export const useInstagramStore = create<InstagramState>((set) => ({
    user: {
        id: 'me',
        username: 'paulo.viccs',
        avatar: 'https://i.pravatar.cc/150?u=me',
        isVerified: true,
    },
    stories: [
        { id: '1', userId: '1', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', viewed: false },
        { id: '2', userId: '2', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500', viewed: false },
        { id: '3', userId: '3', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500', viewed: true },
    ],
    posts: [
        {
            id: '1',
            userId: '1',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500',
            likes: 1240,
            caption: 'New ride! 🏎️ #simlife #ferrari',
            comments: 45,
            timeAgo: '2h'
        },
        {
            id: '2',
            userId: '2',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500',
            likes: 856,
            caption: 'Hiking views 🏔️',
            comments: 12,
            timeAgo: '5h'
        },
    ],
    toggleLike: (postId) => set((state) => ({
        posts: state.posts.map(post =>
            post.id === postId
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        )
    })),
}));
