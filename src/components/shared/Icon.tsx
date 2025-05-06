'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  // @ts-ignore - LucideIcons typing issue
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;

  return <IconComponent className={cn('', className)} size={size} />;
};
