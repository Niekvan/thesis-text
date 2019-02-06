<template>
  <line class="link" />
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
  stroke-width: 0.75px;
  stroke-opacity: 0.5;
  stroke: $color-text-primary;
}
</style>
