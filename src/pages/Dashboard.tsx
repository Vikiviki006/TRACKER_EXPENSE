import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import SavingTips from '@/components/SavingTips';
import { IncomeExpenseChart, CategoryPieChart, MonthlyTrendChart } from '@/components/Charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { getMonthlyAnalytics, isLoading } = useData();
  const [activeTab, setActiveTab] = useState('income');
  
  const now = new Date();
  const analytics = getMonthlyAnalytics(now.getMonth(), now.getFullYear());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {analytics.month} {analytics.year} Overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Income"
            value={analytics.totalIncome}
            type="income"
          />
          <StatCard
            title="Total Expenses"
            value={analytics.totalExpenses}
            type="expense"
          />
          <StatCard
            title="Net Savings"
            value={analytics.savings}
            type="savings"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms & Transactions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Transaction Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="income" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Income
                </TabsTrigger>
                <TabsTrigger value="expense" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Expense
                </TabsTrigger>
              </TabsList>
              <TabsContent value="income">
                <TransactionForm type="income" />
              </TabsContent>
              <TabsContent value="expense">
                <TransactionForm type="expense" />
              </TabsContent>
            </Tabs>

            {/* Saving Tips */}
            <SavingTips />
          </div>

          {/* Right Column - Charts & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IncomeExpenseChart />
              <CategoryPieChart />
            </div>

            {/* Trend Chart */}
            <MonthlyTrendChart />

            {/* Transaction List */}
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
