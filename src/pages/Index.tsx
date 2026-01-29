import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2,
  BarChart3,
  Shield
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Track Income & Expenses',
      description: 'Easily log all your financial transactions with categories and dates.',
    },
    {
      icon: PieChart,
      title: 'Visual Analytics',
      description: 'Beautiful charts showing spending patterns and monthly trends.',
    },
    {
      icon: Lightbulb,
      title: 'Smart Insights',
      description: 'Get personalized saving tips based on your spending behavior.',
    },
    {
      icon: BarChart3,
      title: 'Monthly Reports',
      description: 'Comprehensive summary of your income, expenses, and savings.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        
        <div className="relative container py-20 sm:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 animate-fade-in">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
              Smart Expense Tracker
              <br />
              <span className="text-gradient">with Insights</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 animate-slide-up">
              Take control of your finances with powerful analytics, smart saving tips, 
              and beautiful visualizations. Your personal financial companion.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link to="/register">
                <Button size="lg" className="text-base px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>No Credit Card</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete financial tracking solution with powerful features to help you 
            manage your money better.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Preview */}
      <div className="container py-20">
        <div className="bg-card rounded-2xl border border-border/50 shadow-card p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Track by Category</h2>
              <p className="text-muted-foreground mb-6">
                Organize your expenses into meaningful categories and see exactly 
                where your money goes each month.
              </p>
              
              <div className="space-y-3">
                {[
                  { emoji: '🍔', label: 'Food & Dining', color: 'bg-chart-food' },
                  { emoji: '✈️', label: 'Travel', color: 'bg-chart-travel' },
                  { emoji: '🛍️', label: 'Shopping', color: 'bg-chart-shopping' },
                  { emoji: '📄', label: 'Bills & Utilities', color: 'bg-chart-bills' },
                  { emoji: '📦', label: 'Other', color: 'bg-chart-other' },
                ].map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      {cat.emoji}
                    </div>
                    <span className="font-medium">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Decorative pie chart preview */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse-subtle" />
                <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
                  <PieChart className="w-20 h-20 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Start Tracking Today</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who have taken control of their finances. 
            It's free, secure, and takes just seconds to get started.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-base px-8">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span className="font-semibold">ExpenseTracker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Smart Expense Tracker. Final Year Project.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
