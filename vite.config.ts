import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

// En GitHub Pages la app vive en /<repositorio>/; en otros alojamientos, en la raíz.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@content": fileURLToPath(new URL("./content", import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["cartas/*.webp", "iconos/*"],
      manifest: {
        name: "Oráculo de los Arcángeles",
        short_name: "Arcángeles",
        description: "Tu mensaje de luz de cada día. Cartas de David Mateu.",
        lang: "es",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0B0A24",
        theme_color: "#0B0A24",
        start_url: ".",
        scope: ".",
        icons: [
          { src: "iconos/icono-192.png", sizes: "192x192", type: "image/png" },
          { src: "iconos/icono-512.png", sizes: "512x512", type: "image/png" },
          { src: "iconos/icono-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: { globPatterns: ["**/*.{js,css,html,webp,png,svg,woff2}"] },
    }),
  ],
  server: { port: 5173, host: true },
});
