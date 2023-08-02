import BaseVc from "./BaseVc";

export default class LoadingVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.bar = this.$getChild('bar');
  }

  dispose() {
    super.dispose();
    this.bar = null;
  }
}
