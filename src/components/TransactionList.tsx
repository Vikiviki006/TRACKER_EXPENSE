import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Income, Expense, EXPENSE_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

const TransactionList = () => {
  const { incomes, expenses, deleteIncome, deleteExpense } = useData();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Combine and sort transactions
  const allTransactions = [
    ...incomes.map(income => ({ ...income, type: 'income' as const })),
    ...expenses.map(expense => ({ ...expense, type: 'expense' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = filter === 'all' 
    ? allTransactions 
    : allTransactions.filter(t => t.type === filter);

  const handleDelete = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      deleteIncome(id);
    } else {
      deleteExpense(id);
    }
  };

  return (
    <div className="form-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                filter === f 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm mt-1">Add your first income or expense above</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredTransactions.slice(0, 20).map((transaction) => {
            const isIncome = transaction.type === 'income';
            const incomeTransaction = transaction as Income & { type: 'income' };
            const expenseTransaction = transaction as Expense & { type: 'expense' };
            
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isIncome ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {isIncome ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {isIncome 
                        ? incomeTransaction.source 
                        : `${EXPENSE_CATEGORIES[expenseTransaction.category].icon} ${expenseTransaction.description}`
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      {!isIncome && (
                        <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                          {EXPENSE_CATEGORIES[expenseTransaction.category].label}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${isIncome ? 'text-success' : 'text-destructive'}`}>
                    {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(transaction.id, transaction.type)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
