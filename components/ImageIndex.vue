<template>
  <section class="image-index">
    <div class="image-index__head">
      <span class="image-index__bar">
        /Images
      </span>
      <span class="image-index__close" @click="SET_IMAGE_INDEX(false)">
        X
      </span>
    </div>
    <div class="image-index__content row">
      <div v-for="(image, index) in images" :key="image.uuid + index" class="col-lg-4 images" @click="handleImageClick(image.uuid)">
        <image-resized :image="image" />
        <p class="images__caption caption">
          {{ image.caption }}
        </p>
      </div>
      <div class="col-12">
        <div class="line-width references">
          <h2 class="heading-2">
            Image References
          </h2>
          <ul class="references__list">
            <reference v-for="source in image_sources" :key="source.uuid" class="references__item" :source="source" />
          </ul>
        </div>
      </div>
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
    ...mapMutations([
      'SET_ACTIVE_ARTICLES',
      'SET_IMAGE_INDEX',
      'SET_READ_ARTICLES'
    ])
  }
}
</script>

<style lang="scss" scoped>
.image-index {
  position: fixed;
  width: 90%;
  height: 95%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;

  background: $white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  &__head {
    box-sizing: border-box;
    display: flex;
    z-index: 0;
    background: $white;
  }

  &__bar {
    flex-grow: 1;
    padding: 0.25rem 1rem;
  }

  &__close {
    padding: 0.25rem 0.5rem;

    &:hover {
      cursor: pointer;
    }
  }

  &__content {
    overflow-y: auto;
    height: calc(100% - 2rem);
  }
}
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
