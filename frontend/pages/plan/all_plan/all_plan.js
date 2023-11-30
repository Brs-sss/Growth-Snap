// pages/plan/all_plan/all_plan.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: [],
    // host_: 'http://127.0.0.1:8090/'
    host_: `${app.globalData.localUrl}`,

  },

  loadPage() {
    var pointer = this
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        var openid = res.data
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/all' + '?openid=' + openid,
          method:'GET',
          success:function(res){
            pointer.setData({
              planList: res.data.plan_list
            })
          },
          fail:function (res) {
            console.log('fail to get')
            console.log(res)
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })
  },

  goToCreate(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/plan/create_plan/create_plan',
    })
  },

  goToTodo(e) {
    const planValue = e.currentTarget.dataset.value;
    console.log(planValue);
    wx.navigateTo({
      url: '/pages/plan/todo/todo?plan=' + encodeURIComponent(JSON.stringify(planValue))
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadPage()
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
    this.loadPage()
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