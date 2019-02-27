import Vue from 'vue'
const StoryblokClient = require('storyblok-js-client')
const Storyblok = new StoryblokClient({
  oauthToken: '<%= options.token %>'
})

console.log('<%= options.token %>') //eslint-disable-line

Vue.prototype.$assetsApi = Storyblok
export default ctx => {
  const { app, store } = ctx
  app.$assetsApi = Vue.prototype.$assetsApi
  ctx.$assetsApi = Vue.prototype.$assetsApi

  if (store) {
    store.$assetsApi = Vue.prototype.$assetsApi
  }
}
