import View from "../../mvc/View";
import {
  CMD_LOAD_ASSETS,
  PKG_NAME_FRIEND,
} from "../Constants";
import GameView from "../view/GameView";

export default class FriendView extends View {


  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }


  onRegister() {
    if (!fgui.UIPackage.getByName(PKG_NAME_FRIEND)) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets: [PKG_NAME_FRIEND],
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  onRemove() {
    this.viewComponent.switchBtn.off(fgui.InteractiveEvents.Down, this.onSwitchFriend, this);

    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_FRIEND, 'main');
    console.log(this.viewComponent, this.viewComponent.ui)
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;
    // this.viewComponent.ui.

    this.viewComponent.switchBtn.on(fgui.InteractiveEvents.Down, this.onSwitchFriend, this);

    const uiLayer4 = this.gameView.viewComponent.uiLayer4;
    uiLayer4.addChild(this.viewComponent);
  }

  onSwitchFriend(evt) {
    evt.stopPropagation();
    const c1 = this.viewComponent.$getController('c1');
    c1.setSelectedIndex(c1.selectedIndex === 0 ? 1 : 0);

  }
}
