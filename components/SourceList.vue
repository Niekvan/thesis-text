<template>
  <section class="references">
    <div class="references__head">
      <h1 class="heading-1">
        References
      </h1>
      <span class="references__close heading-1" @click="SET_REFERENCE(false)">
        X
      </span>
    </div>
    <simplebar class="references__scroll">
      <ul class="references__list line-width">
        <reference v-for="source in sources" :key="source.uuid" class="references__item" :source="source" />
      </ul>
    </simplebar>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['sources'])
  },
  methods: {
    ...mapMutations(['SET_REFERENCE'])
  }
}
</script>

<style lang="scss" scoped>
.references {
  position: fixed;
  width: 90%;
  height: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  overflow: hidden;

  background: $white;
  padding: 1rem 0;
  border: 2px solid $color-text-primary;

  &__head {
    position: relative;
    padding: 0 1.5rem;
    .heading-1 {
      margin: 0;
      margin-bottom: 0.5rem;
    }
  }

  &__close {
    position: absolute;
    right: 0.5rem;
    top: 0;

    &:hover {
      cursor: pointer;
    }
  }

  &__scroll {
    height: calc(100% - 5.5rem);
    width: 100%;
    box-sizing: border-box;
    padding-left: 1.5rem;
  }

  &__list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    padding-left: 1rem;
    text-indent: -1rem;
  }
}
</style>
