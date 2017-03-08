var fs    = require('fs');
var path  = require('path');
var os    = require("os");

var Helper = function(){

}

Helper.prototype.htmlReplace = function(filePath, options, cb) {
  var htmls, i, len;
  htmls = this.getHtmlFiles(path.join(filePath, 'html'));
  i = 0;
  len = htmls.length;
  return htmls.forEach(function(file) {
    return fs.readFile(file, function(err, data) {
      if (err) {
        return cb(err);
      }
      data = data.toString().replace(/\@{3}TBJAPP_VERSION\@{3}/g, options.tbjAppVersion);
      data = data.toString().replace(/\@{3}TBJAPP_PREFIX\@{3}/g, options.tbjAppPrefix);
      fs.writeFileSync(file, data);
      ++i;
      if (i === len) {
        return cb(null);
      }
    });
  });
}

Helper.prototype.getHtmlFiles = function(filePath) {
  var files, res, _self;
  _self = this;
  res = [];
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath);
    files.forEach(function(file) {
      var extname, stats, _dir;
      _dir = path.resolve(filePath, file);
      stats = fs.statSync(_dir);
      if (stats.isDirectory()) {
        return res = res.concat(_self.getHtmlFiles(_dir));
      } else {
        extname = path.extname(_dir);
        if (extname === '.html') {
          return res.push(_dir);
        }
      }
    });
  }
  return res;
}
//获取要编译的主js文件
Helper.prototype.getJsFiles = function(filePath, isFlag) {
  var files, res, _self, __path, _ars, platform;
  _self = this;
  res = [];
  platform = os.platform();
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath);
    files.forEach(function(file) {
      var extname, stats, _dir;
      _dir = path.resolve(filePath, file);
      stats = fs.statSync(_dir);
      if (stats.isDirectory() && isFlag) {
        return res = res.concat(_self.getJsFiles(_dir));
      } else {
        extname = path.extname(_dir);
        if (extname === '.js' && file.indexOf('View') === -1) {
          _ars = _dir.split("/");
          if(platform.match(/^win*/)){
            _ars = _dir.split("\\");
          }
          _ars.pop();
          __path = _ars.pop();
          return res.push(__path + "/" + file);
        }
      }
    });
  }
  return res;
}

exports = module.exports = function(){
  return new Helper();
}