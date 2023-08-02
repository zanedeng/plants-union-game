import Model from "../../mvc/Model";
import { SUPPORTED_CHAINS } from "../Constants";

export default class ConnectWalletModel extends Model {

  constructor(data = null) {
    super(data);
  }

  /**
   * 获取登录的钱包账号
   */
  get account() { return this.data.account; }

  /**
   * 设置登录的钱包账号
   */
  set account(value) {
    if (this.data.account !== value) {
      this.data.account = value;
    }
  }

  /**
   * 获取连接的链ID
   */
  get chainId() { return this.data.chainId; }

  /**
   * 设置连接的链ID
   */
  set chainId(value) {
    if (this.data.chainId !== value) {
      this.data.chainId = value;
    }
  }

  onRegister() {
    this.data.account = null;
    this.data.chainId = SUPPORTED_CHAINS[0];
  }
}
