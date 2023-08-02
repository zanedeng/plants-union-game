import View from "../../mvc/View";
import GameView from "../view/GameView";
import {
  CMD_LOAD_ASSETS,
  CMD_REGISTER_VIEW,
  CMD_REMOVE_VIEW,
  PKG_NAME_HALL,
  TYPE_SYSTEM_PROMPT,
  getErrorMsg,
  ERROR_HUNT_LEVEL_LIMIT,
  HUNT_TYPE,
  TYPE_SHOW_BACKGROUND,
} from "../Constants";
import MyInfoCardView from "./MyInfoCardView";
import MyInfoCardVc from "./vc/MyInfoCardVc";
import RoleModel from "../model/RoleModel";
import GameModel from "../model/GameModel";
import LangModel from "../model/LangModel";
import HuntModel from "../model/HuntModel";
import { replaceTemplateString } from "../../utils/replaceTemplateString";
import HuntView from "./HuntView";
import HuntVc from "./vc/HuntVc";

export default class HallView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameView() {
    return this.retrieveView(GameView);
  }

  get gameModel() {
    return this.retrieveModel(GameModel);
  }

  get roleModel() {
    return this.retrieveModel(RoleModel);
  }

  get langModel() {
    return this.retrieveModel(LangModel);
  }

  get huntModel() {
    return this.retrieveModel(HuntModel);
  }

  onRegister() {
    if (!fgui.UIPackage.getByName(PKG_NAME_HALL)) {
      this.sendEvent(
        CMD_LOAD_ASSETS,
        {
          assets: [PKG_NAME_HALL],
          callback: () => this.initUi(),
        }
      );
      return;
    }
    this.initUi();
  }

  onRemove() {
    this.viewComponent.rankBtn.off(fgui.InteractiveEvents.Down, this.onOpenRank, this);
    this.viewComponent.warehouseBtn.off(fgui.InteractiveEvents.Down, this.onOpenWarehouse, this);
    this.viewComponent.mixtureBtn.off(fgui.InteractiveEvents.Down, this.onOpenMixture, this);
    this.viewComponent.shopBtn.off(fgui.InteractiveEvents.Down, this.onOpenShop, this);
    this.viewComponent.allianceBtn.off(fgui.InteractiveEvents.Down, this.onOpenAlliance, this);
    this.viewComponent.battleBtn.off(fgui.InteractiveEvents.Down, this.onOpenBattle, this);
    this.viewComponent.gardenBtn.off(fgui.InteractiveEvents.Down, this.onOpenGarden, this);
    this.viewComponent.territoryBtn.off(fgui.InteractiveEvents.Down, this.onOpenTerritory, this);
    this.viewComponent.taskBtn.off(fgui.InteractiveEvents.Down, this.onOpenTask, this);
    this.viewComponent.manualBtn.off(fgui.InteractiveEvents.Down, this.onOpenManual, this);
    this.viewComponent.mineBtn.off(fgui.InteractiveEvents.Down, this.onOpenMine, this);
    this.viewComponent.nightHunt.off(fgui.InteractiveEvents.Down, this.onOpenNightHunt, this);
    this.viewComponent.zombieHuntBtn.off(fgui.InteractiveEvents.Down, this.onOpenZombieHunt, this);
    this.viewComponent.personalHunt.off(fgui.InteractiveEvents.Down, this.onOpenPersionalHunt, this);

    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_HALL, 'hall');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    this.viewComponent.rankBtn.on(fgui.InteractiveEvents.Down, this.onOpenRank, this);
    this.viewComponent.warehouseBtn.on(fgui.InteractiveEvents.Down, this.onOpenWarehouse, this);
    this.viewComponent.mixtureBtn.on(fgui.InteractiveEvents.Down, this.onOpenMixture, this);
    this.viewComponent.shopBtn.on(fgui.InteractiveEvents.Down, this.onOpenShop, this);
    this.viewComponent.allianceBtn.on(fgui.InteractiveEvents.Down, this.onOpenAlliance, this);
    this.viewComponent.battleBtn.on(fgui.InteractiveEvents.Down, this.onOpenBattle, this);
    this.viewComponent.gardenBtn.on(fgui.InteractiveEvents.Down, this.onOpenGarden, this);
    this.viewComponent.territoryBtn.on(fgui.InteractiveEvents.Down, this.onOpenTerritory, this);
    this.viewComponent.taskBtn.on(fgui.InteractiveEvents.Down, this.onOpenTask, this);
    this.viewComponent.manualBtn.on(fgui.InteractiveEvents.Down, this.onOpenManual, this);
    this.viewComponent.mineBtn.on(fgui.InteractiveEvents.Down, this.onOpenMine, this);
    this.viewComponent.nightHunt.on(fgui.InteractiveEvents.Down, this.onOpenNightHunt, this);
    this.viewComponent.zombieHuntBtn.on(fgui.InteractiveEvents.Down, this.onOpenZombieHunt, this);
    this.viewComponent.personalHunt.on(fgui.InteractiveEvents.Down, this.onOpenPersionalHunt, this);

    const uiLayer4 = this.gameView.viewComponent.uiLayer4;
    uiLayer4.addChild(this.viewComponent);

    this.sendEvent(
      CMD_REGISTER_VIEW,
      {
        viewClazz: MyInfoCardView,
        vcClazz: MyInfoCardVc
      }
    );
  }

  /**
   * 退出大厅
   */
  exitHall() {
    this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: MyInfoCardView});
    this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: HallView});
  }

  /**
   * 打开排行榜
   */
  onOpenRank() {

  }

  /**
   * 打开仓库
   */
  onOpenWarehouse() {

  }

  /**
   * 打开改造
   */
  onOpenMixture() {

  }

  /**
   * 打开商店
   */
  onOpenShop() {

  }

  /**
   * 打开联盟
   */
  onOpenAlliance() {

  }

  /**
   * 打开竞技场
   */
  onOpenBattle() {

  }

  /**
   * 打开阳光屋
   */
  onOpenGarden() {

  }

  /**
   * 打开领地
   */
  onOpenTerritory() {

  }

  /**
   * 打开任务
   */
  onOpenTask() {

  }

  /**
   * 打开图鉴
   */
  onOpenManual() {

  }

  /**
   * 进入矿洞
   */
  onOpenMine() {

  }

  /**
   * 进入暗黑斗猎场
   */
  onOpenNightHunt() {
    const limitLevel = 8;
    if (this.roleModel.level < limitLevel) {
      this.sendEvent(TYPE_SYSTEM_PROMPT, {
        msg: replaceTemplateString(
          getErrorMsg(ERROR_HUNT_LEVEL_LIMIT, this.langModel.lang),
          {
            level: limitLevel,
          }
        )
      });
      return;
    }
    this.huntModel.huntType = HUNT_TYPE.NIGHT;
  }

  /**
   * 进入僵尸斗猎场
   */
  onOpenZombieHunt() {
    this.huntModel.huntType = HUNT_TYPE.ZOMBIE;
    this.exitHall();
    this.sendEvent(CMD_REGISTER_VIEW, {viewClazz: HuntView, vcClazz: HuntVc})
  }

  /**
   * 进入私人斗猎场
   */
  onOpenPersionalHunt() {
    const limitLevel = 5;
    if (this.roleModel.level < limitLevel) {
      this.sendEvent(TYPE_SYSTEM_PROMPT, {
        msg: replaceTemplateString(getErrorMsg(ERROR_HUNT_LEVEL_LIMIT, this.langModel.lang), {level: limitLevel})
      });
      return;
    }
    this.huntModel.huntType = HUNT_TYPE.PERSONAL;

  }
}
