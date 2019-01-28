export const state = () => ({
  articles: []
})

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
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
  async nuxtServerInit({ dispatch }, { isDev }) {
    await dispatch('getArticles', isDev)
  }
}
