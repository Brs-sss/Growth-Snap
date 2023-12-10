// pages/generate/generate.js
function isEmpty(x){
  return  x.trim()==''
}

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 2, // 初始显示的子页面
    timelineList: [], // 时间轴模板数据
    colorList: [],
    timelineTitle: "",
    templateSelected: 0, // 当前选中的时间轴模板
    colorSelected: 0,
    diaryActiveIndex: 0,
    coverList: [],  // 日记本封面模板数据 
    coverSelected: 0,
    paperList: [],  // 日记本纸张模板数据
    paperSelected: 0,
    diaryTitle: '',// 日记本标题
    audioList: [], // 选的配乐
    videoTitle: '', // 小视频标题
    audioSelected: 0,
    chartList: [], // 图表模板数据
    host_: `${app.globalData.localUrl}`,
  },
  navigateToPage(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    });
  },
  navigateToSubPage(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      diaryActiveIndex: index
    });
  },
  navigateTochart(e){
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/generate/chart/chart?index=' + encodeURIComponent(index),
    })
  },
  selectTemplate(e){
    const index = e.currentTarget.dataset.index;
    console.log(index)
    console.log(this.data.timelineList[index].name)
    this.setData({
      templateSelected: index,
    })
  },

  selectColor(e){
    const index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      colorSelected: index,
    })
  },

  addVideo(e){
    var that=this
    const category = e.currentTarget.dataset.category;
    // const index = e.currentTarget.dataset.index;
    console.log('generate_category:',category);
    // console.log('generate_index:',index);
    wx.navigateTo({
      url: '/pages/generate/add_event/add_event?category=' + encodeURIComponent(category)
    })
  },
  addEvent(e) {
    var that=this
    const category = e.currentTarget.dataset.category;
    const index = e.currentTarget.dataset.index;
    console.log('generate_category:',category);
    console.log('generate_index:',index);
    if (category=="timeline"){
      wx.navigateTo({
        url: '/pages/generate/add_event/add_event?category=timeline&index=' + 
        encodeURIComponent(that.data.templateSelected) + 
        '&color=' + encodeURIComponent(that.data.colorSelected),
      })
    }else if (category=="video")
    { 
      if(isEmpty(that.data.videoTitle)){
        wx.showToast({
          title: "标题不能为空",
          icon: 'error',
          duration: 1000,
        })
        return;
      }
      wx.setStorageSync('audioSelected', this.data.audioSelected)
      wx.navigateTo({
        url: '/pages/generate/add_event/add_event?category=video' + "&index=" + encodeURIComponent(this.data.audioSelected)+"&title="+this.data.videoTitle,
      })

    }else if (category=="diary"){
      if(isEmpty(that.data.diaryTitle)){
        wx.showToast({
          title: "标题不能为空",
          icon: 'error',
          duration: 1000,
        })
        return;
      }
      wx.navigateTo({
        url: '/pages/generate/add_event/add_event?category=' + encodeURIComponent(category) + "&index=" + encodeURIComponent(index)+ "&cover=" + that.data.coverSelected+"&paper="+that.data.paperSelected+"&title="+that.data.diaryTitle,
      })
    }
  },
  addAudio(e){
    const index = e.currentTarget.dataset.index;
    console.log(index)
    console.log(this.data.audioList[index].name)
    this.setData({
      audioSelected: index,
      
    })
  },
  selectCover(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      coverSelected: index
    });
  },
  selectPaper(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      paperSelected: index
    });
  },
  handleInputTitle(e) {  //输入标题的处理
    this.setData({
      diaryTitle: e.detail.value
    });
  },
  handleInputTimelineTitle(e) {  //输入标题的处理
    this.setData({
      timelineTitle: e.detail.value
    });
  },
  handleInputVideoTitle(e) {  //输入标题的处理
    this.setData({
      videoTitle: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      timelineList: [
        { id: 0, name: "日历标注模板"},
        { id: 1, name: "彩色时间轴模板" },
        { id: 2, name: "曲线时间轴模板" },
        { id: 3, name: "圆环标注模板"}
      ],
      colorList: [
        { id: 0, name: "天蓝色系"},
        { id: 1, name: "橙黄色系" },
        { id: 2, name: "粉红色系" },
        { id: 3, name: "淡绿色系"}
      ],
      coverList: [
        { id: 0 , selected:false},
        { id: 1 , selected:false},
        { id: 2 , selected:false},
        { id: 3 , selected:false},
        { id: 4 , selected:false},
        { id: 5 , selected:false},
        { id: 6 , selected:false},
        { id: 7 , selected:false},
        { id: 8 , selected:false},
        { id: 9 , selected:false},
        { id: 10 , selected:false},
        { id: 11 , selected:false}
      ],
      paperList: [
        { id: 0 , selected:false},
        { id: 1 , selected:false},
        { id: 2 , selected:false},
        { id: 3 , selected:false},
        { id: 4 , selected:false},
        { id: 5 , selected:false},
        { id: 6 , selected:false},
        { id: 7 , selected:false},
        { id: 8 , selected:false},
        { id: 9 , selected:false},
        { id: 10 , selected:false},
        { id: 11 , selected:false},
      ],
      audioList: [
        { id: 0 , name:'单车'},
        { id: 1 , name:'富士山下'},
        { id: 2 , name:'因为爱情'},
        { id: 3 , name:'孤勇者'},
        { id: 4 , name:'宝贝宝贝'},
        { id: 5 , name:'你的眼神'},
        { id: 6 , name:'黑桃A'},
        { id: 7 , name:'EverytimeWeTouch'},
      ],
      chartList: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 }
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