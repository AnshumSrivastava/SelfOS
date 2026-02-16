import { SupabaseStore } from './supabaseStore.svelte';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    date: string;
    category: string;
    tags: string[];
    createdAt?: string;
}

export interface Budget {
    id: string;
    category: string;
    amount: number;
    spent: number;
    period: 'monthly';
    color: string;
}

export interface FinancialGoal {
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

class FinanceStore {
    private transactionsStore = new SupabaseStore<Transaction>('finance_transactions');
    private budgetsStore = new SupabaseStore<Budget>('finance_budgets');
    private goalsStore = new SupabaseStore<FinancialGoal>('finance_savings_goals');
    private investmentsStore = new SupabaseStore<Investment>('finance_investments');
    private remindersStore = new SupabaseStore<Reminder>('finance_reminders');

    get transactions() { return this.transactionsStore.value; }
    get budgets() { return this.budgetsStore.value; }
    get goals() { return this.goalsStore.value; }
    get investments() { return this.investmentsStore.value; }
    get reminders() { return this.remindersStore.value; }
    get loading() {
        return this.transactionsStore.loading ||
            this.budgetsStore.loading ||
            this.goalsStore.loading ||
            this.investmentsStore.loading ||
            this.remindersStore.loading;
    }

    get status() {
        const statuses = [
            this.transactionsStore.status,
            this.budgetsStore.status,
            this.goalsStore.status,
            this.investmentsStore.status,
            this.remindersStore.status
        ];
        if (statuses.includes('saving')) return 'saving';
        if (statuses.includes('loading')) return 'loading';
        if (statuses.includes('error')) return 'error';
        if (statuses.includes('success')) return 'success';
        return 'idle';
    }

    get errorMsg() {
        return this.transactionsStore.errorMsg ||
            this.budgetsStore.errorMsg ||
            this.goalsStore.errorMsg ||
            this.investmentsStore.errorMsg ||
            this.remindersStore.errorMsg;
    }

    get incomeReminders() {
        return this.reminders.filter(r => r.type === 'income' && !r.isPaid);
    }

    get expenseReminders() {
        return this.reminders.filter(r => r.type === 'expense' && !r.isPaid);
    }

    get totalReceivingPending() {
        return this.incomeReminders.reduce((acc, r) => acc + r.amount, 0);
    }

    get totalBillsDue() {
        return this.expenseReminders.reduce((acc, r) => acc + r.amount, 0);
    }

    get savingsRate() {
        if (this.income <= 0) return 0;
        return Math.max(0, Math.min(100, Math.round(((this.income - this.expense) / this.income) * 100)));
    }

    // --- Transactions ---
    async addTransaction(transaction: Omit<Transaction, 'id'>) {
        const added = await this.transactionsStore.insert(transaction);
        if (added && transaction.type === 'expense') {
            await this.updateBudgetProgress(added);
        }
    }

    async removeTransaction(id: string) {
        const transaction = this.transactionsStore.value.find(t => t.id === id);
        if (transaction) {
            await this.transactionsStore.delete(id);
            if (transaction.type === 'expense') {
                const budget = this.budgetsStore.value.find(b => b.category === transaction.category);
                if (budget) {
                    await this.budgetsStore.update(budget.id, { spent: budget.spent - transaction.amount });
                }
            }
        }
    }

    get balance() {
        return this.transactions.reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);
    }

    get income() {
        return this.transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    get expense() {
        return this.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    // --- Budgets ---
    async addBudget(budget: Omit<Budget, 'id' | 'spent'>) {
        await this.budgetsStore.insert({ ...budget, spent: 0 } as any);
    }

    async removeBudget(id: string) {
        await this.budgetsStore.delete(id);
    }

    async updateBudgetProgress(transaction: Transaction) {
        if (transaction.type === 'expense') {
            const budget = this.budgetsStore.value.find(b => b.category === transaction.category);
            if (budget) {
                await this.budgetsStore.update(budget.id, { spent: budget.spent + transaction.amount });
            }
        }
    }

    // --- Goals ---
    async addGoal(goal: Omit<FinancialGoal, 'id' | 'currentAmount'>) {
        await this.goalsStore.insert({ ...goal, currentAmount: 0 } as any);
    }

    async removeGoal(id: string) {
        await this.goalsStore.delete(id);
    }

    async addToGoal(id: string, amount: number) {
        const goal = this.goalsStore.value.find(g => g.id === id);
        if (goal) {
            await this.goalsStore.update(id, { currentAmount: goal.currentAmount + amount });
        }
    }

    // --- Investments ---
    async addInvestment(investment: Omit<Investment, 'id'>) {
        await this.investmentsStore.insert(investment);
    }

    async removeInvestment(id: string) {
        await this.investmentsStore.delete(id);
    }

    get totalInvestmentValue() {
        return this.investments.reduce((acc, i) => acc + i.currentValue, 0);
    }

    // --- Reminders ---
    async addReminder(reminder: Omit<Reminder, 'id'>) {
        await this.remindersStore.insert(reminder);
    }

    async removeReminder(id: string) {
        await this.remindersStore.delete(id);
    }

    async toggleReminderPaid(id: string) {
        const reminder = this.remindersStore.value.find(r => r.id === id);
        if (reminder) {
            await this.remindersStore.update(id, { isPaid: !reminder.isPaid });
        }
    }
}

export const financeStore = new FinanceStore();
