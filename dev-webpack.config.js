var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: '#inline-source-map',

  entry: [
    './src/index.ts'
  ],

  output: {
    filename: 'bundle.js',
    path: __dirname + '/app'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/, use: [{
          loader: 'ts-loader'
        }]
      }],
  }
};
