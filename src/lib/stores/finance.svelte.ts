import { LocalStore } from './localStore.svelte';

type Transaction = {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    date: string; // ISO string or display string for now, preferably ISO
};

const DEFAULT_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        title: "Freelance Project",
        amount: 1200,
        type: "income",
        date: new Date().toISOString(),
    },
    {
        id: '2',
        title: "Grocery Shopping",
        amount: 85.5,
        type: "expense",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
];

class FinanceStore {
    store = new LocalStore<Transaction[]>('selfos_finance', DEFAULT_TRANSACTIONS);

    get transactions() {
        return this.store.value;
    }

    add(title: string, amount: number, type: 'income' | 'expense') {
        this.store.value.unshift({
            id: crypto.randomUUID(),
            title,
            amount,
            type,
            date: new Date().toISOString()
        });
    }

    remove(id: string) {
        this.store.value = this.store.value.filter(t => t.id !== id);
    }

    get balance() {
        return this.store.value.reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);
    }

    get income() {
        return this.store.value
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    get expense() {
        return this.store.value
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
    }
}

export const financeStore = new FinanceStore();
