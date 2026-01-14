import { StrictMode } from 'react';
import type { Metadata } from 'next';
import { DM_Sans, Newsreader } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from './theme'
import Footer from './components/footer'
import Navbar from './components/navbar'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Hassan Shahzad',
  description: 'Personal site for Hassan Shahzad, a software engineer and full-stack developer from Broomfield, Colorado. B.S. in Computer Science and minor degree in Creative Technology & Design at the University of Colorado Boulder (CU Boulder). Passionate about powerlifting, innovation, and building impactful software solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${newsreader.variable} antialiased`}>
        <StrictMode>
          <ThemeProvider>
            {/* Skip to main content link for keyboard users */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100
                         focus:px-4 focus:py-2 focus:rounded-md focus:font-medium
                         focus:dark:bg-neutral-800 focus:dark:text-neutral-100
                         focus:light:bg-white focus:light:text-neutral-900
                         focus:ring-2 focus:ring-offset-2 focus:dark:ring-neutral-400 focus:light:ring-neutral-600"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex flex-col items-center w-full xl:w-[80%] mx-auto" role="main">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </StrictMode>
      </body>
    </html>
  );
}
