import View from "../../mvc/View";
import {
  CMD_LOAD_ASSETS,
  PKG_NAME_HUNT,
  TYPE_SHOW_BACKGROUND,
  CMD_REGISTER_VIEW,
  HUNT_TYPE,
  CMD_REMOVE_VIEW
} from "../Constants";
import GameView from "../view/GameView";
import MyInfoCardView from "../view/MyInfoCardView";
import MyInfoCardVc from "./vc/MyInfoCardVc";
import HuntModel from "../model/HuntModel";
import FriendView from "./FriendView";
import FriendVc from "./vc/FriendVc";
import HallView from "./HallView";
import HallVc from "./vc/HallVc";

export default class HuntView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  get huntModel() {
    return this.retrieveModel(HuntModel);
  }

  onRegister() {
    this.sendEvent(TYPE_SHOW_BACKGROUND, {url: `images/bg/huntbg1.jpg`});
    if (!fgui.UIPackage.getByName(PKG_NAME_HUNT)) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets: [PKG_NAME_HUNT],
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  onRemove() {
    this.viewComponent.backBtn.off(fgui.InteractiveEvents.Down, this.onBackToHall, this);

    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_HUNT, 'main');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    this.viewComponent.backBtn.on(fgui.InteractiveEvents.Down, this.onBackToHall, this);

    const uiLayer4 = this.gameView.viewComponent.uiLayer4;
    uiLayer4.addChild(this.viewComponent);

    this.sendEvent(CMD_REGISTER_VIEW, {viewClazz: MyInfoCardView, vcClazz: MyInfoCardVc });

    if (this.huntModel.huntType !== HUNT_TYPE.ZOMBIE) {
      this.viewComponent.nextPageBtn.visible = false;
      this.viewComponent.prevPageBtn.visible = false;
    } else {
      this.sendEvent(CMD_REGISTER_VIEW, {viewClazz: FriendView, vcClazz: FriendVc});
    }
  }

  onBackToHall(evt) {
    evt.stopPropagation();
    this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: FriendView});
    this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: MyInfoCardView});
    this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: HuntView});

    this.sendEvent(CMD_REGISTER_VIEW, {viewClazz: HallView, vcClazz: HallVc});
  }
}
