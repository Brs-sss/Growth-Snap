// pages/plan/all_plan/all_plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: ['钢琴计划', '英语', '物理竞赛', '少儿编程', '软工迭代计划', '阴阳师爬塔', '原神', '王者荣耀'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var bgList = []
    var bgNum = 7
    for(var i = 0; i < this.data.planList.length; i++){
      bgList.push(i % bgNum)
    }
    console.log(bgList)
    this.setData({
      bgList: bgList
    })
  },

  goToCreate(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/plan/create_plan/create_plan',
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