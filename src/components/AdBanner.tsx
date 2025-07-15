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
      // Load MonetAG Ads
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.topcreativeformat.com/${zoneId}`;
      script.async = true;
      
      const container = document.getElementById(`monetag-${zoneId}`);
      if (container && !container.querySelector('script')) {
        container.appendChild(script);
      }
    } catch (error) {
      console.error('MonetAG Ads error:', error);
    }
  }, [zoneId]);

  return (
    <div className={`ad-container ${className}`}>
      <div 
        id={`monetag-${zoneId}`}
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