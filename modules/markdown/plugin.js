import Vue from 'vue'
const markdownItAttrs = require('markdown-it-attrs')
const container = require('markdown-it-container')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})
  .use(markdownItAttrs)
  .use(container, 'quote', {
    validate: function(params) {
      return params.trim().match(/^quote/)
    },
    render: function(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        return `<blockquote class="quote">`
      } else {
        return `</blockquote>\n`
      }
    },
    marker: '-'
  })
  .use(container, 'text', {
    validate: function(params) {
      return params.trim().match(/^text/)
    },
    render: function(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^text\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<span class="text"><span class="quotemarks"></span>${m[1]}`
      } else {
        return `</span>`
      }
    },
    marker: '-'
  })
  .use(container, 'something', {
    validate: function(params) {
      return params.trim().match(/^source/)
    },
    render: function(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^source\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<span class="source">(${m[1]})`
      } else {
        return `</span>`
      }
    },
    marker: '-'
  })

Vue.prototype.$md = md

export default ctx => {
  const { app, store } = ctx

  app.$md = Vue.prototype.$md
  ctx.$md = Vue.prototype.$md

  if (store) {
    store.$md = Vue.prototype.$md
  }
}
