import BaseObject from "../core/BaseObject";
/**
 * @class App
 * @classdesc App类表示应用程序的主类。
 * @extends BaseObject
 */
export default class App extends BaseObject {

  /**
   * 创建App的实例。
   */
  constructor() {
    super();
  }

  /**
   * 注册控制器。
   * @param {string} type - 控制器的类型。
   * @param {Function} clazz - 控制器的类。
   * @returns {*} 控制器的实例。
   */
  registerController(type, clazz) {
    return new clazz(type);
  }

  /**
   * 注册模型。
   * @param {Function} clazz - 模型的类。
   * @param {*} [data=null] - 附带的可选数据。
   * @returns {*} 模型的实例。
   */
  registerModel(clazz, data = null) {
    return new clazz(data);
  }

  /**
   * 注册视图组件。
   * @param {Function} clazz - 视图组件的类。
   * @param {*} viewComponent - 视图组件的实例。
   * @returns {*} 视图组件的实例。
   */
  registerView(clazz, viewComponent) {
    return new clazz(viewComponent);
  }
}
