// https://nuxt.com/docs/api/configuration/nuxt-config
const africanHeritageTheme = {
  dark: false,
  colors: {
    // A warm, off-white/cream like sun-bleached cotton
    background: "#FFF9F2",
    // Slightly darker clay/sand for cards
    surface: "#FCF3E8",
    "surface-bright": "#FFFFFF",
    "surface-light": "#F2E4D8",
    "surface-variant": "#5D4037", // Deep wood brown
    "on-surface-variant": "#F2E4D8",

    // PRIMARY: A bold, burnt orange/terracotta (Earth/Sunset)
    primary: "#D35400",
    "primary-darken-1": "#A04000",

    // SECONDARY: A deep 'African Gold' or 'Ochre'
    secondary: "#C0392B",
    "secondary-darken-1": "#922B21",

    // ACCENTS: Deep Jungle Green or Indigo
    info: "#2E7D32", // Rich Green
    success: "#1B5E20", // Deep Forest
    warning: "#F39C12", // Bright Gold
    error: "#922B21", // Dried Blood/Clay red
  },
  variables: {
    "border-color": "#5D4037", // Brownish borders instead of black
    "border-opacity": 0.15,
    "high-emphasis-opacity": 0.9,
    "medium-emphasis-opacity": 0.7,
    // Add a slight "warmth" to the overlay state
    "hover-opacity": 0.06,
  },
};

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
});
