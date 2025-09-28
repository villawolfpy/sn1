import React from 'react';

export const metadata = {
  title: 'SN ↔ Farcaster Frame (MVP)',
  description: 'Frame that reads Stacker News via RSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>{children}</body>
    </html>
  );
}