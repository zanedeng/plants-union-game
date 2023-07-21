import { PKG_NAME_MAIN } from "../../Constants";
import BaseVc from "./BaseVc";

export default class ConnectWalletVc extends BaseVc {

  constructor() {
    super();
    this.btn = null;
  }

  onLoaded() {
    this.btn = this.$getChild('btn');
  }

  dispose() {
    super.dispose();
    this.btn = null;
  }
}
