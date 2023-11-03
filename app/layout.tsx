import { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ServiceContainerProvider } from '@/tools/service-container-context';
import IntlProvider from '@/tools/i18n/intl-provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MikadoApp - The Mikado Method applied to your projects',
  description: 'MikadoApp is a tool to help you apply the Mikado Method to your projects.',
  authors: {
    name: 'Arnaud Langlade',
    url: 'https://arnolanglade.github.io',
  },
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
              closeButton={false}
              icon
            />
          </ServiceContainerProvider>
        </IntlProvider>
        <Analytics />
      </body>
    </html>
  );
}
