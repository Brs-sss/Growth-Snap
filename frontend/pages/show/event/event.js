// pages/show/event/event.js

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
    inputTitle: '', //标题的名称
    imageList: [],
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    showInput: false, // 是否显示输入框
    inputText: '', // 输入框的值
    inputTag:'',
    isEditing: false, // 是否处于编辑模式
    imgGridStyle:getImageGridStyle(1),
    host_: 'http://127.0.0.1:8090/'
  },

  handleInputTitle(e) {  //输入标题的处理
    this.setData({
      inputTitle: e.detail.value
    });
  },

  handleInputText(e) {  //输入文字的处理
    this.setData({
      inputText: e.detail.value
    });
  },

  handleSubmit() {
    //console.log('提交的文本：', this.data.inputTitle);
    // 进行其他处理或操作
    var that = this
    const currentDateAndTime = new Date();
    // 创建一个 Date 对象来表示当前日期
    // 获取年、月、日
    var year = currentDateAndTime.getFullYear();
    var month = (currentDateAndTime.getMonth() + 1).toString().padStart(2, '0'); 
    var day = currentDateAndTime.getDate().toString().padStart(2, '0');

    // 格式化日期为 "YYYY-MM-DD"
    var formattedDate = year + '-' + month + '-' + day;
    //时间为
    const currentTimeString = currentDateAndTime.toTimeString();
    
    // 获取存储的openid
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        // 从本地存储中获取数据,在index.js文件中保存建立的
        let openid=res.data
        console.log('opeidd: ',openid) 
        const event_text_id=openid+currentTimeString;
        //通过后端获取event_id(一个事件的唯一id为openid+发表时间的sha256值):
        wx.request({
          url: that.data.host_+'user/api/getSHA256'+'?text='+event_text_id, //url get传参数
          method:'GET',
          success:function(res){
            const event_id_sha256 = res.data.sha256;
            console.log('SHA-256 哈希值:',  event_id_sha256);
            wx.request({
              url: that.data.host_+'user/api/show/event/submit',
              method: 'POST',
              header:
              {
                'content-type': 'application/json'
              },
              data:{
                'openid':openid,
                'event_id': event_id_sha256,
                'title':that.data.inputTitle,
                'content':that.data.inputText,
                'tags':that.data.tags,
                'date':formattedDate,
                'time':currentTimeString
              },
              success:function(res){
                console.log('success return')
                //准备开始上传各张图片,利用循环把整个imageList都上传
                for(var i=0;i<that.data.imageList.length;i++){
                  wx.uploadFile({
                    url: that.data.host_+'user/api/show/event/upload_image', // 服务器地址
                    filePath: that.data.imageList[i], // 用户选择的图片文件路径
                    name: 'image', // 服务器接收文件的字段名
                    formData: {     // 可以传递其他表单数据
                      'pic_index':i, //此次传的照片是第几张
                      'event_id':  event_id_sha256,  //到了后端归入哪个事件
                    },
                    success(res) {
                      console.log('上传成功', res.data);
                    },
                    fail(res) {
                      console.error('上传失败', res);
                    }
                  });
                }
               

    
                wx.navigateBack(1) //成功提交，返回上个页面
              },
              fail:function(res){
                console.log(that.data.host_+'user/api/show/event/submit')
              }
            })
          },
          fail:function(res){
            console.log('failed to get sha256 value')
          }
        })
      },
      fail: function (res) {
        console.log('获取数据失败');
      }
    });
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

  changeImage:function(e){  //更改一张图片为其他图片
    const index = e.currentTarget.dataset.index; // 获取用户点击的格子索引
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles;
        const imageList = this.data.imageList;
        imageList[index]=tempFiles[0].tempFilePath;
        this.setData({
          imageList: imageList,
        });
      },
    });
  },

  handleDelete(event) {
    const index = event.currentTarget.dataset.index;
    const imageList = this.data.imageList;
    imageList.splice(index, 1);
    const num_rows=Math.ceil((imageList.length+1)/ 3);
    console.log("rows",num_rows)
    this.setData({
      imageList: imageList,
      imgGridStyle:getImageGridStyle(num_rows)
    });
    // 返回 false 阻止事件传播
    return false
  },



  toggleTag: function(e) {
    const { index } = e.currentTarget.dataset;

    const { selectedTags } = this.data;
    const tag = this.data.tags[index].info;
    const tagIndex = selectedTags.indexOf(tag);
    if (tagIndex !== -1) {
      selectedTags.splice(tagIndex, 1); // 取消选中
      this.data.tags[index].checked = false ;
    } else {
      selectedTags.push(tag); // 选中
      this.data.tags[index].checked = true ;
    }
    this.setData({
      selectedTags: selectedTags,
      ['tags[' + index + '].checked']: this.data.tags[index].checked 
    });

    console.log("index",index)
    console.log(this.data.tags[index].checked)
  },
  showInput: function() {
    this.setData({
      showInput: true
    });
  },

  addTag: function(e) {
    const { value } = e.detail;
    if (value.trim() !== '') {
      const { tags } = this.data;
      const existingTag = tags.find(tag => tag.info === value);
      if (existingTag) {
        // 已存在相同的标签
        wx.showToast({
          title: '标签已存在',
          icon: 'none'
        });
        this.setData({
          tags: tags,
          showInput: false,
          inputTag: ''
        });
      } else {
        tags.push({info: value, checked: false});
        this.setData({
          tags: tags,
          showInput: false,
          inputTag: ''
        });
      }
    } else {
      this.setData({
        showInput: false,
        inputTag: ''
      });
    }
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getDict('tags')
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