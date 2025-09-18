import React, { useEffect, useRef } from 'react';

interface CursorTrailProps {
  respectReducedMotion?: boolean;
}

const CursorTrail: React.FC<CursorTrailProps> = ({
  respectReducedMotion = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);
  const trailPointsRef = useRef<Array<{ x: number; y: number; age: number; char: string }>>([]);
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
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Track mouse position with throttling for performance
    let lastCaptureTime = 0;
    const throttleInterval = 30; // milliseconds between captures
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Throttle point creation for better performance
      if (now - lastCaptureTime > throttleInterval) {
        // Add a new point to the trail with a random binary digit
        const binary = Math.random() > 0.5 ? '1' : '0';
        trailPointsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          age: 0,
          char: binary
        });
        
        lastCaptureTime = now;
        
        // Adjust trail length based on device capability
        const isMobile = window.innerWidth < 768;
        const maxTrailLength = isMobile ? 5 : 15;
        
        // Limit trail length
        if (trailPointsRef.current.length > maxTrailLength) {
          trailPointsRef.current = trailPointsRef.current.slice(-maxTrailLength);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Skip animation if user prefers reduced motion
      if (prefersReducedMotion.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Update trail points
      trailPointsRef.current.forEach((point) => {
        point.age += 1;
        
        // Calculate opacity based on age
        const opacity = Math.max(0, 1 - point.age / 20);
        
        if (opacity > 0) {
          // Draw the binary digit
          ctx.font = '14px monospace';
          ctx.fillStyle = `rgba(0, 255, 123, ${opacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(point.char, point.x, point.y);
          
          // Add glow effect
          ctx.shadowColor = 'rgba(0, 255, 123, 0.5)';
          ctx.shadowBlur = 5;
        }
      });
      
      // Remove old points
      trailPointsRef.current = trailPointsRef.current.filter(point => point.age < 20);
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ opacity: 0.8 }}
      aria-hidden="true"
    />
  );
};

export default CursorTrail;
