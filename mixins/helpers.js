export default {
  methods: {
    flatten(list) {
      return list.reduce(
        (a, b) => a.concat(Array.isArray(b) ? this.flatten(b) : b),
        []
      )
    },
  },
}
