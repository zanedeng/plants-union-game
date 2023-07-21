import { isArray } from './is';
/**
 * 根据类名和参数创建一个类的实例。
 * @param {Function} clazz - 类名。
 * @param {Array|any} args - 参数数组或单个参数。
 * @param {Object} props - 属性对象。
 * @returns {Object|null} 创建的类实例，如果类名不存在则返回 null。
 */
export function createInstance(clazz, args, props) {
  if (!clazz) return null;
  if (!isArray(args)) {
    args = [args];
  }
  let instance;
  if (args) {
    switch (args.length) {
      case 0:
        instance = new clazz();
        break;
      case 1:
        instance = new clazz(args[0]);
        break;
      case 2:
        instance = new clazz(args[0], args[1]);
        break;
      case 3:
        instance = new clazz(args[0], args[1], args[2]);
        break;
      case 4:
        instance = new clazz(args[0], args[1], args[2], args[3]);
        break;
      case 5:
        instance = new clazz(args[0], args[1], args[2], args[3], args[4]);
        break;
      case 6:
        instance = new clazz(
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5]
        );
        break;
      case 7:
        instance = new clazz(
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5],
          args[6]
        );
        break;
      case 8:
        instance = new clazz(
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5],
          args[6],
          args[7]
        );
        break;
      case 9:
        instance = new clazz(
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5],
          args[6],
          args[7],
          args[8]
        );
        break;
      case 10:
        instance = new clazz(
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5],
          args[6],
          args[7],
          args[8],
          args[9]
        );
        break;
      default:
        return null;
    }
  } else {
    instance = new clazz();
  }

  if (props) {
    Object.keys(props).map((key) => {
      if (instance.hasOwnProperty(key)) {
        instance[key] = props[key];
      }
    });
  }

  return instance;
}
