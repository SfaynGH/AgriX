import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function addThousandsSeparator(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function numberToPercentage(num: number) {
  return `${num * 100}%`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
