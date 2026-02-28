<script lang="ts">
  import { calc } from "../stores/order";
  import { t } from "../stores/i18n";
  import { formatEUR } from "../utils/money";

  const sectionKey: Record<string, string> = {
    appetizers: "sections.appetizers",
    mains: "sections.mains",
    desserts: "sections.desserts",
    extras: "sections.extras"
  };

  function roundNice(n: number) {
    return (Math.round(n * 100) / 100).toString();
  }
</script>

<div class="card">
  <h2 style="margin:0;">{$t("order.summary")}</h2>
  <div class="small" style="margin-top:6px;">
    Live-Berechnung · Menge pro Person erlaubt Kommazahlen (z. B. 0.5)
  </div>
  <hr class="sep" />

  {#if $calc.lines.length === 0}
    <p>Bitte wähle mindestens eine Speise oder ein Extra.</p>
  {:else}
    <div style="display:grid; gap:10px;">
      {#each $calc.lines as l}
        <div style="display:flex; justify-content:space-between; gap:12px;">
          <div>
            <div style="font-weight:800;">{l.title}</div>
            <div class="small">
              {$t(sectionKey[l.section])} · qty: {roundNice(l.qty)} · unit: {formatEUR(l.unit)}
            </div>
          </div>
          <div style="font-weight:900;">{formatEUR(l.sum)}</div>
        </div>
      {/each}
    </div>

    <hr class="sep" />
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div class="badge">{$t("common.people")}: {$calc.people}</div>
      <div style="font-size:22px; font-weight:950;">{formatEUR($calc.total)}</div>
    </div>
  {/if}
</div>