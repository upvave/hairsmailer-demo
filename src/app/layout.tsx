import '@/styles/globals.css';

import { cn } from '@heroui/react';
import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { meta } from '@/constants/site-config.text';

import { Providers } from './providers';

export const generateMetadata = (): Metadata => ({
  title: {
    default: meta.title,
    template: meta.titleTemplate,
  },
  description: meta.description,
  keywords: meta.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      {
        url: '/favicon/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    siteName: meta.title,
    images: '/opengraph-image.png',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: '/opengraph-image.png',
  },
});

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ colorScheme: 'light' }}
      data-theme="light"
      className="light"
    >
      <body className={cn('min-h-screen')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
