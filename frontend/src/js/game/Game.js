import App from "../mvc/App";
import { CMD_LOAD_ASSETS, CMD_REGISTER_VIEW, CMD_REMOVE_VIEW } from "./Constants";
import RegisterViewController from "./controller/RegisterViewController";
import RemoveViewController from "./controller/RemoveViewController";
import GameModel from "./model/GameModel";
import RoleModel from "./model/RoleModel";
import LangModel from "./model/LangModel";
import GameView from "./view/GameView";
import Smoothie from "../core/Smoothie";
import LoadAssetsController from "./controller/LoadAssetsController";
import ConnectWalletModel from "./model/ConnectWalletModel";
import HuntModel from "./model/HuntModel";

export default class GameApp extends App {

  constructor(element, options = {}) {
    super();

    PIXI.settings.GC_MAX_IDLE = 240 * 2; // 修改进行垃圾回收的最大空闲时间间隔
    PIXI.settings.GC_MAX_CHECK_COUNT = 120 * 1; // 进行垃圾回收时的最大检查次数
    PIXI.settings.MIPMAP_TEXTURES = false; // 不启用多级纹理缓存

    options = options || {};
    this.renderer = PIXI.autoDetectRenderer({
      width: options.width !== undefined ? options.width : 760, // 指定渲染器的宽度。
      height: options.height !== undefined ? options.height : 500, // 指定渲染器的高度。
      transparent: options.transparent !== undefined ? options.transparent : true, // 设置渲染器的背景是否透明。
      antialias: options.antialias !== undefined? options.antialias : true, // 设置是否开启抗锯齿效果。
      resolution: options.resolution !== undefined? options.resolution : 1, // 指定渲染器的分辨率，可以是1或2等值。
      preserveDrawingBuffer: options.preserveDrawingBuffer !== undefined ? options.preserveDrawingBuffer: true, // 设置是否在渲染后保留绘图缓冲区。
      clearBeforeRender: options.clearBeforeRender !== undefined ? options.clearBeforeRender : true, // 设置是否在每次渲染前清除画布。
      forceCanvas: options.forceCanvas !== undefined ? options.forceCanvas : false, // 设置是否强制使用Canvas渲染器而非WebGL渲染器。
      backgroundColor: options.backgroundColor !== undefined ? options.backgroundColor : 0, // 指定渲染器的背景颜色。
      powerPreference: options.powerPreference !== undefined ? options.powerPreference : 'high-performance', // 指定渲染器使用的GPU性能偏好，可以是"default"、"high-performance"或"low-power"。
      autoDensity: true
    });

    this.element = element;
    if (this.element) {
      this.element.appendChild(this.renderer.view);
    } else if (document.body) {
      document.body.appendChild(this.renderer.view);
    }

    this.stage = new PIXI.Container();

    // 逻辑帧率
    let fps = options.fps || 30;
    // 渲染帧率
    let renderFps = options.renderFps || 30;

    this.ticker = options.sharedTicker ? PIXI.Ticker.shared : new PIXI.Ticker();

    this.smoothie = new Smoothie({
      engine: PIXI,
      renderer: this.renderer,
      root: this.stage,
      fps: fps,
      ticker: this.ticker,
      renderFps: renderFps,
      update: this.update.bind(this)
    });

    // UI 根节点在屏幕上的适配方式有
    // `noScale`：不进行缩放，保持原始大小，可能会导致部分内容超出屏幕范围。
    // `showAll`：按比例缩放内容，使其完整显示在屏幕内，可能会留有空白边。
    // `noBorder`：按比例缩放内容，使其填充满屏幕，可能会裁剪部分内容。
    // `exactFit`：拉伸或压缩内容以填充整个屏幕，可能导致内容失真。
    // `fixedWidth`：固定宽度，自动调整高度以保持内容比例。
    // `fixedHeight`：固定高度，自动调整宽度以保持内容比例。
    // `fixedAuto`：固定宽度和高度，自动调整比例以适应屏幕.

    fgui.GRoot.inst.attachTo(this, {
      designWidth: options.designWidth !== undefined ? options.designWidth : 760, // 指定设计分辨率的宽度
      designHeight: options.designHeight !== undefined ? options.designHeight: 500, // 指定设计分辨率的高度
      scaleMode: options.scaleMode !== undefined ? options.scaleMode : 'noBorder', // 指定屏幕适配的模式
      orientation: options.orientation !== undefined ? options.orientation : 'auto', // 指定屏幕方向
      alignV: 4, // 指定垂直对齐方式
      alignH: 1 // 指定水平对齐方式
    });

    this.uiLayer0 = new fgui.GComponent();
    fgui.GRoot.inst.addChild(this.uiLayer0);

    this.layer1 = new PIXI.Container();
    this.stage.addChild(this.layer1);

    this.layer2 = new PIXI.Container();
    this.stage.addChild(this.layer2);

    this.layer3 = new PIXI.Container();
    this.stage.addChild(this.layer3);

    this.uiLayer4 = new fgui.GComponent();
    fgui.GRoot.inst.addChild(this.uiLayer4);

    this.uiLayer5 = new fgui.GComponent();
    fgui.GRoot.inst.addChild(this.uiLayer5);

    // Start the rendering
    const autoStart = options.autoStart !== undefined ? options.autoStart : true;
    if (autoStart) {
      this.smoothie.start();
    }
  }

  get view() {
    return this.renderer.view;
  }

  update() {

  }

  startup() {
    // PIXI.utils.skipHello();
    PIXI.settings.TARGET_FPMS = 0.03;

    this.registerController(CMD_REGISTER_VIEW, RegisterViewController);
    this.registerController(CMD_REMOVE_VIEW, RemoveViewController);
    this.registerController(CMD_LOAD_ASSETS, LoadAssetsController);

    this.registerModel(GameModel);
    this.registerModel(RoleModel);
    this.registerModel(LangModel);
    this.registerModel(HuntModel);
    this.registerModel(ConnectWalletModel);

    this.registerView(GameView, this);
  }
}
