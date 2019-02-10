<template>
  <div>
    <h1>Article</h1>
  </div>
</template>

<script>
export default {
  props: {
    article: {
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
