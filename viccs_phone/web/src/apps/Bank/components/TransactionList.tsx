import React from 'react';
import { useBankStore } from '../../../store/bankStore';

export const TransactionList: React.FC = () => {
    const { history } = useBankStore();

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-lg font-bold">Histórico</h3>
            </div>
            <div className="flex flex-col gap-px bg-white/10 rounded-xl overflow-hidden">
                {history.map((tx) => (
                    <div key={tx.id} className="bg-white p-4 flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                <i className={tx.type === 'in' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{tx.title}</p>
                                <p className="text-xs text-gray-500">{tx.date}</p>
                            </div>
                        </div>
                        <span className={`font-bold text-sm ${tx.type === 'in' ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.type === 'in' ? '+' : '-'} R$ {tx.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
