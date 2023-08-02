import BaseVc from "./BaseVc";

export default class BackgroundVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.bg = this.$getChild('bg');
  }
}
