<template>
  <div>
    <svg :id="settings.selector">
      <g class="links">
        <node-link 
          v-for="linkData in links"
          :key="linkData.name"
          :link="linkData"
        />
      </g>
      <g class="nodes">
        <node
          v-for="nodeData in nodes"
          :key="nodeData.uuid"
          :node="nodeData"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceCenter,
  forceCollide,
  forceX,
  forceY
} from 'd3-force'
import { drag } from 'd3-drag'
import * as d3 from 'd3-selection'

import nodeLink from './Link.vue'
import Node from './Node.vue'

export default {
  components: {
    nodeLink,
    Node
  },
  props: {
    links: {
      type: Array,
      default() {
        return []
      }
    },
    nodes: {
      type: Array,
      default() {
        return []
      }
    },
    settings: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      simulation: null
    }
  },
  computed: {
    svg() {
      const svg = d3.select(`svg#${this.settings.selector}`)
      svg
        .attr('viewBox', [0, 0, this.width, this.height])
        .attr('preserveAspectRatio', 'xMidYMid meet')
      return svg
    },
    node() {
      return this.svg
        .select('g.nodes')
        .selectAll('g.node')
        .data(this.nodes)
        .call(this.drag(this.simulation))
    },
    link() {
      return this.svg
        .select('g.links')
        .selectAll('line')
        .data(this.links)
    },
    height() {
      return window.innerHeight - 5
    },
    width() {
      return window.innerWidth - 1
    }
  },
  mounted() {
    this.start()
  },
  methods: {
    drag(simulation) {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    forceSimulation(selector, strength) {
      return forceSimulation()
        .force('charge', forceManyBody().strength(strength))
        .force('center', forceCenter(this.width / 2, this.height / 2))
        .force('collision', forceCollide(d => d.r * 1.25))
        .force('link', forceLink().id(d => d[selector]))
        .force('x', forceX())
        .force('y', forceY())
    },
    restart(nodes, links) {
      this.simulation.nodes(nodes)
      this.simulation.force('link').links(links)
      this.simulation.alpha(1).restart()
    },
    start() {
      this.simulation = this.forceSimulation('uuid', -30).on(
        'tick',
        this.ticked
      )
      this.restart(this.nodes, this.links)
    },
    ticked() {
      this.link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      this.node.attr('transform', d => `translate(${d.x}, ${d.y})`)
    }
  }
}
</script>

<style scoped>
</style>
