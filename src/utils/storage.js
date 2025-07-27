/**
 * 从本地存储中获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值，如果存储中没有对应的值
 * @returns {any} 存储的值或默认值
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`从存储中获取 ${key} 失败:`, error);
    return defaultValue;
  }
};

/**
 * 保存数据到本地存储
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的值
 * @returns {boolean} 是否成功保存
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`保存 ${key} 到存储失败:`, error);
    return false;
  }
};

/**
 * 从本地存储中删除数据
 * @param {string} key - 存储键名
 * @returns {boolean} 是否成功删除
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`从存储中删除 ${key} 失败:`, error);
    return false;
  }
};

/**
 * 清空本地存储
 * @returns {boolean} 是否成功清空
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清空存储失败:', error);
    return false;
  }
};

/**
 * 获取所有存储的键
 * @returns {string[]} 所有存储的键
 */
export const getAllStorageKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('获取所有存储键失败:', error);
    return [];
  }
};

/**
 * 导出所有存储数据为JSON文件
 * @param {string} filename - 导出的文件名
 */
export const exportStorageToFile = (filename = 'homepage-backup.json') => {
  try {
    const data = {};
    const keys = getAllStorageKeys();
    
    keys.forEach(key => {
      if (key.startsWith('homepage-')) {
        data[key] = getFromStorage(key);
      }
    });
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('导出存储数据失败:', error);
    return false;
  }
};

/**
 * 从JSON文件导入存储数据
 * @param {string} jsonString - JSON字符串
 * @returns {boolean} 是否成功导入
 */
export const importStorageFromJson = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    
    Object.keys(data).forEach(key => {
      if (key.startsWith('homepage-')) {
        saveToStorage(key, data[key]);
      }
    });
    
    return true;
  } catch (error) {
    console.error('导入存储数据失败:', error);
    return false;
  }
};