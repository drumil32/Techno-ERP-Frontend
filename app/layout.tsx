import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/sonner';
import Head from 'next/head';
import ProgressBar from '@/components/custom-ui/progress-bar/progress-bar';
import { NavigationEvents } from '@/components/custom-ui/router-events/router-event';
import useAuthRedirect from '@/lib/useAuthRedirect';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Techno ERP',
  description: 'Enterprise-Resource-Planning for Techno'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/techno-logo.png" />
      </head>
      <body
        className={`overflow-hidden ${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ProgressBar />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <NavigationEvents />
        <Toaster richColors theme="light" position="top-center" />
      </body>
    </html>
  );
}
