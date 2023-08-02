// ---- 错误码 -------------------------
export const ERROR_CODE_101 = 101;
export const ERROR_CODE_102 = 102;
export const ERROR_CODE_103 = 103;

export const ERROR_HUNT_LEVEL_LIMIT = 501;
export const ERROR_GET_ROLE = 502;

// ---- 错误码对应的提示语 ---------------
export const ERROR_MESSAGE = {
  cn: {
    [ERROR_CODE_101]: '角色名称不能为空！',
    [ERROR_CODE_102]: '角色名称已经存在！',
    [ERROR_CODE_103]: '您已经创建了角色，不能重复创建！',
    [ERROR_HUNT_LEVEL_LIMIT]: '玩家等级到达{{level}}级才可以进入该斗猎场！',
    [ERROR_GET_ROLE]: '获取角色信息失败，请检查链Id是否正确！'
  }
}

export const getErrorMsg = (code, lang = 'cn') => {
  return ERROR_MESSAGE[lang]?.[code];
}

// ---- 控制器类型 ----------------------
export const CMD_REGISTER_VIEW = 'cmd_register_view'; // 注册视图
export const CMD_REMOVE_VIEW = 'cmd_remove_view'; // 移除视图
export const CMD_LOAD_ASSETS = 'cmd_load_assets'; // 加载资源

// ---- 视图监听事件列表 -----------------
export const TYPE_CONNECT_WALLET_SUCCESS = 'type_connect_wallet_success'; // 连接钱包成功
export const TYPE_ACCOUNTS_CHANGED = 'type_accounts_changed'; // 账号发生改变
export const TYPE_NETWORK_CHANGED = 'type_network_changed'; // 连接的网络ID发生改变
export const TYPE_LOADING = 'type_loading'; // 加载中
export const TYPE_LOADED = 'type_loaded'; // 加载完成
export const TYPE_SYSTEM_PROMPT = 'type_system_prompt'; // 系统提示
export const TYPE_LANG_CHANGED = 'type_lang_changed'; // 语言发生变化
export const TYPE_SHOW_BACKGROUND = 'type_show_background'; // 显示背景图

// ---- 资源包 -------------------------
export const PKG_NAME_MAIN = 'main';
export const PKG_NAME_LOADING = 'loading';
export const PKG_NAME_BG = 'background';
export const PKG_NAME_CREATE_ROLE = 'createRole';
export const PKG_NAME_HALL = 'hall';
export const PKG_NAME_MYINFO_CARD = 'myInfoCard';
export const PKG_NAME_HUNT = 'hunt';
export const PKG_NAME_FRIEND = 'friend';

// ---- 资源包里需要加载的资源 ------------
export const ASSETS_DICT = {
  [PKG_NAME_MAIN]: [
    {name: `${PKG_NAME_MAIN}`, url: `fgui/${PKG_NAME_MAIN}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_MAIN}@atlas0`, url: `fgui/${PKG_NAME_MAIN}@atlas0.png`},
  ],
  [PKG_NAME_LOADING]: [
    {name: `${PKG_NAME_LOADING}`, url: `fgui/${PKG_NAME_LOADING}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_LOADING}@atlas0`, url: `fgui/${PKG_NAME_LOADING}@atlas0.png`},
  ],
  [PKG_NAME_BG]: [
    {name: `${PKG_NAME_BG}`, url: `fgui/${PKG_NAME_BG}.fui`, options: {xhrType: 'arraybuffer'}},
  ],
  [PKG_NAME_CREATE_ROLE]: [
    {name: `${PKG_NAME_CREATE_ROLE}`, url: `fgui/${PKG_NAME_CREATE_ROLE}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_CREATE_ROLE}@atlas0`, url: `fgui/${PKG_NAME_CREATE_ROLE}@atlas0.png`},
  ],
  [PKG_NAME_HALL]: [
    {name: `${PKG_NAME_HALL}`, url: `fgui/${PKG_NAME_HALL}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_HALL}@atlas0`, url: `fgui/${PKG_NAME_HALL}@atlas0.png`},
  ],
  [PKG_NAME_MYINFO_CARD]: [
    {name: `${PKG_NAME_MYINFO_CARD}`, url: `fgui/${PKG_NAME_MYINFO_CARD}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_MYINFO_CARD}@atlas0`, url: `fgui/${PKG_NAME_MYINFO_CARD}@atlas0.png`},
  ],
  [PKG_NAME_HUNT]: [
    {name: `${PKG_NAME_HUNT}`, url: `fgui/${PKG_NAME_HUNT}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_HUNT}@atlas0`, url: `fgui/${PKG_NAME_HUNT}@atlas0.png`},
  ],
  [PKG_NAME_FRIEND]: [
    {name: `${PKG_NAME_FRIEND}`, url: `fgui/${PKG_NAME_FRIEND}.fui`, options: {xhrType: 'arraybuffer'}},
    {name: `${PKG_NAME_FRIEND}@atlas0`, url: `fgui/${PKG_NAME_FRIEND}@atlas0.png`},
  ]
}

// ---- 狩猎场类型 ------------
export const HUNT_TYPE = {
  NIGHT: 1, // 暗夜狩猎场
  ZOMBIE: 2, // 僵尸狩猎场
  PERSONAL: 3 // 私人狩猎场
}

// ---- 支持的链 --------------
export const CHAIN_ID = {
  MAINNET: 1,
  GOERLI: 5,
}

export const SUPPORTED_CHAINS = [CHAIN_ID.GOERLI];
