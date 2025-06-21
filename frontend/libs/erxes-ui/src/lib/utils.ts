import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixNum(value: any, p = 4) {
  const cleanNumber = Number((value ?? '').toString().replace(/,/g, ""));

  if (isNaN(cleanNumber)) {
    return 0;
  }
  const multiplier = 10 ** p;

  const big = Math.round(
    Number((cleanNumber * multiplier).toFixed(2))
  );

  return Number((big / multiplier).toFixed(p))
};
