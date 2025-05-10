import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayoutContent from '@/components/layout/ClientLayoutContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LH3 Application',
  description: 'Larryville Hash House Harriers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </body>
    </html>
  );
}
