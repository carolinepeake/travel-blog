const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: "development",
  entry: path.join(__dirname,'/client/src/index.js'),
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

 // should move index.html into a public folder, so not included in gitignore but loaded files saved into dist dir are included in git ignore (will also need to change script src if index.html is moved)

 // in deployed repo, the index.html file is in the dist directory and only *bundle.js is in gitignore under compiled directories


//"devDependencies": {
  // An app built using webpack has no front-end dependencies. if you compile your code with webpack and babel and then commit it to git and then clone the bundled code into your production server, you do not need to install any front-end dependencies
  // (express and back-end would still be dependencies)
  //   },