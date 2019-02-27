<template>
  <section class="image-index">
    <div class="image-index__head">
      <span class="image-index__bar">
        /Index
      </span>
      <span class="image-index__close" @click="SET_IMAGE_INDEX(false)">
        X
      </span>
    </div>
    <div class="image-index__content row">
      <div v-for="(image, index) in images" :key="image.uuid + index" class="col-lg-4 images">
        <img :src="image.image" class="images__image" :class="image.class ? image.class.replace('.', '') : ''" :alt="image.caption" @click="handleImageClick(image.uuid)">
        <p class="images__caption caption">
          {{ image.caption }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['images'])
  },
  methods: {
    handleImageClick(uuid) {
      this.SET_ACTIVE_ARTICLES(uuid)
      this.SET_IMAGE_INDEX(false)
    },
    ...mapMutations(['SET_ACTIVE_ARTICLES', 'SET_IMAGE_INDEX'])
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
  overflow: hidden;

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
  // justify-content: space-between;

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
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
