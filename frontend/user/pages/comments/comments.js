// pages/user/comments/comments.js
function getImageGridStyle(num_rows){
  return `display: grid;
  grid-template-rows: repeat(${num_rows}, 1fr);
  grid-template-columns: 1fr 1fr 1fr;
  justify-content:center;
  align-items:center;
  width: 100%;
  height:calc(30vw*${num_rows});`
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
  },
  chooseImage:function(e){
    console.log("tapped")
    const index = e.currentTarget.dataset.index; // 获取用户点击的格子索引
    wx.chooseMedia({
      count: 9 - this.data.imageList.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles;
        const imageList = this.data.imageList.concat(tempFiles.map((file) => file.tempFilePath));
        const num_rows=Math.ceil((imageList.length+1)/ 3);
        this.setData({
          imageList: imageList.slice(0, 9),
          imgGridStyle:getImageGridStyle(num_rows)
        });
        // var query = wx.createSelectorQuery().select('#image-grid-container').boundingClientRect(function (gridContainer) { 
        //     gridContainer.gridTemplateRows = `repeat(${num_rows}, 1fr)`;
        //     let grid_height=30*num_rows;
        //     gridContainer.height=`${grid_height}vw`;
        //   }).exec();
      },
      fail: (res)=>{
        console.log(1)
      }
    });
  },

  handleSubmit(){
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1000,
      success: function () {
                      // setTimeout(function () {
                      // }, 1000)
      setTimeout(function () {
              wx.navigateBack(1)

      }, 1000)
                    }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
