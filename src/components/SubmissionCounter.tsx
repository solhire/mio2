import React, { useState, useEffect } from 'react';
import { SUBMISSION_COUNT_UPDATED_EVENT } from './InputForm';

const SubmissionCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the submission count
  const fetchCount = async () => {
    try {
      const response = await fetch('/api/submission-count');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submission count');
      }
      
      const data = await response.json();
      setCount(data.count);
    } catch (err) {
      console.error('Error fetching submission count:', err);
      setError('Failed to load count');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCount();
    
    // Set up polling every 15 seconds
    const intervalId = setInterval(() => {
      fetchCount();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Listen for submission count updates
  useEffect(() => {
    const handleSubmissionCountUpdated = () => {
      fetchCount();
    };
    
    window.addEventListener(SUBMISSION_COUNT_UPDATED_EVENT, handleSubmissionCountUpdated);
    
    return () => {
      window.removeEventListener(SUBMISSION_COUNT_UPDATED_EVENT, handleSubmissionCountUpdated);
    };
  }, []);

  // Animate count from 0 to actual value
  useEffect(() => {
    if (count > 0 && displayCount < count) {
      // Calculate animation duration based on count
      const duration = 1500; // 1.5 seconds total
      const steps = 30; // Number of steps in the animation
      const increment = Math.ceil(count / steps);
      const stepDuration = duration / steps;
      
      const timer = setTimeout(() => {
        setDisplayCount(prev => {
          const next = prev + increment;
          return next >= count ? count : next;
        });
      }, stepDuration);
      
      return () => clearTimeout(timer);
    }
  }, [count, displayCount]);

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className="text-center mb-8 mt-4">
      <div className="inline-block py-2 px-6 bg-black/40 backdrop-blur-sm rounded-full">
        <p className="font-mono text-lg">
          <span className="text-gray-300">💬</span>
          {' '}
          <span className="font-bold text-orange-400 glow-text">
            {loading ? '...' : displayCount.toLocaleString()}
          </span>
          {' '}
          <span className="text-gray-300">people want to make it out</span>
        </p>
      </div>
    </div>
  );
};

export default SubmissionCounter; 