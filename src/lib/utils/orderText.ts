import type { Lang } from "../stores/i18n";

// Baut einen schönen Text, der in Mail/WhatsApp landet
export function buildOrderText(opts: {
  lang: Lang;
  eventLabel: string;
  people: number;
  lines: Array<{ title: string; qty: number; unit: number; sum: number }>;
  total: number;
  notes?: string;
  customer: { name: string; email: string; phone: string; date: string; location: string };
}) {
  const { lang, eventLabel, people, lines, total, notes, customer } = opts;

  const labels = {
    de: { head: "Catering Anfrage", event: "Kategorie", people: "Personen", customer: "Kontaktdaten", total: "Gesamt", notes: "Hinweise" },
    en: { head: "Catering request", event: "Category", people: "People", customer: "Contact", total: "Total", notes: "Notes" },
    tr: { head: "Catering talebi", event: "Kategori", people: "Kişi", customer: "İletişim", total: "Toplam", notes: "Notlar" }
  }[lang];

  const lineText = lines
    .map((l) => `- ${l.title} | qty: ${roundNice(l.qty)} | unit: €${roundNice(l.unit)} | sum: €${roundNice(l.sum)}`)
    .join("\n");

  const notesText = notes?.trim() ? `\n\n${labels.notes}: ${notes.trim()}` : "";

  return `${labels.head}

${labels.customer}:
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
Date: ${customer.date}
Location: ${customer.location}

${labels.event}: ${eventLabel}
${labels.people}: ${people}

Items:
${lineText}

${labels.total}: €${roundNice(total)}${notesText}`;
}

function roundNice(n: number) {
  return (Math.round(n * 100) / 100).toString();
}