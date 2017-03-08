var gulp = require('gulp');
var stylus = require('gulp-stylus');
var mincss = require('gulp-minify-css');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require('gulp-clean');
var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var replace = require('gulp-str-replace');
var imagemin = require('gulp-imagemin');
var helper   = require('./helper')();
var reactify      = require('reactify');
var to5Browserify = require('6to5-browserify');
var streamify     = require('gulp-streamify');
var gulpif      = require('gulp-if');
var md5         = require('md5');
var rename = require('gulp-rename');
//自动刷新     
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var fs = require('fs');
var fileContent = fs.readFileSync('./package.json');
var jsonObj = JSON.parse(fileContent);

var argv = process.argv.pop();
var DEBUGGER = (argv === "-D" || argv === "-d") ? true : false;

/* 基础路径 */
var paths = {
  app       : "app", 
  images    : 'app/images',
  pages    : 'app/pages',
  build     :  "build"
};
var resProxy = "项目的真实路径";
var prefix = "项目的真实路径" + jsonObj.name;

if(DEBUGGER) {
  resProxy = "http://localhost:3000/build";
  prefix = "http://localhost:3000/build";
}
// 先清理文件
gulp.task('clean-css',function(){
    return gulp.src(paths.build + "**/*.css")
           .pipe(clean());
});

gulp.task('css', ['clean-css'],function () {
  return gulp.src([paths.app+'/pages/**/*.styl']) 
         .pipe(stylus())
         .pipe(replace({
            original : {
                resProxy : /\@{3}RESPREFIX\@{3}/g,
                prefix : /\@{3}PREFIX\@{3}/g,
                tbjAppVersion : /\@{3}TBJAPP_VERSION\@{3}/g
              },
              target : {
                resProxy : resProxy,
                prefix : prefix,
                tbjAppVersion : md5(jsonObj.version)
              }
          }))
         .pipe(mincss())
         .pipe(gulp.dest(paths.build + "/pages"))
         .pipe(reload({stream:true}));
});
// 监听html文件的改变
gulp.task('html',function(){
    return gulp.src(paths.app + "/html/**/*.html")
      .pipe(replace({
        original : {
            resProxy : /\@{3}RESPREFIX\@{3}/g,
            prefix : /\@{3}PREFIX\@{3}/g,
            tbjAppVersion : /\@{3}TBJAPP_VERSION\@{3}/g
          },
          target : {
            resProxy : resProxy,
            prefix : prefix,
            tbjAppVersion : md5(jsonObj.version)
          }
       }))
      .pipe(gulp.dest(paths.build + "/"))
      .pipe(reload({stream:true})); 
});
// 对图片进行压缩
gulp.task('images',function(){
   return gulp.src(paths.images + "**/*")
          .pipe(imagemin())
          .pipe(gulp.dest(paths.build));
});
// 对libs 库js文件 进行打包
gulp.task('modal-js', function() {
  return gulp.src([
      paths.app + '/libs/modal/**/*.js'
    ])
    .pipe(uglify())
    .pipe(rename('modal.min.js'))
    .pipe(gulp.dest(paths.build + '/libs/modal'))
});
gulp.task('jQuery-filer-js', function() {
  return gulp.src([
      paths.app + '/libs/jQuery.filer/js/*.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest(paths.build + '/libs'));
});
gulp.task('jquery-ztree-core', ['jQuery-filer-js','modal-js'], function(){
  return gulp.src([
        paths.app + "/libs/jquery.ztree.core.js",
        paths.app + "/libs/jquery.ztree.excheck.js",
        paths.app + "/libs/jquery.ztree.exedit.js"
      ])
       .pipe(uglify())
       .pipe(gulp.dest(paths.build + '/libs'))
       .pipe(reload({stream:true}));
});
gulp.task('jquery-filter-fonts', function() {
  return gulp.src([
      paths.app + "/libs/jQuery.filer/assets/**/*"
    ])
    .pipe(gulp.dest(paths.build + '/libs/jQuery.filer'));
});
gulp.task('zTreeStyle-img',function(){
  return gulp.src([
        paths.app + "/libs/zTreeStyle/img/**/*"
      ])
      .pipe(gulp.dest(paths.build + '/libs/zTreeStyle/img'));
});
// 对css文件 进行打包
gulp.task('modal-css', function() {
  return gulp.src([
      paths.app + "/libs/modal/**/*.css"
    ])
    .pipe(concat('modal.css'))
    .pipe(mincss())
    .pipe(rename('modal.min.css'))
    .pipe(gulp.dest(paths.build + '/libs/modal'))
    .pipe(reload({stream:true}));
});
gulp.task('jquery-filer-css',['jquery-filter-fonts','modal-css'], function(){
  return gulp.src([
        paths.app + "/libs/jQuery.filer/css/**/*"
      ])
      .pipe(gulp.dest(paths.build + '/libs/jQuery.filer'))
      .pipe(reload({stream:true}));
});
gulp.task('zTreeStyle-css',['jquery-filer-css','zTreeStyle-img'],function(){
  return gulp.src([
        paths.app + "/libs/zTreeStyle/**/*"
      ])
      .pipe(gulp.dest(paths.build + '/libs/zTreeStyle'))
      .pipe(reload({stream:true}));
});
// 复制jquery文件
gulp.task('copyjs', function() {
  gulp.src(['app/libs/jquery.min.js'])
    .pipe(gulp.dest(paths.build + '/libs'))
});
// 创建本地服务器，并且实时更新页面文件
gulp.task('browser-sync', ['css','html','browserify'],function() {
    var files = [
      '**/*.html',
      '**/*.css',
      '**/*.styl',
      '**/*.js'
    ]; 
    browserSync.init(files,{
   
        server: {
            //baseDir: "./html"
        }
        
    });
});

// 解决js模块化及依赖的问题
gulp.task("browserify",['jquery-ztree-core'],function () {
    var compileFiles = helper.getJsFiles(__dirname + '/app/pages/', true);
    for (var i = compileFiles.length - 1; i >= 0; i--) {
      var file = compileFiles[i];
      var b = browserify({
        entries: [__dirname + '/app/pages/' + file ],
        transform: [reactify, to5Browserify],
        debug:true
      })
      .bundle()
      .pipe(source(file))
      .pipe(buffer())
      .pipe(gulp.dest("./build/pages/"))
      .pipe(sourcemaps.write("."))
      .pipe(replace({
        original : {
            resProxy : /\@{3}RESPREFIX\@{3}/g,
            prefix : /\@{3}PREFIX\@{3}/g,
            tbjAppVersion : /\@{3}TBJAPP_VERSION\@{3}/g
          },
          target : {
            resProxy : resProxy,
            prefix : prefix,
            tbjAppVersion : md5(jsonObj.version)
          }
      }))
      .pipe(gulpif(!DEBUGGER, uglify()))
      .pipe(gulp.dest("./build/pages/"))
      .pipe(reload({stream:true}));
    };
});

gulp.task('default',['css','html','images','browserify', 'copyjs','zTreeStyle-css'],function () {
    gulp.watch(["**/*.styl"], ['css','browserify']);
    gulp.watch("**/*.html", ['html','browserify']);
});

gulp.task('server', ['browser-sync','images', 'copyjs','zTreeStyle-css'],function () {
    gulp.watch(["**/*.styl"], ['css','browserify']);
    gulp.watch("**/*.html", ['html','browserify']);
});