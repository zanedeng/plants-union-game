const modelDict = new WeakMap();

/**
 * @class Model
 * @classdesc Model类表示应用程序中的数据模型。
 */
export default class Model {

  /**
   * 创建Model的实例。
   * @param {*} [data=null] - Model的初始数据。
   */
  constructor(data = null) {
    if (Model.retrieveModel(this.constructor)) {
      throw new Error(`名为[${this.constructor.name}] 的 Model 实例已经存在!`);
    }
    this.data = {}
    if (data) {
      Object.keys(data).forEach((key) => {
        this.data[key] = data[key];
      })
    }
    modelDict.set(this.constructor, this)
    this.onRegister()
  }

  /**
   * 在Model注册时调用的函数。
   */
  onRegister() { }

  /**
   * 在Model移除时调用的函数。
   */
  onRemove() { }

  /**
   * 发送事件给视图。
   * @param {string} type - 事件的类型。
   * @param {*} [data=null] - 附带的可选数据。
   */
  sendEvent(type, data = null) {
    View.notifyViews(type, data, this);
  }

  /**
   * 检索已注册的Model实例。
   * @param {Function} clazz - Model类。
   * @returns {*} 已注册Model的实例。
   */
  static retrieveModel(clazz) {
    return modelDict.get(clazz);
  }

  /**
   * 移除已注册的Model实例。
   * @param {Function} clazz - Model类。
   */
  static removeModel(clazz) {
    modelDict.remove(clazz);
  }
}
