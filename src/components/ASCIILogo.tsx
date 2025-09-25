import React, { useEffect, useState } from 'react';

interface ASCIILogoProps {
  className?: string;
}

const ASCIILogo: React.FC<ASCIILogoProps> = ({ className = '' }) => {
  const [glitching, setGlitching] = useState(false);
  
  // Occasionally trigger glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
        <a 
          href="https://pump.fun/profile/m%CE%B9%CF%84"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer transition-opacity hover:opacity-80"
      >
        <pre 
          className={`text-[var(--matrix-text)] font-bold whitespace-pre text-center select-none ${
            glitching ? 'animate-[flicker_0.2s_infinite]' : ''
          }`}
          style={{ 
            textShadow: 'var(--matrix-glow)',
            letterSpacing: '0.1em',
            lineHeight: '1.2em'
          }}
        >
{`
 ███╗   ███╗ ██╗████████╗
 ████╗ ████║ ██║╚══██╔══╝
 ██╔████╔██║ ██║   ██║   
 ██║╚██╔╝██║ ██║   ██║   
 ██║ ╚═╝ ██║ ██║   ██║   
 ╚═╝     ╚═╝ ╚═╝   ╚═╝   
`}
        </pre>
        <div className="text-center mt-2">
          <p className="text-sm font-mono tracking-widest text-[var(--matrix-text)] uppercase">
            MAKE IT THROUGH
          </p>
        </div>
      </a>
      
      {/* X (Twitter) Links */}
      <div className="flex gap-4 mt-4">
        <a 
          href="https://x.com/transmit_mit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 bg-black/50 hover:bg-black/70 rounded-md border border-[var(--matrix-text)] transition-colors terminal-button"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--matrix-text)" className="mr-2">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-[var(--matrix-text)] text-sm font-mono">Follow @transmit_mit</span>
        </a>
      </div>
    </div>
  );
};

export default ASCIILogo;
