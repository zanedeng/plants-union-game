import { pool } from "../core/BaseObjectPool";
import { getUrlParams } from "../utils/getUrlParams";
import { httpBuildQuery } from "../utils/httpBuildQuery";
import AssetsBundle from "./AssetsBundle";

const ERROR = 'error';
const PROGRESS = 'progress';
const COMPLETE = 'complete';

/**
 * 资源加载器对象。
 * @type {PIXI.Loader}
 */
const resLoader = new PIXI.Loader('', 6);
resLoader.onProgress.add(onLoadAssetProgress);

/**
 * 忽略的文件列表。
 * @type {Array<string>}
 */
const ignoreFileList = [];

/**
 * 等待加载的资源包列表。
 * @type {Array<AssetsBundle>}
 */
const waitBundles = [];
/**
 * 当前正在加载的资源包。
 * @type {AssetsBundle}
 */
let currentBundle = null;
/**
 * 资源加载器是否空闲。
 * @type {boolean}
 */
let resLoaderIdle = true;

/**
 * 加载当前资源包。
 */
function loadCurrentBundle() {
  if (resLoaderIdle) {
    currentBundle = waitBundles.shift();
    if (currentBundle) {
      resLoaderIdle = false;
      resLoader.progress = 0;
      resLoader.loading = false;

      let count = 0;
      let res = currentBundle.assets;
      res.map(item => {
        if (!resLoader.resources[item.name] ||
          !resLoader.resources[item.name].isComplete) {
          resLoader.add(item.name, item.url, item.options, item.cb);
          count++;
        }
      });
      if (count > 0) {
        resLoader.onError.once(onLoadAssetError);
        resLoader.onComplete.once(onLoadAssetComplete);

        let beforeMiddlewares = currentBundle.beforeMiddlewares;
        if (beforeMiddlewares) {
          beforeMiddlewares.forEach((fn) => {
            resLoader.pre(fn);
          });
        }

        let afterMiddlewares = currentBundle.afterMiddlewares;
        if (afterMiddlewares) {
          afterMiddlewares.forEach((fn) => {
            resLoader.use(fn);
          });
        }
        resLoader.load();
      } else {
        onLoadAssetComplete(resLoader, resLoader.resources);
      }
    }
  }
}

/**
 * 资源加载失败事件回调函数。
 * @param {string} errMsg - 错误消息。
 * @param {PIXI.loaders.Loader} loader - 资源加载器。
 * @param {PIXI.loaders.Resource} res - 资源对象。
 */
function onLoadAssetError(errMsg, loader, res) {
  if (currentBundle) {
    currentBundle.loadErrorAssets.push(res.name);
    currentBundle.emit(ERROR, {
      name: res.name,
      url: res.url
    });
  }
}

/**
 * 资源加载进度事件回调函数。
 * @param {PIXI.loaders.Loader} loader - 资源加载器。
 * @param {PIXI.loaders.Resource} res - 资源对象。
 */
function onLoadAssetProgress(loader, res) {
  if (currentBundle) {
    currentBundle.emit(PROGRESS, loader.progress);
  }
}

/**
 * 资源加载完成事件回调函数。
 * @param {PIXI.loaders.Loader} loader - 资源加载器。
 * @param {Object} resources - 加载完成的资源对象集合。
 */
function onLoadAssetComplete(loader, resources) {
  if (currentBundle) {
    let canComplete = false;
    if (currentBundle.loadErrorAssets.length > 0) {
      let loadErrorAssets = currentBundle.loadErrorAssets;
      currentBundle.loadErrorAssets = [];
      currentBundle.retryTimes++;
      if (currentBundle.retryTimes < currentBundle.maxRetryTimes) {
        const assets = currentBundle.assets;
        assets.map(asset => {
          if (loadErrorAssets.indexOf(asset.name) !== -1) {
            const params = getUrlParams(asset.url);
            params.r = currentBundle.retryTimes;
            asset.url = asset.url.split('?')[0] + '?' +  httpBuildQuery(params);
            let res = loader.resources[asset.name];
            if (res) {
              if (res.texture) {
                res.texture.destroy(true);
              }
              delete loader.resources[res.name];
              res = null;
            }
          }
        });
        resLoaderIdle = true;
        loadAssetBundle(currentBundle);
        return;
      } else {
        canComplete = true;
      }
    } else {
      canComplete = true;
    }
    if (canComplete) {
      currentBundle.progress = 1;
      currentBundle.emit(COMPLETE, resources);
    }
  }
  resLoaderIdle = true;
  loadCurrentBundle();
}

/**
 * 加载资源包。
 * @param {AssetsBundle} bundle - 资源包对象。
 */
export function loadAssetBundle (bundle){
  if (waitBundles.indexOf(bundle) === -1) {
    waitBundles.push(bundle);
  }
  loadCurrentBundle();
}

