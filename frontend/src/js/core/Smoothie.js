/**
 * Smoothie 类是一个用于管理 PIXI.js 游戏的游戏循环的类。
 */
export default class Smoothie {
  /**
   * 创建一个 Smoothie 实例。
   * @param {Object} options - 配置选项。
   * @param {Object} options.engine - 渲染引擎，应为 PIXI。
   * @param {Object} options.renderer - 用于渲染游戏的渲染器对象。
   * @param {Object} options.root - 根容器对象，通常是添加所有游戏对象的舞台。
   * @param {Function} options.update - 每帧调用的函数，用于更新游戏状态。
   * @param {boolean} options.interpolate - 是否使用插值进行平滑渲染。
   * @param {number} options.fps - 更新帧率。
   * @param {number} options.renderFps - 渲染帧率。
   * @param {Object} options.properties - 指定要插值的精灵属性的对象。
   */
  constructor(
    options = {
      engine: PIXI,
      renderer: undefined,
      root: undefined,
      update: undefined,
      interpolate: true,
      fps: 60,
      renderFps: undefined,
      properties: {
        position: true,
        rotation: true,
        size: false,
        scale: false,
        alpha: false,
        tile: false,
      },
    }
  ) {
    if (options.engine === undefined)
      throw new Error(
        "Please assign a rendering engine as Smoothie's engine option"
      );

    // 正在使用的渲染引擎（默认为 Pixi）。
    this.engine = "";

    //如果 `renderingEngine` 是 Pixi，那么设置 Pixi 对象别名。
    if (options.engine.ParticleContainer && options.engine.Sprite) {
      this.renderingEngine = "pixi";
      this.Container = options.engine.Container;
      this.Sprite = options.engine.Sprite;
      this.MovieClip = options.engine.extras.MovieClip;
    }

    // 确保用户已经提供了一个渲染器。如果你正在使用 Pixi，
    // 这应该是你在主应用程序中创建的已实例化的 renderer 对象。
    if (options.renderer === undefined) {
      throw new Error(
        "Please assign a renderer object as Smoothie's renderer option"
      );
    } else {
      this.renderer = options.renderer;
    }

    // 确保用户已经提供了一个根容器。
    // 这个对象位于显示列表层级的顶部。
    // 如果你正在使用 `Pixi`，它会是一个 `Container` 对象，通常按照惯例被称为 `stage`.
    if (options.root === undefined) {
      throw new Error(
        "Please assign a root container object (the stage) as Smoothie's rootr option"
      );
    } else {
      this.stage = options.root;
    }

    if (options.update === undefined) {
      throw new Error(
        "Please assign a function that you want to update on each frame as Smoothie's update option"
      );
    } else {
      this.update = options.update;
    }

    // 定义应该被插值的精灵属性。
    if (options.properties === undefined) {
      this.properties = { position: true, rotation: true };
    } else {
      this.properties = options.properties;
    }

    // 游戏逻辑更新函数应运行的最高帧率。Smoothie 默认为 60 fps。
    if (options.fps !== undefined) {
      this._fps = options.fps;
    } else {
      this._fps = undefined;
    }

    // 可选地限制精灵渲染的最高帧率。
    if (options.renderFps !== undefined) {
      this._renderFps = options.renderFps;
    } else {
      this._renderFps = undefined;
    }

    // 设置精灵渲染位置的插值，默认设置为 true.
    if (options.interpolate === false) {
      this.interpolate = false;
    } else {
      this.interpolate = true;
    }

    // 一个可以用来暂停和播放 Smoothie 的变量。
    this.paused = false;

    // 用于设置帧率并计算插值值的私有属性。
    this._startTime = Date.now();
    this._frameDuration = 1000 / this._fps;
    this._lag = 0;
    this._lagOffset = 0;

    this._renderStartTime = 0;
    if (this._renderFps !== undefined) {
      this._renderDuration = 1000 / this._renderFps;
    }
  }

