import React from 'react';
import { motion } from 'framer-motion';
import { usePhoneAppStore } from '../../../store/phoneAppStore';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export const Keypad: React.FC = () => {
    const { addDigit, dialedNumber, deleteDigit } = usePhoneAppStore();

    return (
        <div className="flex flex-col items-center justify-end h-full pb-8">
            {/* Display Number */}
            <div className="h-20 text-4xl font-light mb-8 text-black flex items-center justify-center w-full relative group">
                {dialedNumber}
                {dialedNumber && (
                    <button onClick={deleteDigit} className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-backspace text-xl"></i>
                    </button>
                )}
            </div>

            {/* Keys Grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8">
                {keys.map((key) => (
                    <motion.button
                        key={key}
                        whileTap={{ backgroundColor: '#e5e7eb' }}
                        onClick={() => addDigit(key)}
                        className="w-20 h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center transition-colors"
                    >
                        <span className="text-3xl font-medium text-black">{key}</span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            {key === '1' ? '' : key === '0' ? '+' : 'ABC'}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Call Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl shadow-lg shadow-green-200"
            >
                <i className="fas fa-phone"></i>
            </motion.button>
        </div>
    );
};
