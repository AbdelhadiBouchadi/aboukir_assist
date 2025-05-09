import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Aboukir Assist | Admin Dashboard',
  description: 'WhatsApp Automation Dashboard for Dental Clinic',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased xl:h-screen flex-colo`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
