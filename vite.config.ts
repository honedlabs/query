import { resolve } from "path"
import { defineConfig } from "vite"
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({
      exclude: ["src/test/**"],
      rollupTypes: true,
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
      outDir: "dist",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: 'query',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core', '@inertiajs/vue3', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
          '@inertiajs/vue3': 'InertiaVue',
          axios: 'axios',
        },
      },
    },
  },
})