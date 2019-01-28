<template>
  <section class="container">
    <div v-editable="story.content">
      <h1 class="title">
        {{ story.content.title }}
      </h1>
      <div 
        v-for="article in selectedArticles"
        :key="article.uuid"
      >
        <nuxt-link :to="`/${article.full_slug}`">
          {{ article.name }}
        </nuxt-link>
      </div>
    </div>
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
    ...mapState(['articles'])
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
    // const links = await context.app.$storyapi.get('cdn/links', {
    //   version: version
    // })
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
