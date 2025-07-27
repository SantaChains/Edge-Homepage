/**
 * 配置管理器 - 处理本地config.json文件的读写
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
    },
    news: {
      sources: [],
      cache: []
    }
  },
  preferences: {
    autoSave: true,
    backupInterval: 24, // 小时
    maxBackups: 5,
    enableAnalytics: false
  }
};

class ConfigManager {
  constructor() {
    this.config = null;
    this.configPath = './config.json';
    this.isLoading = false;
    this.saveQueue = [];
    this.autoSaveTimer = null;
  }

  /**
   * 初始化配置管理器
   */
  async initialize() {
    try {
      this.isLoading = true;
      await this.loadConfig();
      this.startAutoSave();
      console.log('配置管理器初始化成功');
    } catch (error) {
      console.error('配置管理器初始化失败:', error);
      await this.createDefaultConfig();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 加载配置文件
   */
  async loadConfig() {
    try {
      // 尝试从本地文件加载
      const response = await fetch(this.configPath);
      if (response.ok) {
        const configData = await response.json();
        this.config = this.mergeWithDefaults(configData);
        console.log('配置文件加载成功');
      } else {
        throw new Error('配置文件不存在');
      }
    } catch (error) {
      console.warn('无法加载配置文件，尝试从localStorage迁移:', error);
      await this.migrateFromLocalStorage();
    }
  }

  /**
   * 从localStorage迁移数据
   */
  async migrateFromLocalStorage() {
    try {
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
      
      // 保存迁移后的配置
      await this.saveConfig();
      
      // 清理localStorage（可选）
      this.clearLocalStorage();
      
      console.log('数据迁移完成');
    } catch (error) {
      console.error('数据迁移失败:', error);
      await this.createDefaultConfig();
    }
  }

  /**
   * 创建默认配置
   */
  async createDefaultConfig() {
    this.config = { ...DEFAULT_CONFIG };
    await this.saveConfig();
    console.log('创建默认配置文件');
  }

  /**
   * 合并配置与默认值
   */
  mergeWithDefaults(config) {
    const merged = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    
    // 深度合并
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
   * 保存配置文件
   */
  async saveConfig() {
    if (!this.config) return;

    try {
      this.config.lastUpdated = new Date().toISOString();
      
      // 创建下载链接保存文件
      const configJson = JSON.stringify(this.config, null, 2);
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 自动下载配置文件到根目录
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.json';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // 同时保存到localStorage作为备份
      localStorage.setItem('homepage-config-backup', configJson);
      
      console.log('配置文件保存成功');
    } catch (error) {
      console.error('保存配置文件失败:', error);
      // 降级到localStorage
      this.saveToLocalStorage('homepage-config', this.config);
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
    
    // 队列保存
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
      }, 1000); // 1秒后保存
    }
    this.saveQueue.push(Date.now());
  }

  /**
   * 立即保存
   */
  async forceSave() {
    this.saveQueue = [];
    await this.saveConfig();
  }

  /**
   * 导出配置
   */
  exportConfig() {
    if (!this.config) return null;
    
    const configJson = JSON.stringify(this.config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-backup-${new Date().toISOString().split('T')[0]}.json`;
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
   * 启动自动保存
   */
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    const interval = (this.get('preferences.backupInterval', 24) * 60 * 60 * 1000);
    this.autoSaveTimer = setInterval(async () => {
      await this.saveConfig();
      console.log('自动保存配置完成');
    }, interval);
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

  clearLocalStorage() {
    const keysToRemove = [
      'homepage-settings',
      'last-active-module',
      'homepage-bookmarks',
      'homepage-todos',
      'homepage-notes',
      'homepage-calendar'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('localStorage清理完成');
  }
}

// 创建全局实例
const configManager = new ConfigManager();

export default configManager;
export { DEFAULT_CONFIG };