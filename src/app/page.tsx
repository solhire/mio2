'use client';

import { useEffect } from 'react';
import Logo from '../components/Logo';
import InputForm from '../components/InputForm';
import MessageFeed from '../components/MessageFeed';
import BinaryReveal from '../components/BinaryReveal';
import DynamicBackground from '../components/DynamicBackground';
import SubmissionCounter from '../components/SubmissionCounter';

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
      
      {/* Content layer with proper z-index */}
      <div className="relative z-10 min-h-screen py-12 px-4">
        <main className="max-w-4xl mx-auto flex flex-col items-center justify-start gap-12">
          <div className="mt-8">
            <Logo />
          </div>
          
          {/* Submission counter */}
          <SubmissionCounter />
          
          <div className="w-full backdrop-blur-sm bg-black/30 p-6 rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <InputForm />
          </div>
          
          <div className="w-full backdrop-blur-sm bg-black/30 p-4 rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <MessageFeed refreshInterval={5000} />
          </div>
        </main>
      </div>
    </div>
  );
}
