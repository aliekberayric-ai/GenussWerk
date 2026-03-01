<script lang="ts">
  import eventsData from "../data/events.json";
  import { order, calc } from "../stores/order";
  import { t } from "../stores/i18n";
  import { buildOrderText } from "../utils/orderText";

  const events = 
Array.isArray(eventsData?.events) ?
eventsData.events : [];

  // Formfelder (Frontend-only)
  let name = "";
  let email = "";
  let phone = "";
  let date = "";
  let location = "";
  let notes = "";

  // ✅ HIER eintragen:
  const TARGET_EMAIL = "aliekberayric@gmail.de";
  const WHATSAPP_NUMBER = "4915561363071; // ohne Plus, z.B. 49...

  // Eventlabel für Text
  $: eventLabel = (() => {
    const e = events.find((x) => x.id === $order.eventId);
    return e ? (e.title[$order.lang] ?? e.title.de) : "—";
  })();

  // Finaler Text, der in E-Mail/WhatsApp landet
  $: summaryText = buildOrderText({
    lang: $order.lang,
    eventLabel,
    people: $calc.people,
    lines: $calc.lines.map((l) => ({ title: l.title, qty: l.qty, unit: l.unit, sum: l.sum })),
    total: $calc.total,
    notes,
    customer: { name, email, phone, date, location }
  });

  function sendEmail() {
    const subject = encodeURIComponent(`Catering Anfrage – ${eventLabel} (${ $calc.people })`);
    const body = encodeURIComponent(summaryText);
    window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
  }

  function sendWhatsApp() {
    const msg = encodeURIComponent(summaryText);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  async function copySummary() {
    await navigator.clipboard.writeText(summaryText);
    alert($t("order.copied"));
  }
</script>

<div class="card">
  <h2 style="margin:0;">{$t("order.title")}</h2>
  <p>{$t("order.hint")}</p>

  <div class="grid cols2">
    <div>
      <label class="small">{$t("order.fields.name")}</label>
      <input class="input" bind:value={name} placeholder="Max Mustermann" />
    </div>

    <div>
      <label class="small">{$t("order.fields.email")}</label>
      <input class="input" bind:value={email} placeholder="max@mail.de" />
    </div>

    <div>
      <label class="small">{$t("order.fields.phone")}</label>
      <input class="input" bind:value={phone} placeholder="+49..." />
    </div>

    <div>
      <label class="small">{$t("order.fields.date")}</label>
      <input class="input" type="date" bind:value={date} />
    </div>

    <div>
      <label class="small">{$t("order.fields.location")}</label>
      <input class="input" bind:value={location} placeholder="Mainz" />
    </div>

    <div>
      <label class="small">{$t("order.fields.notes")}</label>
      <input class="input" bind:value={notes} placeholder="Allergien, halal, vegan..." />
    </div>
  </div>

  <hr class="sep" />

  <div class="small">{$t("order.summary")}</div>
  <textarea class="input" rows="10" readonly style="white-space:pre-wrap;">{summaryText}</textarea>

  <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
    <button class="btn" on:click={copySummary}>{$t("common.copy")}</button>
    <button class="btn primary" on:click={sendEmail}>{$t("order.sendEmail")}</button>
    <button class="btn" on:click={sendWhatsApp}>{$t("order.sendWhatsApp")}</button>
  </div>

  <div class="small" style="margin-top:10px;">
    Empfänger in <code>OrderForm.svelte</code> setzen: <code>TARGET_EMAIL</code>, <code>WHATSAPP_NUMBER</code>
  </div>
</div>
