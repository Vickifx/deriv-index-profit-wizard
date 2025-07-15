import { PipCalculator } from '@/components/PipCalculator';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { AdBanner } from '@/components/AdBanner';
import { AdSidebar } from '@/components/AdSidebar';
import { TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-gradient-start to-trading-gradient-end p-4">
      <DarkModeToggle />
      
      <div className="container mx-auto max-w-7xl py-8">
        {/* Header Banner Ad */}
        <div className="mb-6">
          <div className="text-center text-sm text-primary-foreground/60 mb-2">Advertisement</div>
          <AdBanner 
            adSlot="1111111111" // Replace with your leaderboard ad slot ID
            adFormat="horizontal"
            className="max-w-4xl mx-auto min-h-[90px]"
          />
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calculator Content */}
          <div className="lg:col-span-3">
            <PipCalculator />
            
            {/* Content Bottom Ad */}
            <div className="mt-8">
              <div className="text-center text-sm text-primary-foreground/60 mb-2">Sponsored Content</div>
              <AdBanner 
                adSlot="2222222222" // Replace with your content ad slot ID
                adFormat="horizontal"
                className="min-h-[250px]"
              />
            </div>
          </div>

          {/* Sidebar with Ads */}
          <div className="lg:col-span-1">
            <AdSidebar />
          </div>
        </div>
        
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
