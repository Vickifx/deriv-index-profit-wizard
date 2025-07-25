import { PipCalculator } from '@/components/PipCalculator';
import { RiskCalculator } from '@/components/RiskCalculator';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { AdBanner } from '@/components/AdBanner';
import { AdSidebar } from '@/components/AdSidebar';
import { Toaster } from '@/components/ui/toaster';
import { TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-gradient-start to-trading-gradient-end p-2 sm:p-4">
      <DarkModeToggle />
      
      <div className="container mx-auto max-w-7xl py-4 sm:py-8">
        {/* Header Banner Ad */}
        <div className="mb-6">
          <div className="text-center text-sm text-primary-foreground/60 mb-2">Advertisement</div>
          <AdBanner 
            zoneId="123458" // Replace with your MonetAG zone ID
            width={728}
            height={90}
            className="max-w-4xl mx-auto min-h-[90px]"
          />
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground">
              Deriv Index Pip Calculator
            </h1>
          </div>
          <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto px-4">
            Calculate pip values and potential profits for Deriv synthetic indices with real-time pricing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Calculator Content */}
          <div className="lg:col-span-3">
            <PipCalculator />
            
            <div className="mt-6 sm:mt-8">
              <RiskCalculator />
            </div>
            
            {/* Content Bottom Ad */}
            <div className="mt-6 sm:mt-8">
              <div className="text-center text-sm text-primary-foreground/60 mb-2">Sponsored Content</div>
              <AdBanner
                zoneId="123459" // Replace with your MonetAG zone ID
                width={728}
                height={250}
                className="min-h-[250px]"
              />
            </div>
          </div>

          {/* Sidebar with Ads */}
          <div className="lg:col-span-1">
            <AdSidebar />
          </div>
        </div>
        
        <footer className="mt-8 sm:mt-12 text-center text-primary-foreground/60">
          <p className="text-xs sm:text-sm px-4">
            Professional trading calculator for Deriv synthetic indices
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
