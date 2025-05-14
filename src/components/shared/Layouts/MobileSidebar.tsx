'use client';

import { MenuDatas } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Menu, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserButton } from '../Users/UserButton';
import { IconType } from 'react-icons/lib';
import Image from 'next/image';

interface SidebarLinkProps {
  title: string;
  path: string;
  icon: IconType;
  onItemClick?: () => void;
}

const SidebarLink = ({ title, path, icon, onItemClick }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === path || (path !== '/' && pathname.startsWith(path));

  return (
    <Link
      href={path}
      className={`${isActive ? 'bg-primary/10 dark:bg-primary/20' : ''} 
      flex gap-4 transition-all group items-center w-full p-4 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20`}
      onClick={onItemClick}
    >
      {React.createElement(icon, {
        className: cn(
          'text-xl font-semibold hover:text-primary dark:hover:text-main group-hover:text-primary dark:group-hover:text-main',
          isActive ? 'text-primary dark:text-main' : 'text-secondary-foreground'
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
  );
};

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden relative group overflow-hidden bg-background/20 backdrop-blur-sm border border-border shadow-lg hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Menu className="size-5 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-[300px] bg-gradient-to-br from-background/90 via-background to-background/90 backdrop-blur-sm"
      >
        <div className="py-6 px-4 h-full flex flex-col justify-between">
          <Link
            href="/"
            className="flex justify-center items-center gap-2 mb-8"
            onClick={handleLinkClick}
          >
            <Image
              width={200}
              height={100}
              src="/aboukir_logo.png"
              className="object-cover"
              alt="Aboukir Assit Logo"
            />
          </Link>
          <div className="flex flex-col gap-2 mt-6 flex-grow">
            {MenuDatas.map((item, index) => (
              <SidebarLink
                key={index}
                path={item.path}
                icon={item.icon}
                title={item.title}
                onItemClick={handleLinkClick}
              />
            ))}
          </div>
          <div className="flex justify-center items-center">
            <UserButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
