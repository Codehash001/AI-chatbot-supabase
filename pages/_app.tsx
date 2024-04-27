import '@/styles/base.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes'
import { NextUIProvider } from '@nextui-org/react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <main>
    <Component {...pageProps} />
    </main>

    </>
  );
}

export default MyApp;
