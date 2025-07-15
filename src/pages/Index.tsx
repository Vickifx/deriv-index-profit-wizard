import { PipCalculator } from '@/components/PipCalculator';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-gradient-start to-trading-gradient-end p-4">
      <DarkModeToggle />
      
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary-foreground">
              Deriv Index Pip Calculator
            </h1>
          </div>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Calculate pip values and potential profits for Deriv synthetic indices with real-time pricing
          </p>
        </div>

        <PipCalculator />
        
        <footer className="mt-12 text-center text-primary-foreground/60">
          <p className="text-sm">
            Professional trading calculator for Deriv synthetic indices
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
