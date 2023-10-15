import { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ServiceContainerProvider } from '@/tools/service-container-context';
import IntlProvider from '@/tools/i18n/intl-provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              icon
            />
          </ServiceContainerProvider>
        </IntlProvider>
        <Analytics />
      </body>
    </html>
  );
}
