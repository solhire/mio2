"use client";

import type { ReactNode } from 'react';
import MatrixBackground from '@/components/MatrixBackground';

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-[320px] bg-transparent">
      <MatrixBackground transparent={true} />
      <div className="relative z-10 p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
}


