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
        url: that.data.host_+'user/api/show/all'+'?openid='+openid+'&types=et&tags=true', //et表示只求取event和text
        method:'GET',
        success:function(res){
          let uniqueTags = new Set();
          let tag_to_eventIndex_dict = {}
          const eventList = res.data.blocks_list.map((blogCard,index) => {
              let {imgSrc}=blogCard;
              const { title, type, tags } = blogCard;
              tags.forEach(tag=>{
                uniqueTags.add(tag);
                if(tag_to_eventIndex_dict[tag]==undefined){
                  tag_to_eventIndex_dict[tag]=[index]
                }
                else{
                  tag_to_eventIndex_dict[tag].push(index)
                }
              })

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
              return { imgSrc, title, id, type, tags, checked: false };
            });
            that.setData({
              blog_cards_list: res.data.blocks_list,
              eventList: eventList,
              tags:Array.from(uniqueTags).map(tag=>{return {'info':tag,'checked':false}}),
              tag_to_event_index_dict:tag_to_eventIndex_dict,
            })
            console.log(that.data.tag_to_event_index_dict)
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
    selectedEvents: [], //已选中的事件列表(存的是index)
    selectedNum:0,
    blog_cards_list: [],
    tag_to_event_index_dict:{},
    comeFrom:null,
  },

  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedTags, eventList} = this.data;
    let { selectedEvents,selectedNum }=this.data;
    const tag = this.data.tags[index].info;
    const tagIndex = selectedTags.indexOf(tag);
    const relatedEvents=this.data.tag_to_event_index_dict[tag]
    if (tagIndex !== -1) {
      relatedEvents.forEach(idx=>{
        eventList[idx].checked=false;  //改变前端 
        selectedEvents=selectedEvents.filter(ele=>ele!==idx) //留下那些不在relatedEvents中的事件idx，改变发送表单
      })
      selectedNum=selectedEvents.length;
      selectedTags.splice(tagIndex, 1); // 取消选中标签
      this.data.tags[index].checked = false ;
    } else {
      selectedTags.push(tag); // 选中
      this.data.tags[index].checked = true ;
      relatedEvents.forEach(idx=>{
        eventList[idx].checked=true;  //改变前端 
      })
      selectedEvents=[...new Set([...selectedEvents,...relatedEvents])]
      selectedNum=selectedEvents.length
    }
    this.setData({
      selectedTags: selectedTags,
      eventList: eventList,
      selectedEvents:selectedEvents,
      selectedNum:selectedNum,
      ['tags[' + index + '].checked']: this.data.tags[index].checked 
    });
  },

  selectAll(e){
    let { eventList } = this.data;
    for(var i=0;i<eventList.length;i++){
      eventList[i].checked=true;
    }
    this.setData({
      eventList:eventList,
      selectedEvents:Array.from({ length: eventList.length }, (_, index) => index),
      selectedNum:eventList.length,
    })
  },

  disSelectAll(e){
    let { eventList } = this.data;
    for(var i=0;i<eventList.length;i++){
      eventList[i].checked=false;
    }
    this.setData({
      eventList:eventList,
      selectedEvents:[],
      selectedNum:0
    })
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
    this.setData({
      comeFrom:options.category,
    })
    console.log(this.data.comeFrom)
    var that = this
    loadPageInfo(that)
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