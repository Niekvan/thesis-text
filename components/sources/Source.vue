<template>
  <li 
    v-editable="source"
    class="source"
  > 
    <span>
      {{ source.author }}
    </span>
    <span>
      ({{ year }}).
    </span>
    <span>
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
      return this.source.location[0].component === 'website'
        ? this.$moment(this.source.year).format('YYYY, MMMM D')
        : this.source.year
    }
  }
}
</script>

<style scoped>
.source {
  margin-bottom: 0.5em;
  list-style-type: none;
}
span {
  margin: 0;
}
</style>
