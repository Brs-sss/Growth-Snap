// pages/plan/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planValue: '',
    icon: '',
    todoList: [{task: '软工ppt', ddl: '2023-11-08', check: false}, 
                 {task: '软工中期答辩', ddl: '2023-11-09', check: false}, 
                 {task: 'buflab', ddl: '2023-11-20', check: false},
                 {task: 'FTP验收', ddl: '2023-11-04', check: true},
                 {task: 'Project FTP', ddl: '2023-10-23', check: true}],
    checkList: [],
    newTodo: '',
    today:'',
    a_week_later:''
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
    let todoList = this.data.todoList.slice()
    todoList.push({
      task: value,
      ddl: this.data.today,
      check: false
    })
    let taskN = todoList.length-1
    const task = todoList.splice(taskN, 1)[0] // 去掉第k个元素
    var index
     {
      index = todoList.findIndex(obj => ! obj.check)
      console.log(index)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
        console.log(index)
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且剩余天数更多的元素 的位置
        index = todoList.findIndex(obj => (! obj.check && obj.ddl < task.ddl))
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
      todoList: todoList,
      showInput: false
    })

    // 与后端通信，新建Todo
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        var openid = res.data
        wx.request({
          url: pointer.data.host_ + 'user/api/plan/add_todo',
          method:'POST',
          header:{
            'content-type': 'application/json'
          },
          data:{
            'openid':openid,
            'title':pointer.data.planValue,
            'deadline':pointer.data.records,
            'date':formattedDate,
            'time':currentTimeString,
          },
          success: function(res) {
            wx.navigateBack(1) //成功提交，返回上个页面
          },
          fail: function(res) {
            console.error('上传失败', res);
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })
  },

  toggleComplete(e) {
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
    const index = e.currentTarget.dataset.index
    console.log(index)
    let todos = this.data.todoList.slice()
    todos.splice(index, 1)
    this.setData({
      todoList: todos
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
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
    var formattedDate = parts[0] + '-' + parts[2] + '-' + parts[1];
    var parts = today_formatted.split('/');
    // 构建转换后的日期字符串
    var formattedToday = parts[0] + '-' + parts[2] + '-' + parts[1];
    console.log(formattedToday)
    this.setData({
      planValue: Value.title,
      icon:Value.icon,
      today: formattedToday,
      a_week_later: formattedDate
    });
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