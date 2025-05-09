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

export const getInitials = (name: string | null) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[?.!,]/g, '')
    .trim();
}
