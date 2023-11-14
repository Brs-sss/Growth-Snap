// pages/user/family/family.js
function LoadFamilyPage(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/user/get_family_info'+'?openid='+openid,
        method:'GET',
        success:function(res){
            that.setData({
              blog_cards_list:res.data.family_list
            })
            console.log(that.data.blog_cards_list)
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
    ],
    blog_cards_list:[],  //所有卡片BlogCard的list
    host_: `${app.globalData.localUrl}`,
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
    var that = this
    LoadFamilyPage(that)
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
    LoadFamilyPage(that)
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