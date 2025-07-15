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
          zoneId="123456" // Replace with your MonetAG zone ID
          width={300}
          height={600}
          className="min-h-[600px]"
        />
      </Card>

      {/* Square Ad */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2 text-center">Sponsored</div>
        <AdBanner 
          zoneId="123457" // Replace with your MonetAG zone ID
          width={300}
          height={250}
          className="min-h-[250px]"
        />
      </Card>
    </div>
  );
};