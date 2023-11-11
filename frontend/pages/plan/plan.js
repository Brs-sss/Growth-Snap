// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoList: [],
    completeList: [],
    planList: [],
    host_: 'http://127.0.0.1:8090/'
  },  

  onLoad(options) {
    var pointer = this
    wx.getStorage({
      key: 'openid',  // 获取openid
      success: function (res) { 
        var openid = res.data
        // 获取7天内的Todo
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/main?openid=' + openid,
          method: 'GET',
          success:function(res){
            // console.log(res.data)
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })


    this.setData({
      todoList: [{task: '软工ppt', leftDay: '1', complete: false}, 
                 {task: '软工中期答辩', leftDay: '2', complete: false}, 
                 {task: 'buflab', leftDay: '12', complete: false},
                 {task: '钢琴比赛', leftDay: '18', complete: false},
                 {task: '钢琴四级考试', leftDay: '22', complete: false},
                 {task: '钢琴二级考试', leftDay: '0', complete: true},
                 {task: 'FTP验收', leftDay: '0', complete: true},
                 {task: 'Project FTP', leftDay: '0', complete: true}],
      planList: [{title:'代码能力提升', icon:'/image/plan/icons/computer.png'},
                 {title:'钢琴计划', icon:'/image/plan/icons/piano.png'}],
      moreThan2: true
    })
  },

  goToTodoList(e) {
    const planValue = e.currentTarget.dataset.value;
    console.log(planValue);
    wx.navigateTo({
      url: '/pages/plan/todo/todo?plan=' + encodeURIComponent(JSON.stringify(planValue))
    })

  wx.request({
    url: 'url',
  })
  },

  goToAllPlan(e) {
    wx.navigateTo({
      url: '/pages/plan/all_plan/all_plan',
    })
  },

  completeTask(e) {
    var taskN = parseInt(e.target.id.substring(8))
    var todoList = this.data.todoList
    const task = todoList.splice(taskN, 1)[0] // 去掉第k个元素
    var index
    if(! task.complete) {
      // 插入到 第一个已完成且剩余天数更多的元素 的位置
      index = todoList.findIndex(obj => (obj.complete && obj.leftDay > task.leftDay))
      if (index === -1) {
        // 未找到，插入到最后
        index = todoList.length 
      }
    }
    else {
      index = todoList.findIndex(obj => ! obj.complete)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且剩余天数更多的元素 的位置
        index = todoList.findIndex(obj => (! obj.complete && obj.leftDay > task.leftDay))
        if (index === -1) {
          // 未找到，插入到 第一个已完成元素 的位置
          index = todoList.findIndex(obj => obj.complete)
          if(index === -1){
            // 未找到，插入到最后
            index = todoList.length 
          }
        }
      }
    }
    task.complete = ! task.complete
    todoList.splice(index, 0, task) // 插入
    this.setData({
      todoList: todoList
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