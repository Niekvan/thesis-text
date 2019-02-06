<template>
  <g class="node">
    <text>{{ node.slug }}</text>
  </g>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped>
</style>
