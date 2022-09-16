const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: "development",
  entry: path.join(__dirname,'/client/src/index.jsx'),
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'bundle.js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      // {
      //   test: /\.png/,
      //   use: {
      //     loader: "file-loader"
      //   }
      // }
      {
        test: /\.png/,
        type: 'asset/resource'
      }
    ]
  },
  devServer: {
    'static': {
      directory: './client/dist'
    }
  }
}


 // to run a webpack config file not named webpack.config.js, use --config <fileName>, useful for more complex configs that need to be split into multiple files //