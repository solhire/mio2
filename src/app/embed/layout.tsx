"use client";

import type { ReactNode } from 'react';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-[320px] bg-gradient-to-b from-black via-black/90 to-zinc-900">
      <ParticlesBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="relative z-10 p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
}


