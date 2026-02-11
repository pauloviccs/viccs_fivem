import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { fetchNui } from '../../utils/fetchNui';
import { ArrowUpRight, ArrowDownLeft, Wallet, Send } from 'lucide-react';

interface BankData {
    cash: number;
    bank: number;
    transactions: Transaction[];
}

interface Transaction {
    id: number;
    type: 'incoming' | 'outgoing';
    amount: number;
    title: string;
    date: string;
}

export const Bank: React.FC = () => {
    const [data, setData] = useState<BankData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNui('getBankData').then((res) => {
            if (res) {
                setData(res);
            }
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-4 text-white">Loading...</div>;

    return (
        <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto hide-scrollbar bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-white">NuBank</h1>
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">V</span>
                </div>
            </div>

            {/* Balance Card */}
            <GlassCard className="bg-gradient-to-br from-purple-700 to-indigo-900 !border-white/20">
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-purple-200">Total Balance</span>
                    <span className="text-3xl font-bold text-white">
                        ${data?.bank.toLocaleString()}
                    </span>
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-xl flex flex-col items-center gap-1 transition-colors">
                            <Send size={16} className="text-white" />
                            <span className="text-[10px] text-white">Pix</span>
                        </button>
                        <button className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-xl flex flex-col items-center gap-1 transition-colors">
                            <ArrowUpRight size={16} className="text-white" />
                            <span className="text-[10px] text-white">Deposit</span>
                        </button>
                        <button className="flex-1 bg-white/20 hover:bg-white/30 p-2 rounded-xl flex flex-col items-center gap-1 transition-colors">
                            <ArrowDownLeft size={16} className="text-white" />
                            <span className="text-[10px] text-white">Withdraw</span>
                        </button>
                    </div>
                </div>
            </GlassCard>

            {/* Wallet Info */}
            <GlassCard className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <Wallet className="text-green-400" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">Cash</span>
                        <span className="text-xs text-white/50">On Hand</span>
                    </div>
                </div>
                <span className="text-lg font-bold text-green-400">${data?.cash.toLocaleString()}</span>
            </GlassCard>

            {/* Transactions */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-white/70 ml-1">Recent Activity</span>
                {data?.transactions.map((tx) => (
                    <GlassCard key={tx.id} className="flex justify-between items-center !p-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tx.type === 'incoming' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                {tx.type === 'incoming' ? <ArrowDownLeft size={16} className="text-green-400" /> : <ArrowUpRight size={16} className="text-red-400" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-white font-medium">{tx.title}</span>
                                <span className="text-[10px] text-white/50">{tx.date}</span>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === 'incoming' ? 'text-green-400' : 'text-white'}`}>
                            {tx.type === 'incoming' ? '+' : '-'}${tx.amount}
                        </span>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
