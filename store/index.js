export const state = () => ({
  articles: [],
  sources: [],
  ip: null,
  geo: null,
  loaded: false,
  middleware_ip: null
})

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  SET_SOURCES(state, sources) {
    state.sources = sources
  },
  SET_GEO(state, data) {
    state.geo = data
    state.loaded = true
  },
  SET_IP(state, ip) {
    state.ip = ip
  },
  SET_MIDDLEWARE_IP(state, ip) {
    state.middleware_ip = ip
  }
}

export const actions = {
  async getArticles({ commit }, isDev) {
    const version = isDev ? 'draft' : 'published'
    const data = await this.$storyapi.get('cdn/stories', {
      starts_with: 'articles',
      version: version
    })
    commit('SET_ARTICLES', data.data.stories)
  },
  async getSources({ commit }, isDev) {
    const version = isDev ? 'draft' : 'published'
    const data = await this.$storyapi.get('cdn/stories/sources', {
      version: version
    })
    commit('SET_SOURCES', data.data.story.content.sources)
  },
  async setGEO({ commit, state }) {
    if (!state.loaded) {
      const { data: geoData } = await this.$axios.get('https://ipinfo.io/json')
      commit('SET_IP', geoData.ip)
      commit('SET_GEO', geoData)
    }
  },
  async nuxtServerInit({ dispatch }, { isDev }) {
    await dispatch('getArticles', isDev)
    await dispatch('getSources', isDev)
  }
}
