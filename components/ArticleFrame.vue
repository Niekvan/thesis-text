<template>
  <section v-editable="article.content" class="article" :style="styles">
    <div class="header" @click="removeNext">
      <span class="bar"> /{{ article.content.title }} </span>
      <span class="trigger" @click="toggleOpen">
        {{ graphOpen ? '&#8673;' : '&#8675;' }}
      </span>
      <span class="close" @click="removeArticle"> X </span>
    </div>
    <div class="content scroll">
      <div class="row">
        <article class="col-lg-8">
          <div class="line-width">
            <h1 class="heading-1">
              {{ article.content.title }}
            </h1>
            <div
              :ref="`md-${article.uuid}-${index}`"
              class="body"
              v-html="body"
            />
            <transition name="fade">
              <div v-if="source" class="source-container">
                <span class="close" @click="source = null"> X </span>
                <reference :source="source" />
              </div>
            </transition>
          </div>
        </article>
        <aside class="side-bar col-lg-4" :class="{ open: graphOpen }">
          <graph
            v-if="graphOpen || width >= 960"
            :nodes="[...linkedArticles, article]"
            :links="links"
            :settings="settings"
          />
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    articleUuid: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      settings: {
        selector: `a${this.articleUuid}-${this.index}`,
        nodes: {
          width: 300,
          height: 300,
          active: this.articleUuid,
        },
        strength: 0.3,
        charge: -0.1,
        collide: 100,
        freedom: 1000,
      },
      localSources: [],
      source: null,
      sizes: [
        {
          width: '300w',
          size: '300',
        },
        {
          width: '600w',
          size: '600',
        },
        {
          width: '900w',
          size: '900',
        },
      ],
      graphOpen: false,
      width: 0,
    }
  },
  computed: {
    body() {
      const regex = /<img src="(?<src>[\w\W]+?)"(?:.+)class="(?<classes>[\w\W]+?)"(?:\/?)>/g
      if (this.article.content.body) {
        let body = this.$md.render(this.article.content.body)
        const links = body.match(regex)
        if (links) {
          links.forEach((link) => {
            const groups = regex.exec(link)
            if (groups) {
              const { src, classes } = groups.groups
              const srcSet = this.createSrcSet(src)
              const newImg = `<div class="loading image"><img src=${this.resizeUrl(
                src,
                '900'
              )} data-src=${this.resizeUrl(
                src,
                '900'
              )} data-srcset="${srcSet}" data-sizes="auto" class="lazyload ${classes}" /></div>`
              body = body.replace(link, newImg)
            }
          })
        }
        return body
      }
      return ''
    },
    linkedArticles() {
      if (this.article.content.linked) {
        return this.$store.getters.getLinkedArticles(
          this.article.content.linked
        )
      }
      return null
    },
    links() {
      return this.linkedArticles.map((article) => {
        return {
          source: this.article,
          target: article,
        }
      })
    },
    styles() {
      return {
        top: `calc(58% - 1rem * ${this.total - this.index})`,
        left: `calc(50% + 5px * ${this.total - this.index})`,
      }
    },
    article() {
      return this.articles.find((article) => article.uuid === this.articleUuid)
    },
    ...mapState(['articles', 'sources']),
  },
  mounted() {
    this.width = window.innerWidth
    this.localSources = this.$refs[`md-${this.article.uuid}-${this.index}`].querySelectorAll('.source') //eslint-disable-line
    this.sidenotes = this.$refs[`md-${this.article.uuid}-${this.index}`].querySelectorAll('.sidenote') //eslint-disable-line
    this.localSources.forEach((source) => {
      source.addEventListener('click', this.handleQuote)
    })
    this.sidenotes.forEach((sidenote) => {
      sidenote.addEventListener('click', this.handleSidenote)
    })
    document.addEventListener(
      'lazyloaded',
      function (e) {
        e.target.parentNode.classList.add('image-loaded')
        e.target.parentNode.classList.remove('loading')
      },
      { passive: true }
    )
  },
  beforeDestroy() {
    this.localSources.forEach((source) => {
      source.removeEventListener('click', this.handleQuote)
    })
    this.sidenotes.forEach((sidenote) => {
      sidenote.removeEventListener('click', this.handleSidenote)
    })
    document.removeEventListener('lazyloaded', function (e) {
      e.target.parentNode.classList.add('image-loaded')
      e.target.parentNode.classList.remove('loading')
    })
  },
  methods: {
    removeArticle() {
      this.settings.open = false
      this.REMOVE_ACTIVE_ARTICLE(this.index)
    },
    removeNext() {
      this.settings.open = false
      this.REMOVE_NEXT_ARTILCES(this.index)
    },
    handleQuote(event) {
      event.preventDefault()
      const keys = [
        event.target.parentNode.querySelector('.author').innerHTML,
        event.target.parentNode.querySelector('.year').innerHTML,
      ]
      const filteredSources = this.sources.filter((source) => {
        const author = source.author ? source.author : source.title
        const year = source.year ? source.year : 'n.d.'
        return (
          keys[0]
            .replace(/ et al./, '')
            .split(', ')
            .some((name) =>
              author.toLowerCase().includes(name.toLowerCase())
            ) && year.includes(keys[1].replace(/[^\d]/g, ''))
        )
      })

      if (filteredSources.length === 1) {
        this.source = filteredSources[0]
      } else {
        const index = keys[1].replace(/[\d]/g, '').charCodeAt(0) - 97
        this.source = filteredSources[index]
      }
    },
    handleSidenote(event) {
      event.target.parentNode.classList.toggle('active')
    },
    createSrcSet(link) {
      const list = this.sizes.map((size) => {
        return `${this.resizeUrl(link, size.size)} ${size.width}`
      })
      return list.join(', ')
    },
    resizeUrl(link, size) {
      return `//img2.storyblok.com/${size}x0/${link.replace(
        '//a.storyblok.com',
        ''
      )}`
    },
    toggleOpen() {
      this.graphOpen = !this.graphOpen
    },
    ...mapMutations(['REMOVE_ACTIVE_ARTICLE', 'REMOVE_NEXT_ARTILCES']),
  },
}
</script>

