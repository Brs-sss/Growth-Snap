// pages/show/event_detail/event_detail.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
      imageList:['/image/temp/colorring.png','/image/temp/cloud.png','/image/temp/star.jpeg','/image/temp/goldhair.jpeg'],
      image_num:4,
      current:1,
      location_bar_style:"top:10px",
      date:null,
      title:null,
      text:null,
      tags:[],
      tags_string:null,
      host_: 'http://127.0.0.1:8090/',
  },

  swiperChange(e){
    this.setData({
      current: e.detail.current+1
    });
    console.log('current:',this.data.current)
  },

  
  //滚动页面时，1/4  2/4这个标识要上下改变
  onPageScroll(e){
    const scrollTop = e.scrollTop;
    this.setData({
      location_bar_style:"top:"+String(10-scrollTop)+"px",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
      var that = this
      const event_id=options.event_id;
      console.log('detail event id:',event_id)
      wx.request({
        url: that.data.host_+'user/api/show/event/detail'+'?event_id='+event_id,
        method:'GET',
        success:function(res){
            const block=res.data.block_item
            that.setData({
              date:block.year+"年"+block.month+block.day+"日",
              title:block.title,
              text:block.content,
              tags:block.tags,
              tags_string:block.tags.length?block.tags.map((ele)=> ("#"+ele)).join(" "):"",
              imageList:block.imgSrcList,
              image_num:block.imgSrcList.length,
            })

        },
        fail:function(res){
          console.log('load page failed: ',res)
        }
      
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