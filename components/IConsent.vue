<template>
  <div class="consent consent__wrapper">
    <main class="consent__content">
      <div class="consent__scroll">
        <div class="row">
          <section class="col-lg-8 consent__text">
            <h1 class="heading-1">
              {{ article.content.title }}
            </h1>
            <div class="consent__body line-width" v-html="body" />
          </section>
          <aside class="consent__button-wrapper col-lg-4">
            <button class="consent__button heading-1" @click="SET_CONSENT_OPEN(false)">
              I Consent
            </button>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    article() {
      return this.$store.getters.getAbstract()
    },
    body() {
      return this.$md.render(this.article.content.body)
    }
  },
  methods: {
    ...mapMutations(['SET_CONSENT_OPEN'])
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.consent {
  &__wrapper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba($color-text-primary, 0.9);
    z-index: 50;
  }

  &__content {
    display: block;
    position: fixed;
    width: 80%;
    height: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: $white;
  }

  &__scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
  }

  .heading-1 {
    margin-bottom: 0.5em;
  }

  .body {
    margin-top: 0;
  }

  &__button-wrapper {
    position: fixed;
    top: 50%;
    left: 66.68%;
    transform: translateY(-50%);

    margin: 0;

    @include media-down($bp-lg) {
      top: 0;
      left: 0;
      transform: translateY(0);
      position: relative;
      text-align: center;
      margin-bottom: 1em;
    }
  }

  &__button {
    border: none;
    background: none;
    max-width: 100%;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 0.1em;
      background: $color-text-primary;
    }

    @include media-down(1550px) {
      font-size: 2em;
    }

    @include media-down($bp-lg) {
      padding: 0.5em 1em;

      &::after {
        display: none;
      }
    }

    &:hover {
      cursor: help;
    }
  }
}
</style>
