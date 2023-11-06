// pages/generate/generate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    timelineList: [] // 时间轴模板列表数据
  },
  navigateToPage(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    });
  },
  addEvent(e) {
    const category = e.currentTarget.dataset.category;
    const index = e.currentTarget.dataset.index;
    console.log(category);
    console.log(index);
    wx.navigateTo({
      url: '/pages/generate/add_event/add_event?category=' + encodeURIComponent(category) + "&index=" + encodeURIComponent(index),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      timelineList: [
        { id: 0 , name:'美丽的模板'},
        { id: 1 , name:'艺术的模板'},
        { id: 2 , name:'无敌的模板'},
        { id: 3 , name:'超级的模板'}
      ]
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