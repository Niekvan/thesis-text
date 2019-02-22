<template>
  <div>
    <svg :id="settings.selector" class="svg">
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
          :settings="settings.nodes"
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
  // forceX,
  forceY
} from 'd3-force'
import { drag } from 'd3-drag'
import * as d3 from 'd3-selection'

export default {
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
      return (
        this.svg
          .select('g.nodes')
          .selectAll('.node')
          .data(this.nodes)
          // .call(this.drag(this.simulation))
          .on('mouseover', this.fade(0.2, true))
          .on('mouseout', this.fade(1, false))
      )
    },
    link() {
      return this.svg
        .select('g.links')
        .selectAll('.link')
        .data(this.links)
    },
    linkedIndex() {
      const linkIndex = {}
      this.links.forEach(link => {
        linkIndex[`${link.source.uuid},${link.target.uuid}`] = 1
      })
      return linkIndex
    },
    height() {
      return window.innerHeight - 5
    },
    width() {
      return window.innerWidth - 1
    },
    offset() {
      return 50
    }
  },
  mounted() {
    this.start()
    document.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    document.removeEventListener('resize', this.handleResize)
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
      /* eslint-disable */
      return forceSimulation()
        .force(
          'charge',
          forceManyBody()
            .strength(strength)
            .distanceMin(10)
        )
        .force('center', forceCenter(this.width / 2, this.height / 2))
        .force('collision', forceCollide(this.settings.nodes.width))
        .force('link', forceLink().id(d => d[selector]))
        .force('y', forceY())
        // .force('x', forceX().x(d => d.primary ? 100 : this.width / 3 * 2))
    },
    positionLink(d) {
      d.source.x = Math.max(
        this.offset,
        Math.min(this.width - this.offset, d.source.x)
      )
      d.source.y = Math.max(
        this.offset,
        Math.min(this.height - this.offset, d.source.y)
      )
      d.target.x = Math.max(
        this.offset,
        Math.min(this.width - this.offset, d.target.x)
      )
      d.target.y = Math.max(
        this.offset,
        Math.min(this.height - this.offset, d.target.y)
      )
      const offset = 30
      const midPointX = (d.source.x + d.target.x) / 2
      const midPointY = (d.source.y + d.target.y) / 2
      const dx = d.target.x - d.source.x
      const dy = d.target.y - d.source.y
      const normalize = Math.sqrt(dx * dx + dy * dy)
      const offsetX = midPointX + offset * (dy / normalize)
      const offsetY = midPointY + offset * (dx / normalize)

      return `M${d.source.x},${d.source.y}S${offsetX},${offsetY} ${d.target.x},${d.target.y}` //eslint-disable-line
    },
    positionNode(d) {
      d.x = Math.max(this.offset, Math.min(this.width - this.offset, d.x))
      d.y = Math.max(this.offset, Math.min(this.height - this.offset, d.y))
      return `translate(${d.x}, ${d.y})`
    },
    restart(nodes, links) {
      this.simulation.nodes(nodes)
      this.simulation.force('link').links(links)
      this.simulation.alpha(1).restart()
      const that = this
      this.svg.selectAll('.node text').each(function(d, i) {
        that.nodes[i].bb = this.getBBox()
      })
    },
    start() {
      this.simulation = this.forceSimulation('uuid', 150).on(
        'tick',
        this.ticked
      )
      this.restart(this.nodes, this.links)
    },
    ticked() {
      this.link.attr('d', this.positionLink)
      this.node.attr('transform', this.positionNode)
    },
    isConnected(a, b) {
      return (
        this.linkedIndex[`${a.uuid},${b.uuid}`] ||
        this.linkedIndex[`${b.uuid},${a.uuid}`] ||
        a.index === b.index
      )
    },
    fade(opacity, over) {
      const strokeOpacity = over ? 1 : 0.05
      return d => {
        this.node.style('opacity', o => {
          return this.isConnected(d, o) ? 1 : opacity
        })
        this.link.style('stroke-opacity', o => {
          return o.source.uuid === d.uuid || o.target.uuid === d.uuid
            ? strokeOpacity
            : 0.05
        })
      }
    },
    handleResize() {
      this.restart(this.nodes, this.links)
    }
  }
}
</script>

<style scoped>
.svg {
  max-width: 100%;
}
</style>
