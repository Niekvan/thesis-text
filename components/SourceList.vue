<template>
  <section class="frame">
    <div class="frame__head">
      <span class="frame__bar">
        /References
      </span>
      <span class="frame__close" @click="SET_REFERENCE(false)">
        X
      </span>
    </div>
    <div class="frame__content">
      <h2 class="heading-2">
        Textual references
      </h2>
      <ul class="references__list line-width">
        <reference v-for="source in sources" :key="source.uuid" class="references__item" :source="source" />
      </ul>
      <h2 class="heading-2">
        Image references
      </h2>
      <ul class="references__list line-width">
        <reference v-for="source in image_sources" :key="source.uuid" class="references__item" :source="source" />
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['sources', 'image_sources'])
  },
  methods: {
    ...mapMutations(['SET_REFERENCE'])
  }
}
</script>

<style lang="scss" scoped>
.frame__content {
  padding: 0 0.5rem;

  .heading-2:not(:first-child) {
    margin-top: 1.25em;
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
