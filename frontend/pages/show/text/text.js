// pages/show/text/text.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    inputTitle: '', //标题的名称
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    showInput: false, // 是否显示输入框
    inputText: '', // 输入框的值
    inputTag:'',
    isEditing: false, // 是否处于编辑模式
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
    const currentDateString =currentDateAndTime.toDateString();
    const currentTimeString = currentDateAndTime.toTimeString();
    
    // 获取存储的openid
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        // 从本地存储中获取数据,在index.js文件中保存建立的
        let openid=res.data
        console.log('opeidd: ',openid) 
        const event_text_id=openid+currentDateString+currentTimeString;
        //通过后端获取event_id(一个事件的唯一id为openid+发表时间的sha256值):
        wx.request({
          url: that.data.host_+'user/api/getSHA256'+'?text='+event_text_id, //url get传参数
          method:'GET',
          success:function(res){
            const event_id_sha256 = res.data.sha256;
            console.log('SHA-256 哈希值:',  event_id_sha256);
            wx.request({ //上传非图片数据
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
                'time':currentTimeString,
                'author':"大壮", //todo
                'type':'text',
              },
              success:function(res){
                wx.navigateBack(1) //成功提交，返回上个页面
              },
              fail:function(res){
                console.log(that.data.host_+'user/api/show/text/submit')
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