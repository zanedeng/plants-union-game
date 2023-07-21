import BaseObject from "./BaseObject";

export default class Event extends BaseObject {

  constructor(type = null, data = null) {
    super();
    this.type = type;
    this.data = data;
    this.target = null;
    this.currentTarget = null;
  }

  toString() {
    return '[object Event Type ' + this.type + ' Data ' + this.data + ']';
  }

  copyFrom(value) {
    this.type = value.type;
    this.data = value.data;
    this.target = value.target;
    return this;
  }

  onDispose() {
    this.type = null;
    this.data = null;
    this.target = null;
    this.currentTarget = null;
    super.onDispose();
  }

}
