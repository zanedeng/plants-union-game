import Controller from "../../mvc/Controller";
import { createInstance } from "../../utils/createInstance";

/**
 * 用于注册视图控制器。
 * @extends Controller
 */
export default class RegisterViewController extends Controller {

  /**
   * 创建一个 RegisterViewController 实例。
   * @param {string} type - 类型参数。
   */
  constructor(type) {
    super(type);
  }

  /**
   * 执行注册操作。
   * @param {Object|null} data - 数据对象。
   * @param {Function} data.viewClazz - 视图类。
   * @param {Function} data.vcClazz - 视图组件类。
   * @param {Array} data.vcParameters - 视图组件类实例化的参数。
   * @param {Object} data.vcProperties - 视图组件类实例化后的属性初始值。
   * @param {Object|null} sponsor - 发起者对象。
   * @throws {Error} 当参数错误时抛出错误。
   * @throws {Error} 当注册视图管理类为空时抛出错误。
   * @throws {Error} 当注册视图类为空时抛出错误。
   */
  execute(data = null, sponsor = null) {
    if (!data) {
      throw new Error('参数错误！');
    }
    if (!data.viewClazz) {
      throw new Error('注册视图管理类不能为空！');
    }
    if (!data.vcClazz) {
      throw new Error('注册视图类不能为空！');
    }

    if (this.retrieveView(data.viewClazz)) {
      this.removeView(data.viewClazz);
    }

    const vc = createInstance(data.vcClazz, data.vcParameters);
    if (data.vcProperties) {
      Object.keys(data.vcProperties).map(key => {
        if (vc[key]) {
          vc[key] = data.vcProperties[key];
        }
      });
    }
    this.registerView(data.viewClazz, vc);
  }
}
