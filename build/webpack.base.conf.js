'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}
/*
 对于以.js或.vue后缀结尾的文件(在src目录下或test目录下的文件)，使用eslint进行文件语法检测。
*/
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot, // 导出目录的绝对路径
    filename: '[name].js', // 导出文件的文件名
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // 设置模块如何被解析
  resolve: {
    // 自动解析确定的扩展名，导入模块时不带扩展名
    extensions: ['.js', '.vue', '.json'],

    // 创建import 或 require的别名
    /*
     比如如下文件
     src
       components
         a.vue
       router
         home
           index.vue
      在index.vue里面，正常引用A组件；如下：
      import A from '../../components/a.vue';
      如果设置了 alias后，那么引用的地方可以如下这样了
      import A from '@/components/a.vue';
      注意：这里的 @ 起到了 resolve('src')路径的作用了。
    */
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      // 在开发环境下 对于以.js或.vue后缀结尾的文件(在src目录下或test目录下的文件)，使用eslint进行文件语法检测。
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,  // vue 文件后缀的
        loader: 'vue-loader', // 使用vue-loader处理
        options: vueLoaderConfig // options是对vue-loader做的额外选项配置 文件配置在 ./vue-loader.conf 内可以查看代码
      },
      {
        test: /\.js$/, // js文件后缀的
        loader: 'babel-loader', // 使用babel-loader处理
        include: [resolve('src'), resolve('test')] // 包含src和test的文件夹
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 处理图片后缀
        loader: 'url-loader',  // 使用url-loader处理
        options: {
          limit: 10000,  // 图片小于10000字节时以base64的方式引用
          name: utils.assetsPath('img/[name].[hash:7].[ext]')  // 文件名为name.7位hash的值.扩展名
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,  // 音频文件后缀
        loader: 'url-loader',
        options: {
          limit: 10000, // 小于10000字节时的时候处理
          name: utils.assetsPath('media/[name].[hash:7].[ext]') // 文件名为name.7位hash的值.扩展名
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 字体文件
        loader: 'url-loader',
        options: {
          limit: 10000, // 字体文件小于10000字节的时候处理
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]') // 文件名为name.7位hash的值.扩展名
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
