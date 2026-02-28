import { writable, derived } from "svelte/store";
import de from "../i18n/de";
import en from "../i18n/en";
import tr from "../i18n/tr";

export type Lang = "de" | "en" | "tr";

const dict: Record<Lang, any> = { de, en, tr };

// Standard: Deutsch
export const lang = writable<Lang>("de");

/**
 * t("path.to.key")
 * - sucht im jeweiligen Sprachobjekt
 * - gibt den Key zurück, falls nicht gefunden (Debug/Fehler sichtbar)
 */
export const t = derived(lang, ($lang) => {
  const d = dict[$lang];
  return (key: string) => {
    const parts = key.split(".");
    let cur: any = d;
    for (const p of parts) cur = cur?.[p];
    return cur ?? key;
  };
});