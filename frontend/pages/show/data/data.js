// pages/show/data/data.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keys: ['身高', '体重', '数学成绩', '语文成绩'],
    loadedKeys: ['身高', '体重'],
    unloadedKeys: ['数学成绩', '语文成绩'],
    records: [],

    startAdd: false,
    waitClear: '',

    submitHeight: '0',
    areaH: 0,
    windowH: 0,

    host_: 'http://127.0.0.1:8090/'
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
    //   unloadedItems: this.data.keys
    // })

    // this.setData({
    //   submitHeight: String.toString(window.innerHeights - 140)
    // })

    // 设置提交按钮高度
    this.updataSubmitHeight()
  },

  handleAddKey(e) { // 处理添加标签
    var id = e.target.id
    // 新建标签
    if(id == "createBar"){
      var newKey = e.detail.value
      var lT = this.data.loadedKeys
      // 已有直接退出
      if(lT.includes(newKey)){
        this.setData({
          startAdd: !this.data.startAdd,
          waitClear: ""
        })
      }
      // 非空进行添加
      else if(newKey != "") {
        var lT = this.data.loadedKeys
        lT.push(newKey)
        this.setData({
          loadedKeys: lT,
          startAdd: !this.data.startAdd,
          waitClear: ""
        })
        this.updataSubmitHeight()
      }
    }
    // 添加已有key
    else if(id != ""){
      var uT = this.data.unloadedKeys
      var lT = this.data.loadedKeys
      for(var i = 0; i < uT.length; i++){
        if(id == uT[i]){
          lT.push(uT[i])
          uT.splice(i, 1)
        }
      }
      this.setData({
        unloadedKeys: uT,
        loadedKeys: lT,
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
    if(e.detail.value == null)
      return
    var key = e.currentTarget.id
    var records = this.data.records
    for(var i = 0; i < records.length; i++){
      if(key == records[i]["key"]){
        records[i]["value"] = e.detail.value;
        console.log(this.data.records)
        return
      }
    }
    records.push({"key": e.currentTarget.id, "value": e.detail.value})
    console.log(this.data.records)
  },

  handleSubmit(e) { // 处理提交
    var pointer = this
    console.log("length: ", pointer.data.records.length)
    if(pointer.data.records.length == 0)
      return

    // 获取年-月-日
    const currentDateAndTime = new Date();
    var year = currentDateAndTime.getFullYear();
    var month = (currentDateAndTime.getMonth() + 1).toString().padStart(2, '0'); 
    var day = currentDateAndTime.getDate().toString().padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;

    const currentDateString = currentDateAndTime.toDateString();
    const currentTimeString = currentDateAndTime.toTimeString();
    
    wx.getStorage({
      key: 'openid',  // 要获取的数据的键名
      success: function (res) { 
        var openid = res.data
        const generate = openid + currentDateString + currentTimeString;
        wx.request({
          url: pointer.data.host_ + 'user/api/getSHA256' + '?text=' + generate,
          method:'GET',
          success:function(res){
            const data_id = res.data.sha256;
            console.log(data_id)
            wx.request({ //上传数据
              url: pointer.data.host_ + 'user/api/show/data/submit',
              method: 'POST',
              header:{
                'content-type': 'application/json'
              },
              data:{
                'openid':openid,
                'data_id':data_id,
                'children':'',
                'records':pointer.data.records,
                'date':formattedDate,
                'time':currentTimeString,
              },
              success: function(res) {
                wx.navigateBack(1) //成功提交，返回上个页面
              },
              fail: function(res) {
                console.error('上传失败', res);
              }
            })
          }
        });
      },
      fail: function(res) {
        console.error('获取本地储存失败', res);
      }
    })
  }
})