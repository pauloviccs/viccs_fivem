import { create } from 'zustand';

interface Song {
    id: string;
    title: string;
    artist: string;
    cover: string;
    duration: number;
}

interface SpotifyState {
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    playSong: (song: Song) => void;
    togglePlay: () => void;
    nextSong: () => void;
    prevSong: () => void;
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
    currentSong: {
        id: '1',
        title: 'Starboy',
        artist: 'The Weeknd',
        cover: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png',
        duration: 230,
    },
    isPlaying: false,
    progress: 30,

    playSong: (song) => set({ currentSong: song, isPlaying: true }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    nextSong: () => console.log('Next song'),
    prevSong: () => console.log('Prev song'),
}));
