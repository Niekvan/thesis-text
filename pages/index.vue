<template>
  <section class="container">
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
  </section>
</template>

<script>
import { mapState } from 'vuex'
import storyblokPreview from '@/mixins/storyblokPreview'

export default {
  mixins: [storyblokPreview],
  computed: {
    selectedArticles() {
      return this.articles.filter(article =>
        this.story.content.articles.includes(article.uuid)
      )
    },
    ...mapState(['articles', 'sources'])
  },
  asyncData(context) {
    const version =
      context.query._storyblok || context.isDev ? 'draft' : 'published'
    return context.app.$storyapi
      .get('cdn/stories/home', {
        version: version
      })
      .then(res => {
        return res.data
      })
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
