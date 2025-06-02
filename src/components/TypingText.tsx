import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  text: string;
  typingSpeed?: number; // milliseconds per character
  className?: string;
  startDelay?: number; // delay before typing starts
  showCursor?: boolean;
  onComplete?: () => void; // callback when typing is complete
  messageId?: string; // unique identifier for the message
}

// Key prefix for localStorage
const TYPING_ANIMATION_KEY_PREFIX = 'mio-typing-animation-';

const TypingText: React.FC<TypingTextProps> = ({
  text,
  typingSpeed = 30,
  className = '',
  startDelay = 0,
  showCursor = true,
  onComplete,
  messageId
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasCompletedRef = useRef(false);
  
  // Check if this animation has already played
  const getAnimationStatus = () => {
    if (!messageId) return false;
    try {
      return localStorage.getItem(`${TYPING_ANIMATION_KEY_PREFIX}${messageId}`) === 'true';
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return false;
    }
  };

  // Save animation status to localStorage
  const saveAnimationStatus = () => {
    if (!messageId) return;
    try {
      localStorage.setItem(`${TYPING_ANIMATION_KEY_PREFIX}${messageId}`, 'true');
    } catch (err) {
      console.error('Error writing to localStorage:', err);
    }
  };

  // Check if animation has already been played
  const hasPlayed = messageId ? getAnimationStatus() : hasCompletedRef.current;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Only start the animation if it hasn't been played yet
    if (!hasPlayed) {
      // Reset if text changes and hasn't been played
      setDisplayedText('');
      setIsComplete(false);
      
      // Delay before starting to type
      timeout = setTimeout(() => {
        setIsTyping(true);
        
        let currentIndex = 0;
        const textLength = text.length;
        
        // Function to add one character at a time
        const typeNextChar = () => {
          if (currentIndex < textLength) {
            setDisplayedText(text.substring(0, currentIndex + 1));
            currentIndex++;
            
            // Schedule next character with variable timing
            // Shorter delay for spaces and punctuation for more natural rhythm
            const nextChar = text[currentIndex] || '';
            const charDelay = /[\s.,!?;:]/.test(nextChar) ? typingSpeed * 0.5 : typingSpeed;
            
            timeout = setTimeout(typeNextChar, charDelay);
          } else {
            setIsTyping(false);
            setIsComplete(true);
            hasCompletedRef.current = true;
            
            // Save to localStorage if we have a messageId
            if (messageId) {
              saveAnimationStatus();
            }
            
            if (onComplete) {
              onComplete();
            }
          }
        };
        
        // Start typing
        typeNextChar();
      }, startDelay);
    } else {
      // If already played, just show the full text immediately
      setDisplayedText(text);
      setIsComplete(true);
      setIsTyping(false);
    }
    
    // Clean up timeouts
    return () => clearTimeout(timeout);
  }, [text, typingSpeed, startDelay, hasPlayed, onComplete, messageId]);

  return (
    <span className={`inline-block ${className}`}>
      {hasPlayed ? text : displayedText}
      {(isTyping || (showCursor && isComplete && !hasPlayed)) && (
        <span className="typing-cursor">▌</span>
      )}
    </span>
  );
};

export default TypingText; 