import React, { useEffect, useRef } from 'react';

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  characters: string[];
  headPos: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  useEffect(() => {
    console.log('MatrixBackground mounted');
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize arrays
    const raindrops: Raindrop[] = [];
    const particles: Particle[] = [];
    
    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reset raindrops when resizing
      raindrops.length = 0;
      createRaindrops();
    };
    
    // Create raindrops
    const createRaindrops = () => {
      const isMobile = window.innerWidth < 768;
      const dropCount = isMobile ? 30 : 80;
      
      for (let i = 0; i < dropCount; i++) {
        const x = Math.random() * canvas.width;
        const speed = 1 + Math.random() * 3;
        const length = 10 + Math.floor(Math.random() * 30);
        
        // Create random characters for this raindrop
        const characters: string[] = [];
        for (let j = 0; j < length; j++) {
          // 50% chance for 0 or 1, 50% chance for random character
          if (Math.random() > 0.5) {
            characters.push(Math.random() > 0.5 ? '0' : '1');
          } else {
            const charCode = 33 + Math.floor(Math.random() * 94); // ASCII printable characters
            characters.push(String.fromCharCode(charCode));
          }
        }
        
        raindrops.push({
          x,
          y: Math.random() * canvas.height * -1, // Start above the canvas
          speed,
          length,
          characters,
          headPos: 0
        });
      }
    };
    
    // Create particles
    const createParticles = () => {
      const particleCount = 40;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    };
    
    // Animation function
    const animate = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw scanlines
      ctx.fillStyle = 'rgba(0, 255, 123, 0.03)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }
      
      // Draw and update particles
      particles.forEach(particle => {
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 123, ${particle.opacity})`;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw and update raindrops
      const fontSize = 14;
      
      raindrops.forEach(drop => {
        // Update raindrop
        drop.y += drop.speed;
        drop.headPos = (drop.headPos + 1) % drop.length;
        
        // Draw characters
        for (let i = 0; i < drop.length; i++) {
          const charIndex = (drop.headPos + i) % drop.length;
          const y = drop.y - i * fontSize;
          
          // Skip if outside canvas
          if (y < 0 || y > canvas.height) continue;
          
          // Calculate opacity based on position (head is brightest)
          let opacity = 1 - (i / drop.length);
          
          // First character (head) is brighter
          if (i === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          } else {
            ctx.fillStyle = `rgba(0, 255, 123, ${opacity})`;
          }
          
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(drop.characters[charIndex], drop.x, y);
        }
        
        // Reset if completely off screen
        if (drop.y - drop.length * fontSize > canvas.height) {
          drop.y = -drop.length * fontSize;
          drop.x = Math.random() * canvas.width;
        }
      });
      
      // Draw vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize everything
    handleResize();
    createParticles();
    
    // Start animation
    animate();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
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
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ backgroundColor: 'black' }}
      aria-hidden="true"
    />
  );
};

export default MatrixBackground;