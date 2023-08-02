import { loadUiAssets } from "../../assets";
import Controller from "../../mvc/Controller";
import { ASSETS_DICT, TYPE_LOADED, TYPE_LOADING } from "../Constants";

const assets = {

};

/**
 * 用于加载资源控制器。
 * @extends Controller
 */
export default class LoadAssetsController extends Controller {

  /**
   * 创建一个 LoadAssetsController 实例。
   * @param {string} type - 类型参数。
   */
  constructor(type) {
    super(type);
  }

  /**
   * 执行注册操作。
   * @param {Object|null} data - 数据对象。
   * @param {Aarray} data.assets - 资源包列表。
   * @param {Function} data.callback - 资源加载完成后的回调函数。
   * @param {Object|null} sponsor - 发起者对象。
   * @throws {Error} 当参数错误时抛出错误。
   */
  execute(data = null, sponsor = null) {
    if (!data) {
      throw new Error('参数错误！');
    }
    let assets = [];
    if (data.assets && data.assets.length > 0) {
      data.assets.forEach((pkgName) => {
        if (ASSETS_DICT[pkgName]) {
          assets = assets.concat(...ASSETS_DICT[pkgName]);
        }
      });
    }
    if (assets.length > 0) {
      loadUiAssets(
        assets,
        (progress) => {
          this.sendEvent(TYPE_LOADING, progress)
        },
        (res) => {
          fgui.utils.AssetLoader.addResources(res);
          data.assets.forEach((pkgName) => {
            fgui.UIPackage.addPackage(pkgName);
          });
          this.sendEvent(TYPE_LOADED);
          if (data.callback && typeof data.callback === 'function') {
            data.callback();
          }
        }
      );
    } else if (data.callback && typeof data.callback === 'function') {
      data.callback();
    }
  }
}
