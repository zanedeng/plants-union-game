import View from "../../mvc/View";
import {
  CMD_LOAD_ASSETS,
  CMD_REGISTER_VIEW,
  PKG_NAME_MAIN,
  PKG_NAME_LOADING,
  TYPE_CONNECT_WALLET_SUCCESS,
  PKG_NAME_BG,
  TYPE_SHOW_BACKGROUND,
  TYPE_SYSTEM_PROMPT,
  getErrorMsg,
  ERROR_GET_ROLE,
} from "../Constants";
import GameModel from "../model/GameModel";
import ConnectWalletModel from "../model/ConnectWalletModel";
import ConnectWalletView from "./ConnectWalletView";
import ConnectWalletVc from "./vc/ConnectWalletVc";
import SystemPromptView from "./SystemPromptView";
import SystemPromptVc from "./vc/SystemPromptVc";
import LoadingView from "./LoadingView";
import LoadingVc from "./vc/LoadingVc";
import BackgroundView from "./BackgroundView";
import BackgroundVc from "./vc/BackgorundVc";
import CreateRoleView from "./CreateRoleView";
import CreateRoleVc from "./vc/CreateRoleVc";
import { getRole } from "../api";
import HallView from "./HallView";
import HallVc from "./vc/HallVc";
import RoleModel from "../model/RoleModel";
import { ethers } from "ethers";

export default class GameView extends View {

  constructor(viewComponent) {
    super(viewComponent);
  }

  get gameModel() {
    return this.retrieveModel(GameModel);
  }

  get roleModel() {
    return this.retrieveModel(RoleModel);
  }

  get connectWalletModel() {
    return this.retrieveModel(ConnectWalletModel);
  }

  onRegister() {
    // 最先开始加载 PKG_NAME_LOADING 资源，这个阶段没有 `loading` 动画
    this.sendEvent(
      CMD_LOAD_ASSETS,
      {
        assets: [ PKG_NAME_LOADING ],
        callback: () => {
          // 注册加载进度显示的视图
          this.sendEvent(
            CMD_REGISTER_VIEW, { viewClazz: LoadingView, vcClazz: LoadingVc }
          );
          // 再加载依赖素材，这个阶段会出现 `loading` 动画
          this.sendEvent(
            CMD_LOAD_ASSETS,
            {
              assets: [ PKG_NAME_MAIN, PKG_NAME_BG ],
              callback: () => {
                // 注册背景视图
                this.sendEvent(
                  CMD_REGISTER_VIEW, {viewClazz: BackgroundView, vcClazz: BackgroundVc}
                );
                // 注册系统提示视图
                this.sendEvent(
                  CMD_REGISTER_VIEW, { viewClazz: SystemPromptView, vcClazz: SystemPromptVc }
                );
                setTimeout(() => {

                  // 根据时间和季节显示不同的背景，这个背景在创建角色和大厅使用
                  const time = (new Date()).getHours();
                  const bgUrl = time >= 19 ? 'hallbg2' : 'hallbg0';
                  this.sendEvent(TYPE_SHOW_BACKGROUND, {url: `images/bg/${bgUrl}.jpg`});

                  this.gotoConnectWallet();
                });
              }
            }
          );
        }
      }
    );
  }

  onRemove() { }

  handleEvent(type, data = null, sponsor = null) {
    const handleDict = {
      [TYPE_CONNECT_WALLET_SUCCESS]: async () => {
        // 侦听钱包账号和链Id发生变化
        // TODO：账号或者链Id发生改变，需要重启游戏

        try {
          const role = await getRole();
          console.log(role);
          if (role[0] === '') {
            // 判断玩家是否创建角色，如果没有创建角色，则进入创建角色的视图，否则进入大厅视图
            this.sendEvent(
              CMD_REGISTER_VIEW, {viewClazz: CreateRoleView, vcClazz: CreateRoleVc }
            );
          } else {
            const model = this.roleModel;
            model.data.nickname = role[0];
            model.avatarId = ethers.getNumber(role[1]);
            model.level = ethers.getNumber(role[2]);
            model.warGridNum = ethers.getNumber(role[3]);
            model.gold = ethers.getNumber(role[4]);
            model.createTime = ethers.getNumber(role[5]);
            this.sendEvent(
              CMD_REGISTER_VIEW, { viewClazz: HallView, vcClazz: HallVc }
            );
          }

        } catch (e) {
          this.sendEvent(TYPE_SYSTEM_PROMPT, {
            msg: getErrorMsg(ERROR_GET_ROLE),
            onOk: () => this.gotoConnectWallet(),
            onCancel: () => this.gotoConnectWallet(),
          })
        }

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

  gotoConnectWallet() {
    // 注册连接钱包的视图
    this.sendEvent(
      CMD_REGISTER_VIEW, { viewClazz: ConnectWalletView, vcClazz: ConnectWalletVc }
    );
  }
}
