const { ProgressPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateWebpackPlugin = require('./index.js');

module.exports = {
  mode: 'development',
  entry: './examples/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new ProgressPlugin(),

    new HtmlWebpackPlugin({
      title: 'Demo',
      template: './examples/index.html',
    }),

    new InterpolateWebpackPlugin({
      key: 'INJECT_HERE',
      value: './lib/*.js',
      type: 'PATH'
    }),
  ],
}
