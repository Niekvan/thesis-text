<template>
  <div class="loading image__wrapper" :style="padding">
    <img
      class="image lazyload"
      :class="image.class ? image.class.replace('.', '') : ''"
      :data-src="image.link"
      :data-srcset="srcSet"
      data-sizes="auto"
      :alt="image.alt"
    />
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      default() {},
    },
  },
  data() {
    return {
      sizes: [
        {
          width: '300w',
          size: '300',
        },
        {
          width: '600w',
          size: '600',
        },
        {
          width: '900w',
          size: '900',
        },
      ],
      reg: /(?:^\/\/a\.storyblok\.com\/f\/[0-9]+\/)(?<width>[0-9]+)x(?<height>[0-9]+)/g,
    }
  },
  computed: {
    padding() {
      const { width, height } = this.reg.exec(this.image.image).groups
      return {
        paddingBottom: `${(height / width) * 100}% `,
      }
    },
    srcSet() {
      const list = this.sizes.map((size) => {
        return `${this.resizeUrl(this.image.image, size.size)} ${size.width}`
      })
      return list.join(', ')
    },
  },
  mounted() {
    document.addEventListener('lazyloaded', function (e) {
      e.target.parentNode.classList.add('image-loaded')
      e.target.parentNode.classList.remove('loading')
    })
  },
  beforeDestroy() {
    document.removeEventListener('lazyloaded', function (e) {
      e.target.parentNode.classList.add('image-loaded')
      e.target.parentNode.classList.remove('loading')
    })
  },
  methods: {
    resizeUrl(link, size) {
      return `//img2.storyblok.com/${size}x0/${link.replace(
        '//a.storyblok.com',
        ''
      )}`
    },
  },
}
</script>

<style lang="scss" scoped>
.image {
  &__wrapper {
    position: relative;
    overflow: hidden;
    background: linear-gradient(rgb(242, 242, 242) 66%, rgba(242, 242, 242, 0));

    &.image-loaded {
      background: transparent;
      padding-bottom: 0;
    }

    &:hover {
      .image {
        transform: scale(1.1);
      }
    }
  }

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: all 0.2s;

  // &.floridi {
  //   top: 50%;
  //   left: 16.5%;
  //   right: 16.5%;
  //   width: 67%;
  //   transform: translateY(-50%);
  // }
}
</style>
