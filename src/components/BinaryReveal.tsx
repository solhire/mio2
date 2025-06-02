import React, { useEffect, useRef } from 'react';

const BinaryReveal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const binaryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<Array<{x: number, y: number, age: number}>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // Create the binary texture canvas only once
  useEffect(() => {
    // Create a simple binary texture once at startup
    const createBinaryTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024; // Larger texture to fit all messages
      canvas.height = 1024;
      
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return null;
      
      // Fill background
      ctx.fillStyle = '#0F0F0F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Collection of messages to insert
      const messages = [
        "codeyourlife",
        "MAKE IT OUT",
        "free your family",
        "survive",
        "break free",
        "keep going",
        "$MIO",
        "find freedom",
        "escape",
        "new future",
        "still breathing",
        "one chance"
      ];
      
      // Draw binary pattern with messages inserted
      ctx.font = '9px monospace';
      
      // Distribute text and binary digits
      for (let y = 0; y < canvas.height; y += 11) {
        for (let x = 0; x < canvas.width; x += 9) {
          // Randomly decide whether to place a message or binary
          if (Math.random() < 0.04 && x + 120 < canvas.width) {
            // Randomly select a message
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            // Add message text in orange
            ctx.fillStyle = '#F7931A'; // Bitcoin orange
            ctx.fillText(message, x, y);
            
            // Skip ahead to avoid overwriting
            x += message.length * 9;
          } else {
            // Add binary digit
            ctx.fillStyle = '#DD8800'; // Orange-gold for binary
            const binary = Math.random() > 0.5 ? '1' : '0';
            ctx.fillText(binary, x, y);
          }
        }
      }
      
      // Add additional emphasized "MAKE IT OUT" messages
      ctx.font = '14px monospace'; // Larger for emphasis
      for (let j = 0; j < 15; j++) {
        const x = Math.random() * (canvas.width - 150);
        const y = Math.random() * canvas.height;
        
        ctx.fillStyle = '#FF7700'; // Bright orange for "MAKE IT OUT"
        ctx.globalAlpha = 0.9;
        ctx.fillText("MAKE IT OUT", x, y);
      }
      
      // Add some medium-sized "codeyourlife" messages
      ctx.font = '11px monospace';
      for (let _ = 0; _ < 20; _++) {
        const x = Math.random() * (canvas.width - 120);
        const y = Math.random() * canvas.height;
        
        ctx.fillStyle = '#F7931A'; // Bitcoin orange
        ctx.globalAlpha = 0.8 + Math.random() * 0.2;
        ctx.fillText("codeyourlife", x, y);
      }
      
      // Add random individual messages in various positions
      ctx.font = '10px monospace';
      for (let _ = 0; _ < 50; _++) {
        const message = messages[Math.floor(Math.random() * messages.length)];
        const x = Math.random() * (canvas.width - message.length * 10);
        const y = Math.random() * canvas.height;
        
        // Vary the orange tone slightly
        const red = 200 + Math.floor(Math.random() * 55);
        const green = 80 + Math.floor(Math.random() * 70);
        ctx.fillStyle = `rgba(${red}, ${green}, ${Math.floor(Math.random() * 40)}, 0.85)`;
        ctx.fillText(message, x, y);
      }
      
      // Add some binary code flow around the text
      ctx.font = '8px monospace';
      ctx.globalAlpha = 0.7;
      for (let _ = 0; _ < 2000; _++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        ctx.fillStyle = '#CC7700'; // Darker orange for background binary
        const binary = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(binary, x, y);
      }
      
      return canvas;
    };
    
    binaryCanvasRef.current = createBinaryTexture();
    isInitializedRef.current = true;
  }, []);
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Add point to trail
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0
      });
      
      // Limit trail length
      if (trailRef.current.length > 5) {
        trailRef.current = trailRef.current.slice(-5);
      }
    };
    
    // Use passive event listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup canvas once
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Very simple render loop
    const render = () => {
      if (!isInitializedRef.current || !binaryCanvasRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update trail ages
      trailRef.current.forEach((point) => {
        point.age += 1;
      });
      
      // Remove old points
      trailRef.current = trailRef.current.filter(point => point.age < 20);
      
      // Create a pattern from the binary texture
      const pattern = ctx.createPattern(binaryCanvasRef.current, 'repeat');
      if (!pattern) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }
      
      // Draw each trail point
      trailRef.current.forEach((point) => {
        // Make older points smaller
        const size = Math.max(15, 40 - point.age);
        const alpha = 1 - (point.age / 20);
        
        ctx.save();
        
        // Draw small dot at each trail point
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        
        // Simple glow effect in orange
        ctx.shadowColor = 'rgba(247, 147, 26, 0.3)'; // Bitcoin orange glow
        ctx.shadowBlur = 5;
        
        // Fill with the binary pattern
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pattern;
        ctx.fill();
        
        ctx.restore();
      });
      
      // Continue the animation loop
      animationFrameRef.current = requestAnimationFrame(render);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(render);
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'lighten' }}
    />
  );
};

export default BinaryReveal; 