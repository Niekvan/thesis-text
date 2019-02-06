const requestIp = require('request-ip')

export default ({ req, store }) => {
  const clientIp = requestIp.getClientIp(req)
  store.commit('SET_MIDDLEWARE_IP', clientIp)
}
