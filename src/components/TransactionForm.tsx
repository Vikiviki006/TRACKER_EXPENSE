import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSuccess?: () => void;
}

const TransactionForm = ({ type, onSuccess }: TransactionFormProps) => {
  const { addIncome, addExpense } = useData();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setIsLoading(false);
      return;
    }

    const selectedDate = new Date(date);

    if (type === 'income') {
      addIncome(parsedAmount, source, selectedDate);
    } else {
      addExpense(parsedAmount, category, description, selectedDate);
    }

    // Reset form
    setAmount('');
    setSource('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsLoading(false);
    onSuccess?.();
  };

  const isIncome = type === 'income';

  return (
    <div className="form-section animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${isIncome ? 'bg-success/10' : 'bg-destructive/10'}`}>
          {isIncome ? (
            <TrendingUp className="w-5 h-5 text-success" />
          ) : (
            <TrendingDown className="w-5 h-5 text-destructive" />
          )}
        </div>
        <h3 className="text-lg font-semibold">
          Add {isIncome ? 'Income' : 'Expense'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${type}-amount`}>Amount (₹)</Label>
            <Input
              id={`${type}-amount`}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-date`}>Date</Label>
            <Input
              id={`${type}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {isIncome ? (
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              type="text"
              placeholder="e.g., Salary, Freelance, Dividends"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPENSE_CATEGORIES).map(([key, { label, icon }]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span>{label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="e.g., Lunch at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          variant={isIncome ? 'default' : 'destructive'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {isIncome ? 'Income' : 'Expense'}
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;
