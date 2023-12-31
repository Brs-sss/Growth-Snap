// pages/register/register/register.js

function getImageGridStyle(num_rows){
  return `display: grid;
  grid-template-rows: repeat(${num_rows}, 1fr);
  grid-template-columns: 1fr 1fr 1fr;
  justify-content:center;
  align-items:center;
  width: 100%;
  height:calc(30vw*${num_rows});`
}

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputUsername: '', //昵称
    inputFamilyId:'', //家庭口令
    imageList: [],
    inputLabel:'',
    profilePath:'',
    // showInput: false, // 是否显示输入框
    // inputText: '', // 输入框的值
    // inputTag:'',
    // isEditing: false, // 是否处于编辑模式
    imgGridStyle:getImageGridStyle(1),
    host_: `${app.globalData.localUrl}`,
    openid: '',
    is_disabled: false,
    familyId_text: '',
    visibility_cancel: 'none',
    visibility_input: 'block',
    visibility_create: 'block',
    visibility_text: 'none',
    firsttime_selected_img:true
  },

  handleInputUsername(e) {  //输入用户名的处理
    this.setData({
      inputUsername: e.detail.value
    });
  },

  handleInputFamilyId(e) {  //输入家庭口令的处理
    this.setData({
      inputFamilyId: e.detail.value
    });
  },
  create_familyId(e){
   var that = this
   that.setData({
    is_disabled: true,
    familyId_text: '已创建新家庭',
    inputFamilyId: 'new_family',
    visibility_cancel: 'block',
    visibility_create: 'none',
    visibility_input: 'none',
    visibility_text: 'flex'
  });
    // wx.request({
    //   url: this.data.host_+'user/api/register_family',
    //   method: 'POST',
    //   data: 
    //   {
    //     'openid': this.data.openid,
    //   },
    //   header:
    //   {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res)
    //   {
    //     console.log(res.data)
    //     if (res.statusCode==200)
    //     {
    //       that.setData({
    //         is_disabled: true,
    //         familyId_text: '已创建新家庭',
    //         inputFamilyId: 'new_family',
    //         visibility_cancel: 'block',
    //         visibility_create: 'none',
    //         visibility_input: 'none',
    //         visibility_text: 'flex'
    //       });
    //     }
    //   }

    // })
    
  },
  handleInputLabel(e) {  //输入家庭角色的处理
    this.setData({
      inputLabel: e.detail.value
    });
  },
  cancel(e){
    this.setData({
      is_disabled: false,
      familyId_text: '',
      visibility_cancel: 'none',
      visibility_create: 'block',
      visibility_input: 'block',
      visibility_text: 'none'
    })
  },
  handleSubmit() {
    var that = this
    console.log('提交的文本：', this.data.inputUsername);
    console.log('提交的文本：', this.data.inputFamilyId);
    console.log('提交的文本：', this.data.inputLabel);
    console.log('提交的文本：', this.data.imageList[0]);
    console.log('提交的文本：', this.data.openid);
    if (this.data.inputFamilyId == '')
    {
      this.data.inputFamilyId = this.data.familyId
    }
    wx.request({
      url: this.data.host_+'user/api/register',
      method: 'POST',
      data: 
      {
        'username': this.data.inputUsername,
        'token': this.data.inputFamilyId,
        'label': this.data.inputLabel,
        'openid': this.data.openid,
      },
      header:
      {
        'content-type': 'application/json'
      },
      success: function(res)
      {
        console.log(res.data)
        console.log(res.statusCode)
        if (res.data.msg == 'family does not exist')
        {
          wx.showToast({
            title: '家庭验证码错误或者过期',
            icon: 'error',
            duration: 2000,
            
          })
        }
        if (res.data.msg=='register success')
        {
          wx.uploadFile({
            url: that.data.host_+'user/api/register_profile_image', // 服务器地址
            filePath: that.data.imageList[0], // 用户选择的图片文件路径
            name: 'image', // 服务器接收文件的字段名
            formData: {     // 可以传递其他表单数据
              
              'openid':  that.data.openid,  //用户的openid
            },
            success(res) {
              console.log('上传成功', res.data);
            },
            fail(res) {
              console.error('上传失败', res);
            }
          });
          console.log('register complete')
          wx.showToast({
            title: "注册成功",
            icon: 'success',
            duration: 1000,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/show/show'
                })
              }, 1000)
            }
          })
        }
      }
    })


    // 进行其他处理或操作
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
          imgGridStyle:getImageGridStyle(num_rows),
          firsttime_selected_img:false,
          // profilePath: res.tempFilePath[0]
        });
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



  // toggleTag: function(e) {
  //   const { index } = e.currentTarget.dataset;

  //   const { selectedTags } = this.data;
  //   const tag = this.data.tags[index].info;
  //   const tagIndex = selectedTags.indexOf(tag);
  //   if (tagIndex !== -1) {
  //     selectedTags.splice(tagIndex, 1); // 取消选中
  //     this.data.tags[index].checked = false ;
  //   } else {
  //     selectedTags.push(tag); // 选中
  //     this.data.tags[index].checked = true ;
  //   }
  //   this.setData({
  //     selectedTags: selectedTags,
  //     ['tags[' + index + '].checked']: this.data.tags[index].checked 
  //   });

  //   console.log("index",index)
  //   console.log(this.data.tags[index].checked)
  // },
  // showInput: function() {
  //   this.setData({
  //     showInput: true
  //   });
  // },

  // addTag: function(e) {
  //   const { value } = e.detail;
  //   if (value.trim() !== '') {
  //     const { tags } = this.data;
  //     const existingTag = tags.find(tag => tag.info === value);
  //     if (existingTag) {
  //       // 已存在相同的标签
  //       wx.showToast({
  //         title: '标签已存在',
  //         icon: 'none'
  //       });
  //       this.setData({
  //         tags: tags,
  //         showInput: false,
  //         inputTag: ''
  //       });
  //     } else {
  //       tags.push({info: value, checked: false});
  //       this.setData({
  //         tags: tags,
  //         showInput: false,
  //         inputTag: ''
  //       });
  //     }
  //   } else {
  //     this.setData({
  //       showInput: false,
  //       inputTag: ''
  //     });
  //   }
  // },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getDict('tags')
    console.log(options)
    let that = this
    that.setData({
      openid: options.openid
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