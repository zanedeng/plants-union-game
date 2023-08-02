import Model from "../../mvc/Model";

export default class RoleModel extends Model {

  constructor(data = null) {
    super(data);
  }

  get nickname() { return this.data.nickname || ''; }

  set nickname(value) {
    this.data.nickname = value;
  }

  get avatarId() { return this.data.avatarId || 1; }

  set avatarId(value) {
    if (this.data.avatarId !== value) {
      this.data.avatarId = value;
    }
  }

  get level() { return this.data.level || 1; }

  set level(value) {
    if (this.data.level !== value) {
      this.data.level = value;
    }
  }

  get warGridNum() { return this.data.warGridNum || 2; }
  set warGridNum(value) {
    if (this.data.warGridNum !== value) {
      this.data.warGridNum = value;
    }
  }

  get gold() { return this.data.gold || 0; }
  set gold(value) {
    if (this.data.gold !== value) {
      this.data.gold = value;
    }
  }

  get createTime() { return this.data.createTime || 0; }
  set createTime(value) {
    if (this.data.createTime !== value) {
      this.data.createTime = value;
    }
  }
}
