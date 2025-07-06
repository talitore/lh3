import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges multiple CSS class names, resolving Tailwind CSS conflicts and duplicates.
 *
 * @param inputs - Class name values to be conditionally joined and merged
 * @returns A single string of merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
