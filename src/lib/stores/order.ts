import { writable, derived } from "svelte/store";
import menuData from "../data/menu.json";
import type { Lang } from "./i18n";

export type Section = "appetizers" | "mains" | "desserts" | "extras";

/**
 * pricingMode:
 * - perPerson: Preis pro Person (alle Personen)
 * - perSelectedPersons: Preis pro Person, aber nur für X ausgewählte Personen
 * - flat: fixer Preis einmalig
 */
export type PricingMode = "perPerson" | "perSelectedPersons" | "flat";

export type MenuItem = {
  id: string;
  section: Section;
  name: Record<Lang, string> & Record<string, string>;
  desc?: Record<Lang, string> & Record<string, string>;
  priceEUR: number;
  image?: string;
  pricingMode?: PricingMode; // nur für extras relevant
};

export type SelectedItem = {
  id: string;

  /**
   * Menge pro Person (Kommazahl erlaubt)
   * Beispiel: 0.5 = halbe Portion pro Person
   */
  qtyPerPerson: number;

  /**
   * Nur für pricingMode = perSelectedPersons:
   * Wie viele Personen bekommen dieses Extra?
   */
  selectedPeople?: number;
};

export type OrderState = {
  lang: Lang;
  eventId: string | null;
  people: number; // ganzzahlig, wird gerundet
  selections: Record<string, SelectedItem>;
  notes: string;
};

const initial: OrderState = {
  lang: "de",
  eventId: null,
  people: 20,
  selections: {},
  notes: ""
};

export const order = writable<OrderState>(initial);

// Root-object -> items
export const menuItems = (menuData as any).items as MenuItem[];
const itemsById = new Map(menuItems.map((m) => [m.id, m]));

/** Toggle Auswahl (Checkmark) */
export function toggleItem(itemId: string) {
  order.update((o) => {
    const existing = o.selections[itemId];
    if (existing) {
      const copy = { ...o.selections };
      delete copy[itemId];
      return { ...o, selections: copy };
    }

    const item = itemsById.get(itemId);
    const isExtra = item?.section === "extras";
    const pricingMode = isExtra ? (item?.pricingMode ?? "perSelectedPersons") : "perPerson";

    // Default: Extras, die "perSelectedPersons" sind → alle Personen bekommen es (kann man runterstellen)
    const selectedPeople = pricingMode === "perSelectedPersons" ? Math.max(1, Math.round(o.people)) : undefined;

    return {
      ...o,
      selections: {
        ...o.selections,
        [itemId]: { id: itemId, qtyPerPerson: 1, selectedPeople }
      }
    };
  });
}

/** Menge pro Person setzen (Komma erlaubt) */
export function setQty(itemId: string, qtyPerPerson: number) {
  const safe = Number.isFinite(qtyPerPerson) ? Math.max(0.1, qtyPerPerson) : 1;

  order.update((o) => {
    const prev = o.selections[itemId] ?? { id: itemId, qtyPerPerson: 1 };
    return {
      ...o,
      selections: { ...o.selections, [itemId]: { ...prev, qtyPerPerson: safe } }
    };
  });
}

/** Für Extras: Anzahl ausgewählter Personen setzen */
export function setSelectedPeople(itemId: string, selectedPeople: number) {
  order.update((o) => {
    const peopleTotal = Math.max(1, Math.round(o.people));
    const safe = Number.isFinite(selectedPeople)
      ? Math.max(1, Math.min(peopleTotal, Math.round(selectedPeople)))
      : peopleTotal;

    const prev = o.selections[itemId];
    if (!prev) return o;

    return {
      ...o,
      selections: { ...o.selections, [itemId]: { ...prev, selectedPeople: safe } }
    };
  });
}

/** Gesamtkalkulation + Zeilen fürs UI */
export const calc = derived(order, ($o) => {
  const people = Math.max(1, Math.round($o.people));

  let total = 0;
  const lines: Array<{
    title: string;
    section: Section;
    pricingMode: PricingMode;
    qty: number;
    unit: number;
    sum: number;
  }> = [];

  for (const sel of Object.values($o.selections)) {
    const item = itemsById.get(sel.id);
    if (!item) continue;

    const isExtra = item.section === "extras";
    const pricingMode: PricingMode = isExtra ? (item.pricingMode ?? "perSelectedPersons") : "perPerson";

    let qty = 0;

    if (pricingMode === "flat") {
      qty = 1;
    } else if (pricingMode === "perPerson") {
      qty = people * sel.qtyPerPerson;
    } else {
      const sp = Math.max(1, Math.min(people, Math.round(sel.selectedPeople ?? people)));
      qty = sp * sel.qtyPerPerson;
    }

    const sum = qty * item.priceEUR;
    total += sum;

    lines.push({
      title: item.name[$o.lang] ?? item.name["de"] ?? item.id,
      section: item.section,
      pricingMode,
      qty,
      unit: item.priceEUR,
      sum
    });
  }

  // Sort nach Sektion
  const orderSection: Record<Section, number> = { appetizers: 1, mains: 2, desserts: 3, extras: 4 };
  lines.sort((a, b) => orderSection[a.section] - orderSection[b.section]);

  return { people, total, lines };
});