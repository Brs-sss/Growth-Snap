// pages/show/show.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    popupVisible: false // 控制浮窗气泡显示隐藏的状态
  },
  showPopup() {
    this.setData({
      popupVisible: true
    });
  },
  hidePopup() {
    this.setData({
      popupVisible: false
    });
  },
  goToPage_event() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/event/event',
    })
  },
  goToPage_text() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/text/text',
    })
  },
  goToPage_data() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/data/data',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
})