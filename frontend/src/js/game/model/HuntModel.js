import Model from "../../mvc/Model";

export default class HuntModel extends Model {

  constructor(data = null) {
    super(data);
  }

  /**
   * 获取涉猎类型
   */
  get huntType() { return this.data.huntType; }

  /**
   * 设置涉猎类型
   */
  set huntType(value) {
    this.data.huntType = value;
  }

}
