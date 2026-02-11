import { create } from 'zustand';

interface Transaction {
    id: string;
    title: string;
    amount: number;
    date: string;
    type: 'in' | 'out';
}

interface BankState {
    balance: number;
    invoices: {
        current: number;
        limit: number;
    };
    loans: {
        available: number;
    };
    history: Transaction[];
}

export const useBankStore = create<BankState>(() => ({
    balance: 1450.50,
    invoices: {
        current: 450.00,
        limit: 2000.00,
    },
    loans: {
        available: 12500.00,
    },
    history: [
        { id: '1', title: 'Transferência recebida', amount: 350.00, date: 'Hoje, 10:23', type: 'in' },
        { id: '2', title: 'Pagamento efetuado', amount: 45.90, date: 'Ontem', type: 'out' },
        { id: '3', title: 'Burger Shot', amount: 22.50, date: '25 ago', type: 'out' },
    ],
}));