  /**
   * 获取更新帧率。
   * @return {number} 更新帧率。
   */
  get fps() {
    return this._fps;
  }
  /**
   * 设置更新帧率。
   * @param {number} value - 新的更新帧率。
   */
  set fps(value) {
    this._fps = value;
    this._frameDuration = 1000 / this._fps;
  }

  /**
   * 获取渲染帧率。
   * @return {number} 渲染帧率。
   */
  get renderFps() {
    return this._renderFps;
  }
  /**
   * 设置渲染帧率。
   * @param {number} value - 新的渲染帧率。
   */
  set renderFps(value) {
    this._renderFps = value;
    this._renderDuration = 1000 / this._renderFps;
  }

  /**
   * 获取帧持续时间。
   * @return {number} 帧持续时间。
   */
  get dt() {
    return this._lagOffset;
  }

  /**
   * 暂停游戏循环。
   */
  pause() {
    this.paused = true;
  }

  /**
   * 恢复游戏循环。
   */
  resume() {
    this.paused = false;
  }

  /**
   * 开始游戏循环。
   */
  start() {
    this.gameLoop();
  }

  /**
   * 游戏主循环。
   * @param {number} timestamp - 时间戳。
   */
  gameLoop(timestamp) {
    requestAnimationFrame(this.gameLoop.bind(this));

    // 仅在 Smoothie 未暂停时运行。
    if (!this.paused) {
      // `interpolate` 函数以用户定义的帧数（fps）频率更新逻辑函数，使用插值在系统能实现的最大帧率下渲染精灵。
      let interpolate = () => {
        // 计算自上一帧以来经过的时间。
        let current = Date.now(),
          elapsed = current - this._startTime;

        // 捕获任何意外的大幅帧速率峰值。
        if (elapsed > 1000) elapsed = this._frameDuration;

        // 关于插值：
        this._startTime = current;

        // 将经过的时间添加到滞后计数器中。
        this._lag += elapsed;

        // 如果滞后计数器的值大于或等于帧持续时间，则更新帧。
        while (this._lag >= this._frameDuration) {
          // 捕获精灵的前一属性以进行渲染插值。
          this.capturePreviousSpriteProperties();

          // 在用户定义的更新函数中更新逻辑。
          this.update();

          // 将滞后计数器减少帧持续时间。
          this._lag -= this._frameDuration;
        }

        // 计算滞后偏移量并使用它来渲染精灵。
        this._lagOffset = this._lag / this._frameDuration;
        this.render(this._lagOffset);
      };

      // 如果fps未定义，则调用用户定义的更新函数，并以系统能够达到的最大速率渲染精灵。
      if (this._fps === undefined) {
        // 以你的系统能够达到的最高帧率运行游戏的每一帧，执行用户定义的游戏逻辑函数。
        this.update();
        this.render();
      } else {
        if (this._renderFps === undefined) {
          interpolate();
        } else {
          //实现可选的帧率渲染限制功能。
          if (timestamp >= this._renderStartTime) {
            // 更新当前的逻辑帧并采用插值法进行渲染。
            interpolate();

            // 重置帧渲染开始时间。
            this._renderStartTime = timestamp + this._renderDuration;
          }
        }
      }
    }
  }

