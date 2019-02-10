import Vue from 'vue'

import ArticleFrame from '@/components/ArticleFrame.vue'
import Source from '@/components/sources/Source.vue'
import Graph from '@/components/graph/Graph.vue'
import nodeLink from '@/components/graph/Link.vue'
import Node from '@/components/graph/Node.vue'

export default () => {
  Vue.component('reference', Source)
  Vue.component('graph', Graph)
  Vue.component('node-link', nodeLink)
  Vue.component('node', Node)
  Vue.component('article-frame', ArticleFrame)
}
