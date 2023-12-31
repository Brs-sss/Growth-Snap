// pages/generate/reselect/videoInfo/videoInfo.js
function isEmpty(x){
  return  x.trim()==''
}
const app = getApp();
import { generateVideoPreview } from '../../add_event/add_event.js';


Page({

  /**
   * Page initial data
   */
  data: {
    audioList: [], // 选的配乐
    video_title: '', // 小视频标题
    audioSelected: null,
    host_: `${app.globalData.localUrl}`,
    loading: false,

  },
  addAudio(e){
    const index = e.currentTarget.dataset.index;
    console.log(index)
    console.log(this.data.audioList[index].name)
    this.setData({
      audioSelected: index,
      
    })
    wx.setStorageSync('audioSelected', this.data.audioSelected)

  },
  handleInputVideoTitle(e) {  //输入标题的处理
    
    this.setData({
      video_title: e.detail.value
    });
  },
submitChange(){
  var that = this
  // console.log(this.data.video_title)
  if(isEmpty(that.data.video_title)){
    wx.showToast({
      title: "标题不能为空",
      icon: 'error',
      duration: 1000,
    })
    return;
  }
  var randomInt = Math.floor(Math.random() * 9) + 1;
    // console.log(randomInt);
  
  var id_list = wx.getStorageSync('generate_id_list');
  generateVideoPreview(that, id_list, that.data.video_title+randomInt.toString(), that.data.audioSelected, false);
},
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // console.log(options.title)
    // console.log(options.audioSelected)
    this.setData({
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
      video_title: options.title,
      audioSelected: options.audioSelected
    })
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