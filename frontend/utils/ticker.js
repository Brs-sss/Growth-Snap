/* eslint-disable valid-jsdoc */
/**
 * Ticker 定时器类
 * @example
 * // 拥有tick方法的Page，会自动启动tick回调
 * Page({
 *    onLoad (){},
 *    onShow (){},
 *    ...
 *    tick (delta) { // delta大部分时间是1，打开新页面，触发onHide之后，60s返回该页面触发onShow,delta=60
 *        this.countdown -= delta
 *        const time = getTimeTxt(this.countdown)
 *        this.setData({
 *            payTimeTxt: time.cn,
 *            payTimeBtnTxt: time.en
 *        })
 *    }
 * })
 * @class Ticker 一个定时器类。它可以按指定帧率重复运行，从而按计划执行代码。
 * @param {Number} fps 指定定时器的运行帧率。
 */
class Ticker {
  constructor(fps) {
    this._targetFPS = fps || 1
    this._interval = 1000 / this._targetFPS
    this._tickers = []
    this._paused = false
    this._lastTime = 0
  }

  /**
   * 启动定时器。
   * 不建议外部直接调用，addTick方法会主动调用start
   * @example
   * ticker.start()
   */
  start() {
    if (this._intervalId) return
    this._lastTime = Number(new Date())

    let interval = this._interval

    let runLoop = () => {
      this._intervalId = setTimeout(runLoop, interval)
      this._tick()
    }

    runLoop()
  }

  /**
   * 停止定时器。
   * 不建议外部直接调用，removeTick方法会判断队列是否为空而主动调用stop
   * @example
   * ticker.stop()
   */
  stop() {
    clearTimeout(this._intervalId)
    this._intervalId = null
    this._lastTime = 0
  }

  /**
   * 暂停定时器。onHide会自动调用
   * @example
   * // 暂停整个ticker
   * ticker.pause()
   * // 暂停单个tickObject
   * ticker.pause(this)
   * @param {Object} tickObject 定时器对象。此对象必须包含 tick 方法。tickObject不为空暂时单个tickObject对象，否则暂停整个ticker。
   */
  pause(tickObject) {
    if (typeof tickObject === 'undefined') {
      this._paused = true
    } else if (tickObject.tick) {
      tickObject._paused = true
      tickObject._lastTime = this._lastTime
    }
  }

  /**
   * 恢复定时器。onShow会自动调用
   * @example
   * // 恢复整个ticker
   * ticker.resume()
   * // 恢复单个tickObject
   * ticker.resume(this)
   * @param {Object} tickObject 定时器对象。此对象必须包含 tick 方法。tickObject不为空恢复单个tickObject对象，否则恢复整个ticker。
   */
  resume(tickObject) {
    if (typeof tickObject === 'undefined') {
      this._paused = false
    } else if (tickObject.tick) {
      tickObject._paused = false
    }
  }

  /**
   * @private
   */
  _tick() {
    if (this._paused) return
    // eslint-disable-next-line one-var
    let startTime = Number(new Date()),
      // deltaTime = startTime - this._lastTime,
      tickers = this._tickers

    let tickersCopy = tickers.slice(0)
    for (let i = 0, len = tickersCopy.length; i < len; i++) {
      // 单个tick的deltaTime
      let deltaTime = startTime - (tickersCopy[i]._lastTime || this._lastTime)
      tickersCopy[i]._paused || (tickersCopy[i]._lastTime = 0) || tickersCopy[i].tick((deltaTime / 1000 + 0.5) >>> 0)
    }
    this._lastTime = startTime
  }

  /**
   * 添加定时器对象。定时器对象必须实现 tick 方法。onLoad会自动调用
   * @example
   * // 添加定时器对象，只对拥有tick的对象有效
   * ticker.addTick(this)
   * @param {Object} tickObject 要添加的定时器对象。此对象必须包含 tick 方法。同一对象重复添加无效。
   */
  addTick(tickObject) {
    if (!tickObject || typeof tickObject.tick !== 'function' || this._tickers.indexOf(tickObject) > -1) {
      return
    }
    this.start()
    this._tickers.push(tickObject)
  }

  /**
   * 删除定时器对象。onUnload会自动调用。特殊情况不需要tick，可以在页面引入ticker.js，主动ticker.removeTick(this)。
   * @example
   * // 删除定时器对象
   * ticker.removeTick(this)
   * // 只有全部订单列表和待支付订单列表才有倒计时
   * Page({
   *    onLoad(){},
   *    ...
   *    unpaidTimeCountdown () {
   *        if (this.data.status !== 'all' && this.data.status !== 'unpaid') {
   *            ticker.removeTick(this)
   *        }
   *    }
   * })
   * @param {Object} tickObject 要删除的定时器对象。
   */
  removeTick(tickObject) {
    // eslint-disable-next-line one-var
    let tickers = this._tickers,
      index = tickers.indexOf(tickObject)
    if (index >= 0) {
      tickers.splice(index, 1)
    }
    if (tickers.length === 0) {
      this.stop()
    }
  }

  /**
   * 下次tick时回调
   * @param  {Function} callback
   * @return {tickObj}
   */
  nextTick(callback) {
    let tickObj = {
      tick(dt) {
        this.removeTick(tickObj)
        callback()
      }
    }

    this.addTick(tickObj)
    return tickObj
  }

  /**
   * 延迟指定的时间后调用回调, 类似setTimeout
   * @param  {Function} callback
   * @param  {Number}   duration 延迟的毫秒数
   * @return {tickObj}
   */
  timeout(callback, duration) {
    let targetTime = new Date().getTime() + duration
    let tickObj = {
      tick: () => {
        let nowTime = new Date().getTime()
        let dt = nowTime - targetTime
        if (dt >= 0) {
          this.removeTick(tickObj)
          callback()
        }
      }
    }
    this.addTick(tickObj)
    return tickObj
  }

  /**
   * 指定的时间周期来调用函数, 类似setInterval
   * @param  {Function} callback
   * @param  {Number}   duration 时间周期，单位毫秒
   * @return {tickObj}
   */
  interval(callback, duration) {
    let targetTime = new Date().getTime() + duration
    let tickObj = {
      tick() {
        let nowTime = new Date().getTime()
        let dt = nowTime - targetTime
        if (dt >= 0) {
          if (dt < duration) {
            nowTime -= dt
          }
          targetTime = nowTime + duration
          callback()
        }
      }
    }
    this.addTick(tickObj)
    return tickObj
  }
}
export default new Ticker()
