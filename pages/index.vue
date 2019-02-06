<template>
  <section v-if="story.content" class="container">
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
    <ul class="sources body">
      <reference
        v-for="source in sources"
        :key="source.uuid"
        :source="source"
      />
    </ul>
    <p v-if="ip">
      {{ ip }}
    </p>
    <p v-if="middleware_ip">
      {{ middleware_ip }}
    </p>
    <div v-if="geoData">
      <p 
        v-for="item in geoData"
        :key="item[0]"
      >
        <span class="name">
          {{ item[0] }}: 
        </span>
        <span class="value">
          {{ item[1] }}
        </span>
      </p>
    </div>
    <graph :nodes="selectedArticles" :links="links" :settings="settings" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import storyblokPreview from '@/mixins/storyblokPreview'
import helpers from '@/mixins/helpers'

export default {
  middleware: 'detectIP',
  mixins: [storyblokPreview, helpers],
  data() {
    return {
      settings: {
        selector: 'index-graph'
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
    geoData() {
      if (this.geo) {
        return Object.entries(this.geo)
      }
      return null
    },
    ...mapState(['articles', 'sources', 'ip', 'middleware_ip', 'geo'])
  },
  mounted() {
    this.$store.dispatch('setGEO')
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

<style>
.links {
  padding-top: 15px;
}
.sources {
  padding: 0;
}
</style>
