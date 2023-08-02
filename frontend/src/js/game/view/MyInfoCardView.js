import View from "../../mvc/View";
import {
  CMD_LOAD_ASSETS,
  PKG_NAME_MYINFO_CARD,
  PKG_NAME_MAIN,
} from "../Constants";
import RoleModel from "../model/RoleModel";
import GameView from "../view/GameView";
import NumberVc from "./vc/NumberVc";

export default class MyInfoCardView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  get roleModel() {
    return this.retrieveModel(RoleModel);
  }

  onRegister() {
    this.huntNum = null;
    this.coinNum = null;
    this.couponNum = null;

    const assets = [];
    if (!fgui.UIPackage.getByName(PKG_NAME_MAIN)) {
      assets.push(PKG_NAME_MAIN)
    }
    if (!fgui.UIPackage.getByName(PKG_NAME_MYINFO_CARD)) {
      assets.push(PKG_NAME_MYINFO_CARD)
    }
    if (assets.length > 0) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets,
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  onRemove() {
    this.huntNum.dispose();
    this.huntNum = null;

    this.coinNum.dispose();
    this.coinNum = null;

    this.couponNum.dispose();
    this.couponNum = null;

    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_MYINFO_CARD, 'infoCard');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    const model = this.roleModel;

    this.viewComponent.avatar.url = `images/avatar/avatar64x64-${model.avatarId + 1}.png`;
    this.viewComponent.nickname.text = model.nickname;
    this.viewComponent.level.text = model.level;

    this.huntNum = new NumberVc(`ui://${PKG_NAME_MAIN}/smallNum`);
    this.viewComponent.huntNum.displayObject.addChild(this.huntNum.displayObject);

    this.coinNum = new NumberVc(`ui://${PKG_NAME_MAIN}/smallNum`);
    this.coinNum.num = model.gold;
    this.viewComponent.coinNum.displayObject.addChild(this.coinNum.displayObject);

    this.couponNum = new NumberVc(`ui://${PKG_NAME_MAIN}/smallNum`);
    this.viewComponent.couponNum.displayObject.addChild(this.couponNum.displayObject);

    const uiLayer4 = this.gameView.viewComponent.uiLayer4;
    uiLayer4.addChild(this.viewComponent);
  }

}
