// pages/generate/generate.js
function isEmpty(x){
  return  x.trim()==''
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0, // 初始显示的子页面
    timelineList: [], // 时间轴模板数据
    diaryActiveIndex: 0,
    coverList: [],  // 日记本封面模板数据 
    coverSelected: 0,
    paperList: [],  // 日记本纸张模板数据
    paperSelected: 0,
    diaryTitle: '',// 日记本标题
    audioList: [], // 选的配乐
    videoTitle: '', // 小视频标题
    audioSelected: 0,
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
    wx.navigateTo({
      url: '/pages/generate/chart/chart',
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
        url: '/pages/generate/add_event/add_event?category=timeline&index=' + encodeURIComponent(index),
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
        { id: 0 , name:'美丽的模板'},
        { id: 1 , name:'艺术的模板'},
        { id: 2 , name:'无敌的模板'},
        { id: 3 , name:'超级的模板'}
      ],
      coverList: [
        { id: 0 , name:'美丽', selected:false},
        { id: 1 , name:'艺术', selected:false},
        { id: 2 , name:'无敌', selected:false},
        { id: 3 , name:'超级', selected:false},
        { id: 4 , name:'美丽', selected:false},
        { id: 5 , name:'艺术', selected:false},
        { id: 6 , name:'艺术', selected:false},
        { id: 7 , name:'艺术', selected:false},
        { id: 8 , name:'艺术', selected:false},
        { id: 9 , name:'艺术', selected:false},
        { id: 10 , name:'艺术', selected:false},
        { id: 11 , name:'艺术', selected:false}
      ],
      paperList: [
        { id: 0 , name:'美丽', selected:false},
        { id: 1 , name:'艺术', selected:false},
        { id: 2 , name:'无敌', selected:false},
        { id: 3 , name:'超级', selected:false},
        { id: 4 , name:'艺术', selected:false},
        { id: 5 , name:'无敌', selected:false},
        { id: 6 , name:'超级', selected:false},
        { id: 7 , name:'艺术', selected:false},
        { id: 8 , name:'艺术', selected:false},
        { id: 9 , name:'艺术', selected:false},
        { id: 10 , name:'艺术', selected:false},
        { id: 11 , name:'艺术', selected:false},
      ],
      audioList: [
        { id: 0 , name:'单车'},
        { id: 1 , name:'富士山下'},
        { id: 2 , name:'因为爱情'},
        { id: 3 , name:'孤勇者'},
        { id: 4 , name:'起风了'},
        { id: 5 , name:'你的眼神'},
        { id: 6 , name:'黑桃A'},
        { id: 7 , name:'EverytimeWeTouch'},
      ]
    });
  },
  generateChart(e){
    wx.navigateTo({
      url: '/pages/generate/chart/chart'
    })
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