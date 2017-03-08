
Page({
  onReady: function() {
    // 加载完 创建动画实例
    this.animation = wx.createAnimation({
      duration: 2000,   // 动画持续的时间
      timingFunction: 'ease'
    });
  },
  // 旋转
  rotate: function() {
    this.animation.rotate(Math.random() * 720 - 360).step();
    // 存储数据
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 缩放
  scale: function() {
    this.animation.scale(Math.random() * 2).step();
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 偏移
  translate: function() {
    this.animation.translate(Math.random() * 100 - 50, Math.random() * 100 - 50).step();
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 倾斜
  skew: function() {
    this.animation.skew(10, 10).step();
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 旋转和放大
  rotateAndScale: function() {
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 先旋转同时放大， 然后平移
  rotateAndScaleThenTranslate: function() {
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({ duration: 1000 })
    this.setData({
      animationData: this.animation.export()
    })
  },
  allInQueue: function() {
    this.animation.rotate(45).step()
      .scale(2, 2).step()
      .translate(100, 100).step()
      .skew(90, 90).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  reset: function() {
    this.animation.rotate(0, 0)
      .scale(1)
      .translate(0, 0)
      .skew(0, 0).step({ duration: 0 });
    this.setData({
      animationData: this.animation.export()
    })
  }
})