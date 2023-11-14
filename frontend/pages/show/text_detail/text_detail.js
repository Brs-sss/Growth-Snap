// pages/show/text_detail/text_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:null,
    title:null,
    text:null,
    tags:[],
    tags_string:null,
    host_: 'http://127.0.0.1:8090/',
    text_id:null,
},
deleteThis(e){
  var that = this
  wx.showModal({
    title: '确认操作',
    content: '确定删除此篇文字',
    success: function (res) {
      if (res.confirm) {
        wx.request({
          url: that.data.host_+'user/api/show/text/delete'+'?text_id='+that.data.text_id,
          method:'GET',
          success:function(res){
            if(res.data.msg='ok'){
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 1000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack(1) //成功提交，返回上个页面
                    }, 1000)
                  }
                })
            }
            else{
              wx.showToast({
                title: "删除失败",
                icon: 'error',
                duration: 1000,
              })
            }
          },
          fail:function(res){

          }
        })
      } else if (res.cancel) {
        return;
      }
    }
  });
  

},

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad(options) {
    var that = this
    const text_id=options.text_id;
    this.setData({
      text_id:text_id,
    })
    console.log('detail text id:',text_id)
    wx.request({
      url: that.data.host_+'user/api/show/text/detail'+'?text_id='+text_id,
      method:'GET',
      success:function(res){
          const block=res.data.block_item
          that.setData({
            date:block.year+"年"+block.month+block.day+"日",
            title:block.title,
            text:block.content,
            tags:block.tags,
            tags_string:block.tags.length?block.tags.map((ele)=> ("#"+ele)).join(" "):"",
          })

      },
      fail:function(res){
        console.log('load page failed: ',res)
      }
    
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