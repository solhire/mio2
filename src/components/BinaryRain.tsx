import React, { useEffect, useRef } from 'react';

interface BinaryRainProps {
  density?: number; // Controls how many columns of binary (1-10)
  speed?: number; // Controls animation speed (1-10)
  fontSize?: number; // Font size in pixels
  respectReducedMotion?: boolean; // Whether to respect prefers-reduced-motion
}

const BinaryRain: React.FC<BinaryRainProps> = ({
  density = 5,
  speed = 5,
  fontSize = 14,
  respectReducedMotion = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mediaQuery.matches;
      
      const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
        prefersReducedMotion.current = e.matches;
      };
      
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
      return () => {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      };
    }
  }, [respectReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeColumns();
    };

    // Initialize columns
    let columns: number[] = [];
    const initializeColumns = () => {
      // Adjust column count based on screen width for better mobile performance
      const isMobile = window.innerWidth < 768;
      const densityFactor = isMobile ? Math.min(density, 3) / 10 : density / 10;
      const columnCount = Math.floor(canvas.width / fontSize) * densityFactor;
      
      columns = [];
      for (let i = 0; i < columnCount; i++) {
        columns[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
      }
    };

    // Set up canvas
    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation function
    const animate = () => {
      // If user prefers reduced motion, slow down or stop animation
      if (prefersReducedMotion.current) {
        // Just draw a static pattern with very low opacity
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw static binary characters with low opacity
        ctx.fillStyle = 'rgba(0, 255, 123, 0.15)';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < columns.length; i++) {
          const x = i * fontSize;
          for (let j = 0; j < canvas.height / fontSize; j += 3) {
            const y = j * fontSize;
            const text = Math.random() > 0.5 ? '1' : '0';
            ctx.fillText(text, x, y);
          }
        }
        
        // Request next frame at a much lower rate
        animationFrameRef.current = requestAnimationFrame(() => {
          setTimeout(animate, 2000); // Very slow refresh
        });
        return;
      }
      
      // Normal animation for users without reduced motion preference
      // Apply fading effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text style
      ctx.fillStyle = '#00ff7b';
      ctx.font = `${fontSize}px monospace`;

      // Draw each column
      for (let i = 0; i < columns.length; i++) {
        // Generate 0 or 1
        const text = Math.random() > 0.5 ? '1' : '0';
        
        // Calculate position
        const x = i * fontSize;
        const y = columns[i] * fontSize;
        
        // Draw the character
        ctx.fillText(text, x, y);
        
        // Some characters are brighter (leading characters)
        if (columns[i] > 0 && Math.random() > 0.975) {
          ctx.fillStyle = 'rgba(0, 255, 123, 0.9)'; // Brighter green
          ctx.fillText(text, x, y);
          ctx.fillStyle = '#00ff7b'; // Reset to normal green
        }
        
        // Move the column down
        columns[i]++;
        
        // Reset if off screen or randomly
        if (columns[i] * fontSize > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        }
      }
      
      // Adjust speed based on the speed prop (1-10)
      const frameDelay = Math.max(10, 110 - (speed * 10));
      
      // Request next frame with appropriate delay
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(animate, frameDelay);
      });
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [density, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-5]"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
};

export default BinaryRain;
