/**
 * 根据对象构建查询字符串。
 * @param {Object} obj - 包含参数键值对的对象。
 * @returns {string} 查询字符串。
 */
export function httpBuildQuery(params) {
  const queryStrings = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      queryStrings.push(`${encodedKey}=${encodedValue}`);
    }
  }
  return queryStrings.join('&');
}
