import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Playfair Display = Davinci substitute (display serif)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-davinci',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Inter = Helvetica Now substitute (utility grotesk)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-helvetica-now',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WordForge - Infinite Word Puzzle Platform',
  description: 'A modern, infinite word puzzle platform with unlimited gameplay',
  keywords: ['word game', 'puzzle', 'wordle', 'word puzzle', 'brain game'],
  authors: [{ name: 'WordForge Team' }],
  creator: 'WordForge',
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'WordForge - Infinite Word Puzzle Platform',
    description: 'A modern, infinite word puzzle platform with unlimited gameplay',
    siteName: 'WordForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordForge - Infinite Word Puzzle Platform',
    description: 'A modern, infinite word puzzle platform with unlimited gameplay',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
        <head>
          {/* Little Phantom Text animated cursor */}
          <link rel="stylesheet" href="https://cdn.cursors-4u.net/cursors/animated/little-phantom-set-text-d1af529f-48.css" />
        </head>
        <body className="min-h-screen bg-gray-900 font-sans antialiased text-gray-100">
          <Providers>
            {children}
            <Toaster />
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
