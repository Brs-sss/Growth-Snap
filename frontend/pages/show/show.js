// pages/show/show.js

/*这个BlogCard类是用于封装正在主页展示的内容的，所以没有tags等内容，且imgSrc只有一张（封面图），更多的内容应当等待用户点开一个卡片后再做加载,所有参数就是exactly在主页展示的，因此传入之前要处理成合适的格式，例如日期、月份、过长content的省略等*/
class BlogCard{
  constructor(type,title,content,author,month,day,year,imgSrc,event_id){
    this.type=type   //type=[event,text,data] 在wxml中用于决定展示哪一种样式
    this.title=title
    this.content=content
    this.author=author
    this.month=month
    this.day=day
    this.year=year
    this.imgSrc=imgSrc
    this.event_id=event_id //用于将来用户点一个具体card时，后端可以根据此返回详细信息
  }

}

/* 与后端联系，获取主页的内容*/
function LoadShowPage(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/show/all'+'?openid='+openid,
        method:'GET',
        success:function(res){
            that.setData({
              blog_cards_list:res.data.blocks_list
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

Page({
  /**
   * 页面的初始数据
   */
  data: {
    popupVisible: false, // 控制浮窗气泡显示隐藏的状态
    blog_cards_list:[],  //所有卡片BlogCard的list
    host_: 'http://127.0.0.1:8090/'
  },
  showPopup() {
    this.setData({
      popupVisible: true
    });
  },
  hidePopup() {
    this.setData({
      popupVisible: false
    });
  },
  goToPage_event() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/event/event',
    })
  },
  goToPage_text() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/text/text',
    })
  },
  goToPage_data() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/data/data',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    LoadShowPage(that)
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
    LoadShowPage(that)
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