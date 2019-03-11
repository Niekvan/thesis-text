<template>
  <section class="frame">
    <div class="frame__head">
      <span class="frame__bar">
        /Images
      </span>
      <span class="frame__close" @click="SET_IMAGE_INDEX(false)">
        X
      </span>
    </div>
    <div class="frame__content row">
      <div v-for="(image, index) in images" :key="image.uuid + index" class="col-lg-4 images" @click="handleImageClick(image.uuid)">
        <image-resized :image="image" />
        <p class="images__caption caption">
          {{ image.caption }}
        </p>
      </div>
      <!-- <div class="col-12">
        <div class="line-width references">
          <h2 class="heading-2">
            Image References
          </h2>
          <ul class="references__list">
            <reference v-for="source in image_sources" :key="source.uuid" class="references__item" :source="source" />
          </ul>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ImageResized from './ImageResized.vue'
export default {
  components: {
    'image-resized': ImageResized
  },
  computed: {
    ...mapState(['images', 'image_sources'])
  },
  methods: {
    handleImageClick(uuid) {
      this.SET_READ_ARTICLES(uuid)
      this.SET_ACTIVE_ARTICLES(uuid)
      this.SET_IMAGE_INDEX(false)
    },
    getUnique(arr, comp) {
      const unique = arr
        .map(e => e[comp])
        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e])
        .map(e => arr[e])

      return unique
    },
    ...mapMutations([
      'SET_ACTIVE_ARTICLES',
      'SET_IMAGE_INDEX',
      'SET_READ_ARTICLES'
    ])
  }
}
</script>

<style lang="scss" scoped>
.images {
  display: flex;
  flex-direction: column;

  &__image {
    max-width: 100%;
    margin: 0;
    &.floridi {
      max-width: 75%;
      margin: auto;
    }
    &:hover {
      cursor: pointer;
    }
  }

  &__caption {
    padding: 0.5em 0 1em;
  }

  &:hover {
    cursor: pointer;
  }
}
.references {
  &__list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    padding-left: 1rem;
    text-indent: -1rem;

    &.source:hover {
      cursor: normal;
    }
  }
}
</style>
