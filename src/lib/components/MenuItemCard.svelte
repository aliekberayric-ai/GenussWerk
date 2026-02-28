<script lang="ts">
  import { order, toggleItem, setQty, setSelectedPeople, type MenuItem } from "../stores/order";
  import { t } from "../stores/i18n";
  import { formatEUR } from "../utils/money";

  export let item: MenuItem;

  // Zustand aus dem Store
  $: selected = !!$order.selections[item.id];
  $: sel = $order.selections[item.id];

  // Pricing-Mode (Extras können anders sein)
  const isExtra = item.section === "extras";
  $: pricingMode = isExtra ? (item.pricingMode ?? "perSelectedPersons") : "perPerson";
</script>

<div class="card" style="display:grid; grid-template-columns: 92px 1fr; gap: 12px;">
  <!-- Vorschaubild -->
  <div style="width:92px; height:92px; border-radius:18px; overflow:hidden; border:1px solid var(--border); background: rgba(255,255,255,0.04);">
    {#if item.image}
      <img src={item.image} alt="" style="width:100%; height:100%; object-fit:cover;" />
    {/if}
  </div>

  <div>
    <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
      <div>
        <div style="display:flex; gap:10px; align-items:center;">
          <!-- Checkmark Toggle -->
          <button
            class="btn"
            style="padding:8px 10px; border-radius:14px;"
            aria-pressed={selected}
            on:click={() => toggleItem(item.id)}
          >
            {#if selected}
              <span style="color:var(--ok); font-weight:800;">✓</span>
              <span>{$t("common.selected")}</span>
            {:else}
              <span style="opacity:.7;">○</span>
              <span>{$t("common.select")}</span>
            {/if}
          </button>

          <div>
            <div style="font-weight:800;">{item.name[$order.lang] ?? item.name.de}</div>
            {#if item.desc}
              <div class="small">{item.desc[$order.lang] ?? item.desc.de}</div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Preis -->
      <div style="text-align:right;">
        <div style="font-weight:900;">{formatEUR(item.priceEUR)}</div>
        <div class="small">
          {#if pricingMode === "flat"}
            {$t("pricing.flat")}
          {:else if pricingMode === "perSelectedPersons"}
            {$t("pricing.perSelectedPersons")}
          {:else}
            {$t("pricing.perPerson")}
          {/if}
        </div>
      </div>
    </div>

    {#if selected}
      <div style="display:flex; gap:10px; margin-top:10px; align-items:center; flex-wrap:wrap;">
        <!-- Menge pro Person (außer flat) -->
        {#if pricingMode !== "flat"}
          <label class="small" style="min-width:160px;">{$t("common.perPersonQty")}</label>
          <input
            class="input"
            style="max-width:160px;"
            type="number"
            min="0.1"
            step="0.1"
            inputmode="decimal"
            value={sel?.qtyPerPerson ?? 1}
            on:input={(e) => setQty(item.id, Number((e.target as HTMLInputElement).value))}
          />
        {/if}

        <!-- Extras: nur manche Personen -->
        {#if pricingMode === "perSelectedPersons"}
          <label class="small" style="min-width:220px;">{$t("common.peopleForExtra")}</label>
          <input
            class="input"
            style="max-width:160px;"
            type="number"
            min="1"
            step="1"
            value={sel?.selectedPeople ?? $order.people}
            on:input={(e) => setSelectedPeople(item.id, Number((e.target as HTMLInputElement).value))}
          />
        {/if}

        {#if pricingMode === "flat"}
          <span class="small">({$t("pricing.flat")})</span>
        {/if}
      </div>
    {/if}
  </div>
</div>