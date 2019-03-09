<template>
  <li
    v-editable="source"
    class="source"
  >
    <span class="author">
      {{ author }}
    </span>
    <span class="year">
      ({{ year }}).
    </span>
    <span v-if="source.author && source.title" class="name">
      {{ source.title }}.
    </span>
    <component
      :is="source.location[0].component"
      :data="source.location[0]"
    />
  </li>
</template>

<script>
import Website from './Website.vue'
import Publisher from './Publisher.vue'
export default {
  components: {
    Website,
    Publisher
  },
  props: {
    source: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    year() {
      return this.source.year
        ? this.$moment(this.source.year).month() !== 0 &&
          this.$moment(this.source.year).day() !== 0
          ? this.$moment(this.source.year).format('YYYY, MMMM D')
          : this.$moment(this.source.year).format('YYYY')
        : 'n.d.'
    },
    author() {
      return this.source.author ? this.source.author : this.source.title
    }
  }
}
</script>

<style lang="scss" scoped>
.source {
  display: block;
  margin-bottom: 0.5em;
  list-style-type: none;
  font-style: normal;
  font-size: 1em;

  &:hover {
    color: inherit;
  }

  .name {
    font-style: italic;
  }
}
span {
  margin: 0;
}
</style>
