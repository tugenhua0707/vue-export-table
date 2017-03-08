//app.js
App({
  onLaunch: function() {
    console.log('监听小程序初始化');
  },
  onShow: function() {
    console.log('小程序启动，或从后台进入前台显示，会触发该生命周期');
  },
  onHide: function() {
    console.log('小程序从前台进入后台，触发onHide');
  },
  onError: function(msg) {
    console.log('小程序发生脚本错误，或者api调用失败时，会触发');
  },
  globalData:  'I am global data'  // 全局参数定义
});