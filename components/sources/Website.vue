<template>
  <span
    v-if="date"
    v-editable="data"
    class="website"
  >
    Retrieved {{ date }}, from
    <a
      v-editable="data.link"
      :href="link"
      class="link"
      target="_blank"
      rel="noreferrer"
    >
      {{ link }}
    </a>
  </span>
  <span
    v-else
    v-editable="data"
    class="website"
  >
    Retrieved from
    <a
      v-editable="data.link"
      :href="link"
      class="link"
      target="_blank"
      rel="noreferrer"
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
      if (this.data.accessed_at) {
        return this.$moment(this.data.accessed_at).format('MMMM D, YYYY')
      }
      return false
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
    color: $color-text-red;
    text-decoration: none;
    word-wrap: break-word;
    transition: all 0.2s;
    border-bottom: 0px;

    &:hover {
      transition: all 0.2s;
      border-bottom: 2px solid $color-text-red;
    }
  }
}
</style>
