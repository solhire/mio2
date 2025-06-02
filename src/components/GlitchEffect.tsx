import React, { useEffect } from 'react';

interface GlitchEffectProps {
  className?: string;
}

const GlitchEffect: React.FC<GlitchEffectProps> = ({ className = '' }) => {
  // Add a log to verify the component is mounted
  useEffect(() => {
    console.log('GlitchEffect mounted');
  }, []);

  return (
    <>
      {/* Top-left corner glitch */}
      <div 
        className={`fixed top-0 left-0 w-64 h-64 pointer-events-none ${className}`}
        style={{
          animation: 'glitch-top-left 5s infinite',
          opacity: 0,
          backgroundImage: 'linear-gradient(135deg, rgba(247, 147, 26, 0.4), transparent 70%)',
        }}
      />
      
      {/* Bottom-right corner glitch */}
      <div 
        className={`fixed bottom-0 right-0 w-72 h-72 pointer-events-none ${className}`}
        style={{
          animation: 'glitch-bottom-right 7s infinite',
          opacity: 0,
          backgroundImage: 'linear-gradient(315deg, rgba(247, 147, 26, 0.4), transparent 70%)',
        }}
      />
      
      {/* Horizontal scanline */}
      <div 
        className={`fixed left-0 w-full h-[3px] pointer-events-none bg-[rgba(255,255,255,0.25)] ${className}`}
        style={{
          animation: 'scanline 5s infinite linear',
          top: '50%',
        }}
      />
      
      {/* Additional vertical scanline */}
      <div 
        className={`fixed top-0 h-full w-[2px] pointer-events-none bg-[rgba(247,147,26,0.2)] ${className}`}
        style={{
          animation: 'scanline-vertical 8s infinite linear',
          left: '30%',
        }}
      />
      
      {/* Full screen flash glitch */}
      <div 
        className={`fixed inset-0 pointer-events-none bg-[rgba(247,147,26,0.03)] ${className}`}
        style={{
          animation: 'full-screen-glitch 15s infinite',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* CSS Animations for the glitch effects */}
      <style jsx>{`
        @keyframes glitch-top-left {
          0%, 90%, 100% {
            opacity: 0;
            transform: scale(1);
            filter: blur(0);
          }
          90.5%, 92% {
            opacity: 0.9;
            transform: scale(1.05) skew(2deg, 1deg);
            filter: blur(1px);
          }
          94% {
            opacity: 0.7;
            transform: scale(0.98);
          }
          96% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }
        
        @keyframes glitch-bottom-right {
          0%, 80%, 100% {
            opacity: 0;
            transform: scale(1);
          }
          81%, 82% {
            opacity: 0.8;
            transform: scale(1.05) skew(-3deg, 1deg);
          }
          83%, 85% {
            opacity: 0.2;
          }
          86%, 88% {
            opacity: 0.7;
            transform: scale(0.95);
          }
          89% {
            opacity: 0.2;
          }
        }
        
        @keyframes scanline {
          0% {
            top: 0%;
            opacity: 0;
          }
          5% {
            opacity: 0.5;
          }
          10% {
            opacity: 0.2;
          }
          50% {
            top: 97%;
          }
          90% {
            opacity: 0.2;
          }
          95% {
            opacity: 0.5;
          }
          100% {
            top: 0%;
            opacity: 0;
          }
        }
        
        @keyframes scanline-vertical {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          20% {
            opacity: 0;
          }
          70% {
            left: 100%;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            left: 0%;
            opacity: 0;
          }
        }
        
        @keyframes full-screen-glitch {
          0%, 94%, 96%, 98%, 100% {
            opacity: 0;
          }
          94.5% {
            opacity: 0.2;
            transform: translateX(2px);
          }
          95.5% {
            opacity: 0;
          }
          96.5% {
            opacity: 0.15;
            transform: translateX(-2px);
          }
          97.5% {
            opacity: 0;
          }
          98.5% {
            opacity: 0.25;
          }
        }
      `}</style>
    </>
  );
};

export default GlitchEffect; 