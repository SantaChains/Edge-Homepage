/**
 * 获取网站图标URL
 * @param {string} url - 网站URL
 * @returns {string} 图标URL
 */
export const getFaviconUrl = (url) => {
  try {
    // 尝试解析URL
    const parsedUrl = new URL(url);
    // 返回Google Favicon服务的URL
    return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
  } catch (error) {
    // 如果URL解析失败，返回默认图标
    console.error('获取网站图标失败:', error);
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTEyIDNjNS4zOTIgMCA5Ljg3OCA0LjAzNyAxMC40MTkgOS4yNDNsLjAwNS4xNzEuMDA4LjE3Ny4wMDguMTc3LjAwNS4xNzZjMCA1LjUyMy00LjQ3NyAxMC0xMCAxMC01LjM5IDAtOS44NzYtNC4wMzYtMTAuNDE4LTkuMjRsLS4wMDUtLjE3MS0uMDA4LS4xNzgtLjAwOC0uMTc3LS4wMDUtLjE3N0MxLjk5NSA4LjQ3NyA2LjQ3MiA0IDEyIDR6bTAgMmE4IDggMCAwIDAtOCA4YzAgNC40MTggMy41OTEgOCA4IDhzOC0zLjU4MiA4LTgtMy41ODktOC04LTh6bTAgM2MxLjY1NyAwIDMgMS4zNDMgMyAzcy0xLjM0MyAzLTMgMy0zLTEuMzQzLTMtMyAxLjM0My0zIDMtM3oiIGZpbGw9InJnYmEoMTQ0LDE0NCwxNDQsMSkiLz48L3N2Zz4=';
  }
};

/**
 * 处理URL变更，支持本地文件路径转换
 * @param {string} url - 输入的URL或路径
 * @returns {string} 处理后的URL
 */
export const handleUrlChange = (url) => {
  if (!url) return '';
  
  // 如果已经是有效URL，直接返回
  try {
    new URL(url);
    return url;
  } catch (e) {
    // 不是有效URL，继续处理
  }
  
  // 处理本地文件路径
  if (url.includes(':\\') || url.includes(':/')) {
    // 检测是否包含引号的Windows路径
    if (url.startsWith('"') && url.endsWith('"')) {
      url = url.slice(1, -1); // 移除引号
    }
    
    // 替换反斜杠为正斜杠
    url = url.replace(/\\/g, '/');
    
    // 添加file://前缀（如果没有）
    if (!url.startsWith('file:/')) {
      url = `file:/${url}`;
    }
    
    return url;
  }
  
  // 如果看起来像是一个域名，添加https://
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(url)) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * 清理搜索查询，移除非URL字符
 * @param {string} query - 搜索查询
 * @returns {string} 清理后的查询
 */
export const cleanSearchQuery = (query) => {
  if (!query) return '';
  
  let cleaned = query;
  
  // 1. 首先去除[]内的内容及[]本身
  cleaned = cleaned.replace(/\[.*?\]/g, '');
  
  // 2. 然后去除中文字符
  cleaned = cleaned.replace(/[\u4e00-\u9fa5]/g, '');
  
  // 3. 将中文标点符号转化为英文标点
  const punctuationMap = {
    '，': ',',
    '。': '.',
    '！': '!',
    '？': '?',
    '：': ':',
    '；': ';',
    '\u201C': '"', // 中文左双引号
    '\u201D': '"', // 中文右双引号
    '\u2018': "'", // 中文左单引号
    '\u2019': "'", // 中文右单引号
    '（': '(',
    '）': ')',
    '【': '[',
    '】': ']',
    '《': '<',
    '》': '>',
    '—': '-'
  };
  
  Object.keys(punctuationMap).forEach(key => {
    cleaned = cleaned.replace(new RegExp(key, 'g'), punctuationMap[key]);
  });
  
  // 4. 最后去除非URL的字符
  // 保留URL中可能出现的字符：字母、数字、一些特殊符号
  cleaned = cleaned.replace(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/g, '');
  
  // 移除多余的空格
  cleaned = cleaned.replace(/\s+/g, '');
  
  return cleaned;
};

/**
 * 检查字符串是否是有效URL
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否是有效URL
 */
export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 构建搜索引擎URL
 * @param {string} query - 搜索查询
 * @param {string} engine - 搜索引擎（bing, google, baidu, sogou, mita）或自定义引擎ID
 * @param {boolean} removeNonUrl - 是否移除非URL字符
 * @param {Array} customEngines - 自定义搜索引擎列表
 * @returns {string} 搜索URL
 */
export const buildSearchUrl = (query, engine = 'bing', removeNonUrl = false, customEngines = []) => {
  if (!query) return '';
  
  // 如果需要移除非URL字符
  const processedQuery = removeNonUrl ? cleanSearchQuery(query) : query;
  
  // 如果是有效URL，直接返回
  if (isValidUrl(processedQuery) || processedQuery.startsWith('file:/')) {
    return processedQuery;
  }
  
  // 检查是否是自定义引擎
  if (customEngines && engine.startsWith('custom_')) {
    const customEngine = customEngines.find(e => e.id === engine);
    if (customEngine) {
      return customEngine.url.replace('{query}', encodeURIComponent(processedQuery));
    }
  }
  
  // 根据搜索引擎构建URL
  const encodedQuery = encodeURIComponent(processedQuery);
  
  switch (engine.toLowerCase()) {
    case 'google':
      return `https://www.google.com/search?q=${encodedQuery}`;
    case 'baidu':
      return `https://www.baidu.com/s?wd=${encodedQuery}`;
    case 'sogou':
      return `https://www.sogou.com/web?query=${encodedQuery}`;
    case 'mita':
      return `https://metaso.cn/#/search?q=${encodedQuery}`;
    case 'bing':
    default:
      return `https://www.bing.com/search?q=${encodedQuery}`;
  }
};

/**
 * 从URL中提取域名
 * @param {string} url - URL
 * @returns {string} 域名
 */
export const extractDomain = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    console.error('提取域名失败:', error);
    return '';
  }
};

/**
 * 从URL中提取网站标题（需要fetch API）
 * @param {string} url - URL
 * @returns {Promise<string>} 网站标题
 */
export const fetchPageTitle = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : extractDomain(url);
  } catch (error) {
    console.error('获取页面标题失败:', error);
    return extractDomain(url);
  }
};