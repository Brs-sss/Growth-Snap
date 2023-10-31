// pages/plan/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos: [],
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
    if (!value) {
      this.setData({
        showInput: false
      })
      return
    }
    let todos = this.data.todos.slice()
    todos.push({
      title: value,
      completed: false
    })
    this.setData({
      todos: todos,
      showInput: false
    })
  },
  toggleComplete(e) {
    const index = e.currentTarget.dataset.index
    let todos = this.data.todos.slice()
    todos[index].completed = !todos[index].completed
    this.setData({
      todos: todos
    })
  },
  deleteTodo: function (e) {
    const index = e.currentTarget.dataset.index
    let todos = this.data.todos.slice()
    todos.splice(index, 1)
    this.setData({
      todos: todos
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