<template>
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
</template>

<script>
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceCollide,
  forceX,
  forceY
} from 'd3-force'
import { drag } from 'd3-drag'
import * as d3 from 'd3-selection'
import { mapState } from 'vuex'

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
      simulation: null,
      width: 0,
      height: 0,
      resizeTimeout: null,
      opacityNode: 0.2
    }
  },
  computed: {
    centers() {
      return {
        '1': {
          x: this.width / 6,
          y: this.height / 3
        },
        '2': {
          x: (this.width / 6) * 2,
          y: this.height / 2
        },
        '3': {
          x: (this.width / 6) * 3,
          y: this.height / 2
        },
        '4': {
          x: (this.width / 6) * 4,
          y: this.height / 2
        },
        '5': {
          x: (this.width / 6) * 5,
          y: this.height / 2
        }
      }
    },
    svg() {
      return d3.select(`svg#${this.settings.selector}`)
    },
    node() {
      return this.svg
        .select('g.nodes')
        .selectAll('.node')
        .data(this.nodes)
        .call(this.drag(this.simulation))
        .on('mouseover', this.handleMouseOver(this.opacityNode))
        .on('mouseout', this.handleMouseOut(this.opacityNode))
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
    ...mapState(['readArticles'])
  },
  mounted() {
    this.width = this.svg.node().clientWidth
    this.height = this.svg.node().clientHeight
    this.start()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
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
    forceSimulation(selector, strength, charge) {
      return forceSimulation()
        .force('center', forceCenter(this.width / 2, this.height / 2))
        .force('charge', forceManyBody().strength(charge))
        .force('collision', forceCollide(this.settings.collide))
        .force('link', forceLink().id(d => d[selector]))
        .force(
          'y',
          forceY()
            .strength(strength)
            .y(this.height / 2)
        )
        .force(
          'x',
          forceX()
            .strength(strength)
            .x(d => this.centers[d.content.level].x)
        )
        .stop()
    },
    positionLink(d) {
      d.source.x = Math.max(
        Math.max(
          this.centers[d.source.content.level].x - this.settings.freedom,
          d.source.bb.width
        ),
        Math.min(
          Math.min(
            this.centers[d.source.content.level].x + this.settings.freedom,
            this.width - d.source.bb.width
          ),
          d.source.x
        )
      )
      if (d.source.content.level === '1') {
        d.source.y = this.centers[d.source.content.level].y
      } else {
        d.source.y = Math.max(
          Math.max(
            this.centers[d.source.content.level].y - this.settings.freedom,
            d.source.bb.height
          ),
          Math.min(
            Math.min(
              this.centers[d.source.content.level].y + this.settings.freedom,
              this.height - d.source.bb.height
            ),
            d.source.y
          )
        )
      }
      d.target.x = Math.max(
        Math.max(
          this.centers[d.target.content.level].x - this.settings.freedom,
          d.target.bb.width
        ),
        Math.min(
          Math.min(
            this.centers[d.target.content.level].x + this.settings.freedom,
            this.width - d.target.bb.width
          ),
          d.target.x
        )
      )
      if (d.target.content.level === '1') {
        d.target.y = this.centers[d.target.content.level].y
      } else {
        d.target.y = Math.max(
          Math.max(
            this.centers[d.target.content.level].y - this.settings.freedom,
            d.target.bb.height
          ),
          Math.min(
            Math.min(
              this.centers[d.target.content.level].y + this.settings.freedom,
              this.height - d.target.bb.height
            ),
            d.target.y
          )
        )
      }
      return `M${d.source.x},${d.source.y} ${d.target.x},${d.target.y}` //eslint-disable-line
    },
    positionNode(d) {
      d.x = Math.max(
        Math.max(
          this.centers[d.content.level].x - this.settings.freedom,
          d.bb.width
        ),
        Math.min(
          Math.min(
            this.centers[d.content.level].x + this.settings.freedom,
            this.width - d.bb.width
          ),
          d.x
        )
      )
      if (d.content.level === '1') {
        d.y = this.centers[d.content.level].y
      } else {
        d.y = Math.max(
          Math.max(
            this.centers[d.content.level].y - this.settings.freedom,
            d.bb.height
          ),
          Math.min(
            Math.min(
              this.centers[d.content.level].y + this.settings.freedom,
              this.height - d.bb.height
            ),
            d.y
          )
        )
      }
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
      this.simulation = this.forceSimulation(
        'uuid',
        this.settings.strength,
        this.settings.charge
      ).on('tick', this.ticked)
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
    handleMouseOver(opacity) {
      return d => {
        this.node.select('.node__text').style('opacity', o => {
          return this.isConnected(d, o) ? 1 : opacity
        })
        this.link.style('stroke-opacity', o => {
          return o.source.uuid === d.uuid || o.target.uuid === d.uuid ? 1 : 0.05
        })
      }
    },
    handleMouseOut(opacity) {
      return d => {
        this.node.select('.node__text').style('opacity', o => {
          return this.readArticles.includes(o.uuid) ? 1 : opacity
        })
        this.link.style('stroke-opacity', o => {
          return this.readArticles.includes(o.source.uuid) &&
            this.readArticles.includes(o.target.uuid)
            ? 1
            : 0.05
        })
      }
    },
    handleResize() {
      if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(() => {
          this.resizeTimeout = null
          this.width = this.svg.node().clientWidth
          this.height = this.svg.node().clientHeight
          this.restart(this.nodes, this.links)
        }, 66)
      }
    }
  }
}
</script>

<style scoped>
.svg {
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
