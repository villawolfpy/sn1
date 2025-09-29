import React from 'react';

export const metadata = {
  title: 'SN Reader - Farcaster Mini App',
  description: 'Read Stacker News posts and territories directly in Farcaster',
  openGraph: {
    title: 'SN Reader',
    description: 'Read Stacker News posts and territories directly in Farcaster',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'SN Reader',
    description: 'Read Stacker News posts and territories directly in Farcaster',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}