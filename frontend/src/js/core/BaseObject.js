import EventEmitter from 'eventemitter3';
import { pool } from './BaseObjectPool';

let $hashCode = 0;

/**
 * 表示具有对象池功能的基础对象。
 * @extends EventEmitter
 */
export default class BaseObject extends EventEmitter {

  /**
   * 创建 BaseObject 的实例。
   */
  constructor() {
    super();
    /**
     * 对象的唯一哈希码。
     * @type {number}
     * @private
     */
    this._hashCode = $hashCode++;
  }

  /**
   * 获取对象的哈希码。
   * @type {number}
   * @readonly
   */
  get hashCode() {
    return this._hashCode;
  }

  /**
   * 处理对象并将其回收到对象池中。
   */
  dispose() {
    this.onDispose();
    pool.recycle(this);
  }

  /**
   * 当对象被处理时调用的钩子方法。
   * 子类可以重写此方法以执行额外的清理或自定义逻辑。
   * @protected
   */
  onDispose() {}

}
