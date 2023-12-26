// pages/show/seach_result/search_result.js

/*这个BlogCard类是用于封装正在主页展示的内容的，所以没有tags等内容，且imgSrc只有一张（封面图），更多的内容应当等待用户点开一个卡片后再做加载,所有参数就是exactly在主页展示的，因此传入之前要处理成合适的格式，例如日期、月份、过长content的省略等*/
class BlogCard{
  constructor(type,title,content,author,month,day,year,imgSrc,event_id){
    this.type=type   //type=[event,text,data] 在wxml中用于决定展示哪一种样式
    this.title=title
    this.content=content
    this.author=author
    this.month=month
    this.day=day
    this.year=year
    this.imgSrc=imgSrc
    this.event_id=event_id //用于将来用户点一个具体card时，后端可以根据此返回详细信息
  }

}


/* 与后端联系，获取主页的内容*/
function LoadShowPage(that){
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        // 修改为搜索的API，需要后端返回针对关键字搜索的结果：事件/文字列表
        url: that.data.host_+'user/api/show/search'+'?openid='+openid+'&searchKey='+encodeURIComponent(that.data.searchKey),
        method:'GET',
        success:function(res){
            console.log(res)
            let uniqueTags = new Set();
            let tag_to_eventIndex_dict = {}
            const eventList = res.data.blocks_list.map((blogCard,index) => {
              let {imgSrc}=blogCard;
              var { title, type, tags } = blogCard;
              console.log(blogCard)
              if(blogCard.hasOwnProperty("tags")){
                tags.forEach(tag=>{
                  uniqueTags.add(tag);
                  if(tag_to_eventIndex_dict[tag]==undefined){
                    tag_to_eventIndex_dict[tag]=[index]
                  }
                  else{
                    tag_to_eventIndex_dict[tag].push(index)
                  }
                })
              }

              var id;
              if(type=='event'){
                const {event_id}=blogCard
                id=event_id
              }
              else if(type=='text'){
                const {text_id}=blogCard
                id=text_id
              }
              
              return { imgSrc, title, id, type, tags, checked: false };
            });
            let tag_array=Array.from(uniqueTags).map(tag=>{return {'info':tag,'checked':false}})
            that.setData({
              blog_cards_list:res.data.blocks_list,
              eventList: res.data.blocks_list,
              tags: tag_array,
              tag_to_eventIndex_dict: tag_to_eventIndex_dict
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

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    popupVisible: false, // 控制浮窗气泡显示隐藏的状态
    blog_cards_list:[],  //所有卡片BlogCard的list
    host_: `${app.globalData.localUrl}`,
    searchKey: '', // 搜索关键词
    tags: [], // 已保存的标签列表
    isTagsEmpty:false,
    selectedTags: [], // 已选中的标签列表
    tag_to_eventIndex_dict: {},
    eventList: [],
    timeText: '按时间正序',
    time: 0, //标记时间顺序
    corre: 0, //相关性 
  },
  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedTags, eventList} = this.data;
    const tag = this.data.tags[index].info;
    const tagIndex = selectedTags.indexOf(tag);
    var relatedEvents=this.data.tag_to_eventIndex_dict[tag];
    console.log(selectedTags)
    var selectedEvents = []
    if(selectedTags.length!==0)
      selectedEvents = this.data.blog_cards_list
    if (tagIndex !== -1) {
      selectedEvents = [];
      selectedTags.splice(tagIndex, 1); // 取消选中标签
      this.data.tags[index].checked = false ;
      selectedTags.forEach(item=>{
        console.log(item);
        relatedEvents=this.data.tag_to_eventIndex_dict[item];
        relatedEvents.forEach(idx=>{
          var eventIndex = selectedEvents.indexOf(eventList[idx])
          console.log(eventIndex)
          if(eventIndex == -1){
            selectedEvents.push(eventList[idx])
          }
        })
      })
    } else {
      selectedTags.push(tag); // 选中
      this.data.tags[index].checked = true ;
      relatedEvents.forEach(idx=>{
        var eventIndex = selectedEvents.indexOf(eventList[idx])
        console.log(eventIndex)
        if(eventIndex == -1){
          selectedEvents.push(eventList[idx])
        }
      })
    }
    console.log(selectedEvents)
    selectedEvents.sort((a, b) => {
      const dateA = new Date(`${a.year}-${parseInt(a.month)}-${a.day}`);
      const dateB = new Date(`${b.year}-${parseInt(b.month)}-${b.day}`);
      return dateA - dateB;
    });
    this.setData({
      selectedTags: selectedTags,
      eventList: eventList,
      ['tags[' + index + '].checked']: this.data.tags[index].checked,
      blog_cards_list: selectedEvents
    });
  },
  toggleCorreTag: function(e) {
    var selectedEvents = this.data.blog_cards_list
    var { corre } = this.data;
    corre = 1 - corre

    if(corre){
      selectedEvents.sort((a, b) => {
        return b.similarity - a.similarity;
      });
    }else{
      selectedEvents.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateB - dateA;
      });
    }

    // 时间恢复缺省状态
    var time = 0;
    var timeText = '按时间正序'

    this.setData({
      time: time,
      timeText: timeText,
      blog_cards_list: selectedEvents,
      corre: corre
    });
  },
  toggleTimeTag: function(e) {
    var selectedEvents = this.data.blog_cards_list
    var { time, timeText} = this.data;
    time = 1 - time;
    if(time){
      // 最新的放前面
      timeText = '按时间正序'
      selectedEvents.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateB - dateA;
      });
    }else{
      // 最新的放后面
      timeText = '按时间倒序'
      selectedEvents.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateA - dateB;
      });
    }
    // 相关性恢复初始状态
    // 时间恢复缺省状态
    var corre = 0;

    this.setData({
      time: time,
      timeText: timeText,
      blog_cards_list: selectedEvents,
      corre: corre
    });
  },
  showDetail(e){  //进入详细展示页面
    const { index,type } = e.currentTarget.dataset;
    console.log("index: ",index,type)
    
    if(type=="event"){
      let event_id=this.data.blog_cards_list[index].event_id;
      wx.navigateTo({
        url: `/pages/show/event_detail/event_detail?event_id=${event_id}`,
      })
    }
    else if(type=="text"){
        //TODO
        let text_id=this.data.blog_cards_list[index].text_id;
        wx.navigateTo({
          url: `/pages/show/text_detail/text_detail?text_id=${text_id}`,
        })

    }else if(type=="data"){
        //TODO

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const searchKey = options.searchKey;
    console.log(searchKey);
    this.setData({
      searchKey: searchKey
    })
    var that = this;
    LoadShowPage(that);
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
    var that = this
    LoadShowPage(that)
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

  },
})