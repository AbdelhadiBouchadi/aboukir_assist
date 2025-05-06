'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  iconName: string;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  change,
  changeType = 'neutral',
  iconName,
  color,
}) => {
  // Dynamically get the icon component from lucide-react
  // @ts-ignore - LucideIcons typing issue
  const IconComponent = LucideIcons[iconName] || LucideIcons.CircleDashed;

  const getIconBgColor = () => {
    const colorMap: Record<string, string> = {
      '#0ea5e9':
        'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
      '#10b981':
        'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-300',
      '#f59e0b':
        'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
      '#8b5cf6':
        'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
      '#ef4444': 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300',
    };

    return (
      colorMap[color] ||
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    );
  };

  const getChangeColor = () => {
    const changeColorMap: Record<string, string> = {
      increase: 'text-green-600 dark:text-green-400',
      decrease: 'text-red-600 dark:text-red-400',
      neutral: 'text-gray-600 dark:text-gray-400',
    };

    return changeColorMap[changeType || 'neutral'];
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-card/20 rounded-lg shadow-sm border border-border overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              <h2 className="text-3xl font-bold text-foreground">
                {value}
                {suffix}
              </h2>
              {change && (
                <span
                  className={`ml-2 text-sm font-medium ${getChangeColor()}`}
                >
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className={`rounded-full p-2 ${getIconBgColor()}`}>
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
