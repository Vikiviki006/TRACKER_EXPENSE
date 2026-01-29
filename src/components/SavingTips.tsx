import React from 'react';
import { useData } from '@/contexts/DataContext';
import { SavingTip } from '@/types';
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SavingTips = () => {
  const { getSavingTips } = useData();
  const tips = getSavingTips();

  const getIcon = (type: SavingTip['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTipClasses = (type: SavingTip['type']) => {
    switch (type) {
      case 'warning':
        return 'tip-card-warning';
      case 'success':
        return 'tip-card-success';
      default:
        return 'tip-card-info';
    }
  };

  if (tips.length === 0) {
    return (
      <div className="form-section">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Smart Saving Tips
        </h3>
        <div className="text-center py-6 text-muted-foreground">
          <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Add some transactions to get personalized tips!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-accent" />
        Smart Saving Tips
      </h3>
      
      <div className="space-y-3">
        {tips.map((tip) => (
          <div key={tip.id} className={`tip-card ${getTipClasses(tip.type)} animate-slide-up`}>
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(tip.type)}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{tip.title}</h4>
              <p className="text-sm mt-1 text-muted-foreground">{tip.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingTips;
