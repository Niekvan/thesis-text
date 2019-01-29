export const state = () => ({
  articles: [],
  sources: []
})

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  SET_SOURCES(state, sources) {
    state.sources = sources
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
  async nuxtServerInit({ dispatch }, { isDev }) {
    await dispatch('getArticles', isDev)
    await dispatch('getSources', isDev)
  }
}
