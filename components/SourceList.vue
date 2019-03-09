<template>
  <section class="references">
    <div class="references__head">
      <span class="references__bar">
        /References
      </span>
      <span class="references__close" @click="SET_REFERENCE(false)">
        X
      </span>
    </div>
    <div class="references__scroll">
      <!-- <h2 class="heading-2">
        Textual sources
      </h2> -->
      <ul class="references__list line-width">
        <reference v-for="source in sources" :key="source.uuid" class="references__item" :source="source" />
      </ul>
      <!-- <h2 class="heading-2">
        Visual sources
      </h2> -->
    </div>
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

  &__scroll {
    height: calc(100% - 2rem);
    width: 100%;
    box-sizing: border-box;
    padding-left: 1.5rem;
    overflow-y: auto;
  }

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
