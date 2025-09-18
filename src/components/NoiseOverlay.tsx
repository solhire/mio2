import React, { useEffect } from 'react';

const NoiseOverlay: React.FC = () => {
  // Add a log to verify the component is mounted
  useEffect(() => {
    console.log('NoiseOverlay mounted');
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-5 pointer-events-none opacity-[0.12]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px',
        mixBlendMode: 'screen',
        filter: 'hue-rotate(120deg) brightness(0.8)', // Adjust to green hue
      }}
      aria-hidden="true"
    />
  );
};

export default NoiseOverlay; 