import BaseObject from "../core/BaseObject";
import Controller from "./Controller";
import Model from "./Model";

const viewMap = new Map()
const viewWeakMap = new WeakMap()

/**
 * @class View
 * @classdesc View类表示应用程序中的视图组件。
 * @extends BaseObject
 */
export default class View extends BaseObject {

  /**
   * 创建View的实例。
   * @param {*} viewComponent - 视图组件的实例。
   */
  constructor(viewComponent) {
    super();
    if (viewWeakMap.has(this.constructor)) {
      throw new Error(`View[${this.constructor.name}] instance already constructed !`);
    }
    this.name = `view_${this.hashCode}`;
    this.eventList = this.listEventInterests();
    this.viewComponent = viewComponent;
    viewWeakMap.set(this.constructor, this.name);
    viewMap.set(this.name, this);
    this.onRegister();
  }

  /**
   * 在View注册时调用的函数。
   */
  onRegister() { }

  /**
   * 在View移除时调用的函数。
   */
  onRemove() { }

  /**
   * 处理事件。
   * @param {string} type - 事件的类型。
   * @param {*} [data=null] - 附带的可选数据。
   * @param {*} [sponsor=null] - 事件的可选发起者。
   */
  handleEvent(type, data = null, sponsor = null) { }

  /**
   * 列出View感兴趣的事件。
   * @returns {Array} View感兴趣的事件列表。
   */
  listEventInterests() {
    return []
  }

  /**
   * 发送事件给视图和其他控制器。
   * @param {string} type - 事件的类型。
   * @param {*} [data=null] - 附带的可选数据。
   * @param {boolean} [strict=false] - 指示是否严格发送事件给视图。
   */
  sendEvent(type, data = null, strict = false) {
    if (!strict) {
      Controller.notifyControllers(type, data, this);
    }
    View.notifyViews(type, data, this);
  }

  /**
   * 注册视图组件。
   * @param {Function} clazz - 视图组件的类。
   * @param {*} viewComponent - 视图组件的实例。
   * @returns {*} 视图组件的实例。
   */
  registerView(clazz, viewComponent) {
    return new clazz(viewComponent)
  }

  /**
   * 检索已注册的视图组件。
   * @param {Function} clazz - 视图组件的类。
   * @returns {*} 已注册视图组件的实例。
   */
  retrieveView(clazz) {
    return View.retrieveView(clazz)
  }

  /**
   * 检索已注册的模型。
   * @param {Function} clazz - 模型的类。
   * @returns {*} 已注册模型的实例。
   */
  retrieveModel(clazz) {
    return Model.retrieveModel(clazz)
  }

  /**
   * 检索已注册的View实例。
   * @param {Function} clazz - View类。
   * @returns {*} 已注册View的实例。
   */
  static retrieveView(clazz) {
    return viewMap.get(viewWeakMap.get(clazz));
  }

  /**
   * 移除已注册的View实例。
   * @param {Function} clazz - View类。
   */
  static removeView(clazz) {
    const viewKey = viewWeakMap.get(clazz);
    if (viewKey) {
      const view = viewMap.get(viewKey);
      if (view) {
        View.viewWeakMap.delete(clazz);
        View.viewMap.delete(viewKey);
        view.onRemove();
        view.viewComponent = null;
        view.eventList = null;
      }
    }
  }

  /**
   * 移除多个已注册的View实例。
   * @param  {...Function} args - View类。
   */
  static removeViews(...args) {
    args.forEach((clazz) => View.removeView(clazz))
  }

  /**
   * 通知所有已注册的View实例关于事件的信息。
   * @param {string} type - 事件的类型。
   * @param {*} [data=null] - 附带的可选数据。
   * @param {*} [sponsor=null] - 事件的可选发起者。
   */
  static notifyViews(type, data = null, sponsor = null) {
    const notifyList = [];
    viewMap.forEach((view) => {
      if (view.eventList.indexOf(type) !== -1) {
        notifyList.push(view);
      }
    });
    notifyList.forEach((view) => view.handleEvent(type, data, sponsor));
  }

}
