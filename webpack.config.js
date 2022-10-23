const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

// See more info on this setup here: https://levelup.gitconnected.com/how-to-bundle-your-library-for-both-nodejs-and-browser-with-webpack-3584ec8197eb

const generalConfig = {
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

const nodeConfig = {
  entry: './src/node.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'node.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
}

const browserConfig = {
  entry: './src/browser.ts',
  target: 'web',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'browser.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
    umdNamedDefine: true,
    // Determines name if we are imprting through script tag
    // Basically, if we do 
    // <script src="path-to-local-library/browser.js"></script>
    // We can then do global.lfd_utils... if I understand correctly
    library: 'lfd_utils', 
  },
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    generalConfig.devtool = 'cheap-module-source-map'
  }
  else if (argv.mode === 'production') {

  } 
  else {
    throw new Error('Specify env')
  }

  Object.assign(nodeConfig, generalConfig)
  Object.assign(browserConfig, generalConfig)

  return [nodeConfig, browserConfig]
}