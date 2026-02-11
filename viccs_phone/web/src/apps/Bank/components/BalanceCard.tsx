import React from 'react';

interface Props {
    title: string;
    value: string;
    subtitle?: string;
}

export const BalanceCard: React.FC<Props> = ({ title, value, subtitle }) => {
    return (
        <div className="bg-white text-black rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-gray-800">{title}</h3>
                <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            </div>
            <p className="text-base font-medium text-gray-700">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
    );
};
