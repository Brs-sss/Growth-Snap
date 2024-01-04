// pages/generate/preview/preview_video/preview_video.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    openid: '',
    video_title: '',
    host_: `${app.globalData.localUrl}`,
    video_src: '',
    show: true,
    not_show: 'none',
    title_text: '预览生成的小视频，可进行更换、保存与分享',
    audioSelected: 0,
    options_video_title: ''
  },
handleDownload(){
  var that=this
  let video_src = that.data.video_src
  wx.downloadFile({
    url: video_src,
    success (res) {
      if (res.statusCode === 200) {
        console.log(res.tempFilePath)
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            });
          },
          fail: function (err) {
            console.log(err);
            wx.showToast({
              title: '保存失败',
              icon: 'error',
              duration: 1000
            });
          }
        })
      }
    }
  })
},
reselectVideoInfo(){
  var that=this
  console.log('reselect:',that.data.video_title,that.data.openid)
  let index = wx.getStorageSync('audioSelected')
  wx.navigateTo({
    url: '/generate/pages/reselect/videoInfo/videoInfo?title='+that.data.video_title+"&openid="+that.data.openid+"&audioSelected="+index,
  })
},
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    console.log(options)
    if (options.share)
    {
      console.log("share")
      this.setData({
        show: 'none',
        not_show: true,
        title_text: '打开乖乖记，get同款小视频~'
      })
    }
    this.setData({
      openid: options.openid,
      video_title: options.video_title.slice(0,-1),
      video_src: this.data.host_+'user/api/generate/video/preview'+'/'+options.openid+'/'+encodeURIComponent(options.video_title),
      options_video_title: options.video_title
    })
    console.log("video_src: ", this.data.video_src)

  },
  reselectEvent(){
    // wx.navigateBack(1)
    let index = wx.getStorageSync('audioSelected')
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[ pages.length - 2 ];  
    prevPage.setData({
      comeFrom:'video',
        audio_index:index,
        video_title:this.data.video_title+'1',
    })

      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      })

    // wx.navigateTo({
    //   url: '/generate/pages/add_event/add_event?category=video' + "&index=" +index+"&title="+this.data.video_title+'1',
    // })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },
  open(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  Refresh(){
    // this.setData({
    //   video_title:''
    // })
    console.log(this.data.video_src)
  },
  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    /**
     * openid: options.openid,
      video_title: options.video_title,
      video_src: this.data.host_+'user/api/generate/video/preview'+'/'+options.openid+'/'+encodeURIComponent(options.video_title)
     */
    return {
      title: '快来看看我生成的视频~',
      path: 'generate/pages/preview/preview_video/preview_video?share=true&openid='+this.data.openid+'&video_title='+this.data.options_video_title,
    }
  }
})