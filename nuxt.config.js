import axios from 'axios'
const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    {
      src: '~/assets/scss/main.scss',
      lang: 'scss'
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/components',
    '~/api/ipApi.js',
    '~/plugins/vuescroll',
    {
      src: '~/node_modules/lazysizes/lazysizes.js',
      mode: 'client'
    }
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
          process.env.NODE_ENV === 'dev'
            ? process.env.STORYBLOK_TOKEN_PREVIEW
            : process.env.STORYBLOK_TOKEN_PREVIEW,
        cacheProvider: 'memory'
      }
    ],
    '@nuxtjs/style-resources'
  ],

  /*
  ** PWA manifest
  */
  manifest: {
    name: 'I Consent',
    short_name: 'I Consent',
    start_url: '/',
    display: 'standalone',
    lang: 'en-UK'
  },

  /*
  ** Global scss vars and mixins
  */
  styleResources: {
    scss: [
      '@/assets/scss/abstracts/_variables.scss',
      '@/assets/scss/abstracts/_mixins.scss'
    ]
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  // serverMiddleware: ['~/middleware/detectIP'],

  /*
  ** Build configuration
  */
  build: {
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
          exclude: /(node_modules)/
        })
      }
    }
  },

  generate: {
    routes: function() {
      return axios
        .get('https://api.storyblok.com/v1/cdn/links', {
          params: {
            version: 'draft',
            token: process.env.STORYBLOK_TOKEN_PREVIEW,
            cv: Math.floor(Date.now() / 1e3)
          }
        })
        .then(res => {
          const routes = Object.keys(res.data.links)
            .map(e => res.data.links[e])
            .filter(link => {
              return (
                !link.is_folder &&
                link.name !== 'Home' &&
                link.name !== 'sources' &&
                link.name !== 'abstract'
              )
            })
            .map(link => `/${link.slug}`)
          return routes
        })
    }
  }
}
