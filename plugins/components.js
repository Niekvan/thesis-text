import Vue from 'vue'

import ArticleFrame from '@/components/ArticleFrame.vue'
import IConsent from '@/components/IConsent.vue'
import Source from '@/components/sources/Source.vue'
import Graph from '@/components/graph/Graph.vue'
import nodeLink from '@/components/graph/Link.vue'
import Node from '@/components/graph/Node.vue'
import SourceList from '@/components/SourceList.vue'
import ImageIndex from '@/components/ImageIndex.vue'
import Credits from '@/components/Credits.vue'

export default () => {
  Vue.component('reference', Source)
  Vue.component('graph', Graph)
  Vue.component('node-link', nodeLink)
  Vue.component('node', Node)
  Vue.component('article-frame', ArticleFrame)
  Vue.component('i-consent', IConsent)
  Vue.component('source-list', SourceList)
  Vue.component('image-index', ImageIndex)
  Vue.component('credits', Credits)
}
