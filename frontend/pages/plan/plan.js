// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoList: ['任务 1', '任务 2', '任务 3', '任务 4', '任务 5', '任务 6',  '任务 7' ],
    planList: ['英语能力提升', '钢琴计划', '计划 3', '计划 4', '计划 5'],
    host_: 'http://127.0.0.1:8090/'
  },

  goToTodoList(e) {
    const planValue = e.currentTarget.dataset.value;
    console.log(planValue);
    wx.navigateTo({
      url: '/pages/plan/todo/todo?plan=' + encodeURIComponent(planValue),
    })
  },
  showInput: function() {
    this.setData({
      showInput: true
    });
  },
  addPlan(e) {
    var that = this
    const value = e.detail.value;
    console.log(value)
    if (value) {
      console.log("here");
      this.setData({
        showInput: false,
      })
      wx.getStorage({
        key: 'openid',
        success: function(res)
        {
          let openid=res.data
          console.log('get openid', openid)
          wx.request({
            url: that.data.host_+'user/api/plan/add_plan',
            method: 'POST',
              header:
              {
                'content-type': 'application/json'
              },
              data:{
                'openid':openid,
                'title':value,
              },
              success: function(res)
              {
                console.log("add plan")
              },
              fail: function(res){
                console.log(res)
              }
          })
        }
      });
    }
    let planList = this.data.planList.slice()
    planList.push(value)
    this.setData({
      planList: planList,
      showInput: false
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