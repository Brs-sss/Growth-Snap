// pages/reselect/diarytemplate/diarytemplate.js

import { generateDiaryPDF } from '../../add_event/add_event.js';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    host_: `${app.globalData.localUrl}`,
    diaryActiveIndex: 0,
    coverList: [],  // 日记本封面模板数据 
    coverSelected: 0,
    paperList: [],  // 日记本纸张模板数据
    paperSelected: 0,
    diaryTitle: '',// 日记本标题
  },

  navigateToSubPage(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      diaryActiveIndex: index
    });
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

  submitChange(){
    var that=this
    const {coverSelected,paperSelected,diary_title}=that.data
    var id_list = wx.getStorageSync('generate_id_list');
    generateDiaryPDF(that,id_list,coverSelected,paperSelected,diary_title)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      coverSelected:options.cover,
      paperSelected:options.paper,
      diary_title:options.diary_title,
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