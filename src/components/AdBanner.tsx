import React, { useEffect } from 'react';

interface AdBannerProps {
  zoneId: string;
  width?: number;
  height?: number;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  zoneId,
  width = 300,
  height = 250,
  className = ""
}) => {
  useEffect(() => {
    try {
      // Load Propeller Ads
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://mulkfinopae.com/400/${zoneId}`;
      script.async = true;
      
      const container = document.getElementById(`propeller-${zoneId}`);
      if (container && !container.querySelector('script')) {
        container.appendChild(script);
      }
    } catch (error) {
      console.error('Propeller Ads error:', error);
    }
  }, [zoneId]);

  return (
    <div className={`ad-container ${className}`}>
      <div 
        id={`propeller-${zoneId}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          margin: '0 auto',
          display: 'block'
        }}
      />
    </div>
  );
};