<style lang="scss" scoped>
.article {
  counter-reset: sidenote;
  width: 90%;
  height: 80%;
  position: fixed;
  transform: translate(-50%, -50%);
  background: $white;
  font-family: $font-serif;
  overflow: hidden;
  box-shadow: 2px 0 7px 1px rgba($color-text-primary, 0.1);

  -webkit-filter: blur(0);

  &:not(:last-of-type) {
    &:hover {
      transform: translate(-50%, calc(-50% - 0.75rem));
      cursor: pointer;
    }

    @include media-up($bp-lg) {
      ::-webkit-scrollbar {
        width: 0;
      }
    }
  }

  .header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    display: flex;
    z-index: 0;
    background: $white;

    .bar {
      flex-grow: 1;
      padding: 0.25rem 1rem;
    }

    .close {
      padding: 0.25rem 0.5rem;
      z-index: 5;

      &:hover {
        cursor: pointer;
      }
    }
    .trigger {
      display: block;
      padding: 0.25rem 1rem 0;
      text-align: center;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 100%;
      }

      @include media-up($bp-lg) {
        display: none;
      }
    }
  }

  .scroll {
    overflow-y: auto;
    width: 100%;
  }

  .content {
    margin: calc(25px + 0.75rem) 0;
    height: calc(100% - 25px - 0.75rem);
    position: relative;

    .side-bar {
      position: fixed;
      width: calc(100% - 12px);
      height: 50%;

      right: 12px;
      padding-top: 2rem;

      @include media-down($bp-lg) {
        max-height: 0;
        padding: 0;
        right: 0;
        padding-top: 1.5rem;
        width: 100%;

        &::before {
          display: block;
          position: absolute;
          content: '';
          width: calc(100% + 2px);
          height: 0;
          left: 0;
          top: -5px;
          right: -2px;
          max-height: 0%;
          background: $white;
          transition: all 0.2s;
          z-index: -1;
        }
        &.open {
          max-height: 100%;
          height: calc(100% - (25px + 0.75rem));

          &::before {
            max-height: 200%;
            height: calc(100% + 5px);
          }
        }
      }
    }

    .heading-1 {
      line-height: 1;
      margin-bottom: 0.5em;
    }

    .body {
      position: relative;
    }

    .source-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      box-sizing: border-box;
      background: $white;
      padding: 1.5rem 1rem;
      box-shadow: 2px 0 7px 1px rgba($color-text-primary, 0.1);
      z-index: 5;

      -webkit-filter: blur(0);

      .close {
        position: fixed;
        top: 0;
        right: 0;
        width: 1.5rem;
        height: 1.5rem;
        box-sizing: border-box;
        text-align: center;
        padding-top: 0.25rem;
        display: block;
        &:hover {
          cursor: pointer;
        }
      }
      .source {
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
