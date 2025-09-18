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
        {children}
      </body>
    </html>
  );
}
