<script lang="ts">
  import { page } from "$app/stores";
  import { t, lang } from "$lib/stores/i18n";
  import { order, menuItems } from "$lib/stores/order";
  import MenuItemCard from "$lib/components/MenuItemCard.svelte";
  import OrderSummary from "$lib/components/OrderSummary.svelte";
  import OrderForm from "$lib/components/OrderForm.svelte";
  import { goto } from "$app/navigation";

  // Tabs/Sektionen
  const sections = [
    { id: "appetizers", key: "sections.appetizers" },
    { id: "mains", key: "sections.mains" },
    { id: "desserts", key: "sections.desserts" },
    { id: "extras", key: "sections.extras" }
  ] as const;

  let active: any = "appetizers";

  // Kategorie aus URL setzen
  $: eventId = $page.url.searchParams.get("event");
  $: if (eventId) order.update(o => ({ ...o, eventId, lang: $lang }));

  // Items für aktive Sektion
  $: filtered = menuItems.filter(m => m.section === active);
</script>

<div class="container" style="padding: 22px 0 50px;">
  <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; align-items:center;">
    <button class="btn" on:click={() => goto("/")}>{$t("common.back")}</button>

    <!-- Personenanzahl -->
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <div class="badge">{$t("common.currency")}: EUR</div>
      <label class="small">{$t("common.people")}</label>
      <input
        class="input"
        style="max-width:120px;"
        type="number"
        min="1"
        step="1"
        bind:value={$order.people}
      />
    </div>
  </div>

  <section style="margin-top:12px;" class="grid cols2">
    <div class="card">
      <h2>Menu Builder</h2>

      <!-- Tabs -->
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
        {#each sections as s}
          <button class="btn {active === s.id ? 'primary' : ''}" on:click={() => (active = s.id)}>
            {$t(s.key)}
          </button>
        {/each}
      </div>

      <!-- Cards -->
      <div class="grid" style="gap:12px;">
        {#each filtered as item (item.id)}
          <MenuItemCard {item} />
        {/each}
      </div>
    </div>

    <div class="grid" style="gap:12px;">
      <OrderSummary />
      <OrderForm />
    </div>
  </section>
</div>