import { id } from "./dictionaries/id";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

/**
 * Bentuk kamus diturunkan dari versi Indonesia, sehingga TypeScript menolak build
 * bila terjemahan Inggris kehilangan atau menambah satu kunci pun.
 */
export type Dictionary = typeof id;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "en") {
    return (await import("./dictionaries/en")).en;
  }
  return id;
}

/** Bahasa selain yang sedang aktif — dipakai tombol pengalih bahasa. */
export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}
