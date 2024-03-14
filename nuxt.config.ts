// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/color-mode'],
  plugins: [],
  ssr: false,
  css: [
    '~/assets/fonts/clash-display.css',
  ]
})
