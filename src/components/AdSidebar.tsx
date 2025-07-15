import React from 'react';
import { AdBanner } from './AdBanner';
import { Card } from '@/components/ui/card';

export const AdSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Vertical Banner Ad */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2 text-center">Advertisement</div>
        <AdBanner 
          adSlot="1234567890" // Replace with your ad slot ID
          adFormat="vertical"
          className="min-h-[600px]"
        />
      </Card>

      {/* Square Ad */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2 text-center">Sponsored</div>
        <AdBanner 
          adSlot="0987654321" // Replace with your ad slot ID
          adFormat="rectangle"
          className="min-h-[250px]"
        />
      </Card>
    </div>
  );
};