/**
 * 从 URL 中提取参数。
 * @param {string} url - URL 字符串。
 * @returns {Object} 包含参数键值对的对象。
 */
export function getUrlParams(url) {
  url = url || window.location.href;
  const params = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const paramPairs = queryString.split('&');
    paramPairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    });
  }
  return params;
}
