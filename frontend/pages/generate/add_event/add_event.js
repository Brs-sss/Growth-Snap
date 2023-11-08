// pages/generate/add_event/add_event.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    generateCategory:'',
    templateIndex: '',
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    eventList: [], //事件列表
    selectedEvents: [], //已选中的事件列表
  },
  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedTags, eventList } = this.data;
    const tag = this.data.tags[index].info;
    const tagIndex = selectedTags.indexOf(tag);
    if (tagIndex !== -1) {
      eventList.forEach(event => {
        if (selectedTags.some(selectedTag => event.tags.includes(selectedTag))) {
          event.checked = false;
        }
      });
      selectedTags.splice(tagIndex, 1); // 取消选中
      this.data.tags[index].checked = false ;
    } else {
      selectedTags.push(tag); // 选中
      this.data.tags[index].checked = true ;
      eventList.forEach(event => {
        if (selectedTags.some(selectedTag => event.tags.includes(selectedTag))) {
          event.checked = true;
        }
      });
    }
    this.setData({
      selectedTags: selectedTags,
      eventList: eventList,
      ['tags[' + index + '].checked']: this.data.tags[index].checked 
    });
  },
  selectEvent: function(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedEvents } = this.data;
    const event = this.data.eventList[index].info;
    const eventIndex = selectedEvents.indexOf(event);
    if (eventIndex !== -1) {
      selectedEvents.splice(eventIndex, 1); // 取消选中
      this.data.eventList[index].checked = false ;
    } else {
      selectedEvents.push(event); // 选中
      this.data.eventList[index].checked = true ;
    }
    this.setData({
      selectedEvents: selectedEvents,
      ['eventList[' + index + '].checked']: this.data.eventList[index].checked 
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // const category = decodeURIComponent(options.category);
    // const index = decodeURIComponent(options.index);
    this.setData({
      // generateCategory: category,
      // templateIndex: index,
      tags: [
        {info: '亲子', checked: false},
        {info: '自然', checked: false},
        {info: '阅读', checked: false},
        {info: '生日', checked: false},
      ],
      eventList: [
        {id: 0, title: '今天带小明感受大自然', tags: ['亲子', '自然'], checked: false},
        {id: 1, title: '小明在书店买了自己喜欢的书', tags: ['亲子', '阅读'], checked: false},
        {id: 2, title: '小明七岁生日', tags: ['生日'], checked: false},
      ]
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