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
    video_src: ''
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
    url: '/pages/generate/reselect/videoInfo/videoInfo?title='+that.data.video_title+"&openid="+that.data.openid+"&audioSelected="+index,
  })
},
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      openid: options.openid,
      video_title: options.video_title,
      video_src: this.data.host_+'user/api/generate/video/preview'+'/'+options.openid+'/'+encodeURIComponent(options.video_title)
    })
    console.log("video_src: ", this.data.video_src)

  },
  reselectEvent(){
    wx.navigateBack(1)
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

  }
})