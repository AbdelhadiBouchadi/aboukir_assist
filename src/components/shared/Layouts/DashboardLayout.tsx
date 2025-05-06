'use client';

import React from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { motion } from 'framer-motion';
import { ModeToggle } from '../ModeToggle';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden xl:block xl:w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <h1 className="text-xl font-bold hidden sm:block">DentalAssist</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </header>
        <motion.main
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