  /**
   * 这个函数是在游戏循环中逻辑更新前执行，用于存储来自上一帧的所有精灵的先前位置。
   * 它允许渲染函数对精灵的位置进行插值处理，从而在任何帧率下都能实现超级流畅的精灵渲染。
   */
  capturePreviousSpriteProperties() {
    // 一个捕捉精灵属性的函数。
    let setProperties = (sprite) => {
      if (this.properties.position) {
        sprite._previousX = sprite.x;
        sprite._previousY = sprite.y;
      }
      if (this.properties.rotation) {
        sprite._previousRotation = sprite.rotation;
      }
      if (this.properties.size) {
        sprite._previousWidth = sprite.width;
        sprite._previousHeight = sprite.height;
      }
      if (this.properties.scale) {
        sprite._previousScaleX = sprite.scale.x;
        sprite._previousScaleY = sprite.scale.y;
      }
      if (this.properties.alpha) {
        sprite._previousAlpha = sprite.alpha;
      }
      if (this.properties.tile) {
        if (sprite.tilePosition !== undefined) {
          sprite._previousTilePositionX = sprite.tilePosition.x;
          sprite._previousTilePositionY = sprite.tilePosition.y;
        }
        if (sprite.tileScale !== undefined) {
          sprite._previousTileScaleX = sprite.tileScale.x;
          sprite._previousTileScaleY = sprite.tileScale.y;
        }
      }

      if (sprite.children && sprite.children.length > 0) {
        for (let i = 0; i < sprite.children.length; i++) {
          let child = sprite.children[i];
          setProperties(child);
        }
      }
    };

    // 遍历所有精灵，并捕获他们的属性。
    for (let i = 0; i < this.stage.children.length; i++) {
      let sprite = this.stage.children[i];
      setProperties(sprite);
    }
  }

