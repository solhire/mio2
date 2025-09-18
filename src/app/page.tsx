'use client';

import { useEffect } from 'react';
import ASCIILogo from '../components/ASCIILogo';
import InputForm from '../components/InputForm';
import MessageFeed from '../components/MessageFeed';
import BinaryReveal from '../components/BinaryReveal';
import DynamicBackground from '../components/DynamicBackground';
import SubmissionCounter from '../components/SubmissionCounter';
import CursorTrail from '../components/CursorTrail';

export default function Home() {
  useEffect(() => {
    // Log to console for debugging
    console.log('Page component mounted');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic background with all effects */}
      <DynamicBackground enableGlitch={true} />
      
      {/* Binary reveal effect layer - reduced opacity for better background visibility */}
      <div className="opacity-75">
        <BinaryReveal />
      </div>
      
      {/* Cursor trail effect */}
      <CursorTrail />
      
      {/* Content layer with proper z-index */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <main className="max-w-4xl mx-auto flex flex-col items-center justify-start gap-12">
          <div className="mt-8">
            <ASCIILogo />
          </div>
          
          {/* Submission counter */}
          <SubmissionCounter />
          
          <div className="w-full terminal-container">
            <InputForm />
          </div>
          
          <div className="w-full terminal-container">
            <MessageFeed refreshInterval={5000} />
          </div>
        </main>
      </div>
    </div>
  );
}
