<template>
  <section v-editable="article.content" class="article" :style="styles">
    <div class="header" @click="removeNext">
      <span class="bar">
        /{{ article.content.title }}
      </span>
      <span class="close" @click="removeArticle">
        X
      </span>
    </div>
    <div class="content row scroll">
      <article class="col-lg-8">
        <div class="line-width">
          <h1 class="heading-1">
            {{ article.content.title }}
          </h1>
          <div :ref="`md-${article.uuid}-${index}`" class="body" v-html="body" />
          <transition name="fade">
            <div v-if="source" class="source-container">
              <span class="close" @click="source=null">
                X
              </span>
              <reference :source="source" />
            </div>
          </transition>
        </div>
      </article>
      <aside class="side-bar col-lg-4">
        <graph :nodes="[...linkedArticles, article]" :links="links" :settings="settings" />
      </aside>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    articleUuid: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      settings: {
        selector: `a${this.articleUuid}-${this.index}`,
        nodes: {
          width: 300,
          height: 300,
          scale: 2.5,
          active: this.articleUuid
        }
      },
      localSources: [],
      source: null
    }
  },
  computed: {
    body() {
      if (this.article.content.body)
        return this.$md.render(this.article.content.body)
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
      return this.linkedArticles.map(article => {
        return {
          source: this.article,
          target: article
        }
      })
    },
    styles() {
      return {
        top: `calc(58% - 1rem * ${this.total - this.index})`,
        left: `calc(50% + 5px * ${this.total - this.index})`
      }
    },
    article() {
      return this.articles.find(article => article.uuid === this.articleUuid)
    },
    ...mapState(['articles', 'sources'])
  },
  mounted() {
    this.localSources = this.$refs[`md-${this.article.uuid}-${this.index}`].querySelectorAll('.source') //eslint-disable-line
    this.localSources.forEach(source => {
      source.addEventListener('click', this.handleQuote)
    })
  },
  beforeDestroy() {
    this.localSources.forEach(source => {
      source.removeEventListener('click', this.handleQuote)
    })
  },
  methods: {
    removeArticle() {
      this.REMOVE_ACTIVE_ARTICLE(this.index)
    },
    removeNext() {
      this.REMOVE_NEXT_ARTILCES(this.index)
    },
    handleQuote(event) {
      event.preventDefault()
      const keys = [
        event.target.parentNode.querySelector('.author').innerHTML,
        event.target.parentNode.querySelector('.year').innerHTML
      ]
      console.log(keys) //eslint-disable-line
      const filteredSources = this.sources.filter(source => {
        const author = source.author ? source.author : source.title
        const year = source.year ? source.year : 'n.d.'
        return (
          keys[0].split(', ').some(name => author.includes(name)) &&
          year.includes(keys[1].replace(/[^\d]/g, ''))
        )
      })

      if (filteredSources.length === 1) {
        this.source = filteredSources[0]
      } else {
        const index = keys[1].replace(/[\d]/g, '').charCodeAt(0) - 97
        this.source = filteredSources[index]
      }
    },
    ...mapMutations(['REMOVE_ACTIVE_ARTICLE', 'REMOVE_NEXT_ARTILCES'])
  }
}
</script>

<style lang="scss" scoped>
.article {
  width: 90%;
  height: 80%;
  position: fixed;
  transform: translate(-50%, -50%);
  border: 2px solid $color-text-primary;
  background: $white;
  font-family: $font-serif;
  overflow: hidden;

  &:not(:last-child):hover {
    transform: translate(-50%, calc(-50% - 0.75rem));
    cursor: pointer;
  }

  .header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    display: flex;
    border-bottom: 2px solid $color-text-primary;

    .bar {
      background: $color-text-green;
      flex-grow: 1;
      padding: 0.25rem 1rem;
    }

    .close {
      background: $color-text-red;
      padding: 0.25rem 0.5rem;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .scroll {
    // height: calc(100% - 25px - 1rem);
    overflow-y: auto;
    width: 100%;
  }

  .content {
    margin: calc(25px + 0.75rem) 0;
    height: calc(100% - 25px - 0.75rem);

    .side-bar {
      position: fixed;
      width: 100%;

      right: 0;
      padding-top: 2rem;
    }

    .heading-1 {
      font-size: 4em;
      font-weight: 600;
      line-height: 1;
    }

    .source-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      box-sizing: border-box;
      background: $white;
      padding: 1.5rem 1rem;
      border: 1px solid $color-text-primary;
      z-index: 5;

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
        border-left: 1px solid $color-text-primary;
        border-bottom: 1px solid $color-text-primary;
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
