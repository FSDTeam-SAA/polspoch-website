import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a product name into a URL-safe slug.
 * Handles Spanish characters (accents, ñ, ü, etc.).
 *
 * Example: "Tubo Cuadrado de Acero" → "tubo-cuadrado-de-acero"
 */
export function slugify(name: string): string {
  return name
    .normalize("NFD") // decompose accented chars e.g. é → e + combining accent
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks
    .toLowerCase()
    .replace(/ñ/g, "n") // handle ñ explicitly (it normalises differently)
    .replace(/[^a-z0-9\s-]/g, "") // keep only alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens
}
