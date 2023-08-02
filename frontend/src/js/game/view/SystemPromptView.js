import View from "../../mvc/View";
import GameView from "../view/GameView";
import {
  CMD_LOAD_ASSETS,
  PKG_NAME_MAIN,
  TYPE_SYSTEM_PROMPT,
} from "../Constants";

export default class SystemPromptView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  onRegister() {
    // 入场动画
    this.inAnime = null;
    // 出场动画
    this.outAnime = null;
    // 确定处理方法
    this.onOkHandler = null;
    // 取消处理方法
    this.onCancelHandler = null;
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
    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
    this.inAnime = null;
    this.outAnime = null;
    this.onOkHandler = null;
    this.onCancelHandler = null;
  }

  listEventInterests() {
    return [
      TYPE_SYSTEM_PROMPT
    ];
  }

  handleEvent(type, data = null, sponsor = null) {
    const handleDict = {
      [TYPE_SYSTEM_PROMPT]: () => {
        if (data) {
          this.viewComponent.visible = true;
          this.viewComponent.msg.text = data.msg;
          this.onOkHandler = data.onOk;
          this.onCancelHandler = data.onCancel;
          if (this.inAnime) {
            this.inAnime.play();
          }
        }
      }
    };
    if (handleDict[type]) {
      handleDict[type]();
    }
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_MAIN, 'SystemPrompt');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;
    this.viewComponent.visible = false;

    this.inAnime = this.viewComponent.$getTransition('t0');
    this.outAnime = this.viewComponent.$getTransition('t1');

    this.viewComponent.closeBtn.on(fgui.InteractiveEvents.Down, this.onClose, this);
    this.viewComponent.cancelBtn.on(fgui.InteractiveEvents.Down, this.onCancel, this);
    this.viewComponent.confirmBtn.on(fgui.InteractiveEvents.Down, this.onConfirm, this);

    // 添加到最高层级的UI层上
    const uiLayer5 = this.gameView.viewComponent.uiLayer5;
    uiLayer5.addChild(this.viewComponent);
  }

  onClose(evt) {
    evt.stopPropagation();
    if (this.outAnime) {
      this.outAnime.play(() => {
        this.viewComponent.visible = false;
      });
    }
    if (this.onCancelHandler) {
      this.onCancelHandler();
    }
  }

  onCancel(evt) {
    evt.stopPropagation();
    if (this.outAnime) {
      this.outAnime.play(() => {
        this.viewComponent.visible = false;
      });
    }
    if (this.onCancelHandler) {
      this.onCancelHandler();
    }
  }

  onConfirm(evt) {
    evt.stopPropagation();
    if (this.outAnime) {
      this.outAnime.play(() => {
        this.viewComponent.visible = false;
      });
    }
    if (this.onOkHandler) {
      this.onOkHandler();
    }
  }
}
