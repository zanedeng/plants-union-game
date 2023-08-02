/**
 *
 * @param {string} template - 包含模板字符串的原始字符串
 * @param {*} data - 包含要替换的键值对的对象
 * @returns
 */
export const replaceTemplateString = (template, data) => {
  // 匹配模板字符串中的占位符
  const regex = /{{\s*([^{}\s]*)\s*}}/g;

  // 使用 replace 方法替换模板字符串中的占位符
  const replacedString = template.replace(regex, (match, key) => {
    // 检查数据对象中是否存在对应的键
    if (data.hasOwnProperty(key)) {
      return data[key];
    }
    // 如果不存在对应的键，则返回原始的占位符
    return match;
  });

  return replacedString;
}
