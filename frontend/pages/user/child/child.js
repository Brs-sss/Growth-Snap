// pages/user/child/child.js


/* 与后端联系，获取主页的内容*/
function LoadChildPage(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/user/children_info'+'?openid='+openid,
        method:'GET',
        success:function(res){
            that.setData({
              blog_cards_list:res.data.children_list
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
    ],
    blog_cards_list:[],  //所有卡片BlogCard的list
    host_: `${app.globalData.localUrl}`,
  },
  goToPage_addchild(){
    wx.navigateTo({
      url: '/pages/user/child/addchild/addchild',
    })
  },
  goToPage_detail: function(e){
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/user/child/child_detail/child_detail' + '?index=' + encodeURIComponent(index),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    LoadChildPage(that)
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
    LoadChildPage(that)
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