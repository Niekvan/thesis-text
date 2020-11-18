<template>
  <path class="link" :style="styles" />
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    link: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    styles() {
      return {
        strokeOpacity:
          this.readArticles.includes(this.link.source.uuid) ||
          this.readArticles.includes(this.link.target.uuid)
            ? 1
            : 0.05,
      }
    },
    ...mapState(['readArticles']),
  },
}
</script>

<style scoped lang="scss">
.link {
  fill: none;
  stroke-width: 1;
  stroke: $color-text-primary;
}
</style>
