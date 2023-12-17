// pages/user/family/family.js
function LoadFamilyPage(that){
  // 获取存储的openid
  // var that = this
  wx.getStorage({
    key: 'openid',  // 要获取的数据的键名
    success: function (res) 
    { 
      // 从本地存储中获取数据,在index.js文件中保存建立的
      let openid=res.data
      that.setData({
        openid: openid
      })
      wx.request({
        url: that.data.host_+'user/api/user/get_family_info'+'?openid='+openid,
        method:'GET',
        success:function(res){
            that.setData({
              blog_cards_list:res.data.family_list
            })
            console.log(that.data.blog_cards_list)
        },
        fail:function(res){
          console.log('load page failed: ',res)
        }
      
      })
      wx.request({
        url: that.data.host_+'user/api/user/get_family_token' + 
        '?openid=' + openid,
        method: 'GET',
        success:function(res){
          console.log(res)
          if (res.data.code != 'invalid')
          {
            console.log('yes', res.data.token, res.data.countdown)
            that.setData({
                        generate_token: true,
                        token: res.data.token,
                        time: res.data.time
                      })
            console.log('yes', that.data.token, that.data.time)
            
          }
          wx.request({
            url: that.data.host_+'user/api/get_familyid?openid='+openid,
            method: 'GET',
            success: function(res){
              console.log('res: ', res)
              // familyid = res.data.family_id
              that.setData({
                familyid: res.data.family_id
              })
              console.log('family_id: ', that.data.familyid)
            }
          })
          
        },

      })
    },
    fail:function(res){
      console.log('get openid failed: ',res)
    }

    

   })
  //  wx.getStorage({
  //    key: 'generate_token',
  //    success: function(res){
  //     //  console.log('token', res.data)
  //      that.setData({
  //        generate_token: res.data
  //      })
  //      wx.getStorage({
  //        key: 'time',
  //        success: function(res){
  //         // console.log('time', res.data)
  //         let time = res.data
  //          that.setData({
  //            time: time
  //          })
  //         //  console.log('set time: ', that.data.time)
  //        }
  //      })
  //    }
  //  })

    
}

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyMembers: [
      {
        profile: "/image/user/profile/mom.png",
        name: "小明妈",
        tag: "妈妈",
        signature: "这里是个性签名1"
      },
      {
        profile: "/image/user/profile/dad.png",
        name: "小明爸",
        tag: "爸爸",
        signature: "这里是个性签名2"
      },
      // 其他家庭成员...
    ],
    blog_cards_list:[],  //所有卡片BlogCard的list
    host_: `${app.globalData.localUrl}`,
    generate_token: false,
    token: 'token',
    time: 0,
    countdown: '',
    openid: '',
    familyid: ''
  },
  addmember() {
    // TODO: 跳转到对应页面的处理逻辑
    var itemList=['转发邀请链接', '生成家庭验证码']
    var that = this
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (!res.cancel) {
          if (res.tapIndex === 0) {　// 执行转发邀请链接的操作
            console.log('share the link')
          } else if (res.tapIndex === 1)
           {　// 执行生成验证码的操作
            
            // that.setData({
            //   generate_token: true,
            //   time: 60*1000*1
            // })
            // wx.setStorage({
            //   key:'generate_token',
            //   data: 'true'
            // })
          }
        }
      }
    })
    // wx.navigateTo({
    //   url: '/pages/user/family/addmember/addmember',
    // })
  },
  familycode()
  {
    console.log('code')
    var that = this
    if (that.data.generate_token == true)
            {
              wx.showToast({
                title: '家庭验证码已生成',
                icon: 'error'
              })
              return
            }
            wx.request({
              url: that.data.host_+'user/api/user/generate_family_token',
              method: 'POST',
              header:{
                'content-type': 'application/json'
              },
              data: {
                'openid': that.data.openid,
              },
              success:function(res){
                console.log(res)
                that.setData({
                  generate_token: true,
                  token: res.data.token,
                  time: res.data.time
                })
              },
            })
  },
  tick (delta) {
    if (this.data.time == 0)
    {
      this.setData({
        generate_token: false
      })
      // wx.setStorage({
      //   key:'generate_token',
      //   data: 'false'
      // })
    }
    // console.log('get time:', this.data.time)
    const t = new Date(this.data.time -= delta * 1000)
    let countdown = `${t.getMinutes()}:${this.PrefixZero(t.getSeconds(), 2)}`
    this.setData({
    countdown: countdown
  })
  // wx.setStorage({
  //   key: 'time',
  //   data: this.data.time
  // })
  // console.log('countdown: ', countdown)
    
    
  },
  PrefixZero(num, n) {// 前补零
    return (Array(n).join(0) + num).slice(-n);
  },
  close() {
    this.setData({
      generate_token: false
    })
    wx.setStorage({
      key:'generate_token',
      data: 'false'
    })
  },
  copy(){
    wx.setClipboardData({
      data: this.data.token,
      success: function(res)
      {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    LoadFamilyPage(that)
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
    var that = this
    LoadFamilyPage(that)
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
    
    console.log('here')
    console.log('familyid: ', this.data.familyid)
    return {
      title: '邀请你加入家庭~',
      path: '/pages/index/index?family_id='+this.data.familyid,
      imageUrl: '/image/user/card_image.jpg',
    }
  }
})