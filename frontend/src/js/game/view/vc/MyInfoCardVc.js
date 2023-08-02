import BaseVc from "./BaseVc";

export default class MyInfoCardVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.nickname = this.$getChild('nickname');
    this.level = this.$getChild('level');
    this.avatar = this.$getChild('avatar');
    this.huntNum = this.$getChild('huntNum');
    this.coinNum = this.$getChild('coinNum');
    this.couponNum = this.$getChild('couponNum');
  }

  dispose() {
    super.dispose();
    this.nickname = null;
    this.level = null;
    this.avatar = null;
    this.huntNum = null;
    this.coinNum = null;
    this.couponNum = null;
  }
}
