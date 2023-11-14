// pages/user/user.js

// const { noneParamsEaseFuncs } = require("XrFrame/xrFrameSystem")

/* 与后端联系，获取user页的内容*/
function LoadUserPage(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/user/get_user_info'+'?openid='+openid,
        method:'GET',
        success:function(res){
            that.setData({
              user_profile:res.data.profile_image,
              user_label: res.data.label,
              username: res.data.username,
              event_number: res.data.event_number,
              plan_number:res.data.plan_number
            })
        },
        fail:function(res){
          console.log('load page failed: ',res)
        }
      
      })
    },
    fail:function(res){
      console.log('get openid failed: ',res)
    }
   })
}

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_profile: '',
    host_: `${app.globalData.localUrl}`,
    username: '',
    user_label: '',
    event_number: 0,
    plan_number: 0
  },
  goToPage_family() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/user/family/family',
    })
  },
  goToPage_child() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/user/child/child',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    LoadUserPage(that)
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
    var that = this
    LoadUserPage(that)

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