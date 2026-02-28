import adapter from "@sveltejs/adapter-static";

export default {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html" // wichtig: GitHub Pages kann keine SSR-Routen
    }),
    paths: {
      // GitHub Actions setzt BASE_PATH=/RepoName
      base: process.env.BASE_PATH ?? ""
    }
  }
};