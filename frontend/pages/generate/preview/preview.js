// pages/generate/preview/preview.js

//const pdfjsLib = require('pdfjs-dist/build/pdf');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewList:[],
    host_: 'http://127.0.0.1:8090/',
  },

  renderPDF: function(url) {
    const pdfWorker = pdfjsLib.getDocument(url);

    pdfWorker.promise.then(pdf => {
      const totalPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        pdf.getPage(pageNum).then(page => {
          const canvasId = `pdf-canvas-${pageNum}`;
          const query = wx.createSelectorQuery();
          query.select(`#${canvasId}`).fields({ node: true, size: true }).exec(res => {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            const viewport = page.getViewport({ scale: 2 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
              canvasContext: ctx,
              viewport: viewport
            };

            page.render(renderContext);
          });
        });
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    let pdf_name=options.title
    let category=options.category
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        // 从本地存储中获取数据,在index.js文件中保存建立的
        let openid=res.data
  
        let pdf_url=that.data.host_+'static/diary/'+openid+'/'+pdf_name+'.pdf'
        //that.renderPDF(pdf_url);
        wx.showLoading({
          title: '加载中...',
        });
        wx.downloadFile({
          url: pdf_url, // 替换成你的后端 API 地址
          success: function (res) {
            if (res.statusCode === 200) {
              const filePath = res.tempFilePath;
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功');
                },
                fail: function (res) {
                  console.log('打开文档失败', res);
                },
                complete: function () {
                  wx.hideLoading();
                }
              });
            } else {
              console.error('下载文件失败', res);
              wx.hideLoading();
            }
          },
          fail: function (res) {
            console.error('下载文件失败', res);
            wx.hideLoading();
          }
        });

      },
      fail: function (res) {
       console.log('获取数据失败');
     }
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