const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    filename: 'build.js'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Word Mind',
      template: './index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  }
}
