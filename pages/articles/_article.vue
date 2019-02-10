<template>
  <div v-editable="story.content" class="row">
    <!-- <div class="col-lg-2">
      <h1>Navbar</h1>
    </div> -->
    <div class="col-lg-8">
      <article>
        <h1 v-if="story.content.title" class="heading-1">
          {{ story.content.title }}
        </h1>
        <div 
          class="body"
          v-html="body"
        />
      </article>
    </div>
    <div class="col-lg-4">
      <graph :nodes="[...linkedArticles, story]" :links="links" :settings="settings" />
      <ul class="linked-articles linked-articles__list">
        <li class="linked-articles__item">
          <nuxt-link to="/" class="linked-articles__link">
            Index
          </nuxt-link>
        </li>
        <li 
          v-for="link in linkedArticles"
          :key="link.uuid"
          class="linked-articles__item"
        >
          <nuxt-link 
            :to="`/${link.full_slug}`"
            class="linked-articles__link"
          >
            {{ link.content.title }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import storyblokPreview from '@/mixins/storyblokPreview'

export default {
  mixins: [storyblokPreview],
  data() {
    return {
      settings: {
        selector: 'index-small',
        nodes: {
          width: 200,
          height: 200
        }
      }
    }
  },
  computed: {
    body() {
      if (this.story.content.body)
        return this.$md.render(this.story.content.body)
      return ''
    },
    linkedArticles() {
      if (this.story.content.linked) {
        return this.$store.getters.getLinkedArticles(this.story.content.linked)
      }
      return null
    },
    links() {
      return this.linkedArticles.map(article => {
        return {
          source: this.story,
          target: article
        }
      })
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
.linked-articles {
  font-family: $font-sans;

  &__list {
    list-style-type: none;
    padding: 0;
    // margin: 0;
  }
  &__item:not(:last-child) {
    margin-bottom: 0.5em;
  }

  &__link {
    color: $color-text-red;
    text-decoration: none;
  }
}
.body {
  position: relative;
}
</style>
