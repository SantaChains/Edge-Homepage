import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

// 默认设置
const defaultSettings = {
  theme: 'light',
  startupModule: {
    type: 'last', // 'last' | 'specific'
    module: 'quote' // 当 type 为 'specific' 时使用
  },
  background: {
    type: 'color', // 'color' | 'image' | 'gradient'
    value: '#ffffff',
    opacity: 1,
    brightness: 1,
    blurAmount: 0,
    size: 'cover',
    repeat: 'no-repeat',
    overlayOpacity: 0
  },
  search: {
    defaultEngine: 'bing',
    autoCleanUrl: false,
    removeNonUrl: false,
    openInNewTab: true,
    customEngines: []
  },
  modules: {
    calendar: {
      showWeather: true,
      showCountdown: true
    },
    bookmark: {
      showFavicons: true,
      gridColumns: 4
    },
    todo: {
      showCompleted: false,
      autoSort: true
    },
    note: {
      autoSave: true,
      fontSize: 14
    },
    quote: {
      autoRefresh: true,
      refreshInterval: 3600000 // 1小时
    },
    news: {
      sources: ['tech', 'general'],
      refreshInterval: 1800000 // 30分钟
    }
  }
};

// 创建上下文
export const SettingsContext = createContext({
  settings: defaultSettings,
  isLoaded: false,
  updateSettings: () => {},
  updateSpecificSettings: () => {},
  resetSettings: () => {}
});

// 设置提供者组件
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // 应用设置到DOM
  const applySettings = useCallback((settingsToApply) => {
    try {
      const root = document.documentElement;
      
      // 应用主题
      if (settingsToApply.theme) {
        root.setAttribute('data-theme', settingsToApply.theme);
        
        if (settingsToApply.theme === 'dark') {
          // 深色模式CSS变量
          root.style.setProperty('--background-color', '#121212');
          root.style.setProperty('--card-background', '#1e1e1e');
          root.style.setProperty('--border-color', '#333333');
          root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
          root.style.setProperty('--text-color', '#e0e0e0');
          root.style.setProperty('--text-secondary-color', '#a0a0a0');
          root.style.setProperty('--primary-color', '#4a90e2');
          root.style.setProperty('--primary-color-light', 'rgba(74, 144, 226, 0.2)');
          root.style.setProperty('--transition-speed', '0.3s');
          document.body.classList.add('dark-mode');
        } else {
          // 浅色模式CSS变量
          root.style.setProperty('--background-color', '#ffffff');
          root.style.setProperty('--card-background', '#f8f8f8');
          root.style.setProperty('--border-color', '#e0e0e0');
          root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
          root.style.setProperty('--text-color', '#333333');
          root.style.setProperty('--text-secondary-color', '#666666');
          root.style.setProperty('--primary-color', '#4a90e2');
          root.style.setProperty('--primary-color-light', 'rgba(74, 144, 226, 0.1)');
          root.style.setProperty('--transition-speed', '0.3s');
          document.body.classList.remove('dark-mode');
        }
      }
      
      // 应用背景设置
      if (settingsToApply.background) {
        const body = document.body;
        const bg = settingsToApply.background;
        
        if (bg.type === 'color') {
          body.style.background = bg.value || '#ffffff';
          body.style.backgroundImage = 'none';
        } else if (bg.type === 'image' && bg.value) {
          body.style.backgroundImage = `url(${bg.value})`;
          body.style.backgroundSize = bg.size || 'cover';
          body.style.backgroundPosition = 'center';
          body.style.backgroundRepeat = bg.repeat || 'no-repeat';
          body.style.backgroundAttachment = 'fixed';
        } else if (bg.type === 'gradient' && bg.value) {
          body.style.background = bg.value;
          body.style.backgroundImage = 'none';
        }
        
        // 应用背景效果
        if (bg.opacity !== undefined) {
          body.style.opacity = bg.opacity;
        }
        if (bg.brightness !== undefined) {
          body.style.filter = `brightness(${bg.brightness})`;
        }
      }
    } catch (error) {
      console.error('应用设置时出错:', error);
    }
  }, []);

  // 初始化设置
  useEffect(() => {
    const initializeSettings = () => {
      try {
        // 从本地存储获取设置
        const savedSettings = getFromStorage('homepage-settings', null);
        
        if (savedSettings) {
          // 合并默认设置和保存的设置
          const mergedSettings = {
            ...defaultSettings,
            ...savedSettings,
            // 深度合并嵌套对象
            startupModule: {
              ...defaultSettings.startupModule,
              ...(savedSettings.startupModule || {})
            },
            background: {
              ...defaultSettings.background,
              ...(savedSettings.background || {})
            },
            search: {
              ...defaultSettings.search,
              ...(savedSettings.search || {})
            },
            modules: {
              ...defaultSettings.modules,
              ...(savedSettings.modules || {}),
              calendar: {
                ...defaultSettings.modules.calendar,
                ...(savedSettings.modules?.calendar || {})
              },
              bookmark: {
                ...defaultSettings.modules.bookmark,
                ...(savedSettings.modules?.bookmark || {})
              },
              todo: {
                ...defaultSettings.modules.todo,
                ...(savedSettings.modules?.todo || {})
              },
              note: {
                ...defaultSettings.modules.note,
                ...(savedSettings.modules?.note || {})
              },
              quote: {
                ...defaultSettings.modules.quote,
                ...(savedSettings.modules?.quote || {})
              },
              news: {
                ...defaultSettings.modules.news,
                ...(savedSettings.modules?.news || {})
              }
            }
          };
          
          setSettings(mergedSettings);
          applySettings(mergedSettings);
        } else {
          // 如果没有保存的设置，使用默认设置
          setSettings(defaultSettings);
          applySettings(defaultSettings);
          // 保存默认设置到本地存储
          saveToStorage('homepage-settings', defaultSettings);
        }
      } catch (error) {
        console.error('初始化设置时出错:', error);
        // 出错时使用默认设置
        setSettings(defaultSettings);
        applySettings(defaultSettings);
      } finally {
        setIsLoaded(true);
      }
    };

    // 延迟初始化以避免闪烁
    const timer = setTimeout(initializeSettings, 100);
    return () => clearTimeout(timer);
  }, [applySettings]);

  // 更新设置
  const updateSettings = useCallback((newSettings) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      setSettings(updatedSettings);
      applySettings(updatedSettings);
      saveToStorage('homepage-settings', updatedSettings);
    } catch (error) {
      console.error('更新设置时出错:', error);
    }
  }, [settings, applySettings]);

  // 更新特定设置
  const updateSpecificSettings = useCallback((path, value) => {
    try {
      const pathArray = path.split('.');
      const updatedSettings = { ...settings };
      
      // 深度设置值
      let current = updatedSettings;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }
      current[pathArray[pathArray.length - 1]] = value;
      
      setSettings(updatedSettings);
      applySettings(updatedSettings);
      saveToStorage('homepage-settings', updatedSettings);
    } catch (error) {
      console.error('更新特定设置时出错:', error);
    }
  }, [settings, applySettings]);

  // 重置设置
  const resetSettings = useCallback(() => {
    try {
      setSettings(defaultSettings);
      applySettings(defaultSettings);
      saveToStorage('homepage-settings', defaultSettings);
    } catch (error) {
      console.error('重置设置时出错:', error);
    }
  }, [applySettings]);

  const contextValue = {
    settings,
    isLoaded,
    updateSettings,
    updateSpecificSettings,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// 自定义 hook 用于使用设置
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;