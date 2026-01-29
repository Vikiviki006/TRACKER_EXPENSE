import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useData } from '@/contexts/DataContext';
import { EXPENSE_CATEGORIES } from '@/types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Bar Chart: Income vs Expense
export const IncomeExpenseChart = () => {
  const { getMonthlyAnalytics } = useData();
  const now = new Date();
  
  // Get last 6 months data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const analytics = getMonthlyAnalytics(date.getMonth(), date.getFullYear());
    months.push({
      month: analytics.month.slice(0, 3),
      income: analytics.totalIncome,
      expense: analytics.totalExpenses,
    });
  }

  const data = {
    labels: months.map(m => m.month),
    datasets: [
      {
        label: 'Income',
        data: months.map(m => m.income),
        backgroundColor: 'hsla(142, 76%, 36%, 0.8)',
        borderColor: 'hsl(142, 76%, 36%)',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: months.map(m => m.expense),
        backgroundColor: 'hsla(0, 72%, 51%, 0.8)',
        borderColor: 'hsl(0, 72%, 51%)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsla(220, 13%, 91%, 0.5)',
        },
        ticks: {
          callback: function(value: number | string) {
            return '₹' + Number(value).toLocaleString('en-IN');
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

// Pie Chart: Category-wise Expenses
export const CategoryPieChart = () => {
  const { getMonthlyAnalytics } = useData();
  const now = new Date();
  const analytics = getMonthlyAnalytics(now.getMonth(), now.getFullYear());

  const categories = Object.entries(analytics.categoryBreakdown)
    .filter(([_, value]) => value > 0);

  if (categories.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No expense data for this month
        </div>
      </div>
    );
  }

  const data = {
    labels: categories.map(([key]) => EXPENSE_CATEGORIES[key as keyof typeof EXPENSE_CATEGORIES].label),
    datasets: [
      {
        data: categories.map(([_, value]) => value),
        backgroundColor: [
          'hsla(32, 95%, 44%, 0.85)',   // Food - orange
          'hsla(210, 92%, 45%, 0.85)',  // Travel - blue
          'hsla(280, 65%, 60%, 0.85)',  // Shopping - purple
          'hsla(160, 84%, 28%, 0.85)',  // Bills - emerald
          'hsla(220, 15%, 46%, 0.85)',  // Other - gray
        ],
        borderColor: [
          'hsl(32, 95%, 44%)',
          'hsl(210, 92%, 45%)',
          'hsl(280, 65%, 60%)',
          'hsl(160, 84%, 28%)',
          'hsl(220, 15%, 46%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ₹${value.toLocaleString('en-IN')}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  hidden: false,
                  index: i,
                  pointStyle: 'circle',
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

// Line Chart: Monthly Trend
export const MonthlyTrendChart = () => {
  const { getMonthlyAnalytics } = useData();
  const now = new Date();
  
  // Get last 6 months data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const analytics = getMonthlyAnalytics(date.getMonth(), date.getFullYear());
    months.push({
      month: analytics.month.slice(0, 3),
      savings: analytics.savings,
    });
  }

  const data = {
    labels: months.map(m => m.month),
    datasets: [
      {
        label: 'Net Savings',
        data: months.map(m => m.savings),
        borderColor: 'hsl(160, 84%, 28%)',
        backgroundColor: 'hsla(160, 84%, 28%, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'hsl(160, 84%, 28%)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return value >= 0 
              ? `Saved: ₹${value.toLocaleString('en-IN')}` 
              : `Deficit: -₹${Math.abs(value).toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'hsla(220, 13%, 91%, 0.5)',
        },
        ticks: {
          callback: function(value: number | string) {
            return '₹' + Number(value).toLocaleString('en-IN');
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Savings Trend</h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
