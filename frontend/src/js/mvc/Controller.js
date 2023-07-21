import View from "./View";
import Model from "./Model";

/**
 * @type {Map<string, Controller>}
 * @private
 */
const controllerDict = new Map();

/**
 * @class Controller
 * @classdesc Controller类用于管理视图和模型组件之间的交互。
 */
export default class Controller {

  /**
   * 创建Controller的实例。
   * @param {string} type - 控制器的类型。
   */
  constructor(type) {
    if (controllerDict.has(type)) {
      throw new Error(`类型名为 [${type}] 的控制器已经存在!`);
    }
    this.type = type;
    controllerDict.set(type, this);
    this.onRegister();
  }

  /**
   * 当控制器注册时调用的函数。
   * @type {function}
   */
  onRegister() { }

  /**
   * 当控制器移除时调用的函数。
   * @type {function}
   */
  onRemove() { }

  /**
   * 执行控制器的逻辑。
   * @param {*} [data] - 执行时的可选数据。
   * @param {*} [sponsor] - 执行的可选发起者。
   */
  execute(data = null, sponsor = null) { }

  /**
   * 向视图和其他控制器发送事件。
   * @param {string} type - 事件的类型。
   * @param {*} [data] - 附带的可选数据。
   * @param {boolean} [strict=false] - 指示是否严格发送事件给视图。
   */
  sendEvent(type, data = null, strict = false) {
    if (!strict) {
      View.notifyViews(type, data, this)
    }
    Controller.notifyControllers(type, data, this)
  }

  /**
   * 注册视图组件。
   * @param {Function} clazz - 视图组件的类。
   * @param {*} viewComponent - 视图组件的实例。
   */
  registerView(clazz, viewComponent) {
    return new clazz(viewComponent);
  }

  /**
   * 检索已注册的视图组件。
   * @param {Function} clazz - 视图组件的类。
   * @returns {*} 已注册视图组件的实例。
   */
  retrieveView(clazz) {
    return View.retrieveView(clazz);
  }

  /**
   * 移除已注册的视图组件。
   * @param {Function} clazz - 视图组件的类。
   */
  removeView(clazz) {
    View.removeView(clazz);
  }

  /**
   * 注册新的控制器。
   * @param {string} type - 控制器的类型。
   * @param {Function} clazz - 控制器的类。
   */
  registerController(type, clazz) {
    return new clazz(type);
  }

  /**
   * 移除已注册的控制器。
   * @param {string} type - 控制器的类型。
   */
  removeController(type) {
    Controller.removeController(type)
  }

  /**
   * 注册新的模型。
   * @param {Function} clazz - 模型的类。
   * @param {*} [data] - 模型的可选数据。
   */
  registerModel(clazz, data = null) {
    return new clazz(data)
  }

  /**
   * 检索已注册的模型。
   * @param {Function} clazz - 模型的类。
   * @returns {*} 已注册模型的实例。
   */
  retrieveModel(clazz) {
    return Model.retrieveModel(clazz);
  }

  /**
   * 移除已注册的模型。
   * @param {Function} clazz - 模型的类。
   */
  removeModel(clazz) {
    Model.removeModel(clazz);
  }

  /**
   * 通知特定类型的控制器关于事件的信息。
   * @param {string} type - 要通知的控制器的类型。
   * @param {*} [data] - 附带的可选数据。
   * @param {*} [sponsor] - 事件的可选发起者。
   */
  static notifyControllers(type, data = null, sponsor = null) {
    const control = controllerDict.get(type);
    if (control) {
      control.execute(data, sponsor);
    }
  }

  /**
   * 检查特定类型的控制器是否存在。
   * @param {string} type - 控制器的类型。
   * @returns {boolean} 如果控制器存在则为true，否则为false。
   */
  static hasController(type) {
    return controllerDict.has(type);
  }

  /**
   * 移除特定类型的控制器。
   * @param {string} type - 控制器的类型。
   */
  static removeController(type) {
    const control = controllerDict.get(type);
    if (control) {
      control.onRemove()
      controllerDict.delete(type)
    }
  }
}
