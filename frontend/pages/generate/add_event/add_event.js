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
        url: that.data.host_+'user/api/show/all'+'?openid='+openid+'&types=et', //et表示只求取event和text
        method:'GET',
        success:function(res){
            const eventList = res.data.blocks_list.map((blogCard) => {
              let {imgSrc}=blogCard;
              const {  title, type } = blogCard;
              var id;
              if(type=='event'){
                const {event_id}=blogCard
                id=event_id
              }
              else if(type=='text'){
                const {text_id}=blogCard
                id=text_id
              }
              
              (imgSrc==undefined)?imgSrc='/image/show/txt.png':null;
              return { imgSrc, title, id, type, checked: false };
            });
            that.setData({
              blog_cards_list: res.data.blocks_list,
              eventList: eventList,
            })
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
    selectedNum:0,
    blog_cards_list: [],
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
    let { selectedEvents,selectedNum } = this.data;
    const eventIndex = selectedEvents.indexOf(index);
    if (eventIndex !== -1) {
      selectedEvents.splice(eventIndex, 1); // 取消选中
      selectedNum--;
      this.data.eventList[index].checked = false ;
    } else {
      selectedEvents.push(index); // 选中
      selectedNum++;
      this.data.eventList[index].checked = true ;
    }
    this.setData({
      selectedEvents: selectedEvents,
      selectedNum:selectedNum,
      ['eventList[' + index + '].checked']: this.data.eventList[index].checked 
    });
  },

  handleSubmit(e){

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
      tags: [
        {info: '亲子', checked: false},
        {info: '自然', checked: false},
        {info: '阅读', checked: false},
        {info: '生日', checked: false},
        {info: '亲子活动', checked: false},
        {info: '自然世界', checked: false},
        {info: '阅读快乐', checked: false},
        {info: '生日派对真不错', checked: false},
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