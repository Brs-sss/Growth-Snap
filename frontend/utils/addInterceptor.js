import * as Interceptor from './interceptor'
import ticker from './ticker'

Interceptor.addInterceptor('onLoad', function () {
  ticker.addTick(this)
})

Interceptor.addInterceptor('onReady', function () {
  // CollectTask('pageView')
})

Interceptor.addInterceptor('onShow', function () {
  ticker.resume(this)
})

Interceptor.addInterceptor('onHide', function () {
  ticker.pause(this)
})

Interceptor.addInterceptor('onUnload', function () {
  ticker.removeTick(this)
})

// Interceptor.addInterceptor('onShareAppMessage', function (e) {
//   // const target = e.target
//   // let path = '',
//   //   title = ''
//   // if (target && target.dataset && target.dataset.share) {
//   //   title = target.dataset.share.title
//   //   path = target.dataset.share.path
//   // }
//   // CollectTask('commonShare', {
//   //   b11: e.from,
//   //   b12: title,
//   //   b13: encodeURIComponent(path)
//   // })
// })

Interceptor.addComponentInterceptor('attached', function () {
  ticker.addTick(this)
})

Interceptor.addComponentInterceptor('show', function () {
  ticker.resume(this)
})

Interceptor.addComponentInterceptor('hide', function () {
  ticker.pause(this)
})

Interceptor.addComponentInterceptor('detached', function () {
  ticker.removeTick(this)
})
