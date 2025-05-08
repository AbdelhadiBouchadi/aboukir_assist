import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatLanguage = (lang: string) => {
  const mapping: { [key: string]: string } = {
    FRENCH: 'Français',
    ARABIC: 'Arabe',
  };
  return mapping[lang] || lang;
};
