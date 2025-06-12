import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/sonner';
import ProgressBar from '@/components/custom-ui/progress-bar/progress-bar';
import { NavigationEvents } from '@/components/custom-ui/router-events/router-event';
import { Suspense } from 'react';
import { DevBadge } from '@/components/ui/dev-badge';

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

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://www.develop.techno.sprintup.in'
    : 'https://techno.sprintup.in';

const imageUrl = `${baseUrl}/images/logo.jpg`;

export const metadata: Metadata = {
  title: 'Techno ERP',
  description: 'Enterprise-Resource-Planning for Techno',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'Techno ERP',
    description:
      'A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges.',
    url: baseUrl,
    images: [imageUrl],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Techno ERP',
    description: 'A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges.',
    images: [imageUrl]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`overflow-hidden ${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <DevBadge />
        <Suspense>
          <ProgressBar />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <NavigationEvents />
          <Toaster richColors theme="light" position="top-center" />
        </Suspense>
      </body>
    </html>
  );
}
