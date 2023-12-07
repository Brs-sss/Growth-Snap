// pages/show/show.js

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

var search_note = 0 //记录搜索操作判断是否收起提示框 0 for 关闭；1 for 保持

//简易模糊搜索
function fuzzySearch(text, query) {
  console.log(text,query)
  // 将搜索字符串转换为小写，并去除空格
  const sanitizedText = text.toLowerCase().replace(/\s/g, '');
  const sanitizedQuery = query.toLowerCase().replace(/\s/g, '');

  //逐个比较搜索字符串的字符是否按顺序在文本中出现，如果出现了，就认为找到了匹配项
  let queryIndex = 0;

  //记录出现的位置
  let queryPos = [-1];
  let res = '';

  for (let i = 0; i < sanitizedText.length; i++) {
      if (sanitizedText[i] === sanitizedQuery[queryIndex]) {
          queryIndex++;
          queryPos.push(i);
          if (queryIndex === sanitizedQuery.length) {
            queryPos.push(sanitizedText.length)
              for(let j = 1; j < queryPos.length; j++){
                if((queryPos[j] - queryPos[j - 1]) > 10){
                  if(j == 1){
                    res = res + '...' + sanitizedText.substring(queryPos[j] - 5, queryPos[j]); 
                  }else if(j == queryPos.length - 1){
                    res = res + sanitizedText.substring(queryPos[j - 1], queryPos[j - 1] + 5) + '...'; 
                  }else{
                    res = res + sanitizedText.substring(queryPos[j - 1], queryPos[j - 1] + 5) + '...' + sanitizedText.substring(queryPos[j] - 5, queryPos[j]); 
                  }
                }else{
                  res = res + sanitizedText.substring(queryPos[j - 1], queryPos[j]);
                }
              }
              return res;
          }
      }
  }
  return '';
}


/* 与后端联系，获取主页的内容*/
function LoadShowPage(that,start=0,delta='all'){
  that.setData({
    popupVisible:false,
  })
  // 获取存储的openid
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      wx.request({
        url: that.data.host_+'user/api/show/all'+'?openid='+openid+'&start='+start+'&delta='+delta,
        method:'GET',
        success:function(res){
            that.setData({
              blog_cards_list:that.data.blog_cards_list.concat(res.data.blocks_list),
              start:res.data.start,
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
    inputShowed: false, // 搜索提示状态
    inputVal: '', // 搜索内容
    searchHint: [],
    hasLoaded:false,
    start:0,
    delta:5,
  },
  showInput() {
    this.setData({
      inputShowed: true,
    });
  },
  hideInput() {
    this.setData({
      inputVal: '',
      inputShowed: false,
    });
  },
  clearInput() {
    this.setData({
      inputVal: '',
    });
  },
  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value,
    });
    const eventList = this.data.blog_cards_list;
    const inputVal = e.detail.value;
    const searchResults = [];
    var buffer = '';
    eventList.forEach(item => {
      // Check if inputVal is a substring of title or content
      buffer = fuzzySearch(item.title, inputVal); 
      if (buffer!='') {
        if(item.type=='event'){
          searchResults.push({title: buffer, type: item.type, id: item.event_id});
        }else if(item.type=='text'){
          searchResults.push({title: buffer, type: item.type, id: item.text_id});
        }
      }else{
        buffer = fuzzySearch(item.content, inputVal); 
        if (buffer!=''){
          if(item.type=='event'){
            searchResults.push({title: buffer, type: item.type, id: item.event_id});
          }else if(item.type=='text'){
            searchResults.push({title: buffer, type: item.type, id: item.text_id});
          }
        }
      }
    });
    //console.log(searchResults);
    this.setData({
      searchHint: searchResults
    })
  },
  handlesearch(e){
    wx.navigateTo({
      url: '/pages/show/seach_result/search_result'+'?searchKey='+encodeURIComponent(this.data.inputVal),
    })
  },
  goToPage_search_detail(e) {
    search_note = 1
    const { index } = e.currentTarget.dataset;
    const id = this.data.searchHint[index].id;
    const type = this.data.searchHint[index].type;
    if(type == 'event'){
      wx.navigateTo({
        url: `/pages/show/event_detail/event_detail?event_id=${id}`,
      })
    }else if(type == 'text'){
      wx.navigateTo({
        url: `/pages/show/text_detail/text_detail?text_id=${id}`,
      })
    }
  },
  showPopup() {
    this.setData({
      popupVisible: true
    });
  },
  hidePopup() {
    this.setData({
      popupVisible: false
    });
  },
  goToPage_event() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/event/event',
    })
  },
  goToPage_text() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/text/text',
    })
  },
  goToPage_data() {
    // TODO: 跳转到对应页面的处理逻辑
    wx.navigateTo({
      url: '/pages/show/data/data',
    })
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
      let data_id=this.data.blog_cards_list[index].data_id;
      console.log(data_id)
      wx.navigateTo({
        url: `/pages/show/data_detail/data_detail?data_id=${data_id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    LoadShowPage(that,that.data.start,that.data.delta)
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
    this.hidePopup()
    console.log('search_note:',search_note)
    if (search_note == 0){
      console.log("here")
      this.clearInput()
      this.hideInput()
    }else{
      search_note = 0
    }
    if (this.data.hasLoaded){
      var that = this
      LoadShowPage(that,that.data.start,that.data.delta)
    }
    else{
      console.log('else')
       this.setData({
         hasLoaded:true,
       })
    }
    
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
    var that = this
    LoadShowPage(that,that.data.start,that.data.delta)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
})