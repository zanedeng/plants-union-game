export default class BaseVc extends fgui.GComponent {

  constructor() {
    super();
    this.ui = null;
    this.on(fgui.InteractiveEvents.Down, this.onDown);
  }

  initUi(pkgName, resName) {
    if (fgui.UIPackage.getByName(pkgName)) {
      this.ui = fgui.UIPackage.createObject(pkgName, resName);
      if (this.ui) {
        this.addChild(this.ui);
        this.onLoaded();
      }
    }
  }

  $getChild(name) {
    return this.ui ? this.ui.getChild(name) : null;
  }

  $getController(name) {
    return this.ui ? this.ui.getController(name) : null;
  }

  $getTransition(name) {
    return this.ui ? this.ui.getTransition(name) : null;
  }

  onLoaded() { }

  onDown(e) {
    e.stopPropagation();
  }

  dispose() {
    super.dispose();
    this.ui = null;
    this.off(fgui.InteractiveEvents.Down, this.onDown);
  }
}
