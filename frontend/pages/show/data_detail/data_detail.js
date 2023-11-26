// pages/show/data_detail/data_detail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_id: "",
    records: [{key: "身高", value: "120"}, 
              {key: "体重", value: "43"},
              {key: "数学成绩", value: "99"}],
    date: "2023年11月21日",
    host_: `${app.globalData.localUrl}`
  },

  /**
   * 与后端通信，删除该记录
   */
  deleteThis() {
    var that = this
    wx.showModal({
      title: '确认操作',
      content: '确定删除此数据记录？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.host_+'user/api/show/data/delete'+'?data_id='+that.data.data_id,
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
              wx.showToast({
                title: "删除失败",
                icon: 'error',
                duration: 1000,
              })
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
      const data_id = options.data_id;
      console.log('detail data id:', data_id)
      wx.request({
        url: that.data.host_+'user/api/show/data/detail'+'?data_id='+data_id,
        method:'GET',
        success:function(res){
            const data_item = res.data.data_item
            console.log(data_item)
            that.setData({
              data_id: data_id,
              date: data_item.date,
              records: data_item.records
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