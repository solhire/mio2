import React, { useState, useEffect } from 'react';

interface InputFormProps {
  onSubmit?: (name: string, message: string) => void;
}

// Custom events for updates
export const MESSAGE_UPDATED_EVENT = 'message-updated';
export const SUBMISSION_COUNT_UPDATED_EVENT = 'submission-count-updated';

// Array of cryptic confirmation messages
const CRYPTIC_MESSAGES = [
  "Etched.",
  "We heard you.",
  "It stays.",
  "One more voice in the dark.",
  "Buried in the wall.",
  "Your signal broke through.",
  "Marked.",
  "It's written.",
  "Whispered to the void.",
  "Echoes remain.",
  "Imprinted.",
  "Received.",
  "Absorbed.",
  "Recorded in the shadows.",
  "Witnessed."
];

// Function to play a random glitch sound
const playRandomGlitchSound = () => {
  // Generate random number between 1 and 4
  const soundNumber = Math.floor(Math.random() * 4) + 1;
  const audio = new Audio(`/glitch/${soundNumber}.mp3`);
  audio.play().catch(err => console.error('Error playing glitch sound:', err));
};

// Function to play Mio sound after glitch sound
const playMioSound = () => {
  // Randomly choose between mio.wav and mio2.wav
  const mioSound = Math.random() < 0.5 ? 'mio.wav' : 'mio2.wav';
  const audio = new Audio(`/${mioSound}`);
  return { 
    sound: mioSound,
    play: () => audio.play().catch(err => console.error(`Error playing ${mioSound}:`, err))
  };
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [mioMessage, setMioMessage] = useState<string | null>(null);
  const [isMioMessageVisible, setIsMioMessageVisible] = useState(false);

  // Clear confirmation message after delay
  useEffect(() => {
    if (confirmationMessage) {
      // Show the message with fade-in effect
      setIsConfirmationVisible(true);
      
      // Set timeout to start fade-out
      const fadeOutTimer = setTimeout(() => {
        setIsConfirmationVisible(false);
      }, 4000);
      
      // Set timeout to clear the message after fade-out completes
      const clearTimer = setTimeout(() => {
        setConfirmationMessage(null);
      }, 5000);
      
      // Clean up timers
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [confirmationMessage]);

  // Handle Mio message visibility
  useEffect(() => {
    if (mioMessage) {
      // Show the message with fade-in effect
      setIsMioMessageVisible(true);
      
      // Set timeout to start fade-out
      const fadeOutTimer = setTimeout(() => {
        setIsMioMessageVisible(false);
      }, 6000);
      
      // Set timeout to clear the message after fade-out completes
      const clearTimer = setTimeout(() => {
        setMioMessage(null);
      }, 7000);
      
      // Clean up timers
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [mioMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // If onSubmit prop is provided, call it (for mock/test usage)
      if (onSubmit) {
        onSubmit(name, message);
      }
      
      // Send message to API
      const response = await fetch('/api/messages/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim() || null, 
          message: message.trim() 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit message');
      }
      
      // Play a random glitch sound
      playRandomGlitchSound();
      
      // Set timeout to play Mio sound after the glitch sound
      setTimeout(() => {
        const mio = playMioSound();
        mio.play();
        
        // Set different caption based on which sound played
        if (mio.sound === 'mio.wav') {
          setMioMessage("You have been marked. The wall accepts your entry.");
        } else {
          setMioMessage("Submission received. One more trying to make it out.");
        }
      }, 1500);
      
      // Clear form on success
      setName('');
      setMessage('');
      
      // Display a random cryptic confirmation message
      const randomIndex = Math.floor(Math.random() * CRYPTIC_MESSAGES.length);
      setConfirmationMessage(CRYPTIC_MESSAGES[randomIndex]);
      
      // Dispatch custom events to notify that a message was added
      window.dispatchEvent(new CustomEvent(MESSAGE_UPDATED_EVENT));
      window.dispatchEvent(new CustomEvent(SUBMISSION_COUNT_UPDATED_EVENT));
    } catch (err) {
      console.error('Error submitting message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl text-white text-center mb-4 font-mono">
        Why do you want to make it out?
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#333333] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:border-transparent font-mono"
            placeholder="Your name (optional)"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-[#1A1A1A] border border-[#333333] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:border-transparent font-mono resize-none"
            placeholder="Your message (required)"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-[#F7931A] hover:bg-[#F7931A]/80 text-black font-bold py-2 px-6 rounded-md transition-colors font-mono ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
        
        {/* Cryptic confirmation message */}
        {confirmationMessage && (
          <div 
            className={`mt-4 ml-4 font-mono text-gray-300 text-sm transition-opacity duration-1000 ${
              isConfirmationVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
              animation: isConfirmationVisible ? 'subtle-flicker 3s infinite' : 'none'
            }}
          >
            {confirmationMessage}
          </div>
        )}
        
        {/* Mio message */}
        {mioMessage && (
          <div 
            className={`mt-6 font-mono text-cyan-300 text-sm text-center transition-opacity duration-1500 ${
              isMioMessageVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
              animation: isMioMessageVisible ? 'subtle-pulse 4s infinite' : 'none'
            }}
          >
            {mioMessage}
          </div>
        )}
      </form>
      {error && (
        <p className="text-red-400 text-sm mt-2 font-mono">{error}</p>
      )}
    </div>
  );
};

export default InputForm; 