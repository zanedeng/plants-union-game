import View from "../../mvc/View";
import {
  CMD_LOAD_ASSETS,
  ERROR_CODE_101,
  ERROR_CODE_102,
  PKG_NAME_CREATE_ROLE,
  TYPE_SYSTEM_PROMPT,
  TYPE_LOADING,
  TYPE_LOADED,
  CMD_REGISTER_VIEW,
  PKG_NAME_MAIN,
  CMD_REMOVE_VIEW,
  getErrorMsg
} from "../Constants";
import { createRole, getRoleByName, getRole } from "../api";
import GameView from "../view/GameView";
import HallView from "./HallView";
import HallVc from "./vc/HallVc";
import RoleModel from "../model/RoleModel";
import { ethers } from "ethers";

const MAX_AVATAR_ID = 25;

export default class CreateRoleView extends View {

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
    this.currentAvatarId = 0;
    this.avatarC1 = null;
    const assets = [];
    if (!fgui.UIPackage.getByName(PKG_NAME_MAIN)) {
      assets.push(PKG_NAME_MAIN)
    }
    if (!fgui.UIPackage.getByName(PKG_NAME_CREATE_ROLE)) {
      assets.push(PKG_NAME_CREATE_ROLE)
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
    this.viewComponent.preBtn.off(fgui.InteractiveEvents.Down, this.onPreAvatar, this);
    this.viewComponent.nextBtn.off(fgui.InteractiveEvents.Down, this.onNextAvatar, this);
    this.viewComponent.startBtn.off(fgui.InteractiveEvents.Down, this.onStartGame, this);
    this.viewComponent.dispose();
    this.viewComponent = null;
    this.eventList = null;
    this.avatarC1 = null;
  }

  initUi() {
    this.viewComponent.initUi(PKG_NAME_CREATE_ROLE, 'createRole');
    this.viewComponent.ui.width = this.gameView.viewComponent.renderer.width;
    this.viewComponent.ui.height = this.gameView.viewComponent.renderer.height;

    this.viewComponent.avatar.url = `images/avatar/avatar64x64-${this.currentAvatarId + 1}.png`;

    const t0 = this.viewComponent.$getTransition('t0');
    t0.play();

    this.viewComponent.preBtn.on(fgui.InteractiveEvents.Down, this.onPreAvatar, this);
    this.viewComponent.nextBtn.on(fgui.InteractiveEvents.Down, this.onNextAvatar, this);
    this.viewComponent.startBtn.on(fgui.InteractiveEvents.Down, this.onStartGame, this);

    const uiLayer4 = this.gameView.viewComponent.uiLayer4;
    uiLayer4.addChild(this.viewComponent);
  }

  updateAvatar() {
    this.viewComponent.avatar.clearContent();
    this.viewComponent.avatar.url = `images/avatar/avatar64x64-${this.currentAvatarId + 1}.png`;
    this.viewComponent.avatar.updateLayout();
  }

  onPreAvatar(evt) {
    evt.stopPropagation();
    this.currentAvatarId--;
    if (this.currentAvatarId < 0) {
      this.currentAvatarId = MAX_AVATAR_ID;
    }
    this.updateAvatar();
  }

  onNextAvatar(evt) {
    evt.stopPropagation();
    this.currentAvatarId++;
    if (this.currentAvatarId > MAX_AVATAR_ID) {
      this.currentAvatarId = 0;
    }
    this.updateAvatar();
  }

  async onStartGame(evt) {
    evt.stopPropagation();
    const nickname = this.viewComponent.nickname.text;
    if (!nickname) {
      this.sendEvent(TYPE_SYSTEM_PROMPT, {
        msg: getErrorMsg(ERROR_CODE_101)
      });
      return;
    }
    const res = await getRoleByName(nickname);
    if (res[0] == '') {
      this.sendEvent(TYPE_LOADING, 100);
      const res1 = await createRole(nickname, this.currentAvatarId);
      if (res1.wait) {
        await res1.wait();
      }
      this.sendEvent(TYPE_LOADED);
      if (res1.value == 0) {
        const role = await getRole();
        if (role[0]) {
          const model = this.roleModel;
          model.data.nickname = role[0];
          model.avatarId = ethers.getNumber(role[1]);
          model.level = ethers.getNumber(role[2]);
          model.warGridNum = ethers.getNumber(role[3]);
          model.gold = ethers.getNumber(role[4]);
          model.createTime = ethers.getNumber(role[5]);

          this.sendEvent(CMD_REMOVE_VIEW, {viewClazz: CreateRoleView});
          this.sendEvent(
            CMD_REGISTER_VIEW,
            {
              viewClazz: HallView,
              vcClazz: HallVc
            }
          );
        }
      }
    } else {
      this.sendEvent(TYPE_SYSTEM_PROMPT, {
        msg: getErrorMsg(ERROR_CODE_102)
      });
    }
  }

}
