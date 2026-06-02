import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
      vue(),
   
      VitePWA({
         strategies: "injectManifest",
         injectRegister: false,
         devOptions: {
            enabled: true,
         },
         base: "/",
         srcDir: "src",
         filename: "sw.ts",
         includeAssets: ["icons/arabic-crescent.svg"],
         injectManifest: {
            globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,ttf,eot,wasm}'],
            maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4M max for build chunks
         },

         manifest: {
            name: "Darija",
            short_name: "Darija",
            theme_color: "#ffffff",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            icons: [
               {
                  src: "icons/arabic-crescent.svg",
                  sizes: "any",
                  type: "image/svg+xml",
                  purpose: "any maskable",
               },
            ],
         },
      }),
   ],
   server: {
      port: 8080,
      open: true,
      host: true, // allows for external device connection on local network
      proxy: {
         '^/speak': 'http://localhost:3018',
      }
   },
})
