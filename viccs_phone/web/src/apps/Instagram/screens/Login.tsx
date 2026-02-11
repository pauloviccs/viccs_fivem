import React, { useState } from 'react';
import { GlassCard } from '../../../components/GlassCard';
import { fetchNui } from '../../../utils/fetchNui';
import { useInstagramStore } from '../store';

export const LoginScreen: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const login = useInstagramStore((state) => state.login);

    const handleSubmit = async () => {
        if (!username || !password) return;

        if (isRegister) {
            const res = await fetchNui('instagramRegister', { username, password, bio, avatar: 'default.png' });
            if (res.success) {
                setIsRegister(false); // Go to login after register
            }
        } else {
            const res = await fetchNui('instagramLogin', { username, password });
            if (res.success) {
                login(res.account);
            }
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-red-900 to-yellow-800">
            <h1 className="text-4xl font-serif italic text-white mb-8">Instagram</h1>

            <GlassCard className="w-full flex flex-col gap-4 !bg-black/30 !border-white/10">
                <input
                    type="text"
                    placeholder="Username"
                    className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {isRegister && (
                    <input
                        type="text"
                        placeholder="Bio (Optional)"
                        className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                )}

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                >
                    {isRegister ? 'Sign Up' : 'Log In'}
                </button>
            </GlassCard>

            <div className="mt-6 flex flex-col items-center gap-2">
                <span className="text-white/60 text-sm">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-white font-semibold text-sm hover:underline"
                >
                    {isRegister ? 'Log In' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};
