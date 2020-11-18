<template>
  <span v-editable="data" class="publisher">
    {{ data.publisher }}
  </span>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped>
.publisher {
  margin: 0;
}
</style>
