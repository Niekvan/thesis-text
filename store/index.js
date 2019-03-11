export const state = () => ({
  articles: [],
  readArticles: [],
  activeArticles: [],
  sources: [],
  images: [],
  image_sources: [],
  ip: null,
  geo: null,
  loaded: false,
  middleware_ip: null,
  referenceOpen: false,
  imagesOpen: false,
  consentOpen: true
})

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  SET_ACTIVE_ARTICLES(state, article) {
    state.activeArticles.push(article)
  },
  REMOVE_ACTIVE_ARTICLE(state, index) {
    state.activeArticles = state.activeArticles
      .slice(0, index)
      .concat(
        state.activeArticles.slice(index + 1, state.activeArticles.length)
      )
  },
  SET_READ_ARTICLES(state, article) {
    state.readArticles.push(article)
  },
  REMOVE_NEXT_ARTILCES(state, index) {
    state.activeArticles.splice(index + 1, state.activeArticles.length - index)
  },
  SET_SOURCES(state, sources) {
    state.sources = sources.sort(compare)
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
  },
  SET_REFERENCE(state, open) {
    state.referenceOpen = open
  },
  SET_IMAGE_INDEX(state, open) {
    state.imagesOpen = open
  },
  SET_IMAGES(state, images) {
    state.images = images
  },
  SET_IMAGE_SOURCES(state, list) {
    state.image_sources = list.sort(compare)
  },
  SET_CONSENT_OPEN(state, open) {
    state.consentOpen = open
  }
}

export const actions = {
  async getArticles({ commit }, isDev) {
    // const version = isDev ? 'draft' : 'published'
    const data = await this.$storyapi.get('cdn/stories', {
      starts_with: 'articles',
      version: 'draft'
    })
    commit('SET_ARTICLES', data.data.stories)
  },
  async getSources({ commit }, isDev) {
    // const version = isDev ? 'draft' : 'published'
    const data = await this.$storyapi.get('cdn/stories/sources', {
      version: 'draft'
    })
    const imageData = await this.$storyapi.get('cdn/stories/image-sources', {
      version: 'draft'
    })
    commit('SET_SOURCES', data.data.story.content.sources)
    commit('SET_IMAGE_SOURCES', imageData.data.story.content.sources)
  },
  async setGEO({ commit, state }) {
    if (!state.loaded) {
      const { data: geoData } = await this.$axios.get(
        'https://api.ipdata.co/',
        {
          params: {
            'api-key':
              '40ab9abe58d4444d4010e0db73473c8518b032b939dd62c0c6ec9815'
          }
        }
      )
      commit('SET_IP', geoData.ip)
      commit('SET_GEO', geoData)
    }
  },
  getImages({ commit, state }) {
    const reg = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)(?:{.image ?(?<extraClass>.+)?}\n?\n?)(?<caption>.+)?\{/g
    const data = state.articles.flatMap(article => {
      const images = []
      let m = null
      while ((m = reg.exec(article.content.body)) !== null) {
        if (m.index === reg.lastIndex) {
          reg.lastIndex++
        }
        images.push({
          image: m.groups.filename,
          uuid: article.uuid,
          name: article.slug,
          caption: m.groups.caption.trim(),
          class: m.groups.extraClass
        })
      }
      return images
    })
    commit('SET_IMAGES', getUnique(data, 'caption'))
  },
  async nuxtServerInit({ dispatch, commit, state }, { isDev }) {
    await dispatch('getArticles', isDev)
    await dispatch('getSources', isDev)
    dispatch('getImages')
    const intro = state.articles.find(
      article => article.name === 'introduction'
    )
    commit('SET_READ_ARTICLES', intro.uuid)
  }
}

export const getters = {
  getLinkedArticles: state => list => {
    return state.articles.filter(article => list.includes(article.uuid))
  },
  getAbstract: state => () => {
    return state.articles.find(article => article.slug === 'abstract')
  }
}

function compare(a, b) {
  const aFirst = a.author ? a.author : a.title
  const bFirst = b.author ? b.author : b.title
  return aFirst.localeCompare(bFirst) || 0
}

function getUnique(arr, comp) {
  const unique = arr
    .map(item => item[comp])
    .map((item, i, final) => final.indexOf(item) === i && i)
    .filter(item => arr[item])
    .map(e => arr[e])

  return unique
}
