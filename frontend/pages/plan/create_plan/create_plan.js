// pages/plan/create_plan/create_plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTitle: '', //标题的名称
    imageList: [],
    kidList: [{info: "小明", checked: false},{info: "妹妹", checked: false}], // 孩子列表 加载页面时从后端获得
    selectedKids: [], // 已选中的孩子列表
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    showInput: false, // 是否显示输入框
    inputText: '', // 输入框的值
    inputTag:'',
    isEditing: false, // 是否处于编辑模式
    host_: 'http://127.0.0.1:8090/'
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