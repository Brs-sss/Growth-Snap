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
    host_: `${app.globalData.localUrl}`,
    openid: '', // 用户的openid
    familyid: '',
    share: false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(options) {
    console.log('options: ', options)
    if (options.family_id)
    {
      this.setData({
        familyid: options.family_id,
        share: true
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    console.log(this.data.canIUseGetUserProfile)
    // wx.getStorage({
    //   key:'shareTicket',
    //   success: function(res){
    //     // console.log(res)
    //     let shareTicket = res.data
    //     console.log("get share:", shareTicket)
    //   }
    // })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    console.log("get")
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
    console.log("jump")
    var that = this
    let flag = true
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
              console.log(res.data)
              if (res.statusCode==200)
              {
                // 登录成功
                // TODO: 处理返回的信息，记录token，id等，以便二次访问微信接口

                // wx.setStorage('csrftoken', res.cookies[0])
                // wx.setStorage('sessionid', res.cookies[1])

               // 存储数据
                wx.setStorage({
                  key: 'openid',  // 设置数据的键名
                  data: res.data.openid,  // 要存储的数据
                  success: function (res) {
                    console.log('数据存储成功');
                  },
                  fail: function (res) {
                    console.log('数据存储失败');
                  }
                });
                // console.log('share?:',that.data.share)
                // 判断是否是分享来的
                // if (that.data.share)
                // {
                //   console.log('here enter')
                //   wx.getStorage({
                //     key: 'shareTicket',
                //     success: function(res)
                //     {
                //       let shareTicket = res.data
                //       console.log('shareTicket:', shareTicket)
                //     wx.authPrivateMessage({
                //       shareTicket: shareTicket,
                //       success(res) {
                //         console.log('access: ', res)
                //       if(res.valid == true)
                //       {
                //           //提示这个人是私密分享的接受者 可以参与活动
                //           console.log("have access")
                //       }else
                //       {
                //         console.log('have no access')
                //         flag = false;
                //           //提示这个人是不是私密分享的接受者
                //           wx.showToast({
                //             title: '该邀请链接不可二次转发',
                //             icon: 'error',
                //             duration: 2000,
                //             success: function () {
                //               setTimeout(function () {
                //               }, 1000)
                //             }
                //           })
                //           return
                          
                //       }
                //       },
                //       fail(res) {
                //       console.log('ticket fail')
                //       }
                //     })
                //     },
                //     fail(res){
                //       return
                //     }
                    
                //   })
                // }
                // console.log(flag, 'falg')
                // if (flag == false)
                // {
                //   console.log('false')
                //   return;
                // }
                // 判断是否第一次登录
                console.log(res.data.exists)
                if (res.data.exists == 'false')
                {
                  wx.showToast({
                    title: "请先完善信息",
                    icon: 'none',
                    duration: 1000,
                    success: function () {
                      if (that.data.familyid == '')
                      {
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '../register/register?openid='+res.data.openid
                          })
                        }, 1000)
                      }
                      else{
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '../register_fix/register_fix?openid='+res.data.openid+'&familyid='+that.data.familyid
                          })
                        }, 1000)
                      }
                      
                    }
                  })
                }
                else
                {
                  wx.showToast({
                    title: "登录成功",
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
                  
                //   setTimeout(function () {
                //     wx.redirectTo({
                //       url: '../register_fix/register_fix?openid='+res.data.openid+'&familyid='+that.data.familyid
                //     })
                //   }, 1000)
                }
                
                // wx.switchTab({
                //   url: '/pages/show/show'
                // })
              }
            },
            fail: function(res){
              console.log(res)
            }
          })
        }
        else {
          console.log('fail')
        }
      },
      fail: (res) => {
        console.log('fail')

      }
      
    })
    console.log('why')
  }
})
