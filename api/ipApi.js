import axios from 'axios'

export default (ctx, inject) => {
  const api = axios.create({
    baseURL: 'http://localhost:8080'
  })
  inject('ipCheck', api)
}
