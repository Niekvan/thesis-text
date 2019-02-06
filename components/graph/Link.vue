<template>
  <path class="link" />
</template>

<script>
export default {
  props: {
    link: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.link {
  fill: none;
  stroke-width: 2;
  stroke-opacity: 0;
  stroke: $color-text-primary;
}
</style>
