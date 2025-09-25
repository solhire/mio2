import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$MIT - Make It Through",
  description: "Survival, struggle, and breaking through. Join the $MIT community.",
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/favicon.png' }
    ],
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black hw-accelerated`}
      >
        <a
          href="https://pump.fun/profile/m%CE%B9%CF%84"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-3 right-3 z-50 text-[var(--matrix-text)]/80 hover:text-[var(--matrix-text)] font-mono text-xs border border-[var(--matrix-text-muted)]/40 px-2 py-1 rounded-sm bg-black/40 backdrop-blur-sm"
        >
          pump.fun
        </a>
        {children}
      </body>
    </html>
  );
}
