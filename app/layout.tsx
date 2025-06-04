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
import Head from 'next/head';

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
  description: 'Enterprise-Resource-Planning for Techno',
  openGraph: {
    title: 'Techno ERP',
    description: 'Enterprise-Resource-Planning for Techno',
    url: 'https://techno.sprintup.in',
    siteName: 'Techno ERP',
    images: [
      {
        url: 'https://nextjs.org/og.png',
        width: 800,
        height: 600
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="description"
          content="A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges. We empower institutions to streamline admissions, enhance academic quality, optimize faculty workload, and maintain data seamlessly — all in one integrated platform."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techno.sprintup.in" />
        <meta property="og:title" content="Techno ERP" />
        <meta
          property="og:description"
          content="A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges."
        />
        <meta property="og:site_name" content="Techno ERP" />
        <meta property="og:image" content="https://techno.sprintup.in/favicon.ico" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Techno ERP Preview" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Techno ERP" />
        <meta
          name="twitter:description"
          content="A powerful all-in-one Lead Tracking and ERP solution built for ambitious colleges."
        />
        <meta name="twitter:image" content="https://techno.sprintup.in/favicon.ico" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`overflow-hidden ${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <DevBadge />
        <Suspense>
          <ProgressBar />
          <h2 className=""></h2>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          <NavigationEvents />
          <Toaster richColors theme="light" position="top-center" />
        </Suspense>
      </body>
    </html>
  );
}
