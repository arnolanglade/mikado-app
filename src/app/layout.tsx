import { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ServiceContainerProvider } from '@/app/lib/service-container/ServiceContainerContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Refactor',
  description: 'Refactor thanks to the mikado method',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceContainerProvider>
          {children}
        </ServiceContainerProvider>
      </body>
    </html>
  );
}
