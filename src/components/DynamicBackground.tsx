import React, { useEffect } from 'react';
import ParticlesBackground from './ParticlesBackground';
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
      {/* Base gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#1A1A1A]" 
        aria-hidden="true"
      />
      
      {/* Additional radial gradient overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(247, 147, 26, 0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0" 
        style={{
          boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.8)',
        }}
        aria-hidden="true"
      />
      
      {/* Particles effect */}
      <ParticlesBackground />
      
      {/* Noise texture overlay */}
      <NoiseOverlay />
      
      {/* Optional glitch effects */}
      {enableGlitch && <GlitchEffect />}
    </div>
  );
};

export default DynamicBackground; 