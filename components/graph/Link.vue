<template>
  <path class="link" :style="{ strokeOpacity: readArticles.includes(link.source.uuid) && readArticles.includes(link.target.uuid) ? 1 : 0.05 }" />
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    link: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapState(['readArticles'])
  }
}
</script>

<style scoped lang="scss">
.link {
  fill: none;
  stroke-width: 1;
  stroke: $color-text-primary;
}
</style>
