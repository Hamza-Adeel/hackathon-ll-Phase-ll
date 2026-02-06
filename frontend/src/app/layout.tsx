import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow AI",
  description: "A secure, intelligent task management experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-[rgb(var(--color-bg-primary))]
          text-[rgb(var(--color-text-primary))]
          transition-colors duration-300
        `}
      >
        <Providers>
          <div className="relative min-h-screen overflow-hidden">
            
            {/* Subtle ambient background glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-3xl rounded-full"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full"></div>
            </div>

            {children}

          </div>
        </Providers>
      </body>
    </html>
  );
}
