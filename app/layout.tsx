import { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ServiceContainerProvider } from '@/lib/service-container-context';
import IntlProvider from '@/lib/i18n/intl-provider';

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
        <IntlProvider>
          <ServiceContainerProvider>
            {children}
          </ServiceContainerProvider>
        </IntlProvider>
        <Analytics />
      </body>
    </html>
  );
}
