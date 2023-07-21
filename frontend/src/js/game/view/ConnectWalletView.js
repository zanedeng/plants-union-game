import View from "../../mvc/View";
import GameView from "../view/GameView";
import ConnectWalletModel from "../model/ConnectWalletModel";
import {
  CMD_LOAD_ASSETS,
  PKG_NAME_MAIN,
  TYPE_CONNECT_WALLET_SUCCESS
} from "../Constants";

export default class ConnectWalletView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  get connectWalletModel() {
    return this.retrieveModel(ConnectWalletModel);
  }

  onRegister() {
    // 先判断有没有加载 `PKG_NAME_MAIN` 资源包
    if (!fgui.UIPackage.getByName(PKG_NAME_MAIN)) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets: [PKG_NAME_MAIN],
          callback: () => this.show(),
        }
      );
      return;
    }
    this.show();
  }

  show() {
    this.viewComponent.initUi(PKG_NAME_MAIN, 'ConnectWallet');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    const c1 = this.viewComponent.$getController('c1');
    c1.setSelectedIndex(0);

    this.viewComponent.btn.on(fgui.InteractiveEvents.Down, this.onConnect, this);

    const uiLayer0 = this.gameView.viewComponent.uiLayer0;
    uiLayer0.addChild(this.viewComponent);
  }

  onConnect(evt) {
    evt.stopPropagation();
    const c1 = this.viewComponent.$getController('c1');
    if (typeof window.ethereum !== "undefined") {
      c1.setSelectedIndex(1);
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          this.connectWalletModel.account = accounts[0];
          this.connectWalletModel.chainId = window.ethereum.networkVersion;
          this.sendEvent(TYPE_CONNECT_WALLET_SUCCESS);
        })
        .catch((error) => {
          console.log(error, error.code);
          c1.setSelectedIndex(0);
        });
    } else {

    }
  }
}
