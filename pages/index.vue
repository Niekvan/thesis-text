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
    <transition name="fade">
      <i-consent v-if="consentOpen" />
    </transition>
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
        strength: 1,
        charge: -50,
        collide: 150,
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
      'consentOpen'
    ])
  },
  // async mounted() {
  //   await this.formatSources()
  // },
  async asyncData(context) {
    // const version =
    //   context.query._storyblok || context.isDev ? 'draft' : 'published'
    const { data: story } = await context.app.$storyapi.get(
      `cdn/stories/home`,
      {
        version: 'draft'
      }
    )
    return story
  },
  methods: {
    // async formatSources() {
    //   const StoryblokClient = require('storyblok-js-client')
    //   const Storyblok = new StoryblokClient({
    //     oauthToken: 'okhpYrRocrS5X8sUrpWwxQtt-41094-PYBv5iyG6Z5Sz3BD5Lro'
    //   })
    //   const sources = require('@/assets/Thesis-new.json')
    //   const formatted = sources.map(source => {
    //     const title = source.title
    //     const year = source.issued
    //       ? this.$moment(source.issued['date-parts'][0].join('-'), [
    //           'YYYY-MM-DD',
    //           'YYYY'
    //         ]).format('YYYY-MM-DD 00:00')
    //       : null
    //     const accessed = source.accessed
    //       ? this.$moment(
    //           source.accessed['date-parts'][0].join('-'),
    //           'YYYY-MM-DD'
    //         ).format('YYYY-MM-DD 00:00')
    //       : null
    //     const author = source.author
    //       ? source.type === 'motion_picture'
    //         ? source.author.map(author => author.literal).length > 1
    //           ? `${source.author
    //               .map(author => author.literal)
    //               .slice(0, -1)
    //               .join(', ')}, and ${source.author
    //               .map(author => author.literal)
    //               .slice(-1)}`
    //           : source.author.map(author => author.literal).join(', ')
    //         : source.author.map(author => {
    //             return author.given
    //               ? `${author.family}, ${author.given
    //                   .match(/\b(\w)/g)
    //                   .join('. ')}.`
    //               : author.family
    //           }).length > 1
    //           ? `${source.author
    //               .map(author => {
    //                 return author.given
    //                   ? `${author.family}, ${author.given
    //                       .match(/\b(\w)/g)
    //                       .join('. ')}.`
    //                   : author.family
    //               })
    //               .slice(0, -1)
    //               .join(', ')}, and ${source.author
    //               .map(author => {
    //                 return author.given
    //                   ? `${author.family}, ${author.given
    //                       .match(/\b(\w)/g)
    //                       .join('. ')}.`
    //                   : author.family
    //               })
    //               .slice(-1)}`
    //           : source.author
    //               .map(author => {
    //                 return author.given
    //                   ? `${author.family}, ${author.given
    //                       .match(/\b(\w)/g)
    //                       .join('. ')}.`
    //                   : author.family
    //               })
    //               .join(', ')
    //       : null
    //     const location = source.URL
    //       ? [
    //           {
    //             component: 'website',
    //             accessed_at: accessed,
    //             link: {
    //               url: source.URL,
    //               linktype: 'url',
    //               fieldtype: 'multilink',
    //               cached_url: source.URL
    //             }
    //           }
    //         ]
    //       : [
    //           {
    //             component: 'publisher',
    //             publisher: `${source['publisher-place']}: ${source.publisher}.`
    //           }
    //         ]
    //     return {
    //       author,
    //       year,
    //       title,
    //       location,
    //       component: 'source'
    //     }
    //   })
    //   const story = {
    //     story: {
    //       content: {
    //         sources: formatted,
    //         component: 'source_page'
    //       }
    //     }
    //   }
    //   const check = await Storyblok.put('spaces/52847/stories/551910', story)
    //   console.log(check) //eslint-disable-line
    // },
    clickSources(ref) {
      switch (ref) {
        case 'images':
          this.SET_IMAGE_INDEX(true)
          this.SET_REFERENCE(false)
          break
        case 'references':
          this.SET_IMAGE_INDEX(false)
          this.SET_REFERENCE(true)
          break
      }
    },
    ...mapMutations(['SET_REFERENCE', 'SET_IMAGE_INDEX'])
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
  font-size: 1.5rem;
  letter-spacing: -1px;
  z-index: 10;

  &__text {
    display: inline-block;
    margin: 0.3em 0.5em;
    margin-left: 0;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
