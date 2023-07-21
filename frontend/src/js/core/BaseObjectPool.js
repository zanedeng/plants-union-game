

class BaseObjectPool {

  /**
   * 创建一个 BaseObjectPool 的实例。
   */
  constructor() {
    // 使用 WeakMap 存储对象池
    this.poolsMap = new WeakMap();
    // 使用 WeakMap 存储对象池的最大数量
    this.maxCountMap = new WeakMap();
  }

  /**
   * 创建一个对象实例。
   * @param {Function} clazz - 构造函数
   * @returns {Object} - 创建的对象实例
   */
  create(clazz) {
    const pool = this.poolsMap.get(clazz);
    if (pool && pool.length) {
      // 如果对象池中有可用对象，则弹出并返回一个对象
      return pool.pop();
    }
    // 如果对象池为空，则创建一个新的对象实例
    return new clazz();
  }

  /**
   * 回收一个对象到对象池中。
   * @param {Object} obj - 要回收的对象
   */
  recycle(obj) {
    const clazz = obj.constructor

    if (!this.poolsMap.has(clazz)) {
      // 如果对象池中没有该类的池，则创建一个新的池
      this.poolsMap.set(clazz, [])
    }

    const pool = this.poolsMap.get(clazz) ?? []
    if (pool.includes(obj)) {
      // 如果对象已经在对象池中，则抛出错误
      throw new Error('该对象已经存在在对象池中！')
    }

    const maxCount = this.maxCountMap.get(clazz) ?? 0
    if (maxCount > 0 && pool.length >= maxCount) {
      // 如果对象池已达到最大数量，则不进行回收
      return
    }

    // 将对象回收到对象池中
    pool.push(obj)
  }

  /**
   * 设置对象池的最大数量。
   * @param {Function} clazz - 构造函数
   * @param {number} maxCount - 最大数量
   */
  setMaxCount(clazz, maxCount = 0) {
    if (maxCount < 0) {
      maxCount = 0
    }
    // 设置对象池的最大数量
    this.poolMaxCountMap.set(clazz, maxCount)
  }

  /**
   * 填充对象池到指定数量。
   * @param {Function} clazz - 构造函数
   * @param {number} count - 需要填充的对象数量，默认为 -1，表示全部填充
   */
  fullFill(clazz, count = -1) {
    if (!this.poolsMap.has(clazz)) {
      // 如果对象池中没有该类的池，则创建一个新的池
      this.poolsMap.set(clazz, [])
    }
    const pool = this.poolsMap.get(clazz) ?? []

    if (count < 0) {
      count = this.poolMaxCountMap.get(clazz) ?? 0
    }

    while (pool.length < count) {
      // 创建新的对象实例并填充到对象池中
      pool.push(new clazz())
    }
  }

  /**
   * 释放对象池中多余的对象。
   * @param {Function} clazz - 构造函数
   * @param {number} count - 需要保留的对象数量，默认为 -1，表示全部释放
   */
  release(clazz, count = -1) {
    if (!this.poolsMap.has(clazz)) {
      return
    }

    const pool = this.poolsMap.get(clazz) ?? []

    if (count < 0) {
      count = this.poolMaxCountMap.get(clazz) ?? 0
    }

    if (count === 0) {
      // 如果需要保留的对象数量为 0，则清空对象池
      pool.length = 0
    } else if (pool.length > count) {
      // 如果对象池中的对象数量超过保留数量，则进行释放
      pool.splice(count)
    }
  }

  /**
   * 释放所有对象池中的对象。
   */
  releaseAll() {
    this.poolsMap = new WeakMap()
  }
}

// 创建全局的对象池实例
export const pool = new BaseObjectPool();
