import Controller from "../../mvc/Controller";

/**
 * 用于注销视图控制器。
 * @extends Controller
 */
export default class RemoveViewController extends Controller {

  /**
   * 创建一个 RemoveViewController 实例。
   * @param {string} type - 类型参数。
   */
  constructor(type) {
    super(type);
  }

  /**
   * 执行注册操作。
   * @param {Object|null} data - 数据对象。
   * @param {Function} data.viewClazz - 视图类。
   * @param {Object|null} sponsor - 发起者对象。
   * @throws {Error} 当参数错误时抛出错误。
   */
  execute(data = null, sponsor = null) {
    if (!data) {
      throw new Error('参数错误！');
    }
    if (this.retrieveView(data.viewClazz)) {
      this.removeView(data.viewClazz);
    }
  }
}
