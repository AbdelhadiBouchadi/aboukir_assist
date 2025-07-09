'use client';

import React from 'react';
import { MenuDatas } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons/lib';
import { UserButton } from '../Users/UserButton';
import Image from 'next/image';

interface SidebarLinkProps {
  title: string;
  path: string;
  icon: IconType;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

const SidebarLink = ({ title, path, icon }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === path || (path !== '/' && pathname.startsWith(path));

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="w-full"
    >
      <Link
        href={path}
        scroll={false}
        className={`${isActive ? 'bg-primary/10 dark:bg-primary/20' : ''} 
        flex gap-4 transition-all group items-center w-full p-4 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20`}
      >
        {React.createElement(icon, {
          className: cn(
            'text-xl font-semibold hover:text-primary dark:hover:text-main group-hover:text-primary dark:group-hover:text-main',
            isActive
              ? 'text-primary dark:text-main'
              : 'text-secondary-foreground'
          ),
        })}
        <p
          className={`text-sm font-semibold transition-all group-hover:text-primary dark:group-hover:text-primary ${
            isActive
              ? 'text-primary dark:text-primary'
              : 'text-secondary-foreground'
          }`}
        >
          {title}
        </p>
      </Link>
    </motion.div>
  );
};

const Sidebar = () => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="xl:shadow-lg py-6 px-4 h-screen w-full border-r border-border flex flex-col justify-between"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link
          href="/"
          className="flex justify-center items-center gap-2 mb-8 w-full"
        >
          <Image
            width={200}
            height={100}
            src="/aboukir_logo.png"
            className="object-cover"
            alt="Aboukir Assit Logo"
          />
        </Link>
      </motion.div>
      <motion.div variants={container} className="flex-colo gap-2 mt-6">
        {MenuDatas.map((item, index) => (
          <SidebarLink
            key={index}
            path={item.path}
            icon={item.icon}
            title={item.title}
          />
        ))}
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex justify-center items-center"
      >
        <UserButton />
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
