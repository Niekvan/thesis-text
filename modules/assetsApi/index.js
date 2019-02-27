import path from 'path'

export default function assetsApi(moduleOptions) {
  const options = Object.assign({}, this.options.assetsApi, moduleOptions)

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options
  })
}
