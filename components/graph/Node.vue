<template>
  <nuxt-link :to="node.full_slug">
    <g class="node">
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
      <text class="node__text body" alignment-baseline="middle">
        {{ node.slug }}
      </text>
    </g>
  </nuxt-link>
</template>

<script>
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
        return select('.node')
          .node()
          .getBBox()
      }
      return null
    }
  }
}
</script>

<style scoped lang="scss">
.node {
  &__item {
    opacity: 1;
  }

  // &__drag {
  //   fill: $color-text-inverse;
  //   opacity: 0;
  // }

  // &__icon {
  //   fill: none;
  //   stroke-width: 5;
  //   stroke: $color-text-primary;
  // }

  &__background {
    fill: $color-text-inverse;
  }

  &__text {
    text-anchor: middle;
    font-size: 1.25rem;
  }
}
</style>
