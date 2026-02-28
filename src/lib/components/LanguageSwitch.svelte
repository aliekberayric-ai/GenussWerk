<script lang="ts">
  import { lang } from "../stores/i18n";
  // Simple Sprachbuttons
</script>

<div style="display:flex; gap:10px; align-items:center;">
  <button class="btn ghost" on:click={() => lang.set("de")}>DE</button>
  <button class="btn ghost" on:click={() => lang.set("en")}>EN</button>
  <button class="btn ghost" on:click={() => lang.set("tr")}>TR</button>
</div>