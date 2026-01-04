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
    <StrictMode>
      <ThemeProvider>
      <html lang='en' className='dark'>
        <body className={`${dmSans.variable} ${newsreader.variable} antialiased`}>
          <main className='flex flex-col items-center w-full xl:w-[80%] mx-auto'>
            <Navbar />
            {children}
            <Footer />
          </main>
        </body>
      </html>
      </ThemeProvider>
    </StrictMode>
  );
}
