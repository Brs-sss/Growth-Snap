// pages/generate/add_event/add_event.js

/* 与后端联系，获取主页的内容*/
function loadPageInfo(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/show/all'+'?openid='+openid,
        method:'GET',
        success:function(res){
            const tags = [];
            const eventList = res.data.blocks_list.map((blogCard) => {
              const { imgSrc, title, event_id , tags} = blogCard;
              return { imgSrc, title, event_id, tags, checked: false };
            });
            eventList.forEach(event => {
              // 遍历每个事件的tags列表，并将其元素添加到tagList中（去重）
              event.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                  tags.push({info: tag, checked: false});
                }
              });
            });
            that.setData({
              blog_cards_list: res.data.blocks_list,
              eventList: eventList,
              tags: tags
            })
            console.log(res.data.blocks_list)
        },
        fail:function(res){
          console.log('load page failed: ',res)
        }
      })
    },
    fail:function(res){
      console.log('get openid failed: ',res)
    }
   })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    host_: 'http://127.0.0.1:8090/',
    generateCategory:'',
    templateIndex: '',
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    eventList: [], //事件列表
    selectedEvents: [], //已选中的事件列表
    blog_cards_list: []
  },
  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedTags, selectedEvents, eventList } = this.data;
    const tag = this.data.tags[index].info;
    const tagIndex = selectedTags.indexOf(tag);
    if (tagIndex !== -1) {
      eventList.forEach(event => {
        if (event.tags.includes(tag)) {
          const eventIndex = selectedEvents.indexOf(event);
          selectedEvents.splice(eventIndex, 1);
          event.checked = false;
        }
      });
      selectedTags.splice(tagIndex, 1); // 取消选中
      this.data.tags[index].checked = false ;
    } else {
      selectedTags.push(tag); // 选中
      this.data.tags[index].checked = true ;
      eventList.forEach(event => {
        if (event.tags.includes(tag)) {
          selectedEvents.push(event); 
          event.checked = true;
        }
      });
    }
    console.log(selectedEvents);
    this.setData({
      selectedTags: selectedTags,
      selectedEvents: selectedEvents,
      eventList: eventList,
      ['tags[' + index + '].checked']: this.data.tags[index].checked 
    });
  },
  selectEvent: function(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedEvents } = this.data;
    const event = this.data.eventList[index].title;
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
    // 获取要生成的类型
    // const category = decodeURIComponent(options.category);
    // const index = decodeURIComponent(options.index);
    var that = this
    loadPageInfo(that)
    this.setData({
      // generateCategory: category,
      // templateIndex: index,
      // tags: [
      //   {info: '超级帅哥', checked: false},
      //   {info: '自然', checked: false},
      //   {info: '阅读', checked: false},
      //   {info: '生日', checked: false},
      // ]
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