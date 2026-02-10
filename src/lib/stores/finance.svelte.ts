import { LocalStore } from './localStore.svelte';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    date: string;
    category: string;
    tags: string[];
}

export interface Budget {
    id: string;
    category: string;
    amount: number;
    spent: number;
    period: 'monthly'; // We can expand this later
    color: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    color: string;
    icon?: string;
}

export interface Investment {
    id: string;
    name: string;
    type: 'stock' | 'crypto' | 'mutual_fund' | 'real_estate' | 'other';
    amountInvested: number;
    currentValue: number;
    date: string;
}

export interface Reminder {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    recurring: boolean;
    frequency?: 'monthly' | 'yearly';
    type: 'income' | 'expense';
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        title: "Freelance Project",
        amount: 1200,
        type: "income",
        date: new Date().toISOString(),
        category: "Work",
        tags: ["freelance", "web-dev"]
    },
    {
        id: '2',
        title: "Grocery Shopping",
        amount: 85.5,
        type: "expense",
        date: new Date(Date.now() - 86400000).toISOString(),
        category: "Food",
        tags: ["groceries", "home"]
    },
];

const DEFAULT_BUDGETS: Budget[] = [
    {
        id: '1',
        category: 'Food',
        amount: 500,
        spent: 350,
        period: 'monthly',
        color: '#ff9800' // Orange
    },
    {
        id: '2',
        category: 'Transport',
        amount: 200,
        spent: 120,
        period: 'monthly',
        color: '#2196f3' // Blue
    }
];

const DEFAULT_GOALS: Goal[] = [
    {
        id: '1',
        name: 'New Laptop',
        targetAmount: 2500,
        currentAmount: 1500,
        deadline: new Date(Date.now() + 7776000000).toISOString(), // ~3 months
        color: '#4caf50' // Green
    }
];

class FinanceStore {
    // Separate stores for better organization, though could be one big object.
    // Keeping them separate for now but exposed via this class.
    transactionsStore = new LocalStore<Transaction[]>('selfos_finance_transactions', DEFAULT_TRANSACTIONS);
    budgetsStore = new LocalStore<Budget[]>('selfos_finance_budgets', DEFAULT_BUDGETS);
    goalsStore = new LocalStore<Goal[]>('selfos_finance_goals', DEFAULT_GOALS);
    investmentsStore = new LocalStore<Investment[]>('selfos_finance_investments', []);
    remindersStore = new LocalStore<Reminder[]>('selfos_finance_reminders', []);

    get transactions() { return this.transactionsStore.value || []; }
    get budgets() { return this.budgetsStore.value || []; }
    get goals() { return this.goalsStore.value || []; }
    get investments() { return this.investmentsStore.value || []; }
    get reminders() { return this.remindersStore.value || []; }

    get incomeReminders() {
        return this.reminders.filter(r => r.type === 'income' && !r.isPaid);
    }

    get expenseReminders() {
        return this.reminders.filter(r => r.type === 'expense' && !r.isPaid);
    }

    // --- Transactions ---
    addTransaction(transaction: Omit<Transaction, 'id'>) {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        this.transactionsStore.value = [newTransaction, ...this.transactionsStore.value];
        this.updateBudgetProgress(newTransaction);
    }

    removeTransaction(id: string) {
        const transaction = this.transactionsStore.value.find(t => t.id === id);
        if (transaction) {
            this.transactionsStore.value = this.transactionsStore.value.filter(t => t.id !== id);
            // Re-calculate budget progress would be complex here without storing history,
            // strictly speaking we should recalculate everything or just subtract.
            // For now, simpler implementation:
            if (transaction.type === 'expense') {
                const budget = this.budgetsStore.value.find(b => b.category === transaction.category);
                if (budget) {
                    budget.spent -= transaction.amount;
                    // Trigger update
                    this.budgetsStore.value = [...this.budgetsStore.value];
                }
            }
        }
    }

    add(title: string, amount: number, type: 'income' | 'expense') {
        // Backwards compatibility wrapper if needed, but better to upgrade calls
        this.addTransaction({
            title,
            amount,
            type,
            category: 'General',
            tags: [],
            date: new Date().toISOString()
        });
    }

    get balance() {
        return (this.transactionsStore.value || []).reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);
    }

    get income() {
        return (this.transactionsStore.value || [])
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    get expense() {
        return (this.transactionsStore.value || [])
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    // --- Budgets ---
    addBudget(budget: Omit<Budget, 'id' | 'spent'>) {
        this.budgetsStore.value = [...this.budgetsStore.value, { ...budget, id: crypto.randomUUID(), spent: 0 }];
    }

    removeBudget(id: string) {
        this.budgetsStore.value = this.budgetsStore.value.filter(b => b.id !== id);
    }

    updateBudgetProgress(transaction: Transaction) {
        if (transaction.type === 'expense') {
            const budget = this.budgetsStore.value.find(b => b.category === transaction.category);
            if (budget) {
                budget.spent += transaction.amount;
                // Re-assign to trigger reactivity if needed
                this.budgetsStore.value = [...this.budgetsStore.value];
            }
        }
    }


    // --- Goals ---
    addGoal(goal: Omit<Goal, 'id' | 'currentAmount'>) {
        this.goalsStore.value = [...this.goalsStore.value, { ...goal, id: crypto.randomUUID(), currentAmount: 0 }];
    }

    removeGoal(id: string) {
        this.goalsStore.value = this.goalsStore.value.filter(g => g.id !== id);
    }

    addToGoal(id: string, amount: number) {
        const goal = this.goalsStore.value.find(g => g.id === id);
        if (goal) {
            goal.currentAmount += amount;
            this.goalsStore.value = [...this.goalsStore.value];
        }
    }

    // --- Investments ---
    addInvestment(investment: Omit<Investment, 'id'>) {
        this.investmentsStore.value = [...this.investmentsStore.value, { ...investment, id: crypto.randomUUID() }];
    }

    removeInvestment(id: string) {
        this.investmentsStore.value = this.investmentsStore.value.filter(i => i.id !== id);
    }

    get totalInvestmentValue() {
        return (this.investmentsStore.value || []).reduce((acc, i) => acc + i.currentValue, 0);
    }

    // --- Reminders ---
    addReminder(reminder: Omit<Reminder, 'id'>) {
        this.remindersStore.value = [...this.remindersStore.value, { ...reminder, id: crypto.randomUUID() }];
    }

    removeReminder(id: string) {
        this.remindersStore.value = this.remindersStore.value.filter(r => r.id !== id);
    }

    toggleReminderPaid(id: string) {
        const reminder = this.remindersStore.value.find(r => r.id === id);
        if (reminder) {
            reminder.isPaid = !reminder.isPaid;
            this.remindersStore.value = [...this.remindersStore.value];
        }
    }
}

export const financeStore = new FinanceStore();
