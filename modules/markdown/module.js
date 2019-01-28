import path from 'path'

export default function markdownParser(moduleOptions) {
  let options = Object.assign({}, this.options.storyblok, moduleOptions)

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options
  })
}
