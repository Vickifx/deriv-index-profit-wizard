
import { PipCalculator } from '@/components/PipCalculator';
import { RiskCalculator } from '@/components/RiskCalculator';
import { ForexCalculator } from '@/components/ForexCalculator';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Toaster } from '@/components/ui/toaster';
import { TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-gradient-start to-trading-gradient-end p-2 sm:p-4">
      <DarkModeToggle />
      
      <div className="container mx-auto max-w-6xl py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground">
              Trading Calculator Suite
            </h1>
          </div>
          <p className="text-base sm:text-lg text-primary-foreground/80 max-w-3xl mx-auto px-4">
            Professional trading calculators for Deriv synthetic indices, Forex pairs, and risk management
          </p>
        </div>

        <div className="space-y-8">
          {/* Index Calculator */}
          <PipCalculator />
          
          {/* Currency Pair Calculator */}
          <ForexCalculator />
          
          {/* Risk Calculator */}
          <RiskCalculator />
        </div>
        
        <footer className="mt-8 sm:mt-12 text-center text-primary-foreground/60">
          <p className="text-xs sm:text-sm px-4">
            Professional trading calculators for synthetic indices, forex, and risk management
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
