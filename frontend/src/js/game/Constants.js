// ---- 控制器类型 ----------------------
export const CMD_REGISTER_VIEW = 'cmd_register_view'; // 注册视图
export const CMD_REMOVE_VIEW = 'cmd_remove_view'; // 移除视图
export const CMD_LOAD_ASSETS = 'cmd_load_assets'; // 加载资源

// ---- 视图监听事件列表 -----------------
export const TYPE_CONNECT_WALLET_SUCCESS = 'type_connect_wallet_success'; // 连接钱包成功
export const TYPE_ACCOUNTS_CHANGED = 'type_accounts_changed'; // 账号发生改变
export const TYPE_NETWORK_CHANGED = 'type_network_changed'; // 连接的网络ID发生改变

// ---- 资源包 -------------------------
export const PKG_NAME_MAIN = 'main';

// ---- 资源包里需要加载的资源 ------------
export const ASSETS_DICT = {
  [PKG_NAME_MAIN]: [
    {name: `${PKG_NAME_MAIN}`, url: `fgui/${PKG_NAME_MAIN}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_MAIN}@atlas0`, url: `fgui/${PKG_NAME_MAIN}@atlas0.png`},
  ]
}
