// pages/plan/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planValue: '',
    todoList: [{task: '软工ppt', ddl: '2023-11-08', complete: false}, 
                 {task: '软工中期答辩', ddl: '2023-11-09', complete: false}, 
                 {task: 'buflab', ddl: '2023-11-20', complete: false},
                 {task: 'FTP验收', ddl: '2023-11-4', complete: true},
                 {task: 'Project FTP', ddl: '2023-10-23', complete: true}],
    completeList: [],
    newTodo: ''
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
      ddl: 9,
      completed: false
    })
    let taskN = todoList.length-1
    const task = todoList.splice(taskN, 1)[0] // 去掉第k个元素
    var index
     {
      index = todoList.findIndex(obj => ! obj.complete)
      console.log(index)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
        console.log(index)
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且剩余天数更多的元素 的位置
        index = todoList.findIndex(obj => (! obj.complete && obj.ddl < task.ddl))
        console.log(index)
        if (index === -1) {
          // 未找到，插入到 第一个已完成元素 的位置
          index = todoList.findIndex(obj => obj.complete)
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
  },
  toggleComplete(e) {
    console.log('enter')
    //const index = e.currentTarget.dataset.index
    let todos = this.data.todos
    let values = e.detail.value
    console.log(values)
    console.log(e.currentTarget)
    // console.log(todos)
    // console.log(e.detail.value)
    for (let i = 0, lenI = todos.length; i < lenI; ++i) {
      // todos[i].completed = false
      console.log(todos[i].completed, todos[i].checked)

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (todos[i].value === values[j]) {
          todos[i].completed = true
          break
        }
      }
    }
    //todos[index].completed = !todos[index].completed
    //console.log(index, todos[index].completed)
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
    const index = e.currentTarget.dataset.index
    let todoList = this.data.todoList
    console.log(index)
    todoList[index].ddl = e.detail.value
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
  
  completeTask(e) {
    var taskN = parseInt(e.target.id.substring(8))
    console.log('index: ', taskN)
    var todoList = this.data.todoList
    const task = todoList.splice(taskN, 1)[0] // 去掉第k个元素
    var index
    if(! task.complete) {
      // 插入到 第一个已完成且剩余天数更多的元素 的位置
      index = todoList.findIndex(obj => (obj.complete && obj.ddl > task.ddl))
      if (index === -1) {
        // 未找到，插入到最后
        index = todoList.length 
      }
    }
    else {
      index = todoList.findIndex(obj => ! obj.complete)
      console.log(index)
      if (index === -1) {
        // 不存在未完成元素，直接插入到开头
        index = 0;
        console.log(index)
      }
      else{
        // 存在未完成元素，插入到 第一个未完成且剩余天数更多的元素 的位置
        index = todoList.findIndex(obj => (! obj.complete && obj.ddl > task.ddl))
        console.log(index)
        if (index === -1) {
          // 未找到，插入到 第一个已完成元素 的位置
          index = todoList.findIndex(obj => obj.complete)
          console.log(index)
          if(index === -1){
            // 未找到，插入到最后
            index = todoList.length 
            console.log(index)
          }
        }
      }
    }
    task.complete = ! task.complete
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
    const planValue = decodeURIComponent(options.plan);
    console.log('Received plan value:', planValue);
    this.setData({
      planValue: planValue
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