<script lang="ts">
  import eventsData from "../data/events.json";
  import { goto } from "$app/navigation";
  import { lang, t } from "../stores/i18n";

  // Root-object -> events
  const events = eventsData.events;
</script>

<div class="grid cols2">
  {#each events as e}
    <div class="card">
      <div class="badge">{e.title[$lang]}</div>
      <h2 style="margin-top:10px;">{e.title[$lang]}</h2>
      <p>{e.subtitle[$lang]}</p>

      <!-- CTA: zur Builder-Seite -->
      <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
        <button class="btn primary" on:click={() => goto(`/builder?event=${e.id}`)}>
          {$t("landing.start")}
        </button>
      </div>
    </div>
  {/each}
</div>