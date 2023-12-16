// pages/generate/reselect/timelineInfo.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    host_: `${app.globalData.localUrl}`,
  },

  selectTemplate(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      templateSelected: index,
    })
  },

  selectColor(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      colorSelected: index,
    })
  },

  changeInfo(e) {
    var pages = getCurrentPages()
    var pre = pages[pages.length - 2]
    var that = this
    pre.setData({
      nextTemplate: that.data.templateSelected,
      nextColor: that.data.colorSelected
    })
    wx.navigateBack(1)
    pre.testChange()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      timelineList: [
        { id: 0, name: "日历标注模板"},
        { id: 1, name: "彩色时间轴模板" },
        { id: 2, name: "曲线时间轴模板" },
        { id: 3, name: "圆环标注模板"}
      ],
      colorList: [
        { id: 0, name: "天蓝色系"},
        { id: 1, name: "橙黄色系" },
        { id: 2, name: "粉红色系" },
        { id: 3, name: "淡绿色系"}
      ],
      templateSelected: options.template,
      colorSelected: options.color
    })
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

  }
})