import View from "../../mvc/View";
import {
  CMD_LOAD_ASSETS,
  CMD_REGISTER_VIEW,
  PKG_NAME_MAIN,
  TYPE_CONNECT_WALLET_SUCCESS,
  TYPE_ACCOUNTS_CHANGED,
  TYPE_NETWORK_CHANGED
} from "../Constants";
import GameModel from "../model/GameModel";
import ConnectWalletModel from "../model/ConnectWalletModel";
import ConnectWalletView from "./ConnectWalletView";
import ConnectWalletVc from "./vc/ConnectWalletVc";

export default class GameView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameModel() {
    return this.retrieveModel(GameModel);
  }

  get connectWalletModel() {
    return this.retrieveModel(ConnectWalletModel);
  }

  onRegister() {
    // 加载进入主界面所需要的资源包
    this.sendEvent(
      CMD_LOAD_ASSETS,
      {
        assets: [ PKG_NAME_MAIN ],
        callback: () => {
          const model = this.connectWalletModel;
          const account = model.account;
          const chainId = model.chainId;
          if (account && chainId) {

          } else {
            this.sendEvent(
              CMD_REGISTER_VIEW,
              {
                viewClazz: ConnectWalletView,
                vcClazz: ConnectWalletVc
              }
            );
          }
        }
      }
    );
  }

  onRemove() { }

  handleEvent(type, data = null, sponsor = null) {
    const handleDict = {
      [TYPE_CONNECT_WALLET_SUCCESS]: () => {
        window.ethereum.on('accountsChanged', (accounts) => {
          this.connectWalletModel.account = accounts[0];
          this.sendEvent(TYPE_ACCOUNTS_CHANGED);
        })

        window.ethereum.on('chainChanged', (networkId) => {
          this.connectWalletModel.chainId = networkId;
          this.sendEvent(TYPE_NETWORK_CHANGED);
        })
      }
    };
    if (handleDict[type]) {
      handleDict[type]();
    }
  }

  listEventInterests() {
    return [
      TYPE_CONNECT_WALLET_SUCCESS,
    ];
  }
}
