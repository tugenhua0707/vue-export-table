'use strict';
const path = require('path');

// 配置文件
const config = require('../config');

// 提取css的插件
// https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const packageConfig = require('../package.json');
/*
 * 生成静态资源的路径
 * @method assetsPath
 * @param {String} _path 相对于静态资源文件夹的文件路径
 * @return {String} 静态资源的完整路径
 */
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  //  path.posix.join与path.join一样，不过总是以 posix 兼容的方式交互
  return path.posix.join(assetsSubDirectory, _path);
};

/*
 * 生成处理css的loaders配置
 * @method cssLoaders
 * @param {Object} options 生成的配置
 options = {
   // 是否开启 sourceMap
   sourceMap: true,
   // 是否提取css
   extract: true
 }
 @return {Object} 处理css的loaders的配置对象
*/
exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: { // options是loader的选项配置
      // 根据参数是否生成sourceMap文件 生成环境下压缩文件
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  /*
   生成ExtractTextPlugin对象或loader字符串
   @method generateLoaders
   @param {Array} loader 名称数组
   @return {String | Object} ExtractTextPlugin对象或loader字符串
   */
  function generateLoaders (loader, loaderOptions) { // 生成loader
    // 默认是css-loader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) { // 如果参数loader存在
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, { // 将loaderOptions和sourceMap组成一个对象
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 当extract为true时，提取css，生成环境中，默认为true
    if (options.extract) {  // 如果传入的options存在extract且为true
      return ExtractTextPlugin.extract({  // ExtractTextPlugin分离js中引入的css文件
        use: loaders, // 处理的loader
        fallback: 'vue-style-loader' // 没有被提取分离时使用的loader
      });
    } else {
      return ['vue-style-loader'].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  // 返回css类型对应的loader组成的对象 generateLoaders()来生成loader
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

// Generate loaders for standalone style files (outside of .vue)
/*
 生成style-loader的配置
 style-loader文档：https://github.com/webpack/style-loader
 @method styleLoaders
 @param {Object} options生成的配置
 @return {Array} style-loader的配置
*/
exports.styleLoaders = function (options) {
  const output = []; // 定义返回的数组，数组中保存的是针对各类型的样式文件的处理方式
  const loaders = exports.cssLoaders(options); // 调用cssLoaders方法返回各类型的样式对象(css: loader)

  for (const extension in loaders) { // 循环遍历loaders
    const loader = loaders[extension]; // 根据遍历获得的key(extension)来得到value(loader)
    output.push({
      test: new RegExp('\\.' + extension + '$'), // 处理的文件类型
      use: loader  // 用loader来处理，loader来自loaders[extension]
    });
  }

  return output;
};
// https://www.npmjs.com/package/node-notifier
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    });
  };
};
