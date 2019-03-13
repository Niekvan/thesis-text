<template>
  <g class="node" :class="node.slug" @click="showArticle(node.uuid)">
    <!-- <svg :width="settings.width" :height="settings.height" viewBox="0 0 170 170" class="node__item">
      <path class="node__drag" d="M85,85m-85,0a85,85 0 1,0 170,0a85,85 0 1,0 -170,0" />
      <path class="node__icon" :d="path" />
    </svg> -->
    <no-ssr>
      <rect
        v-if="BBox"
        :x="BBox.x - padding.left / 2"
        :y="BBox.y - padding.top / 2"
        :width="BBox.width + padding.left"
        :height="BBox.height +padding.top"
        class="node__background"
      />
    </no-ssr>
    <text class="node__text body" :class="{ active: settings.active === node.uuid }" :style="{ opacity: readArticles.includes(node.uuid) ? 1 : 0.2 }" alignment-baseline="middle">
      {{ node.slug }}
    </text>
  </g>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { select } from 'd3-selection'
export default {
  props: {
    node: {
      type: Object,
      default() {
        return {}
      }
    },
    settings: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      padding: {
        top: 10,
        left: 20
      }
    }
  },
  computed: {
    path() {
      let path = ''
      switch (this.node.slug) {
        case 'introduction':
          path = 'M85,85m-75,0a75,75 0 1,0 150,0a75,75 0 1,0 -150,0'
          break
        case 'history':
          path = 'M97.5,10l-75,75l75,75'
          break
        case 'information':
          path = 'M10, 10l150,0l-75,125l-75-125'
          break
        case 'privacy':
          path = 'M10,10l150,0l0,150l-150,0l0-150'
          break
        case 'process':
          path = 'M85,10l-75,75l75,75l75,-75l-76,-75m1,4l0,142'
          break
        case 'conclusion':
          path = ''
          break
        case 'design':
          break
      }
      return path
    },
    BBox() {
      if (process.browser && select('.node').node()) {
        return select(`.node.${this.node.slug}`)
          .node()
          .getBBox()
      }
      return null
    },
    ...mapState(['readArticles'])
  },
  methods: {
    showArticle(uuid) {
      if (this.settings.active === this.node.uuid) {
        return
      }
      this.SET_ACTIVE_ARTICLES(uuid)
      this.SET_READ_ARTICLES(uuid)
    },
    ...mapMutations(['SET_ACTIVE_ARTICLES', 'SET_READ_ARTICLES'])
  }
}
</script>

<style scoped lang="scss">
.node {
  &:hover {
    cursor: pointer;
  }

  &__background {
    fill: #ffffff;
  }

  &__text {
    font-family: $font-serif;
    text-anchor: middle;
    font-size: 1rem;
    text-transform: capitalize;

    &.active {
      // text-decoration: underline;
      fill: $color-text-red;
    }
  }
}
</style>
