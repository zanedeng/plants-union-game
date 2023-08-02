import View from "../../mvc/View";
import { PKG_NAME_LOADING, TYPE_LOADED, TYPE_LOADING } from "../Constants";
import GameView from "../view/GameView";

export default class LoadingView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  onRegister() {
    // 先判断有没有加载 `PKG_NAME_LOADING` 资源包
    if (!fgui.UIPackage.getByName(PKG_NAME_LOADING)) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets: [PKG_NAME_LOADING],
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  listEventInterests() {
    return [
      TYPE_LOADING,
      TYPE_LOADED
    ];
  }

  handleEvent(type, data = null, sponsor = null) {
    const handleDict = {
      [TYPE_LOADING]: () => {
        this.viewComponent.visible = true;
        // 这里有可能有多个视图加载资源发送加载进度，所以取最大进度
        const width = Math.max(250 * data / 100, this.viewComponent.bar.width);
        this.viewComponent.bar.width = width;
      },
      [TYPE_LOADED]: () => {
        this.viewComponent.visible = false;
        this.viewComponent.bar.width = 250;
      }
    };
    if (handleDict[type]) {
      handleDict[type]();
    }
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_LOADING, 'loading');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;
    this.viewComponent.visible = false;

    // 添加到最高层级的UI层上
    const uiLayer5 = this.gameView.viewComponent.uiLayer5;
    uiLayer5.addChild(this.viewComponent);
  }
}
