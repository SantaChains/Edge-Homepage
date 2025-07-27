/**
 * 应用启动管理器
 * 处理应用初始化、设置加载和延迟显示
 */

import configManager from './simpleConfigManager';
import backgroundManager from './backgroundManager';

class AppInitializer {
  constructor() {
    this.isInitialized = false;
    this.initPromise = null;
    this.settings = {};
  }

  /**
   * 初始化应用
   * @param {Object} options 初始化选项
   * @returns {Promise<Object>} 初始化结果
   */
  async initialize(options = {}) {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._performInitialization(options);
    return this.initPromise;
  }

  /**
   * 执行初始化过程
   * @private
   */
  async _performInitialization(options) {
    try {
      const { 
        delay = 150, // 延迟时间，避免闪烁
        showLoadingScreen = true 
      } = options;

      console.log('🚀 开始应用初始化...');

      // 显示加载屏幕
      if (showLoadingScreen) {
        this._showLoadingScreen();
      }

      // 预先应用基础样式，避免闪烁
      this._applyBaseStyles();

      // 延迟初始化，避免闪烁
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // 初始化配置管理器
      console.log('📁 初始化配置管理器...');
      await configManager.initialize();

      // 加载设置
      console.log('⚙️ 加载用户设置...');
      this.settings = configManager.get('settings', {});
      console.log('📋 已加载设置项:', Object.keys(this.settings).length);

      // 应用基础设置
      this._applyBaseSettings(this.settings);

      // 确定启动模块
      const startupModule = this._determineStartupModule(this.settings);
      console.log('📱 确定启动模块:', startupModule);

      // 应用完整设置
      console.log('🎨 应用完整设置...');
      this._applyFullSettings(this.settings);

      // 隐藏加载屏幕
      if (showLoadingScreen) {
        this._hideLoadingScreen();
      }

      this.isInitialized = true;
      console.log('✅ 应用初始化完成');

      return {
        success: true,
        settings: this.settings,
        startupModule,
        message: '应用初始化成功'
      };

    } catch (error) {
      console.error('❌ 应用初始化失败:', error);
      
      // 隐藏加载屏幕
      this._hideLoadingScreen();

      // 应用默认设置，确保应用可用
      this._applyDefaultSettings();

      return {
        success: false,
        error,
        settings: {},
        startupModule: 'quote',
        message: '应用初始化失败，使用默认设置'
      };
    }
  }

  /**
   * 确定启动模块
   * @private
   */
  _determineStartupModule(settings) {
    const moduleComponents = ['calendar', 'bookmark', 'todo', 'note', 'quote', 'news'];
    let startupModule = 'quote'; // 默认为一语

    if (settings.startupModuleType === 'last') {
      // 继承上次使用的模块
      const lastModule = configManager.get('data.lastActiveModule', 'quote');
      startupModule = lastModule;
    } else if (settings.startupModuleType === 'specific') {
      // 使用指定的模块
      startupModule = settings.startupModule || 'quote';
    } else {
      // 如果没有设置，检查是否有上次使用的模块
      const lastModule = configManager.get('data.lastActiveModule', null);
      if (lastModule) {
        startupModule = lastModule;
      }
    }

    // 验证模块是否存在
    if (!moduleComponents.includes(startupModule)) {
      startupModule = 'quote';
    }

    return startupModule;
  }

  /**
   * 应用基础样式（在配置加载前）
   * @private
   */
  _applyBaseStyles() {
    const root = document.documentElement;
    
    // 设置页面标题
    document.title = '時';
    
    // 应用基础CSS变量
    root.style.setProperty('--primary-color', '#4a90e2');
    root.style.setProperty('--transition-speed', '0.3s');
    
    // 确保基础变量存在
    root.style.setProperty('--background-color', '#ffffff');
    root.style.setProperty('--card-background', '#f8f8f8');
    root.style.setProperty('--border-color', '#e0e0e0');
    root.style.setProperty('--text-color', '#333333');
    root.style.setProperty('--text-secondary-color', '#666666');
    root.style.setProperty('--hover-background', '#f0f0f0');
  }

