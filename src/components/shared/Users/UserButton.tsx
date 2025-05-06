'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Stethoscope,
  Sun,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { useTheme } from 'next-themes';

export function UserButton() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none w-full">
        <div className="flex gap-4 items-center w-full p-4 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg">
          <Avatar className="h-10 w-10 border border-border cursor-pointer hover:border-primary transition-colors duration-200">
            <AvatarFallback className="bg-primary/10 text-primary">
              <Stethoscope className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold ">Aboukir</p>
          </div>
          <ChevronsUpDown size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">Aboukir Assist</p>
            <p className="text-xs leading-none text-muted-foreground">
              aboukir@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer font-bold">
            <Monitor className="mr-2 size-4" />
            Mode
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="font-bold ">
              <DropdownMenuItem
                onClick={() => setTheme('system')}
                className="cursor-pointer"
              >
                <Monitor className="mr-2 size-4" />
                System default
                {theme === 'system' && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className="cursor-pointer"
              >
                <Sun className="mr-2 size-4" />
                Light
                {theme === 'light' && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className="cursor-pointer"
              >
                <Moon className="mr-2 size-4" />
                Dark
                {theme === 'dark' && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer font-bold"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
