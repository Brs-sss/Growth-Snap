// pages/plan/create_plan/create_plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTitle: '', //标题的名称
    imageList: [],
    // kidList: [{info: "小明", checked: false},{info: "妹妹", checked: false}], // 孩子列表 加载页面时从后端获得
    kidList: [],// 孩子列表 加载页面时从后端获得
    selectedKids: [], // 已选中的孩子列表
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    showInput: false, // 是否显示输入框
    inputText: '', // 输入框的值
    inputTag:'',
    isEditing: false, // 是否处于编辑模式
    host_: 'http://127.0.0.1:8090/',
    openid: '',
    iconList: ['../../../image/plan/icons/basketball.png', '../../../image/plan/icons/biking.png', '../../../image/plan/icons/book.png', '../../../image/plan/icons/clock.png', '../../../image/plan/icons/computer.png', '../../../image/plan/icons/pencil.png', '../../../image/plan/icons/piano.png', '../../../image/plan/icons/shirt.png', '../../../image/plan/icons/swimmer.png', '../../../image/plan/icons/cat.png', '../../../image/plan/icons/carrot.png', '../../../image/plan/icons/brush.png', '../../../image/plan/icons/travel.png', '../../../image/plan/icons/fish.png'],
    selected_icon_index: 0
  },

  toggleKid: function(e) {
    const { index } = e.currentTarget.dataset;

    const { selectedKids } = this.data;
    const tag = this.data.kidList[index].info;
    const tagIndex = selectedKids.indexOf(tag);
    if (tagIndex !== -1) {
      selectedKids.splice(tagIndex, 1); // 取消选中
      this.data.kidList[index].checked = false ;
    } else {
      selectedKids.push(tag); // 选中
      this.data.kidList[index].checked = true ;
    }
    this.setData({
      selectedKids: selectedKids,
      ['kidList[' + index + '].checked']: this.data.kidList[index].checked 
    });

    console.log("index",index)
    console.log(this.data.kidList[index].checked)
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
    console.log("tags:", this.data.tags)
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

  // 处理计划名称输入
  handleInputTitle(e) {  //输入标题的处理
    this.setData({
      inputTitle: e.detail.value
    });
  },

  // 获取选择的图标
  iconChange(e){
    const { index } = e.currentTarget.dataset;
    console.log(index)
    this.setData({
      selected_icon_index: index
    })
  },

  // 提交计划
  handleSubmit(){
    var that = this
    console.log(that.data.selectedKids)
    console.log(that.data.inputTitle)
    // console.log(that.data.tags)
    let index = that.data.selected_icon_index
    let icon = that.data.iconList[index]
    console.log("icon:", icon)
    console.log("openid:",that.data.openid)
    wx.request({
      url: that.data.host_+'user/api/plan/add_plan',
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      data:{
        'openid':that.data.openid,
        'child': that.data.selectedKids,
<<<<<<< HEAD
        'icon': icon,
=======
>>>>>>> feature/other
        'title': that.data.inputTitle
      },
      success: function(res)
      {
        console.log(res)
        wx.showToast({
          title: "新建成功",
          icon: 'success',
          duration: 1000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack(1) //成功提交，返回上个页面
            }, 1000)
          }
        })
        
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    let openid
    // 获取存储的openid
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        // 从本地存储中获取数据,在index.js文件中保存建立的
        openid=res.data
        console.log("openid:",openid)
        that.setData({
          openid: openid
        })
        
    wx.request({
      url: that.data.host_+'user/api/user/children_info'+'?openid='+openid,
      method: 'GET',
      success:function(res){
        console.log(res.data)
        let children_list = res.data.children_list
        console.log(children_list.length)
        let temp_kidList = []
        for(let i = 0; i < children_list.length; i++)
        {
          let name = children_list[i].name
          console.log(name)
          temp_kidList.push({'info': name, 'checked': false})
          
        }
        that.setData({
          kidList: temp_kidList
        })
        // that.setData({
        //   user_profile:res.data.profile_image,
        //   user_label: res.data.label,
        //   username: res.data.username,
        //   event_number: res.data.event_number,
        //   plan_number:res.data.plan_number
        // })
    },
    fail:function(res){
      console.log('load page failed: ',res)
    }
    })
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