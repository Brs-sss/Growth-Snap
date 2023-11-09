// pages/plan/all_plan/all_plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: [{title:'代码能力提升', icon:'/image/plan/icons/computer.png'},
               {title:'钢琴计划', icon:'/image/plan/icons/piano.png'},
               {title:'英语考级', icon:'/image/plan/icons/piano.png'},
               {title:'阴阳师', icon:'/image/plan/icons/piano.png'},
               {title:'王者荣耀', icon:'/image/plan/icons/piano.png'},
               {title:'原神', icon:'/image/plan/icons/piano.png'},],
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

  goToTodo(e) {
    const planValue = e.currentTarget.dataset.value;
    console.log(planValue);
    wx.navigateTo({
      url: '/pages/plan/todo/todo?plan=' + encodeURIComponent(JSON.stringify(planValue))
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