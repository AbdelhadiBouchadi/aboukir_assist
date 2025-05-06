import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'STELLANTIS | Système de Gestion Des Amadeus',
  description:
    'Plateforme digitale dédiée à la création, la gestion et le suivi des Amadeus au sein de Stellantis Kénitra',
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
        <Toaster />
      </body>
    </html>
  );
}
