// app.js
import './utils/addInterceptor'
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  globalData: {
    // 如果 localDebug is set true, 会访问 localUrl
    localDebug:true,
    localUrl:'http://127.0.0.1:8090/',
    // localUrl:'http://43.138.42.129:8000/',
    // TODO: 填写服务器的url
    userInfo: null
  }
})
