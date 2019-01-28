import Vue from 'vue'
const markdownItAttrs = require('markdown-it-attrs')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
}).use(markdownItAttrs)

Vue.prototype.$parser = md

export default ctx => {
  const { app, store } = ctx

  app.$parser = Vue.prototype.$parser
  ctx.$parser = Vue.prototype.$parser

  if (store) {
    store.$parser = Vue.prototype.$parser
  }
}
