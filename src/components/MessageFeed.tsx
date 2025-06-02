import React, { useState, useEffect, useRef } from 'react';
import { MESSAGE_UPDATED_EVENT, SUBMISSION_COUNT_UPDATED_EVENT } from './InputForm';
import TypingText from './TypingText';

interface Submission {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
  timestamp: number;
  isNew?: boolean; // Flag to track new submissions
}

interface MessageFeedProps {
  refreshInterval?: number; // milliseconds
}

// Key for localStorage
const ANIMATED_MESSAGES_KEY = 'mio-animated-messages';
// Key to track if the current user just submitted a message
const USER_SUBMITTED_KEY = 'mio-user-submitted';

const MessageFeed: React.FC<MessageFeedProps> = ({ 
  refreshInterval = 5000 // default to 5 seconds
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevSubmissionsRef = useRef<Submission[]>([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [isUserSubmission, setIsUserSubmission] = useState(false);
  const scrollPositionRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize animatedMessages from localStorage
  const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(ANIMATED_MESSAGES_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (err) {
      console.error('Error loading animated messages from localStorage:', err);
      return new Set<string>();
    }
  });

  // Persist animatedMessages to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ANIMATED_MESSAGES_KEY, JSON.stringify([...animatedMessages]));
    } catch (err) {
      console.error('Error saving animated messages to localStorage:', err);
    }
  }, [animatedMessages]);

  // Save scroll position before fetching new messages
  const saveScrollPosition = () => {
    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollTop;
    }
  };

  // Restore scroll position after rendering new messages
  const restoreScrollPosition = () => {
    if (containerRef.current && scrollPositionRef.current !== null) {
      containerRef.current.scrollTop = scrollPositionRef.current;
      scrollPositionRef.current = null;
    }
  };

  // Function to fetch submissions
  const fetchSubmissions = async (isUserAction = false) => {
    try {
      // Save scroll position if this is a user action
      if (isUserAction) {
        saveScrollPosition();
      }
      
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/messages');
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      // Store previous submissions for comparison
      const prevSubmissions = [...submissions];
      prevSubmissionsRef.current = prevSubmissions;
      
      // Track if we have any new messages
      let foundNewMessages = false;
      
      // Convert API format to component format
      const formattedSubmissions: Submission[] = data.map((item: any) => {
        const existingSubmission = prevSubmissions.find(s => s.id === item.id);
        
        // If this submission doesn't exist in our current state, mark it as new
        const isNew = !existingSubmission && !animatedMessages.has(item.id);
        
        // Set flag if we found a new message
        if (isNew) {
          foundNewMessages = true;
        }
        
        return {
          id: item.id,
          name: item.name,
          message: item.message,
          created_at: item.created_at,
          timestamp: new Date(item.created_at).getTime(),
          isNew
        };
      });
      
      // Check if this is a user submission
      const userJustSubmitted = sessionStorage.getItem(USER_SUBMITTED_KEY) === 'true';
      
      // Only set hasNewMessages if we actually found new messages and it's not from the current user
      setHasNewMessages(foundNewMessages && !userJustSubmitted && !isUserAction);
      setIsUserSubmission(userJustSubmitted);
      
      // Clear the user submission flag
      if (userJustSubmitted) {
        sessionStorage.removeItem(USER_SUBMITTED_KEY);
      }
      
      setSubmissions(formattedSubmissions);
      
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
      
      // Restore scroll position if this was a user action
      // Move this outside the try block and after setLoading(false) to ensure DOM has updated
      if (isUserAction) {
        // Use a longer timeout to ensure the DOM has fully updated
        setTimeout(restoreScrollPosition, 100);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    // Treat initial fetch as a user action to maintain scroll position
    fetchSubmissions(true);
  }, []);

  // Set up periodic refresh
  useEffect(() => {
    // Skip if refresh interval is 0 or negative
    if (refreshInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      // Always treat periodic refreshes as user actions to maintain scroll position
      fetchSubmissions(true);
    }, refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Listen for message update events
  useEffect(() => {
    const handleMessageUpdated = () => {
      // Save the current scroll position before doing anything
      saveScrollPosition();
      
      // Set a flag in sessionStorage to indicate this is a user submission
      sessionStorage.setItem(USER_SUBMITTED_KEY, 'true');
      
      // Fetch submissions with isUserAction=true to maintain scroll position
      fetchSubmissions(true);
    };
    
    const handleCountUpdated = () => {
      // This is just for the counter, no need to fetch messages
    };
    
    window.addEventListener(MESSAGE_UPDATED_EVENT, handleMessageUpdated);
    window.addEventListener(SUBMISSION_COUNT_UPDATED_EVENT, handleCountUpdated);
    
    return () => {
      window.removeEventListener(MESSAGE_UPDATED_EVENT, handleMessageUpdated);
      window.removeEventListener(SUBMISSION_COUNT_UPDATED_EVENT, handleCountUpdated);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive (but not for user submissions)
  useEffect(() => {
    // Completely disable auto-scrolling as it's causing issues
    // Only manually restore scroll position when the user submits a message
    if (hasNewMessages) {
      // Just reset the flag without scrolling
      setHasNewMessages(false);
    }
  }, [submissions, hasNewMessages]);

  // Handle animation completion for a message
  const handleAnimationComplete = (id: string) => {
    setAnimatedMessages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Also remove the isNew flag
    setSubmissions(prevState => 
      prevState.map(s => s.id === id ? { ...s, isNew: false } : s)
    );
  };

  // Calculate if message should use typing effect (only for new messages that aren't too long)
  const shouldUseTypingEffect = (submission: Submission) => {
    return submission.isNew && submission.message.length <= 100 && !animatedMessages.has(submission.id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-[#121212] border border-[#333333] rounded-md overflow-hidden">
        <div 
          ref={containerRef}
          className="max-h-[400px] overflow-y-auto p-4"
        >
          {loading && submissions.length === 0 ? (
            <p className="text-gray-500 text-center font-mono">Loading messages...</p>
          ) : error ? (
            <p className="text-red-400 text-center font-mono">{error}</p>
          ) : submissions.length === 0 ? (
            <p className="text-gray-500 text-center font-mono">No messages yet. Be the first to share.</p>
          ) : (
            <ul className="space-y-4">
              {submissions.map((submission) => {
                const hasBeenAnimated = animatedMessages.has(submission.id);
                return (
                  <li 
                    key={submission.id} 
                    className={`p-3 bg-[#1A1A1A] rounded-md border-l-4 border-[#F7931A] font-mono text-white
                      ${submission.isNew && !isUserSubmission ? 'animate-new-entry' : ''}
                    `}
                  >
                    <div className="font-bold text-[#F7931A]">
                      {submission.isNew && !hasBeenAnimated && !isUserSubmission ? (
                        <TypingText 
                          text={`${submission.name || "Anonymous"} →`} 
                          typingSpeed={20}
                          onComplete={() => handleAnimationComplete(submission.id)}
                          messageId={`name-${submission.id}`}
                        />
                      ) : (
                        `${submission.name || "Anonymous"} →`
                      )}
                    </div>
                    <div className="mt-1">
                      {shouldUseTypingEffect(submission) && !isUserSubmission ? (
                        <TypingText 
                          text={submission.message} 
                          typingSpeed={25}
                          startDelay={300}
                          onComplete={() => handleAnimationComplete(submission.id)}
                          messageId={`message-${submission.id}`}
                        />
                      ) : (
                        submission.message
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(submission.timestamp).toLocaleString()}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageFeed; 