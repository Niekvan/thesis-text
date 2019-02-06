<template>
  <main class="wrapper row"> 
    <section v-editable="story.content" class="section section__legend col-lg-12">
      <h1 class="heading-1 title">
        {{ story.content.title }}
      </h1>
      <graph :nodes="selectedArticles" :links="links" :settings="settings" />
    </section>
    <!-- <section 
      v-if="story.content" 
      class="section section__content col-lg-4"
    >
      <div v-editable="story.content">
        <h1 class="title heading-1">
          {{ story.content.title }}
        </h1>
        <div 
          v-for="article in selectedArticles"
          :key="article.uuid"
          class="body"
        >
          <nuxt-link :to="`/${article.full_slug}`">
            {{ article.name }}
          </nuxt-link>
        </div>
      </div>
    </section> -->
  </main>
</template>

<script>
import { mapState } from 'vuex'
import storyblokPreview from '@/mixins/storyblokPreview'
import helpers from '@/mixins/helpers'

export default {
  // middleware: 'detectIP',
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
    ...mapState(['articles', 'sources'])
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
  font-size: 4rem;
  margin: 0;
  font-family: ff-more-web-pro, serif;
}
/* .links {
  padding-top: 15px;
}
.sources {
  padding: 0;
} */
</style>
