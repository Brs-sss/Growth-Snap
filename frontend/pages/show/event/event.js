// pages/show/event/event.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    imageList: [],
    tags: [], // 已保存的标签列表
    selectedTags: [], // 已选中的标签列表
    showInput: false, // 是否显示输入框
    inputValue: '', // 输入框的值
    isEditing: false, // 是否处于编辑模式
    imgGridStyle:`display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content:center;
    align-items:center;
    width: 100%;
    height:30vw;`
  },
  handleInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },
  handleSubmit() {
    console.log('提交的文本：', this.data.inputText);
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
        console.log('num_rows',num_rows)
        // var query = wx.createSelectorQuery().select('#image-grid-container').boundingClientRect(function (gridContainer) { 
        //     gridContainer.gridTemplateRows = `repeat(${num_rows}, 1fr)`;
        //     let grid_height=30*num_rows;
        //     gridContainer.height=`${grid_height}vw`;
        //   }).exec();

        this.setData({
          imageList: imageList.slice(0, 9),
          imgGridStyle:`  display: grid;
          grid-template-rows: repeat(${num_rows}, 1fr);
          grid-template-columns: 1fr 1fr 1fr;
          justify-content:center;
          align-items:center;
          width: 100%;
          height:calc(30vw*${num_rows});`
        });
        
      },
      fail: (res)=>{
        console.log(1)
      }
    });
  },

  handleDelete(event) {
    const index = event.currentTarget.dataset.index;
    const imageList = this.data.imageList;
    imageList.splice(index, 1);
    this.setData({
      imageList: imageList
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
          inputValue: ''
        });
      } else {
        tags.push({info: value, checked: false});
        this.setData({
          tags: tags,
          showInput: false,
          inputValue: ''
        });
      }
    } else {
      this.setData({
        showInput: false,
        inputValue: ''
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