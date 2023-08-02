import BaseVc from "./BaseVc";

export default class ConnectWalletVc extends BaseVc {

  constructor() {
    super();
  }

  onLoaded() {
    this.btn = this.$getChild('btn');
  }

  dispose() {
    super.dispose();
    this.btn = null;
  }
}
