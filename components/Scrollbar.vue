<template>
  <div class="scroll__wrapper">
    <div class="scroll__box">
      <div class="perspective" :style="perspectiveStyles">
        <div class="thumb" :style="thumbStyles" />
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrollable: null,
      dragging: false,
      lastY: 0,
      scrollTop: 0,
      thumb: null,
      style: {
        pointerEvents: 'initial',
        userSelect: 'initial'
      },
      perspectiveStyles: {
        perspectiveOrigin: 'top right',
        transformStyle: 'preserve-3d',
        width: '100%',
        position: 'absolute',
        pointerEvents: 'none'
      },
      thumbStyles: {
        pointerEvents: 'initial',
        position: 'absolute',
        transfromOrigin: 'top right',
        top: '0',
        right: '0'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.scrollable = document.querySelector('.scroll__box')
      this.thumb = this.scrollable.querySelector('.thumb')
      this.makeScrollbar()
      this.updateSize()
    },
    dragStart(event) {
      this.dragging = true
      this.scrollable.style.pointerEvents = 'none'
      this.scrollable.style.userSelect = 'none'

      this.lastY =
        event.clientY || event.clientY === 0
          ? event.clientY
          : event.touches[0].clientY
    },
    dragMove(event) {
      if (!this.dragging) return
      const clientY =
        event.clientY || event.clientY === 0
          ? event.clientY
          : event.touches[0].clientY
      this.scrollTop += (clientY - this.lastY) / this.thumb.scaling
      this.lastY = clientY
    },
    dragEnd(event) {
      this.dragging = false
      this.scrollable.style.pointerEvents = 'initial'
      this.scrollable.style.userSelect = 'initial'
    },
    updateSize() {
      this.scrollable.style.width = ''
      this.scrollable.style.width = `calc(${
        getComputedStyle(this.scrollable).width
      } + 200px)`

      const viewport = this.scrollable.getBoundingClientRect()
      const scrollHeight = this.scrollable.scrollHeight
      const maxScrollTop = scrollHeight - viewport.height
      const thumbHeight = Math.pow(viewport.height, 2) / scrollHeight
      const maxTopOffset = viewport.height - thumbHeight

      this.thumb.scaling = maxTopOffset / maxScrollTop
      this.thumb.style.height = `${thumbHeight}px`

      if (this.scrollable.isIOS) {
        this.thumb.nextElementSibling.style.marginTop = `-${thumbHeight}px`
        const z = 1 - 1 / (1 + this.thumb.scaling)
        this.thumb.style.transform = `
        translateZ(${z}px)
        scale(${1 - z})
        translateX(-200px)
        `
      } else {
        this.thumb.style.transform = `
        scale(${1 / this.thumb.scaling})
         matrix3d(
           1, 0, 0, 0,
           0, 1, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, -1
         )
         translateZ(${-2 + 1 - 1 / this.thumb.scaling}px)
         translateX(-200px)
        `
      }
    },
    makeScrollbar() {
      if (getComputedStyle(document.body).transform === 'none') {
        document.body.style.transform = 'translateZ(0)'
        const fixedPos = document.createElement('div')
        fixedPos.style.position = 'fixed'
        fixedPos.style.top = '0'
        fixedPos.style.width = '1px'
        fixedPos.style.height = '1px'
        fixedPos.style.zIndex = 1
        document.body.insertBefore(fixedPos, document.body.firstChild)
      }

      this.scrollable.style.perspectiveOrigin = 'top right'
      this.scrollable.style.transformStyle = 'preserve-3d'
      this.scrollable.style.perspective = '1px'

      if (getComputedStyle(this.scrollable).webkitOverflowScrolling) {
        this.scrollable.isIOS = true
        this.thumb.style.right = ''
        this.thumb.style.left = '100%'
        this.thumb.style.position = '-webkit-sticky'
        this.perspectiveStyles.perspective = '1px'
        this.perspectiveStyles.height = ''
        this.perspectiveStyles.width = ''
        this.perspectiveStyles.position = ''
      }

      this.thumb.addEventListener('mousedown', this.dragStart, {
        passive: true
      })
      window.addEventListener('mousemove', this.dragMove)
      window.addEventListener('mouseup', this.dragEnd, {
        passive: true
      })
      this.thumb.addEventListener('touchstart', this.dragStart, {
        passive: true
      })
      window.addEventListener('touchmove', this.dragMove)
      window.addEventListener('touchend', this.dragEnd, {
        passive: true
      })
      const that = this
      const f = function() {
        that.updateSize()
      }
      requestAnimationFrame(f)
      window.addEventListener('resize', f)
      return f
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll {
  &__wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }

  &__box {
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    position: relative;
    -webkit-overflow-scrolling: touch;
    backface-visibility: hidden;
  }
}

.thumb {
  width: 14px;
  background: $color-text-primary;
}

.perspective {
  > .row {
    width: calc(100% - 200px);
    position: relative;
  }
}
</style>
