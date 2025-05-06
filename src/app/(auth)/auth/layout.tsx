import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dental Clinic Admin Panel',
  description: 'WhatsApp Automation Dashboard for Dental Clinic',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.className} w-full h-screen flex flex-col items-center justify-center px-4 relative`}
    >
      <div className="absolute -top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 -z-10 h-[31.25rem] w-[31.25rem] animate-pulse-fast rounded-full bg-[#8e9bc4] blur-[10rem] dark:animate-pulse-slow dark:bg-[#5464a4] sm:w-[68.75rem]"></div>
      <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 -z-10 h-[31.25rem] w-[50rem] animate-pulse-faster rounded-full bg-[#515d8a] blur-[10rem] dark:animate-pulse-slower dark:bg-[#2d365a] sm:w-[68.75rem] "></div>
      {children}
    </div>
  );
}
