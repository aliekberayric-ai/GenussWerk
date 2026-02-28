<script lang="ts">
  import LanguageSwitch from "$lib/components/LanguageSwitch.svelte";
  import EventCards from "$lib/components/EventCards.svelte";
  import { t } from "$lib/stores/i18n";
</script>

<div class="container" style="padding: 22px 0 50px;">
  <header style="display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap;">
    <div style="display:flex; gap:12px; align-items:center;">
      <img src="/logo.svg" alt="Logo" style="width:44px; height:44px;" />
      <div>
        <div style="font-weight:950; letter-spacing:.06em;">{$t("brand.title")}</div>
        <div class="small">{$t("brand.tagline")}</div>
      </div>
    </div>
    <LanguageSwitch />
  </header>

  <section style="margin-top:18px;" class="card">
    <h1>{$t("brand.title")}</h1>
    <p>{$t("brand.tagline")}</p>

    <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
      <a class="btn primary" href="#events">{$t("landing.start")}</a>
      <a class="btn" href="/admin">{$t("common.admin")}</a>
    </div>

    <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
      <span class="badge">{$t("landing.badges.range")}</span>
      <span class="badge">{$t("landing.badges.setup")}</span>
      <span class="badge">{$t("landing.badges.halal")}</span>
    </div>
  </section>

  <section id="events" style="margin-top:16px;">
    <h2>{$t("landing.eventsTitle")}</h2>
    <EventCards />
  </section>

  <footer style="margin-top:18px; opacity:.8;">
    <div class="small">© {new Date().getFullYear()} {$t("brand.title")} · GitHub Pages · Sveltia CMS</div>
  </footer>
</div>