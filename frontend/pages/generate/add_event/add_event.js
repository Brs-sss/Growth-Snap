// pages/generate/add_event/add_event.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    generateCategory:'',
    templateIndex: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const category = decodeURIComponent(options.category);
    const index = decodeURIComponent(options.index);
    console.log('category', category);
    this.setData({
      generateCategory: category,
      templateIndex: index
    });
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