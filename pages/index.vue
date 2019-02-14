<template>
  <main v-if="story" class="wrapper row">
    <section v-editable="story.content" class="section section__legend col-lg-12">
      <h1 class="heading-1 title">
        {{ story.content.title }}
      </h1>
      <graph :nodes="selectedArticles.reverse()" :links="links" :settings="settings" />
      <h2 class="heading-2 reference-trigger" @click="SET_REFERENCE(true)">
        References
      </h2>
    </section>
    <article-frame
      v-for="(article,index) in activeArticles"
      :key="`${article.uuid}-${index}-active`"
      :article-uuid="article"
      :index="index"
      :total="activeArticles.length"
    />
    <source-list v-if="referenceOpen" />
    <!-- <i-consent /> -->
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
        }
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
    ...mapState([
      'articles',
      'sources',
      'geo',
      'activeArticles',
      'referenceOpen'
    ])
  },
  mounted() {
    // await this.formatSources()
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
    //         ? source.author.map(author => author.literal).join(', &')
    //         : source.author
    //             .map(author => {
    //               return author.given
    //                 ? `${author.family}, ${author.given
    //                     .match(/\b(\w)/g)
    //                     .join('. ')}.`
    //                 : author.family
    //             })
    //             .join(', & ')
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
    //       year,
    //       title,
    //       author,
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
    //   const { story: check } = await Storyblok.put(
    //     'spaces/52847/stories/551910',
    //     story
    //   )
    //   console.log(check) //eslint-disable-line
    // },
    ...mapMutations(['SET_REFERENCE'])
  },
  async asyncData(context) {
    const version =
      context.query._storyblok || context.isDev ? 'draft' : 'published'
    const { data: story } = await context.app.$storyapi.get(
      'cdn/stories/home',
      {
        version: version
      }
    )
    return { story: story.story }
  }
}
</script>

<style scoped lang="scss">
.title {
  position: fixed;
  font-weight: 400;
  font-size: 2.5rem;
  margin: 0.3em 0.2em;
  font-family: $font-sans;
  letter-spacing: -1px;
}

.reference-trigger {
  position: fixed;
  bottom: 0;
  right: 0;
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0.3em 0.5em;
  font-family: $font-sans;
  letter-spacing: -1px;

  &:hover {
    cursor: pointer;
  }
}
</style>
