// pages/user/child/child.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kidList: [
      {
        profile: "/image/user/profile/xiaoming.png",
        name: "小明",
        age: "7",
        height: "145",
        weight: "45"
      },
      {
        profile: "/image/user/profile/meimei.png",
        name: "妹妹",
        age: "5",
        height: "132",
        weight: "33"
      },
      // 其他家庭成员...
    ]
  },

  goToPage_addchild(){
    wx.navigateTo({
      url: '/pages/user/child/addchild/addchild',
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

  }
})