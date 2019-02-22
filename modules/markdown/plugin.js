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
        const author = m[1].split(' | ')
        const data =
          author.length > 1
            ? [author[0]].concat(author[1].split(', '))
            : m[1].split(', ')
        if (data[2]) {
          return `<span class="source">(<span class="author">${
            data[0]
          }</span>, <span class="year">${
            data[1]
          }</span>, <span class="page-ref">${data[2]}</span>`
        } else {
          return `<span class="source">(<span class="author">${
            data[0]
          }</span>, <span class="year">${data[1]}</span>`
        }
      } else {
        return `)</span>`
      }
    },
    marker: '-'
  })
  .use(container, 'sidenote', {
    validate: function(params) {
      return params.trim().match(/^sidenote/)
    },
    render: function(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^sidenote\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return ` <span class="sidenote__wrapper"><span class="sidenote__link">${
          m[1]
        }</span>\n<span class="sidenote__description">`
      } else {
        return '</span>\n</span>'
      }
    },
    marker: '|'
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
