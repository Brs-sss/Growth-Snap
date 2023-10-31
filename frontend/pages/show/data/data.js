// pages/show/data/data.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tags: ['身高', '体重', '数学成绩', '语文成绩'],
    loadedTags: ['身高', '体重'],
    unloadedTags: ['数学成绩', '语文成绩'],
    records: [],

    startAdd: false,
    waitClear: '',

    submitHeight: '0',
    areaH: 0,
    windowH: 0
  },

  updataSubmitHeight() {
    var p = this
    wx.createSelectorQuery().selectViewport().scrollOffset(function(res) {
      const scrollHeight = res.scrollHeight; // Total height of the scrollable area
      p.setData({
        submitHeight: String(scrollHeight - 180)
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // get(api, items) & get(api, unloadedItems)
    // this.setData({
    //   unloadedItems: this.data.tags
    // })

    // this.setData({
    //   submitHeight: String.toString(window.innerHeights - 140)
    // })

    // 设置提交按钮高度
    this.updataSubmitHeight()
  },

  handleAddTag(e) { // 处理添加标签
    var id = e.target.id
    // 新建标签
    if(id == "createBar"){
      var newTag = e.detail.value
      var lT = this.data.loadedTags
      // 已有直接退出
      if(lT.includes(newTag)){
        this.setData({
          startAdd: !this.data.startAdd,
          waitClear: ""
        })
      }
      // 非空进行添加
      else if(newTag != "") {
        var lT = this.data.loadedTags
        lT.push(newTag)
        this.setData({
          loadedTags: lT,
          startAdd: !this.data.startAdd,
          waitClear: ""
        })
        this.updataSubmitHeight()
      }
    }
    // 添加已有tag
    else if(id != ""){
      var uT = this.data.unloadedTags
      var lT = this.data.loadedTags
      for(var i = 0; i < uT.length; i++){
        if(id == uT[i]){
          lT.push(uT[i])
          uT.splice(i, 1)
        }
      }
      this.setData({
        unloadedTags: uT,
        loadedTags: lT,
        startAdd: !this.data.startAdd
      })
      this.updataSubmitHeight()
    }
    // 点击其他区域收回
    else if(id == "overlay"){
      this.setData({
        startAdd: false,
        waitClear: ""
      })
    }
    else {
      this.setData({
        startAdd: !this.data.startAdd
      })
    }
  },

  handleAddData(e) { // 处理数据改变
    var tag = e.currentTarget.id
    var records = this.data.records
    for(var i = 0; i < records.length; i++){
      if(tag == records[i]["tag"]){
        records[i]["value"] = parseInt(e.detail.value);
        console.log(this.data.records)
        return
      }
    }
    records.push({"tag": e.currentTarget.id, "value": parseInt(e.detail.value)})
    console.log(this.data.records)
  },

  handleSubmit(e) { // 处理提交
    var map = new Map();
  }
})