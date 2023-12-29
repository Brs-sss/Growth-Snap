// pages/plan/plan.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todoList: [],
    planList: [],
    centerNum: 0,
    host_: `${app.globalData.localUrl}`
  },  

  loadPage() {
    var pointer = this
    console.log('plan load')
    wx.getStorage({
      key: 'openid',  // 获取openid
      success: function (res) { 
        var openid = res.data
        // 获取7天内的Todo
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/main?openid=' + openid,
          method: 'GET',
          success:function(res){
            console.log(res)
            var todoList = res.data.not_finished_todo_list
            todoList = todoList.concat(res.data.finished_todo_list)
            console.log(todoList)
            pointer.setData({
              todoList: todoList,
              planList: res.data.plan_list
            })
          },
          fail: function (res) {
            console.log(res)
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })

    // 设置计划固定位置上侧的最大元素个数
    // const query = wx.createSelectorQuery()
    // // 选择页面根节点
    // query.selectViewport().boundingClientRect(function (rect) {
    //   var item_height = 0.04 * rect.height + 24
    //   var left = 0.40 * rect.height - 36
    //   console.log(item_height, left)
    //   var centerNum = Math.floor(left / item_height)
    //   console.log('个数:', centerNum)
    //   pointer.setData({
    //     centerNum: centerNum
    //   })
    // }).exec()
  },

  goToTodoList(e) {
    const planValue = e.currentTarget.dataset.value;
    console.log(planValue);
    wx.navigateTo({
      url: '/plan/pages/todo/todo?plan=' + encodeURIComponent(JSON.stringify(planValue))
    })

  wx.request({
    url: 'url',
  })
  },

  goToAllPlan(e) {
    wx.navigateTo({
      url: '/plan/pages/all_plan/all_plan',
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
    console.log(todoList)

    // 与后端通信，更新数据
    var pointer = this
    wx.getStorage({
      key: 'openid',  // 获取openid
      success: function (res) { 
        var openid = res.data
        // 获取7天内的Todo
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/update_todo',
          method: 'POST',
          header:{
            'content-type': 'application/json'
          },
          data: {
            'openid': openid,
            'content': 'finish',
            'id': task.todo_id,
            'finish': task.complete
          },
          success:function(res){
            console.log('更改成功', res)
          },
          fail:function (res) {
            console.log('更改失败', res)
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
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