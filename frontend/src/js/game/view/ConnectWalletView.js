import View from "../../mvc/View";
import GameView from "../view/GameView";
import ConnectWalletModel from "../model/ConnectWalletModel";
import {
  CMD_LOAD_ASSETS,
  CMD_REMOVE_VIEW,
  PKG_NAME_MAIN,
  TYPE_CONNECT_WALLET_SUCCESS,
  TYPE_SYSTEM_PROMPT
} from "../Constants";
import { isMobile } from "../../utils/is";
import { getWallet } from "../../wallet";

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
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  onRemove() {
    this.viewComponent.btn.off(fgui.InteractiveEvents.Down, this.onConnect, this);
    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_MAIN, 'ConnectWallet');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    const c1 = this.viewComponent.$getController('c1');
    c1.setSelectedIndex(0);

    this.viewComponent.btn.on(fgui.InteractiveEvents.Down, this.onConnect, this);

    const uiLayer4 = this.gameView.viewComponent.uiLayer4;
    uiLayer4.addChild(this.viewComponent);
  }

  onConnect(evt) {
    evt.stopPropagation();
    const c1 = this.viewComponent.$getController('c1');
    if (typeof window.ethereum !== "undefined") {
      c1.setSelectedIndex(1);
      const wallet = getWallet();
      wallet.activate(this.connectWalletModel.chainId).then(() => {
        this.sendEvent(TYPE_CONNECT_WALLET_SUCCESS);
        this.destroy();
      })
      .catch((error) => {
        console.log(error, error.code);
        c1.setSelectedIndex(0);
      });
    } else {
      if (isMobile()) {
        this.sendEvent(TYPE_SYSTEM_PROMPT, {
          msg: '如果您使用手机，请使用 MetaMask 应用程序的浏览器进行连接。'
        });
      } else {
        this.sendEvent(TYPE_SYSTEM_PROMPT, {
          msg: '您的浏览器没有安装 Metamask 插件，是否前往安装？',
          onOk: () => {
            window.open("https://metamask.io/download/", "_blank");
          }
        });
      }
    }
  }

  /**
   * 卸载视图，因为连接钱包不是频繁操作，所以在这里连接成功后可以卸载掉视图
   */
  destroy() {
    this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: ConnectWalletView});
  }
}
