import './globals.css';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { Suspense } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/sonner';
import ProgressBar from '@/components/custom-ui/progress-bar/progress-bar';
import { NavigationEvents } from '@/components/custom-ui/router-events/router-event';
import { DevBadge } from '@/components/ui/dev-badge';
import { HomeProvider } from './c/HomeRouteContext';

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



export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Enterprise-Resource-Planning for Techno" />

        <meta property="og:title" content="Techno ERP" />
        <meta property="og:description" content="A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges." />
        <meta property="og:image" content="https://techno.sprintup.in/images/techno-logo.webp" />
        <meta property="og:url" content="https://techno.sprintup.in" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Techno ERP" />
        <meta name="twitter:description" content="A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges." />
        <meta name="twitter:image" content="https://techno.sprintup.in/images/techno-logo.webp" />
      </head>

      <body
        className={`overflow-hidden ${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <DevBadge />
        <Suspense>
          <ProgressBar />
          <HomeProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
            <NavigationEvents />
          </HomeProvider>
          <Toaster richColors theme="light" position="top-center" />
        </Suspense>
      </body>
    </html>
  );
}