/**
 * 加载 UI 资源。
 * @param {Array<Object>} assets - 资源数组。
 * @param {Function} onProgress - 进度回调函数。
 * @param {Function} onSuccess - 成功回调函数。
 */
export function loadUiAssets(assets, onProgress = null, onSuccess = null) {
  if (assets && assets.length > 0) {
    let bundle = pool.create(AssetsBundle);

    /**
     * 加载进度事件回调函数。
     * @param {number} progress - 加载进度。
     */
    const onProgressCallback = (progress) => {
      if (onProgress) {
        onProgress(progress);
      }
    };

    /**
     * 加载成功事件回调函数。
     * @param {Object} data - 加载完成的资源对象集合。
     */
    const onSuccessCallback = (data) => {
      bundle.removeAllListeners();
      bundle.dispose();
      bundle = null;
      if (onSuccess) {
        onSuccess(data);
      }
    };

    bundle.on(PROGRESS, onProgressCallback, this);
    bundle.on(COMPLETE, onSuccessCallback, this);

    assets.map(item => {
      bundle.add(item.name, item.url, item.options);
    });

    loadAssetBundle(bundle);

  } else if (onSuccess) {
    onSuccess(null);
  }
}

/**
 * 获取资源加载器对象。
 * @returns {PIXI.loaders.Loader} 资源加载器对象。
 */
export function getLoader() { return resLoader; }

/**
 * 根据资源 ID 获取资源对象。
 * @param {string} id - 资源 ID。
 * @returns {PIXI.loaders.Resource} 资源对象。
 */
export function getResById(id) { return resLoader.resources[id]; }

/**
 * 根据资源 URL 获取资源对象。
 * @param {string} url - 资源 URL。
 * @returns {PIXI.loaders.Resource} 资源对象。
 */
export function getResByUrl(url) {
  Object.keys(resLoader.resources).map(key => {
    let resInfo = resLoader.resources[key];
    if (resInfo.url === url) {
      return resInfo;
    }
  });
  return null;
}

/**
 * 清理资源加载器中的资源。
 * @param {boolean} destroyBase - 是否销毁基础资源。
 */
export function clearResLoader(destroyBase = false) {
  destroyBase = !!destroyBase;
  Object.keys(resLoader.resources).map(key => {
    if (ignoreFileList.indexOf(key) !== -1) {
      return ;
    }
    const resInfo = resLoader.resources[key];
    // 图片的后期处理
    if (resInfo.texture) {
      resInfo.texture.destroy(true);
    }
    // fgui
    if (resInfo.extension === 'fui') {
      if (fgui.UIPackage.getByName(key)) {
        // fgui.UIPackage.removePackage(key);
        const removePackage = fgui.UIPackage.removePackage;
        removePackage(key, destroyBase);
      }
    }
    delete resLoader.resources[key];
  });
}

/**
 * 清理指定资源的加载。
 * @param {string} key - 资源键名。
 * @param {boolean} destroyBase - 是否销毁基础资源。
 */
export function clearResByKey(key, destroyBase = false) {
  if (ignoreFileList.indexOf(key) !== -1) {
    return ;
  }
  destroyBase = !!destroyBase;
  let resInfo = resLoader.resources[key];
  if (resInfo) {
    if (resInfo.texture) {
      resInfo.texture.destroy(true);
    }
    // fgui
    if (resInfo.extension === 'fui') {
      if (fgui.UIPackage.getByName(key)) {
        const removePackage = fgui.UIPackage.removePackage;
        removePackage(key, destroyBase);
      }
    }
    delete resLoader.resources[key];
  }
}

/**
 * 销毁所有资源。
 */
export function destroyAssets() {
  resLoader.destroy();
}

/**
 * 添加忽略的文件。
 * @param {string} file - 文件名。
 */
export function addIgnoreFile(file) {
  if (ignoreFileList.indexOf(file) === -1) {
    ignoreFileList.push(file);
  }
}

/**
 * 批量添加忽略的文件。
 * @param {Array<string>} files - 文件名数组。
 */
export function addIgnoreFiles(files) {
  const len = files.length;
  for (let i = 0; i < len; i++) {
    addIgnoreFile(files[i]);
  }
}

/**
 * 删除忽略的文件。
 * @param {Array<string>} files - 文件名数组。
 */
export function deleteIgnoreFiles(files) {
  const len = files.length;
  for (let i = 0; i < len; i++) {
    let pos = ignoreFileList.indexOf(files[i]);
    if (pos !== -1) {
      ignoreFileList.splice(pos, 1);
    }
  }
}

/**
 * 清空忽略的文件列表。
 */
export function clearIgnoreFiles() {
  ignoreFileList = [];
}
