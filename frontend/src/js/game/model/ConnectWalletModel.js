import Model from "../../mvc/Model";

export default class ConnectWalletModel extends Model {

  constructor(data = null) {
    super(data);
    this.account = null; // 登录的钱包账号
    this.chainId = null; // 连接的链ID
  }

}
