// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/color-mode'],
  plugins: [],
  runtimeConfig: {
    // The private keys which are only available server-side
    xamanApiKey: process.env.XAMAN_API_KEY,
    xamanSecretKey: process.env.XAMAN_SECRET_KEY,
    xrplCommonsAddress: process.env.XRPL_COMMONS_ADDRESS,    
    xrplCommonsSecret: process.env.XRPL_COMMONS_SECRET,
    wssExplorer: process.env.WSS_EXPLORER,
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api'
    }
  },
  ssr: false,
  css: [
    '~/assets/fonts/clash-display.css',
  ]
})