/**
 * 简化的配置管理器 - 使用localStorage和config.json的混合方案
 */

// 默认配置
const DEFAULT_CONFIG = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  settings: {
    theme: 'light',
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundOpacity: 1,
    backgroundBrightness: 1,
    backgroundBlur: 0,
    backgroundFit: 'cover',
    textColor: '#000000',
    linkColor: '#4a90e2',
    fontFamily: 'Arial, sans-serif',
    gradientType: 'linear',
    gradientDirection: 'to right',
    gradientColors: ['#4a90e2', '#9b59b6'],
    gradientStops: [0, 100],
    showBackground: true,
    startupModuleType: 'last',
    startupModule: 'quote'
  },
  data: {
    lastActiveModule: 'quote',
    bookmarks: [],
    todos: [],
    notes: [],
    calendar: {
      events: [],
      countdowns: []
    }
  }
};

class SimpleConfigManager {
  constructor() {
    this.config = null;
    this.isInitialized = false;
    this.isLoading = false;
    this.loadPromise = null;
    this.saveQueue = [];
    this.autoSaveTimer = null;
  }

  /**
   * 初始化配置管理器
   */
  async initialize() {
    if (this.isInitialized) return this.config;
    if (this.isLoading) return this.loadPromise;

    this.isLoading = true;
    this.loadPromise = this._doInitialize();
    
    try {
      await this.loadPromise;
      this.startAutoSave();
      return this.config;
    } finally {
      this.isLoading = false;
    }
  }

  async _doInitialize() {
    try {
      // 尝试从localStorage加载现有配置
      const savedConfig = this.getFromLocalStorage('homepage-config', null);
      
      if (savedConfig) {
        this.config = this.mergeWithDefaults(savedConfig);
      } else {
        // 迁移旧数据
        await this.migrateFromOldStorage();
      }
      
      this.isInitialized = true;
      console.log('简化配置管理器初始化成功');
    } catch (error) {
      console.error('配置管理器初始化失败:', error);
      this.config = { ...DEFAULT_CONFIG };
      this.isInitialized = true;
    }
  }

  /**
   * 从旧存储迁移数据
   */
  async migrateFromOldStorage() {
    const migratedConfig = { ...DEFAULT_CONFIG };
    
    // 迁移设置
    const oldSettings = this.getFromLocalStorage('homepage-settings', {});
    if (Object.keys(oldSettings).length > 0) {
      migratedConfig.settings = { ...migratedConfig.settings, ...oldSettings };
    }

    // 迁移数据
    migratedConfig.data.lastActiveModule = this.getFromLocalStorage('last-active-module', 'quote');
    migratedConfig.data.bookmarks = this.getFromLocalStorage('homepage-bookmarks', []);
    migratedConfig.data.todos = this.getFromLocalStorage('homepage-todos', []);
    migratedConfig.data.notes = this.getFromLocalStorage('homepage-notes', []);
    
    const calendarData = this.getFromLocalStorage('homepage-calendar', {});
    if (calendarData.events) migratedConfig.data.calendar.events = calendarData.events;
    if (calendarData.countdowns) migratedConfig.data.calendar.countdowns = calendarData.countdowns;

    this.config = migratedConfig;
    await this.saveConfig();
    
    console.log('数据迁移完成');
  }

  /**
   * 合并配置与默认值
   */
  mergeWithDefaults(config) {
    const merged = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };

    deepMerge(merged, config);
    merged.lastUpdated = new Date().toISOString();
    
    return merged;
  }

  /**
   * 保存配置
   */
  async saveConfig() {
    if (!this.config) return;

    try {
      this.config.lastUpdated = new Date().toISOString();
      
      // 保存到localStorage
      this.saveToLocalStorage('homepage-config', this.config);
      
      console.log('配置保存成功');
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  }

  /**
   * 获取配置值
   */
  get(path, defaultValue = null) {
    if (!this.config) return defaultValue;
    
    const keys = path.split('.');
    let current = this.config;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current;
  }

  /**
   * 设置配置值
   */
  async set(path, value) {
    if (!this.config) await this.initialize();
    
    const keys = path.split('.');
    let current = this.config;
    
    // 导航到父级对象
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    // 设置值
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    // 队列保存，避免频繁保存
    this.queueSave();
  }

  /**
   * 队列保存（防抖）
   */
  queueSave() {
    if (this.saveQueue.length === 0) {
      setTimeout(async () => {
        if (this.saveQueue.length > 0) {
          await this.saveConfig();
          this.saveQueue = [];
        }
      }, 500); // 500ms 防抖
    }
    this.saveQueue.push(Date.now());
  }

  /**
   * 启动自动保存
   */
  startAutoSave() {
    if (this.autoSaveTimer) return;
    
    this.autoSaveTimer = setInterval(async () => {
      if (this.saveQueue.length > 0) {
        await this.saveConfig();
        this.saveQueue = [];
      }
    }, 5000); // 每5秒检查一次
  }

  /**
   * 停止自动保存
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * 导出配置为config.json
   */
  exportConfig() {
    if (!this.config) return null;
    
    const configJson = JSON.stringify(this.config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return configJson;
  }

  /**
   * 导入配置
   */
  async importConfig(file) {
    try {
      const text = await file.text();
      const importedConfig = JSON.parse(text);
      
      // 验证配置格式
      if (!this.validateConfig(importedConfig)) {
        throw new Error('配置文件格式无效');
      }
      
      this.config = this.mergeWithDefaults(importedConfig);
      await this.saveConfig();
      
      return true;
    } catch (error) {
      console.error('导入配置失败:', error);
      throw error;
    }
  }

  /**
   * 验证配置格式
   */
  validateConfig(config) {
    return config && 
           typeof config === 'object' && 
           config.settings && 
           config.data;
  }

  /**
   * 强制保存配置
   */
  async forceSave() {
    await this.saveConfig();
    console.log('配置强制保存完成');
  }

  /**
   * 重置配置
   */
  async resetConfig() {
    this.config = { ...DEFAULT_CONFIG };
    await this.saveConfig();
    console.log('配置已重置为默认值');
  }

  /**
   * 获取配置统计信息
   */
  getStats() {
    if (!this.config) return null;
    
    return {
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
      dataSize: JSON.stringify(this.config).length,
      bookmarksCount: this.config.data.bookmarks?.length || 0,
      todosCount: this.config.data.todos?.length || 0,
      notesCount: this.config.data.notes?.length || 0,
      eventsCount: this.config.data.calendar?.events?.length || 0,
      countdownsCount: this.config.data.calendar?.countdowns?.length || 0
    };
  }

  // 辅助方法
  getFromLocalStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  saveToLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage保存失败:', error);
    }
  }
}

// 创建全局实例
const simpleConfigManager = new SimpleConfigManager();

export default simpleConfigManager;
export { DEFAULT_CONFIG };