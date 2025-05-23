import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected font import
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster
import { cn } from '@/lib/utils';

const geistSans = Geist({ // Corrected variable name
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected variable name
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Daily Dynamo',
  description: 'Track your daily goals and stay motivated.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          geistSans.variable, 
          geistMono.variable, 
          "antialiased font-sans" // Use sans-serif from Geist
        )}
      >
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
