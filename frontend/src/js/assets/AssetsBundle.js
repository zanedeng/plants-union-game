import BaseObject from "../core/BaseObject";

/**
 * @class AssetsBundle
 * @classdesc AssetsBundle类表示资源包。
 * @extends BaseObject
 */
export default class AssetsBundle extends BaseObject {

  /**
   * 创建AssetsBundle的实例。
   */
  constructor() {
    super();
    this.loadErrorAssets = []; // 加载错误的资源列表
    this.retryTimes = 0; // 重试次数
    this.maxRetryTimes = 10; // 最大重试次数
    this._assets = []; // 资源列表
    this._afterMiddlewares = []; // 后置中间件列表
    this._beforeMiddlewares = []; // 前置中间件列表
  }

  /**
   * 获取资源列表。
   * @returns {Array} 资源列表。
   */
  get assets() {
    return this._assets;
  }

  /**
   * 获取前置中间件列表。
   * @returns {Array} 前置中间件列表。
   */
  get beforeMiddlewares() {
    return this._beforeMiddlewares;
  }

  /**
   * 获取后置中间件列表。
   * @returns {Array} 后置中间件列表。
   */
  get afterMiddlewares() {
    return this._afterMiddlewares;
  }

  /**
   * 添加资源。
   * @param {string} name - 资源的名称。
   * @param {string} url - 资源的URL。
   * @param {Object} [options={}] - 资源的选项。
   * @param {Function} [cb=null] - 加载完成后的回调函数。
   * @returns {AssetsBundle} AssetsBundle实例。
   */
  add(name, url, options = {}, cb = null) {
    if (!this._checkExist(name)) {
      url = encodeURI(url);
      this._assets.push({name, url, options, cb});
    }
    return this;
  }

  /**
   * 添加前置中间件。
   * @param {Function} func - 前置中间件函数。
   */
  addBeforeMiddleware(func) {
    if (func instanceof Function) {
      this._beforeMiddlewares.push(func);
    }
  }

  /**
   * 添加后置中间件。
   * @param {Function} func - 后置中间件函数。
   */
  addAfterMiddleware(func) {
    if (func instanceof Function) {
      this._afterMiddlewares.push(func);
    }
  }

  /**
   * 在释放资源时调用的函数。
   */
  onDispose() {
    this.progress = 0; // 进度重置为0
    this.loadErrorAssets = []; // 加载错误的资源列表清空
    this.retryTimes = 0; // 重试次数重置为0
    this.removeAllListeners(); // 移除所有事件监听器
    this._assets = []; // 资源列表清空
    this._afterMiddlewares = []; // 后置中间件列表清空
    this._beforeMiddlewares = []; // 前置中间件列表清空
  }

  /**
   * 重置资源包。
   */
  reset() {
    this.progress = 0; // 进度重置为0
    this._assets = []; // 资源列表清空
    this._afterMiddlewares = []; // 后置中间件列表清空
    this._beforeMiddlewares = []; // 前置中间件列表清空
  }

  /**
   * 检查资源是否已存在。
   * @param {string} name - 资源的名称。
   * @returns {boolean} 如果资源已存在，则返回true；否则返回false。
   */
  _checkExist(name) {
    for (let i = 0, l = this._assets.length; i < l; ++i) {
      if (name === this._assets[i].name) {
        return true;
      }
    }
    return false;
  }
}
