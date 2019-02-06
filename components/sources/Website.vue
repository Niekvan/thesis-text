<template>
  <span
    v-editable="data"
    class="website"
  >
    Retrieved {{ date }}, from 
    <a 
      v-editable="data.link"
      :href="link"
      class="link"
    >
      {{ link }}
    </a>
  </span>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    date() {
      return this.$moment(this.data.accessed_at).format('MMMM D, YYYY')
    },
    link() {
      return this.data.link.url
    }
  }
}
</script>

<style scoped lang="scss">
.website {
  margin: 0;
  .link {
    display: inline;
  }
}
</style>
