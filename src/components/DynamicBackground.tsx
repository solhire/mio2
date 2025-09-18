import React, { useEffect } from 'react';
import MatrixBackground from './MatrixBackground';
import NoiseOverlay from './NoiseOverlay';
import GlitchEffect from './GlitchEffect';

interface DynamicBackgroundProps {
  enableGlitch?: boolean;
  className?: string;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  enableGlitch = true,
  className = '' 
}) => {
  // Add a log to verify the component is mounted
  useEffect(() => {
    console.log('DynamicBackground mounted');
  }, []);

  return (
    <div className={`fixed inset-0 -z-20 ${className}`}>
      {/* All-in-one Matrix background with binary rain, particles, vignette and scanlines */}
      <MatrixBackground />
      
      {/* Noise texture overlay */}
      <NoiseOverlay />
      
      {/* Optional glitch effects */}
      {enableGlitch && <GlitchEffect />}
    </div>
  );
};

export default DynamicBackground; 