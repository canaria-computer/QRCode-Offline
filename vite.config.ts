import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import generouted from "@generouted/solid-router/plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solid(), generouted(), VitePWA({
    registerType: "autoUpdate",
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: "QR Code Reader",
      short_name: "QR Reader",
      description: "Simple and Offline Support QRcode Reader",
      theme_color: "#ffffff",
    },

    workbox: {
      globPatterns: ["**/*.{js,css,html,svg,png,ico,wasm}"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },
    // includeAssets: ["zxing-wasm.wasm"],

    devOptions: {
      enabled: false,
      navigateFallback: "index.html",
      suppressWarnings: true,
      type: "module",
    },
  })],
})