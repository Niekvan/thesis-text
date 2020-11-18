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
  Vue.component('Reference', Source)
  Vue.component('Graph', Graph)
  Vue.component('NodeLink', nodeLink)
  Vue.component('Node', Node)
  Vue.component('ArticleFrame', ArticleFrame)
  Vue.component('IConsent', IConsent)
  Vue.component('SourceList', SourceList)
  Vue.component('ImageIndex', ImageIndex)
  Vue.component('Credits', Credits)
}
