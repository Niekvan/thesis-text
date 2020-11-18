<template>
  <section v-editable="credits.content" class="frame">
    <div class="frame__head">
      <div class="frame__bar">/credits</div>
      <div class="frame__close" @click="SET_CREDITS_OPEN(false)">X</div>
    </div>
    <div class="frame__content credits">
      <div class="line-width" v-html="body" />
    </div>
  </section>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    body() {
      return this.$md.render(this.credits.content.body)
    },
    ...mapState(['credits']),
  },
  methods: {
    ...mapMutations(['SET_CREDITS_OPEN']),
  },
}
</script>

<style lang="scss" scoped>
.frame {
  &__content {
    padding: 0 0.5rem;
  }
}
</style>
