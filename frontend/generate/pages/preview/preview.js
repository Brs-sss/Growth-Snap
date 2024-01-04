// pages/generate/preview/preview.js


const app = getApp();


//const pdfjsLib = require('pdfjs-dist/build/pdf');


function loadPreview(that,options){
  let pdf_name=options.title
  let category=options.category
  let src_openid=options.src_openid
  let is_sharing=false
  if(options.is_sharing=="true"){
    is_sharing=true
  }
  if(is_sharing){
    let openid=src_openid;
    let pdf_url=that.data.host_+'static/diary/'+openid+'/'+pdf_name+'.pdf'
    that.setData({
      openid:openid,
      category:category,
      cover_index:options.cover,
      paper_index:options.paper,
      pdf_url:pdf_url,
      pdf_name:pdf_name,
      hasLoaded:true,
    })
    //that.renderPDF(pdf_url);
    //that.WXpreviewPDF(pdf_url)
    that.AskForPreviewImages(that,openid,pdf_name,category)
  }
  else wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      let pdf_url=that.data.host_+'static/diary/'+openid+'/'+pdf_name+'.pdf'
      that.setData({
        openid:openid,
        category:category,
        cover_index:options.cover,
        paper_index:options.paper,
        pdf_url:pdf_url,
        pdf_name:pdf_name,
        hasLoaded:true,
      })

      that.AskForPreviewImages(that,openid,pdf_name,category)

    },
    fail: function (res) {
     console.log('获取数据失败');
   }
 });
}

function showPreview(that){
  const {pdf_name, openid, category,cover_index  }=that.data
  let pdf_url=that.data.host_+'static/diary/'+openid+'/'+pdf_name+'.pdf'
  that.setData({
    pdf_url:pdf_url,
  })
  that.AskForPreviewImages(that,openid,pdf_name,category)
  
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewList:[],
    host_: `${app.globalData.localUrl}`,
    hasLoaded:false,
    pdf_url:null,
    pdf_name:null,
    pages_num:null,
    openid:null,
    category:null,
    cover_index:null,
    paper_index:null,
    is_sharing:false,
    src_openid:null,
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

  downloadPDF(){
    var that=this
    wx.showLoading({
      title: '加载中...',
    });
    wx.downloadFile({
      url: that.data.pdf_url,
      success: function (res) {
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function (saveRes) {
              const savedFilePath = saveRes.savedFilePath;
              console.log('文件保存成功：', savedFilePath);
              // 这里可以进行其他操作，比如分享或打开文件等
            },
            fail: function (saveErr) {
              console.log('文件保存失败：', saveErr);
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

  AskForPreviewImages(that,openid,pdf_name,category){
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: that.data.host_+'user/api/generate/'+category+'/preview'+'?openid='+openid+'&file_name='+pdf_name,
      method:'GET',
      success:function(res){
          that.setData({
            previewList:res.data.imageList,
            pages_num:res.data.pageNum,
          })
      },
      fail:function(res){
        console.log('load page failed: ',res)
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  pdfLoaded: function (e) {
    console.log('PDF加载完成', e);
  },
  pdfError: function (e) {
    console.error('PDF加载失败', e);
  },

  handleDownload(){
    var that=this
    let itemList=[]
    const {openid,category,pdf_name}=this.data
    if(that.data.pages_num>8) //太长的不能导出为图
    {
       itemList=['保存为PDF']
    }
    else{
       itemList=['保存为PDF', '保存为长图']
    }
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (!res.cancel) {
          if (res.tapIndex === 0) {　// 执行导出为PDF的操作
            that.downloadPDF(that.data.pdf_url)
          } else if (res.tapIndex === 1) {　// 执行导出为图片的操作
              wx.showLoading({
                title: '加载中...',
              });
              wx.request({
                url: that.data.host_+'user/api/generate/'+category+'/longimage'+'?openid='+openid+'&file_name='+pdf_name,
                method:'GET',
                success:function(res){
                   that.saveImageToAlbum(res.data.long_image_url)
                },
                fail:function(res){
                  wx.showToast({
                    title: "文件已过期",
                    icon: 'error',
                    duration: 1000,
                  })
                },
                complete: function () {
                  wx.hideLoading();
                }
              })
          }
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  saveImageToAlbum: function (url) {
    wx.getImageInfo({
      src: url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
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
        });
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: '获取图片信息失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  reselectEvent(){
    var that=this
    var pages = getCurrentPages();
    var previousPage=pages[pages.length-2];
    previousPage.setData({
      cover_index:that.data.cover_index,
      paper_index:that.data.paper_index,
      pdf_name:that.data.diary_title,
    })
    wx.navigateBack(1)
  },

  reselectTemplate(){
    var that=this
    console.log('reselect:',that.data.cover_index,that.data.paper_index)
    wx.navigateTo({
      url: '/generate/pages/reselect/diarytemplate/diarytemplate?cover='+that.data.cover_index+"&paper="+that.data.paper_index+'&diary_title='+that.data.pdf_name
    })
  },

  Refresh(){
    this.setData({
      previewList:[]
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    loadPreview(that,options)
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
    var that=this
    if(that.data.hasLoaded) showPreview(that) 
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
    this.setData({
      is_sharing:true,
    })
    return {
      title: '快来看看我生成的日记本~',
      path: 'generate/pages/preview/preview?share=true&openid='+this.data.openid+'&title='+this.data.pdf_name+'&category='+this.data.category+'&src_openid='+this.data.openid+'&is_sharing=true',
    }
  }
})