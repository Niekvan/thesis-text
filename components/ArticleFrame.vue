<template>
  <section 
    v-editable="article"  
    class="article"
    :style="styles"
  >
    <div 
      class="header"
      @click="removeNext"  
    >
      <span class="bar">
        /{{ article.content.title }}
      </span>
      <span 
        class="close"
        @click="removeArticle"
      >
        X
      </span>
    </div>
    <div class="content row">
      <article class="scroll col-lg-8">
        <div class="line-width">
          <h1 
            class="heading-1"
          >
            {{ article.content.title }}
          </h1>
          <div class="body" v-html="body" />
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
          scale: 2.5
        }
      }
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
    ...mapState(['articles'])
  },
  methods: {
    removeArticle() {
      this.REMOVE_ACTIVE_ARTICLE(this.index)
    },
    removeNext() {
      this.REMOVE_NEXT_ARTILCES(this.index)
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

    // &:hover {
    //   transform: translateY(-0.75rem);
    //   border: 2px solid $color-text-primary;
    // }

    .bar {
      background: $color-text-green;
      flex-grow: 1;
      padding: 0.25rem 1rem;
    }

    .close {
      background: $color-text-red;
      // position: relative;
      padding: 0.25rem 0.5rem;

      &:hover {
        cursor: pointer;
      }
    }
  }
  .content {
    margin: calc(25px + 1rem) 0;
    height: 100%;

    .scroll {
      height: calc(100% - 25px - 1rem);
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .side-bar {
      padding-top: 2rem;
    }

    .heading-1 {
      font-size: 4em;
      font-weight: 600;
      line-height: 1;
    }
  }
}
</style>
