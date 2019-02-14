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
  plugins: ['~/plugins/components', '~/api/ipApi.js'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/moment',
    // '@nuxtjs/markdownit',
    '@/modules/markdown/module',
    [
      'storyblok-nuxt',
      {
        accessToken:
          process.env.NODE_ENV === 'production'
            ? process.env.STORYBLOK_TOKEN_PREVIEW
            : process.env.STORYBLOK_TOKEN_PREVIEW,
        cacheProvider: 'memory'
      }
    ],
    '@nuxtjs/style-resources'
  ],
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
            version: 'published',
            token: process.env.STORYBLOK_TOKEN_PREVIEW,
            cv: Math.floor(Date.now() / 1e3)
          }
        })
        .then(res => {
          const routes = Object.keys(res.data.links)
            .map(e => res.data.links[e])
            .filter(link => {
              return !link.is_folder && link.name !== 'Home'
            })
            .map(link => link.slug)
          return routes
        })
    }
  }
}
