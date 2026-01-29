import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'savings';
  trend?: number;
}

const StatCard = ({ title, value, type, trend }: StatCardProps) => {
  const icons = {
    income: TrendingUp,
    expense: TrendingDown,
    savings: PiggyBank,
  };
  
  const Icon = icons[type];
  
  const cardClasses = {
    income: 'stat-card-income',
    expense: 'stat-card-expense',
    savings: 'stat-card-savings',
  };

  return (
    <div className={`stat-card ${cardClasses[type]} animate-slide-up`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <Icon className="w-full h-full" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">{title}</span>
        </div>
        
        <div className="text-3xl font-bold">
          ₹{value.toLocaleString('en-IN')}
        </div>
        
        {trend !== undefined && (
          <div className="mt-2 text-sm opacity-80">
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% from last month
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
