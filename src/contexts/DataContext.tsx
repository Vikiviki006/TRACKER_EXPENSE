import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Income, Expense, ExpenseCategory, MonthlyAnalytics, SavingTip, EXPENSE_CATEGORIES } from '@/types';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  incomes: Income[];
  expenses: Expense[];
  addIncome: (amount: number, source: string, date: Date) => void;
  updateIncome: (id: string, amount: number, source: string, date: Date) => void;
  deleteIncome: (id: string) => void;
  addExpense: (amount: number, category: ExpenseCategory, description: string, date: Date) => void;
  updateExpense: (id: string, amount: number, category: ExpenseCategory, description: string, date: Date) => void;
  deleteExpense: (id: string) => void;
  getMonthlyAnalytics: (month: number, year: number) => MonthlyAnalytics;
  getSavingTips: () => SavingTip[];
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Storage keys
const INCOMES_KEY = 'expense_tracker_incomes';
const EXPENSES_KEY = 'expense_tracker_expenses';

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedIncomes = localStorage.getItem(`${INCOMES_KEY}_${user.id}`);
      const storedExpenses = localStorage.getItem(`${EXPENSES_KEY}_${user.id}`);
      
      setIncomes(storedIncomes ? JSON.parse(storedIncomes) : []);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : []);
    } else {
      setIncomes([]);
      setExpenses([]);
    }
    setIsLoading(false);
  }, [user, isAuthenticated]);

  // Save incomes to localStorage
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`${INCOMES_KEY}_${user.id}`, JSON.stringify(incomes));
    }
  }, [incomes, user, isLoading]);

  // Save expenses to localStorage
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`${EXPENSES_KEY}_${user.id}`, JSON.stringify(expenses));
    }
  }, [expenses, user, isLoading]);

  // Add income
  const addIncome = (amount: number, source: string, date: Date) => {
    if (!user) return;
    const newIncome: Income = {
      id: uuidv4(),
      userId: user.id,
      amount,
      source,
      date,
      createdAt: new Date(),
    };
    setIncomes(prev => [...prev, newIncome]);
  };

  // Update income
  const updateIncome = (id: string, amount: number, source: string, date: Date) => {
    setIncomes(prev => prev.map(income => 
      income.id === id ? { ...income, amount, source, date } : income
    ));
  };

  // Delete income
  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  // Add expense
  const addExpense = (amount: number, category: ExpenseCategory, description: string, date: Date) => {
    if (!user) return;
    const newExpense: Expense = {
      id: uuidv4(),
      userId: user.id,
      amount,
      category,
      description,
      date,
      createdAt: new Date(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  // Update expense
  const updateExpense = (id: string, amount: number, category: ExpenseCategory, description: string, date: Date) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, amount, category, description, date } : expense
    ));
  };

  // Delete expense
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Get monthly analytics
  const getMonthlyAnalytics = (month: number, year: number): MonthlyAnalytics => {
    const monthlyIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
    });

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });

    const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryBreakdown: Record<ExpenseCategory, number> = {
      food: 0,
      travel: 0,
      shopping: 0,
      bills: 0,
      other: 0,
    };

    monthlyExpenses.forEach(expense => {
      categoryBreakdown[expense.category] += expense.amount;
    });

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    return {
      month: monthNames[month],
      year,
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      categoryBreakdown,
    };
  };

  // Get smart saving tips based on spending behavior
  const getSavingTips = (): SavingTip[] => {
    const tips: SavingTip[] = [];
    const now = new Date();
    const analytics = getMonthlyAnalytics(now.getMonth(), now.getFullYear());
    
    // Warning: Expenses exceed income
    if (analytics.totalExpenses > analytics.totalIncome && analytics.totalIncome > 0) {
      tips.push({
        id: 'overspending',
        type: 'warning',
        title: 'Overspending Alert!',
        message: `Your expenses (₹${analytics.totalExpenses.toLocaleString()}) exceed your income (₹${analytics.totalIncome.toLocaleString()}). Consider cutting back on non-essential expenses.`,
        icon: '⚠️',
      });
    }

    // Food expense > 40% warning
    const foodPercentage = analytics.totalExpenses > 0 
      ? (analytics.categoryBreakdown.food / analytics.totalExpenses) * 100 
      : 0;
    
    if (foodPercentage > 40) {
      tips.push({
        id: 'food-high',
        type: 'warning',
        title: 'High Food Expenses',
        message: `Food expenses are ${foodPercentage.toFixed(1)}% of your total spending. Try meal prepping or cooking at home more often to save money.`,
        icon: '🍔',
      });
    }

    // Shopping > 30% tip
    const shoppingPercentage = analytics.totalExpenses > 0 
      ? (analytics.categoryBreakdown.shopping / analytics.totalExpenses) * 100 
      : 0;
    
    if (shoppingPercentage > 30) {
      tips.push({
        id: 'shopping-high',
        type: 'info',
        title: 'Shopping Tip',
        message: `Shopping is ${shoppingPercentage.toFixed(1)}% of expenses. Consider waiting 24 hours before non-essential purchases.`,
        icon: '🛍️',
      });
    }

    // Good savings rate
    const savingsRate = analytics.totalIncome > 0 
      ? (analytics.savings / analytics.totalIncome) * 100 
      : 0;
    
    if (savingsRate >= 20) {
      tips.push({
        id: 'good-savings',
        type: 'success',
        title: 'Great Savings Rate!',
        message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the great work!`,
        icon: '🎉',
      });
    } else if (savingsRate > 0 && savingsRate < 20) {
      tips.push({
        id: 'improve-savings',
        type: 'info',
        title: 'Savings Goal',
        message: `You're saving ${savingsRate.toFixed(1)}%. Aim for 20% savings rate for financial security.`,
        icon: '💡',
      });
    }

    // Suggested monthly savings
    if (analytics.totalIncome > 0) {
      const suggestedSavings = analytics.totalIncome * 0.2;
      tips.push({
        id: 'suggested-savings',
        type: 'info',
        title: 'Recommended Savings',
        message: `Based on your income, aim to save ₹${suggestedSavings.toLocaleString()} per month (20% rule).`,
        icon: '📊',
      });
    }

    return tips;
  };

  return (
    <DataContext.Provider value={{
      incomes,
      expenses,
      addIncome,
      updateIncome,
      deleteIncome,
      addExpense,
      updateExpense,
      deleteExpense,
      getMonthlyAnalytics,
      getSavingTips,
      isLoading,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
