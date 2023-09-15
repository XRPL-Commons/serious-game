// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  plugins: [{ src: 'plugins/oruga.js' }],
  ssr: false,
  css: [
    '@oruga-ui/theme-bulma/dist/bulma.css',
    '~/assets/fonts/clash-display.css',
    '~/assets/css/style.css'
  ]
})
