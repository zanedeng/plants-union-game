import BaseVc from "./BaseVc";

export default class FriendVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.switchBtn = this.$getChild('switchBtn');
    this.friend = this.$getChild('friend');
  }

  dispose() {
    super.dispose();
    this.switchBtn = null;
    this.friend = null;
  }
}
