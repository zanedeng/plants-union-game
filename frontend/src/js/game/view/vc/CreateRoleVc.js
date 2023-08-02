import BaseVc from "./BaseVc";

export default class CreateRoleVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.nickname = this.$getChild('nickname');
    this.preBtn = this.$getChild('preBtn');
    this.nextBtn = this.$getChild('nextBtn');
    this.startBtn = this.$getChild('startBtn');
    this.avatar = this.$getChild('avatar');
  }

  dispose() {
    super.dispose();
    this.nickname = null;
    this.preBtn = null;
    this.nextBtn = null;
    this.startBtn = null;
    this.avatar = null;
  }
}
