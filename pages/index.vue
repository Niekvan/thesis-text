<template>
  <main v-if="story" class="wrapper row" :class="opacityClass">
    <section v-editable="story.content" class="section section__legend col-lg-12">
      <div class="titles">
        <h1 class="heading-1 title">
          {{ story.content.title }}
        </h1>
        <h2 class="heading-2 sub_title">
          {{ story.content.sub_title }}
        </h2>
      </div>
      <graph :nodes="selectedArticles.reverse()" :links="links" :settings="settings" />
      <div class="indexes">
        <h3 class="indexes__images indexes__text" @click="clickSources('images')">
          Images
        </h3>
        <h3 class="indexes__sources indexes__text" @click="clickSources('references')">
          References
        </h3>
        <h3 class="indexes__credits indexes__text" @click="clickSources('credits')">
          Credits
        </h3>
      </div>
    </section>
    <article-frame
      v-for="(article,index) in activeArticles"
      :key="`${article.uuid}-${index}-active`"
      :article-uuid="article"
      :index="index"
      :total="activeArticles.length"
    />
    <source-list v-if="referenceOpen" />
    <image-index v-if="imagesOpen" />
    <credits v-if="creditsOpen" />
    <transition name="fade">
      <i-consent v-if="consentOpen" />
    </transition>
    <div class="mobile-check">
      <h1 class="heading-2 mobile-check__text">
        Please rotate to portrait mode or visit the site on a computer
      </h1>
    </div>
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import storyblokPreview from '@/mixins/storyblokPreview'
import helpers from '@/mixins/helpers'

export default {
  mixins: [storyblokPreview, helpers],
  data() {
    return {
      settings: {
        selector: 'index-graph',
        nodes: {
          width: 200
        },
        strength: 0.1,
        charge: 0,
        collide: 100,
        offset: 50,
        freedom: 200
      },
      story: null
    }
  },
  computed: {
    selectedArticles() {
      return this.articles
        .filter(article => this.story.content.articles.includes(article.uuid))
        .map(article => {
          if (article.name === 'introduction') {
            article.primary = true
          }
          return article
        })
    },
    links() {
      const connections = []
      const links = this.selectedArticles
        .filter(article => article.content.linked)
        .map(article => {
          const links = []
          article.content.linked.forEach(link => {
            if (!connections.includes(`${link}-to-${article.uuid}`)) {
              connections.push(`${article.uuid}-to-${link}`)
              links.push({
                source: article.uuid,
                target: link,
                name: `${article.uuid}-to-${link}`
              })
            }
          })
          return links
        })
      return this.flatten(links)
    },
    colophoneBody() {
      return this.$md.render(this.colophone.content.body)
    },
    opacityClass() {
      return this.activeArticles.length ? 'opaque' : ''
    },
    ...mapState([
      'articles',
      'sources',
      'geo',
      'activeArticles',
      'referenceOpen',
      'imagesOpen',
      'consentOpen',
      'creditsOpen'
    ])
  },
  async asyncData(context) {
    const version =
      context.query._storyblok || context.isDev ? 'draft' : 'published'
    const { data: story } = await context.app.$storyapi.get(
      `cdn/stories/home`,
      {
        version: version
      }
    )
    return story
  },
  methods: {
    clickSources(ref) {
      switch (ref) {
        case 'images':
          this.SET_IMAGE_INDEX(true)
          this.SET_REFERENCE(false)
          this.SET_CREDITS_OPEN(false)
          break
        case 'references':
          this.SET_IMAGE_INDEX(false)
          this.SET_REFERENCE(true)
          this.SET_CREDITS_OPEN(false)
          break
        case 'credits':
          this.SET_IMAGE_INDEX(false)
          this.SET_REFERENCE(false)
          this.SET_CREDITS_OPEN(true)
          break
      }
    },
    ...mapMutations(['SET_REFERENCE', 'SET_IMAGE_INDEX', 'SET_CREDITS_OPEN'])
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  height: 100%;

  .section {
    height: 100%;
  }
}

.titles {
  position: fixed;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  letter-spacing: -1px;
}

.title {
  font-size: 4rem;
  font-weight: 400;
  margin: 0;
  line-height: 1;
}

.sub_title {
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
}

.indexes {
  position: fixed;
  bottom: 0;
  right: 0;
  font-weight: 400;
  font-size: 1rem;
  letter-spacing: -1px;
  z-index: 10;
  display: flex;

  &__text {
    margin: 0;
    padding-right: 0.5em;
  }

  &:hover {
    cursor: pointer;
  }
}

@include media-down($bp-lg) {
  .titles,
  .indexes {
    position: relative;
  }

  .indexes {
    bottom: 0.5rem;
    z-index: 0;
  }
  .section {
    display: flex;
    flex-direction: column;
  }
}
.mobile-check {
  display: none;
}

@media only screen and (orientation: landscape) and (max-height: 500px) {
  .mobile-check {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    background: $color-text-primary;
    color: $color-text-inverse;
    display: flex;
    justify-content: center;
    align-items: center;

    &__text {
      padding: 0 1em;
      text-align: center;
    }
  }
}
</style>
