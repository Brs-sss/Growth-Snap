/* eslint-disable valid-jsdoc */
// 生命周期函数集合
const Interceptor = {
  onLoad: [],
  onReady: [],
  onShow: [],
  onHide: [],
  onUnload: []
  // onShareAppMessage: []
}

// 组件生命周期函数集合
const ComponentInterceptor = {
  attached: [],
  show: [],
  hide: [],
  detached: []
}

/**
 * 组合函数，依次执行
 * @param  {...Function} args 被组合的函数
 */
function compose(interceptorList, sourceMethod, keyName) {
  return function () {
    ;[...interceptorList, sourceMethod].forEach((fn) => {
      typeof fn === 'function' && fn.apply(this, arguments)
    })
  }
}

/**
 * 小程序Page方法的替代实现
 */
const wxPage = Page

/**
 * 重写Page构造函数
 * @param pageObject - 传入的页面对象
 */
Page = function (pageObject) {
  Object.keys(Interceptor).forEach((keyName) => {
    const sourceMethod = pageObject[keyName]
    pageObject[keyName] = compose(Interceptor[keyName], sourceMethod, keyName)
  })
  return wxPage(pageObject)
}

/**
 * 增加对Page生命周期方法的拦截器
 * @param methodName
 * @param handler
 */
export function addInterceptor(methodName, handler) {
  Interceptor[methodName] && Interceptor[methodName].push(handler)
}

/**
 * 小程序Component方法的替代实现
 */
const wxComponent = Component

/**
 * 重写Conponent构造函数
 * @param componentObject - 传入的页面对象
 */
Component = function (componentObject) {
  componentObject.pageLifetimes = componentObject.pageLifetimes || {}
  Object.keys(ComponentInterceptor).forEach((keyName) => {
    if (['show', 'hide'].includes(keyName)) {
      const sourceMethod = componentObject.pageLifetimes[keyName]
      componentObject.pageLifetimes[keyName] = compose(ComponentInterceptor[keyName], sourceMethod, keyName)
    } else {
      // 兼容Component.lifetimes.attached和Component.attached，detached同理
      let lifetimes = componentObject
      if (componentObject.lifetimes && componentObject.lifetimes[keyName]) {
        lifetimes = componentObject.lifetimes
      }
      const sourceMethod = lifetimes[keyName]
      lifetimes[keyName] = compose(ComponentInterceptor[keyName], sourceMethod)
    }
  })
  return wxComponent(componentObject)
}

/**
 * 增加对Component生命周期方法的拦截器
 * @param methodName
 * @param handler
 */
export function addComponentInterceptor(methodName, handler) {
  ComponentInterceptor[methodName] && ComponentInterceptor[methodName].push(handler)
}
