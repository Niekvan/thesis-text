<template>
  <main class="wrapper row"> 
    <section v-editable="story.content" class="section section__legend col-lg-12">
      <h1 class="heading-1 title">
        {{ story.content.title }}
      </h1>
      <graph :nodes="selectedArticles.reverse()" :links="links" :settings="settings" />
    </section>
    <article-frame 
      v-for="(article,index) in activeArticles" 
      :key="`${article.uuid}-${index}-active`"
      :article-uuid="article"
      :index="index"
      :total="activeArticles.length"
    />
    <!-- <i-consent /> -->
  </main>
</template>

<script>
import { mapState } from 'vuex'
import storyblokPreview from '@/mixins/storyblokPreview'
import helpers from '@/mixins/helpers'

export default {
  mixins: [storyblokPreview, helpers],
  data() {
    return {
      settings: {
        selector: 'index-graph',
        nodes: {
          width: 200,
          height: 200
        }
      }
    }
  },
  computed: {
    selectedArticles() {
      return this.articles.filter(article =>
        this.story.content.articles.includes(article.uuid)
      )
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
    ...mapState(['articles', 'sources', 'geo', 'activeArticles'])
  },
  mounted() {
    // this.$store.dispatch('setGEO')
    // this.$ipCheck.get('/').then(res => {
    //   console.log(res.data) //eslint-disable-line
    // })
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
  font-weight: 500;
  font-size: 2.5rem;
  margin: 0.3em 0.2em;
  font-family: $font-sans;
}
</style>
