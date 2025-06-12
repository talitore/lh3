import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayoutContent from '@/components/layout/ClientLayoutContent';
import AuthProvider from '@/components/layout/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Application',
  description: 'A community platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        <AuthProvider>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
