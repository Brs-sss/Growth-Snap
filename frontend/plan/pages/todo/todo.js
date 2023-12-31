// pages/plan/todo/todo.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planTitle: '',
    icon: '',
    todoList: [],
    childList:[],
    newTodo: '',
    today:'',
    a_week_later:'',
    // host_: 'http://127.0.0.1:8090/'
    host_: `${app.globalData.localUrl}`,

  },

  loadTodos() {
    var pointer = this
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        var openid = res.data
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/certain_plan' + 
               '?openid=' + openid + '&plan=' + pointer.data.planTitle,
          method:'GET',
          success:function(res){
            console.log('childList', res.data.childList)
            pointer.setData({
              todoList: res.data.todos,
              childList: res.data.childList
            })
          },
          fail:function (res) {
            console.log('fail to get', res)
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })
  },

  inputChange(e) {
    this.setData({
      newTodo: e.detail.value
    })
  },

  showInput: function() {
    this.setData({
      showInput: true
    });
  },

  deletePlan(){
    var pointer = this
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        var openid = res.data
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/delete_plan',
          method:'POST',
          header:{
            'content-type': 'application/json'
          },
          data:{
            'openid': openid,
            'planTitle': pointer.data.planTitle
          },
          success:function(res){
            wx.navigateBack({
              delta: 1
            })
          },
          fail:function (res) {
            console.log('fail to delete', res)
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })
  },
  addTodo(e) {
    const value = e.detail.value;
    var pointer = this
    console.log(value)

    if (!value) {
      console.log("here");
      this.setData({
        showInput: false
      })
      return
    }

    let todoList = this.data.todoList
    // 新增todo
    var task = {
      task: value,
      ddl: this.data.today,
      check: false
    }

    var index
    // 添加新增todo至对应位置
    {
      // 未完成的改变时间
      index = todoList.findIndex(obj => ! obj.check)
      console.log(index)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
        console.log(index)
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且ddl更后的元素 的位置
        console.log("difference:", this.calculateDaysDifference(task.ddl))
        index = todoList.findIndex(obj => (! obj.check && this.calculateDaysDifference(obj.ddl) >= this.calculateDaysDifference(task.ddl)))
        console.log(index)
        if (index === -1) {
          // 未找到，插入到 第一个已完成元素 的位置
          index = todoList.findIndex(obj => obj.check)
          console.log(index)
          if(index === -1){
            // 未找到，插入到最后
            index = todoList.length 
            console.log(index)
          }
        }
      }
    }
    console.log('final index: ', index)
    todoList.splice(index, 0, task) // 插入

    // 与后端通信，新建Todo
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        const openid = res.data
        const currentDateAndTime = new Date();
        const generate = openid + value + currentDateAndTime.toDateString()
                         + currentDateAndTime.toTimeString();
        wx.request({  // 获取SHA256键值
          url: pointer.data.host_ + 'user/api/getSHA256' + '?text=' + generate,
          method:'GET',
          success:function(res){
            const todo_id = res.data.sha256;
            todoList[index].todo_id = todo_id
            wx.request({  // 上传todo
              url: pointer.data.host_ + 'user/api/plan/add_todo',
              method:'POST',
              header:{
                'content-type': 'application/json'
              },
              data:{
                'openid': openid,
                'title': value,
                'deadline': pointer.data.today,
                'id': todo_id,
                'planTitle': pointer.data.planTitle
              },
              success: function(res) {
                console.log('上传成功', res);
              },
              fail: function(res) {
                console.error('上传失败', res);
              }
            });
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })

    this.setData({
      todoList: todoList,
      showInput: false
    })
  },

  toggleComplete(e) {
    var pointer = this
    console.log('enter')
    //const index = e.currentTarget.dataset.index
    let todos = this.data.todos
    let values = e.detail.value
    console.log(e)
    console.log(values)
    console.log(e.currentTarget)
    // console.log(todos)
    // console.log(e.detail.value)
    for (let i = 0, lenI = todos.length; i < lenI; ++i) {
      // todos[i].checkd = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (todos[i].value === values[j]) {
          todos[i].checkd = true
          break
        }
      }
    }
    //todos[index].checkd = !todos[index].checkd
    //console.log(index, todos[index].checkd)
    this.setData({
      todos: todos
    })
  },

  deleteTodo: function (e) {
    var pointer = this
    const index = e.currentTarget.dataset.index
    console.log(index)
    let todos = this.data.todoList.slice()
    var id = todos.splice(index, 1)[0].todo_id
    this.setData({
      todoList: todos
    })

    // 与后端通信，更新数据
    // 与后端通信，更新数据
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
            'content': 'delete',
            'id': id,
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

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.currentTarget.dataset.index
    let todoList = this.data.todoList
    console.log(index)
    console.log("here11")
    todoList[index].ddl = e.detail.value
    console.log("here")
    const task = todoList.splice(index, 1)[0] // 去掉第k个元素
    console.log("task:", task)
    if(task.check) {
      // 已完成的改变时间
      // 插入到 第一个已完成且剩余天数更多的元素 的位置
      index = todoList.findIndex(obj => (obj.check && this.calculateDaysDifference(obj.ddl) > this.calculateDaysDifference(task.ddl)))
      if (index === -1) {
        // 未找到，插入到最后
        index = todoList.length 
      }
    }
    else {
      // 未完成的改变时间
      index = todoList.findIndex(obj => ! obj.check)
      console.log(index)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
        console.log(index)
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且ddl更后的元素 的位置
        console.log("difference:", this.calculateDaysDifference(task.ddl))
        index = todoList.findIndex(obj => (! obj.check && this.calculateDaysDifference(obj.ddl) >= this.calculateDaysDifference(task.ddl)))
        console.log(index)
        if (index === -1) {
          // 未找到，插入到 第一个已完成元素 的位置
          index = todoList.findIndex(obj => obj.check)
          console.log(index)
          if(index === -1){
            // 未找到，插入到最后
            index = todoList.length 
            console.log(index)
          }
        }
      }
    }
    console.log('final index: ', index)
    todoList.splice(index, 0, task) // 插入
    this.setData({
      todoList: todoList
    })

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
            'content': 'ddl',
            'id': task.todo_id,
            'ddl': task.ddl
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

  calculateDaysDifference(dateString) {
    // 获取今天的日期
    var today = new Date();
    // 创建一个表示给定日期的Date对象
    var givenDate = new Date(dateString);
    // 计算给定日期和今天之间的时间差（以毫秒为单位）
    var timeDiff = givenDate.getTime() - today.getTime();
    // 将时间差转换为天数
    var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(today, givenDate, daysDiff)
    return daysDiff;
  },
  
  checkTask(e) {
    var pointer = this
    var taskN = parseInt(e.target.id.substring(8))
    console.log('index: ', taskN)
    var todoList = this.data.todoList
    const task = todoList.splice(taskN, 1)[0] // 去掉第k个元素
    var index
    if(! task.check) {
      // 没完成的要更新为完成的
      // 插入到 第一个已完成且剩余天数更多的元素 的位置
      index = todoList.findIndex(obj => (obj.check && this.calculateDaysDifference(obj.ddl) > this.calculateDaysDifference(task.ddl)))
      if (index === -1) {
        // 未找到，插入到最后
        index = todoList.length 
      }
    }
    else {
      // 完成的要更新为未完成
      index = todoList.findIndex(obj => ! obj.check)
      console.log(index)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
        console.log(index)
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且ddl更后的元素 的位置
        console.log("difference:", this.calculateDaysDifference(task.ddl))
        index = todoList.findIndex(obj => (! obj.check && this.calculateDaysDifference(obj.ddl) > this.calculateDaysDifference(task.ddl)))
        console.log(index)
        if (index === -1) {
          // 未找到，插入到 第一个已完成元素 的位置
          index = todoList.findIndex(obj => obj.check)
          console.log(index)
          if(index === -1){
            // 未找到，插入到最后
            index = todoList.length 
            console.log(index)
          }
        }
      }
    }
    task.check = ! task.check
    console.log('final index: ', index)
    todoList.splice(index, 0, task) // 插入
    this.setData({
      todoList: todoList
    })

    // 与后端通信，更新数据
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
            'finish': task.check
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
    const Value = JSON.parse(decodeURIComponent(options.plan));
    console.log('Received plan value:', Value);
    let today = new Date()
    console.log(today.toLocaleString())
    let today_formatted = today.toLocaleDateString();
    // 获取今天的时间戳（以毫秒为单位）
    var timestamp = today.getTime();
    // 计算一周后的时间戳（7天后）
    var oneWeekLaterTimestamp = timestamp + (7 * 24 * 60 * 60 * 1000);
    // 创建表示一周后日期的 Date 对象
    var oneWeekLater = new Date(oneWeekLaterTimestamp);
    let oneWeekLater_formatted = oneWeekLater.toLocaleDateString();
    console.log(oneWeekLater_formatted)
    // 使用字符串操作方法拆分日期字符串
    var parts = oneWeekLater_formatted.split('/');
    // 构建转换后的日期字符串
    var formattedDate = parts[0] + '-' + parts[1] + '-' + parts[2];
    if (parts[2].length == 4){
      formattedDate = parts[2] + '-' + parts[0] + '-' + parts[1];
    }
    var parts = today_formatted.split('/');
    // 构建转换后的日期字符串
    var formattedToday = parts[0] + '-' + parts[1] + '-' + parts[2];
    if (parts[2].length == 4){
      formattedToday = parts[2] + '-' + parts[0] + '-' + parts[1];
    }
    console.log(formattedToday)
    this.setData({
      planTitle: Value.title,
      icon: Value.icon,
      today: formattedToday,
      a_week_later: formattedDate
    });

    this.loadTodos()
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
    this.loadTodos()
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