  /**
   * 渲染游戏。
   * Smoothie 的 render 方法会在 Hexi 的 interpolate 属性为 true（默认如此）时，
   * 对精灵位置和旋转进行插值处理，以实现超流畅的动画效果。
   * @param {number} lagOffset - 延迟偏移量。
   */
  render(lagOffset = 1) {
    //如果 `this.interpolate` 为 `true`（默认情况下为真），则计算精灵的插值渲染位置。
    if (this.interpolate) {
      // 一个递归函数，负责计算出插值位置。
      let interpolateSprite = (sprite) => {
        // 位置（x 和 y 属性）
        if (this.properties.position) {
          // 捕获精灵当前的x和y位置。
          sprite._currentX = sprite.x;
          sprite._currentY = sprite.y;

          // 找出其插值位置。
          if (sprite._previousX !== undefined) {
            sprite.x =
              (sprite.x - sprite._previousX) * lagOffset + sprite._previousX;
          }
          if (sprite._previousY !== undefined) {
            sprite.y =
              (sprite.y - sprite._previousY) * lagOffset + sprite._previousY;
          }
        }

        //旋转（“rotation”属性）
        if (this.properties.rotation) {
          // 捕获精灵当前的 rotation。
          sprite._currentRotation = sprite.rotation;

          if (sprite._previousRotation !== undefined) {
            sprite.rotation =
              (sprite.rotation - sprite._previousRotation) * lagOffset +
              sprite._previousRotation;
          }
        }

        // 尺寸（“width”和“height”属性）
        if (this.properties.size) {
          // 仅允许对Sprites或MovieClips进行此操作。
          // 因为当它们包含的精灵移动时，容器的大小会发生变化，
          // 这种插值会导致它们的缩放行为变得无序不定。
          if (
            sprite instanceof this.Sprite ||
            sprite instanceof this.MovieClip
          ) {
            sprite._currentWidth = sprite.width;
            sprite._currentHeight = sprite.height;

            if (sprite._previousWidth !== undefined) {
              sprite.width =
                (sprite.width - sprite._previousWidth) * lagOffset +
                sprite._previousWidth;
            }
            if (sprite._previousHeight !== undefined) {
              sprite.height =
                (sprite.height - sprite._previousHeight) * lagOffset +
                sprite._previousHeight;
            }
          }
        }

        // 缩放（“scale.x”和“scale.y”属性）
        if (this.properties.scale) {
          sprite._currentScaleX = sprite.scale.x;
          sprite._currentScaleY = sprite.scale.y;

          if (sprite._previousScaleX !== undefined) {
            sprite.scale.x =
              (sprite.scale.x - sprite._previousScaleX) * lagOffset +
              sprite._previousScaleX;
          }
          if (sprite._previousScaleY !== undefined) {
            sprite.scale.y =
              (sprite.scale.y - sprite._previousScaleY) * lagOffset +
              sprite._previousScaleY;
          }
        }

        // 透明度（“alpha”属性）
        if (this.properties.alpha) {
          sprite._currentAlpha = sprite.alpha;

          if (sprite._previousAlpha !== undefined) {
            sprite.alpha =
              (sprite.alpha - sprite._previousAlpha) * lagOffset +
              sprite._previousAlpha;
          }
        }

        // 平铺精灵属性（“tileposition”和“tileScale” 的x和y值）
        if (this.properties.tile) {
          if (sprite.tilePosition !== undefined) {
            sprite._currentTilePositionX = sprite.tilePosition.x;
            sprite._currentTilePositionY = sprite.tilePosition.y;

            if (sprite._previousTilePositionX !== undefined) {
              sprite.tilePosition.x =
                (sprite.tilePosition.x - sprite._previousTilePositionX) *
                  lagOffset +
                sprite._previousTilePositionX;
            }
            if (sprite._previousTilePositionY !== undefined) {
              sprite.tilePosition.y =
                (sprite.tilePosition.y - sprite._previousTilePositionY) *
                  lagOffset +
                sprite._previousTilePositionY;
            }
          }

          if (sprite.tileScale !== undefined) {
            sprite._currentTileScaleX = sprite.tileScale.x;
            sprite._currentTileScaleY = sprite.tileScale.y;

            if (sprite._previousTileScaleX !== undefined) {
              sprite.tileScale.x =
                (sprite.tileScale.x - sprite._previousTileScaleX) * lagOffset +
                sprite._previousTileScaleX;
            }
            if (sprite._previousTileScaleY !== undefined) {
              sprite.tileScale.y =
                (sprite.tileScale.y - sprite._previousTileScaleY) * lagOffset +
                sprite._previousTileScaleY;
            }
          }
        }

        if (sprite.children.length !== 0) {
          for (let j = 0; j < sprite.children.length; j++) {
            let child = sprite.children[j];
            interpolateSprite(child);
          }
        }
      };

      for (let i = 0; i < this.stage.children.length; i++) {
        let sprite = this.stage.children[i];
        interpolateSprite(sprite);
      }
    }

    this.renderer.render(this.stage);

    if (this.interpolate) {
      let restoreSpriteProperties = (sprite) => {
        if (this.properties.position) {
          sprite.x = sprite._currentX;
          sprite.y = sprite._currentY;
        }
        if (this.properties.rotation) {
          sprite.rotation = sprite._currentRotation;
        }
        if (this.properties.size) {
          if (
            sprite instanceof this.Sprite ||
            sprite instanceof this.MovieClip
          ) {
            sprite.width = sprite._currentWidth;
            sprite.height = sprite._currentHeight;
          }
        }
        if (this.properties.scale) {
          sprite.scale.x = sprite._currentScaleX;
          sprite.scale.y = sprite._currentScaleY;
        }
        if (this.properties.alpha) {
          sprite.alpha = sprite._currentAlpha;
        }
        if (this.properties.tile) {
          if (sprite.tilePosition !== undefined) {
            sprite.tilePosition.x = sprite._currentTilePositionX;
            sprite.tilePosition.y = sprite._currentTilePositionY;
          }
          if (sprite.tileScale !== undefined) {
            sprite.tileScale.x = sprite._currentTileScaleX;
            sprite.tileScale.y = sprite._currentTileScaleY;
          }
        }

        if (sprite.children.length !== 0) {
          for (let i = 0; i < sprite.children.length; i++) {
            let child = sprite.children[i];
            restoreSpriteProperties(child);
          }
        }
      };
      for (let i = 0; i < this.stage.children.length; i++) {
        let sprite = this.stage.children[i];
        restoreSpriteProperties(sprite);
      }
    }
  }
}
