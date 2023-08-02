import EventEmitter from 'eventemitter3';

export default class AbstractConnector extends EventEmitter {

  constructor() {
    super();
    if (new.target === AbstractConnector) {
      throw new TypeError("Cannot instantiate AbstractConnector directly.");
    }
    /**
     * 这个属性在连接器处于活动状态时必须被定义，除非提供了 customProvider。
     */
    this.provider = null;

    this.accounts = null;

    this.chainId = null;
  }

  /**
   * 发起连接。
   */
  activate() {
    throw new Error("Abstract method must be implemented.");
  }

}
