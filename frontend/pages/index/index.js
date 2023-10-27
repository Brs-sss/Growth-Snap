// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    host_: 'http://127.0.0.1:8090/',
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumpPage:function() {
    var that = this
    wx.login({
      success: (res) => {
        if (res.code)
        {
          console.log(res.code, ' code')
          wx.request({
            url: that.data.host_+'user/api/login',
            method: 'POST',
            data: {
              "code": res.code,
            },
            header:
            {
              'content-type': 'application/json'
            },
            success: function(res)
            {
              console.log(res.data),
              console.log(res.statusCode)
              if (res.statusCode==200)
              {
                // 登录成功
                // TODO: 处理返回的信息，记录token等，以便二次访问微信接口

                // wx.setStorage('csrftoken', res.cookies[0])
                // wx.setStorage('sessionid', res.cookies[1])
                wx.showToast({
                  title: "登录成功",
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/show/show'
                      })
                    }, 2000)
                  }
                })
                // wx.switchTab({
                //   url: '/pages/show/show'
                // })
              }
            }
          })
        }
      },
    })
    
  }
})
