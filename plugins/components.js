import Vue from 'vue'

import Source from '@/components/sources/Source.vue'
import Graph from '@/components/graph/Graph.vue'

export default () => {
  Vue.component('reference', Source)
  Vue.component('graph', Graph)
}
