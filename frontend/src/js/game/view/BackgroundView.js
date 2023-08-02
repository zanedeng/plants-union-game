import View from "../../mvc/View";
import {
  PKG_NAME_BG,
  CMD_LOAD_ASSETS,
  TYPE_SHOW_BACKGROUND
} from "../Constants";
import GameView from "../view/GameView";

export default class BackgroundView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  onRegister() {
    this.currentBgUrl = null;
    if (!fgui.UIPackage.getByName(PKG_NAME_BG)) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets: [PKG_NAME_BG],
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  listEventInterests() {
    return [
      TYPE_SHOW_BACKGROUND,
    ];
  }

  handleEvent(type, data = null, sponsor = null) {
    const handleDict = {
      [TYPE_SHOW_BACKGROUND]: async () => {
        if (data.url && this.currentBgUrl !== data.url) {
          this.currentBgUrl = data.url;
          this.viewComponent.bg.clearContent();
          this.viewComponent.bg.url = data.url;
          this.viewComponent.bg.updateLayout();
        }
      }
    };
    if (handleDict[type]) {
      handleDict[type]();
    }
  }


  initUi() {
    this.viewComponent.initUi(PKG_NAME_BG, 'bg');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    const uiLayer0 = this.gameView.viewComponent.uiLayer0;
    uiLayer0.addChild(this.viewComponent);
  }
}
