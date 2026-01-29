// Type definitions for Smart Expense Tracker

export type ExpenseCategory = 'food' | 'travel' | 'shopping' | 'bills' | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Income {
  id: string;
  userId: string;
  amount: number;
  source: string;
  date: Date;
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface MonthlyAnalytics {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
}

export interface SavingTip {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  icon: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TransactionFormData {
  amount: number;
  source?: string;
  category?: ExpenseCategory;
  description?: string;
  date: Date;
}

// Category configuration for consistent styling
export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; color: string; icon: string }> = {
  food: { label: 'Food & Dining', color: 'hsl(32, 95%, 44%)', icon: '🍔' },
  travel: { label: 'Travel', color: 'hsl(210, 92%, 45%)', icon: '✈️' },
  shopping: { label: 'Shopping', color: 'hsl(280, 65%, 60%)', icon: '🛍️' },
  bills: { label: 'Bills & Utilities', color: 'hsl(160, 84%, 28%)', icon: '📄' },
  other: { label: 'Other', color: 'hsl(220, 15%, 46%)', icon: '📦' },
};
