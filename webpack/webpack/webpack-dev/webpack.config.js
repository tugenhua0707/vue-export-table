var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    "index": path.join(__dirname, 'src') + "/js/index.js",
    "a": path.join(__dirname, 'src') + "/js/a.js",
  },
  output: {
    path: path.join(__dirname, '/build/js/'),
    filename: '[name].js'
  },
  plugins: [
    // 内联css提取到单独的styles的css
    new ExtractTextPlugin("index.css"),
    new HtmlWebpackPlugin({
      title: 'Hello World app',
      filename: 'index.html',
      template: 'src/html/index.html',
      inject: true,
      hash: true
    }),
    new webpack.optimize.UglifyJsPlugin({    //压缩代码
       compress: {
           warnings: false
       },
       except: ['$super', '$', 'exports', 'require']    //排除关键字
    })
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css']
    }]
  }
}