// pages/user/family/family.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyMembers: [
      {
        profile: "/image/user/profile/mom.png",
        name: "小明妈",
        tag: "妈妈",
        signature: "这里是个性签名1"
      },
      {
        profile: "/image/user/profile/dad.png",
        name: "小明爸",
        tag: "爸爸",
        signature: "这里是个性签名2"
      },
      // 其他家庭成员...
    ]
  },
  goToPage_addmember() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/user/family/addmember/addmember',
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