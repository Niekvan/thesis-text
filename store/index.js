export const state = () => ({
  articles: [],
  credits: null,
  readArticles: [],
  activeArticles: [],
  sources: [],
  images: [],
  image_sources: [],
  loaded: false,
  referenceOpen: false,
  imagesOpen: false,
  creditsOpen: false,
  consentOpen: true
})

export const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles
  },
  SET_CREDITS(state, credits) {
    state.credits = credits
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
    state.sources = sources.sort(compareAuthor)
  },
  SET_IMAGES(state, images) {
    state.images = images.sort(compareImages)
  },
  SET_IMAGE_SOURCES(state, list) {
    state.image_sources = list.sort(compareAuthor)
  },
  SET_REFERENCE(state, open) {
    state.referenceOpen = open
  },
  SET_IMAGE_INDEX(state, open) {
    state.imagesOpen = open
  },
  SET_CONSENT_OPEN(state, open) {
    state.consentOpen = open
  },
  SET_CREDITS_OPEN(state, open) {
    state.creditsOpen = open
  }
}

export const actions = {
  async getArticles({ commit }, isDev) {
    const version = isDev ? 'draft' : 'published'
    const data = await this.$storyapi.get('cdn/stories', {
      starts_with: 'articles',
      version
    })
    const credits = await this.$storyapi.get('cdn/stories/credits', {
      version
    })
    commit('SET_CREDITS', credits.data.story)
    commit('SET_ARTICLES', data.data.stories)
  },
  async getSources({ commit }, isDev) {
    const version = isDev ? 'draft' : 'published'
    const data = await this.$storyapi.get('cdn/stories/sources', {
      version
    })
    const imageData = await this.$storyapi.get('cdn/stories/image-sources', {
      version
    })
    commit('SET_SOURCES', data.data.story.content.sources)
    commit('SET_IMAGE_SOURCES', imageData.data.story.content.sources)
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
  async nuxtServerInit({ dispatch }, { isDev }) {
    await dispatch('getArticles', isDev)
    await dispatch('getSources', isDev)
    dispatch('getImages')
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

function compareAuthor(a, b) {
  const bFirst = b.author ? b.author : b.title
  const aFirst = a.author ? a.author : a.title
  return aFirst.localeCompare(bFirst) || 0
}

function compareImages(a, b) {
  const reg = /(?:Figure )(?<number>\d+)\./g
  const numA = reg.exec(a.caption)
  reg.lastIndex = 0
  const numB = reg.exec(b.caption)

  if (numA && numB) {
    return parseInt(numA.groups.number) - parseInt(numB.groups.number)
  }
  return a.caption.localeCompare(b.caption)
}

function getUnique(arr, comp) {
  const unique = arr
    .map(item => item[comp])
    .map((item, i, final) => final.indexOf(item) === i && i)
    .filter(item => arr[item])
    .map(e => arr[e])

  return unique
}
