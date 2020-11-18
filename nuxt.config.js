const pkg = require('./package')
require('dotenv').config()

module.exports = {
  target: 'static',

  /*
   ** Headers of the page
   */
  head: {
    title: 'I Consent - Niek van Sleeuwen - Thesis',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'theme-color', content: '#071230' },
      { name: 'apple-mobile-web-app-status-bar-style', content: '#071230' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.png' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/components',
    {
      src: '~/node_modules/lazysizes/lazysizes.js',
      mode: 'client',
    },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/moment',
    '@/modules/markdown',
    [
      'storyblok-nuxt',
      {
        accessToken:
          process.env.ENV === 'dev'
            ? process.env.STORYBLOK_TOKEN_PREVIEW
            : process.env.STORYBLOK_TOKEN_PROD,
        cacheProvider: 'memory',
      },
    ],
    '@nuxtjs/style-resources',
  ],

  /*
   ** PWA manifest
   */
  manifest: {
    name: 'I Consent',
    short_name: 'I Consent',
    start_url: '/',
    display: 'standalone',
    lang: 'en-UK',
    theme_color: '#071230',
  },

  /*
   ** Service worker config
   */
  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://img2.storyblok.com/.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'images',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: 'https://a.storyblok.com/.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'images',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },

  /*
   ** Global scss vars and mixins
   */
  styleResources: {
    scss: [
      '@/assets/scss/abstracts/_variables.scss',
      '@/assets/scss/abstracts/_mixins.scss',
    ],
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    // analyze: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
