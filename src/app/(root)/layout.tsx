import '../globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import MobileSidebar from '@/components/shared/Layouts/MobileSidebar';
import Sidebar from '@/components/shared/Layouts/Sidebar';
import { requireAuth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dental Clinic Admin Panel',
  description: 'WhatsApp Automation Dashboard for Dental Clinic',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
    >
      <div className="grid xl:grid-cols-12 w-full bg-background dark:bg-background/20">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-main/20 via-subMain to-main/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
        <div className="col-span-2 xl:block hidden z-50">
          <Sidebar />
        </div>
        <div className="col-span-10 xl:h-screen overflow-y-scroll relative">
          <div className="fixed top-4 left-8 z-50">
            <MobileSidebar />
          </div>
          <div className="px-8 py-16  lg:py-20 xl:py-6">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
