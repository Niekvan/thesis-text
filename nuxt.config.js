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
  plugins: ['~/plugins/components'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@/modules/markdown/module',
    '@nuxtjs/moment',
    [
      'storyblok-nuxt',
      {
        accessToken:
          process.env.NODE_ENV === 'production'
            ? process.env.STORYBLOK_TOKEN_PROD
            : process.env.STORYBLOK_TOKEN_PREVIEW,
        cacheProvider: 'memory'
      }
    ]
  ],
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
            token: process.env.STORYBLOK_TOKEN_PROD,
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
