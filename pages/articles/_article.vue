<template>
  <div v-editable="story.content" class="row">
    <!-- <div class="col-lg-2">
      <h1>Navbar</h1>
    </div> -->
    <div class="col-lg-8">
      <article>
        <div 
          class="body"
          v-html="body"
        />
      </article>
    </div>
    <div class="col-lg-4">
      <h1 class="heading-1">
        Welcome
      </h1>
    </div>
  </div>
</template>

<script>
import storyblokPreview from '@/mixins/storyblokPreview'

export default {
  mixins: [storyblokPreview],
  computed: {
    body() {
      return this.$parser.render(this.story.content.body)
    }
  },
  async asyncData(context) {
    const version =
      context.query._storyblok || context.isDev ? 'draft' : 'published'
    const { data: story } = await context.app.$storyapi.get(
      `cdn/stories/articles/${context.params.article}`,
      {
        version: version
      }
    )
    return story
  }
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
}
</style>
