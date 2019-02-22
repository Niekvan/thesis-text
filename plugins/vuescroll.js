import Vue from 'vue'
import vuescroll from 'vuescroll/dist/vuescroll-native'

export default () => {
  Vue.use(vuescroll, {
    ops: {
      bar: {
        // keepShow: true,
        background: '',
        opacity: '',
        size: '',
        hoverStyle: true
      },
      rail: {
        opacity: null,
        background: '',
        size: '',
        gutterOfSide: ''
      }
    }
  })
}
