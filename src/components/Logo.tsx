import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const Logo: React.FC = () => {
  const [heartbeat, setHeartbeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastBeatTimeRef = useRef<number>(0);

  useEffect(() => {
    let audioElement: HTMLAudioElement | null = null;
    
    const setupAudio = () => {
      try {
        // Create a new audio element and add it to the DOM
        audioElement = document.createElement('audio');
        audioElement.id = 'heartbeat-audio';
        audioElement.src = '/heart.mp3';
        audioElement.loop = true;
        audioElement.volume = 1.0;
        audioElement.style.display = 'none';
        
        document.body.appendChild(audioElement);
        audioRef.current = audioElement;

        // Try to play with precise timing
        const startAudio = () => {
          if (!audioElement) return;
          
          audioElement.play()
            .then(() => {
              // Record the exact start time for synchronization
              audioStartTimeRef.current = performance.now();
              lastBeatTimeRef.current = audioStartTimeRef.current;
              
              // Start the sync loop
              animationFrameRef.current = requestAnimationFrame(syncHeartbeatWithAudio);
            })
            .catch((err) => {
              console.error('Audio play failed:', err);
            });
        };
        
        // Try auto-play
        startAudio();
        
        // Fallback to user interaction if auto-play fails
        const playOnInteraction = () => {
          startAudio();
          document.removeEventListener('click', playOnInteraction);
        };
        
        document.addEventListener('click', playOnInteraction);
      } catch (err) {
        console.error('Audio setup error:', err);
      }
    };

    // Synchronize heartbeat animation with audio precisely
    const syncHeartbeatWithAudio = () => {
      const now = performance.now();
      
      // Heartbeat timing constants - adjusted to match the audio file
      // Adjust these values to fine-tune the synchronization
      const beatInterval = 930; // Time between heartbeats in ms (based on audio)
      const beatDuration = 150; // How long each pulse lasts
      
      // Check if it's time for a heartbeat
      if (now - lastBeatTimeRef.current >= beatInterval) {
        // Time for a new beat
        setHeartbeat(true);
        lastBeatTimeRef.current = now;
        
        // Schedule the end of the beat
        setTimeout(() => {
          setHeartbeat(false);
        }, beatDuration);
      }
      
      // Continue the animation loop
      animationFrameRef.current = requestAnimationFrame(syncHeartbeatWithAudio);
    };

    // Initialize
    setupAudio();
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioElement) {
        audioElement.pause();
        audioElement.remove();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <a 
        href="https://pump.fun/profile/mio000?include-nsfw=true"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer transition-opacity hover:opacity-80"
      >
        <div className="relative w-full max-w-[250px]">
          <Image 
            src="/mio2.png" 
            alt="$MIO2 Logo" 
            width={250} 
            height={100} 
            priority
            className={`drop-shadow-[0_0_10px_rgba(247,147,26,0.5)] transition-all duration-75 ${
              heartbeat ? 'scale-110 brightness-125' : 'scale-100 brightness-100'
            }`}
          />
        </div>
        <p className="text-sm text-white mt-2 font-mono tracking-wide text-center">MAKE IT OUT</p>
      </a>
      
      {/* X (Twitter) Links */}
      <div className="flex gap-4 mt-4">
        <a 
          href="https://x.com/MakeItOutMIO"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 bg-black/50 hover:bg-black/70 rounded-md border border-gray-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white" className="mr-2">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-white text-sm font-mono">Follow $MIO</span>
        </a>
        
        <a 
          href="https://x.com/i/communities/1929640634526454141"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 bg-black/50 hover:bg-black/70 rounded-md border border-gray-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white" className="mr-2">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-white text-sm font-mono">Join Community</span>
        </a>
      </div>
    </div>
  );
};

export default Logo; 