  /**
   * 应用基础设置
   * @private
   */
  _applyBaseSettings(settings) {
    const root = document.documentElement;
    
    // 应用用户自定义的基础CSS变量
    root.style.setProperty('--primary-color', settings.linkColor || '#4a90e2');
    
    // 预设主题变量，避免闪烁
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  /**
   * 应用默认设置（初始化失败时使用）
   * @private
   */
  _applyDefaultSettings() {
    const root = document.documentElement;
    
    // 设置页面标题
    document.title = '時';
    
    // 应用默认主题
    root.style.setProperty('--background-color', '#ffffff');
    root.style.setProperty('--card-background', '#f8f8f8');
    root.style.setProperty('--border-color', '#e0e0e0');
    root.style.setProperty('--text-color', '#333333');
    root.style.setProperty('--text-secondary-color', '#666666');
    root.style.setProperty('--hover-background', '#f0f0f0');
    root.style.setProperty('--primary-color', '#4a90e2');
    
    document.body.classList.remove('dark-mode');
    
    console.log('🔧 已应用默认设置');
  }

  /**
   * 应用完整设置
   * @private
   */
  _applyFullSettings(settings) {
    try {
      const root = document.documentElement;
      const body = document.body;
      
      // 应用主题
      const theme = settings.theme || 'light';
      if (theme === 'dark') {
        root.style.setProperty('--background-color', '#121212');
        root.style.setProperty('--card-background', '#1e1e1e');
        root.style.setProperty('--border-color', '#333333');
        root.style.setProperty('--text-color', settings.textColor || '#e0e0e0');
        root.style.setProperty('--text-secondary-color', '#a0a0a0');
        root.style.setProperty('--hover-background', '#333333');
        root.style.setProperty('--primary-color-light', 'rgba(74, 144, 226, 0.2)');
        body.classList.add('dark-mode');
      } else {
        root.style.setProperty('--background-color', '#ffffff');
        root.style.setProperty('--card-background', '#f8f8f8');
        root.style.setProperty('--border-color', '#e0e0e0');
        root.style.setProperty('--text-color', settings.textColor || '#333333');
        root.style.setProperty('--text-secondary-color', '#666666');
        root.style.setProperty('--hover-background', '#f0f0f0');
        root.style.setProperty('--primary-color-light', 'rgba(74, 144, 226, 0.1)');
        body.classList.remove('dark-mode');
      }
      
      // 应用字体设置
      if (settings.fontFamily) {
        root.style.setProperty('--font-family', settings.fontFamily);
      }
      
      // 使用背景管理器应用背景设置
      backgroundManager.applySettings(settings);
      
    } catch (error) {
      console.error('应用完整设置时出错:', error);
    }
  }

  /**
   * 显示加载屏幕
   * @private
   */
  _showLoadingScreen() {
    // 检查是否已存在加载屏幕
    if (document.getElementById('app-loading-screen')) {
      return;
    }

    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'app-loading-screen';
    loadingScreen.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--background-color, #ffffff);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
      ">
        <div style="
          width: 60px;
          height: 60px;
          border: 3px solid var(--border-color, #e0e0e0);
          border-top: 3px solid var(--primary-color, #4a90e2);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        "></div>
        <div style="
          font-size: 18px;
          font-weight: 500;
          color: var(--text-color, #333333);
          margin-bottom: 8px;
        ">正在加载...</div>
        <div style="
          font-size: 14px;
          color: var(--text-secondary-color, #666666);
        ">请稍候，正在初始化应用程序</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    document.body.appendChild(loadingScreen);
  }

  /**
   * 隐藏加载屏幕
   * @private
   */
  _hideLoadingScreen() {
    const loadingScreen = document.getElementById('app-loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 300);
    }
  }

  /**
   * 获取当前设置
   */
  getSettings() {
    return this.settings;
  }

  /**
   * 更新设置
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this._applyFullSettings(this.settings);
  }

  /**
   * 重置初始化状态
   */
  reset() {
    this.isInitialized = false;
    this.initPromise = null;
    this.settings = {};
  }
}

// 创建单例实例
const appInitializer = new AppInitializer();

export default appInitializer;