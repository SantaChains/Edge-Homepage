import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import configManager from '../utils/simpleConfigManager';
import backgroundManager from '../utils/backgroundManager';

// 默认设置
const DEFAULT_SETTINGS = {
  theme: 'light',
  backgroundType: 'color',
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundOpacity: 1,
  backgroundBrightness: 1,
  backgroundBlur: 0,
  backgroundFit: 'cover',
  textColor: '#333333',
  linkColor: '#4a90e2',
  fontFamily: 'Arial, sans-serif',
  gradientType: 'linear',
  gradientDirection: 'to right',
  gradientColors: ['#4a90e2', '#9b59b6'],
  gradientStops: [0, 100],
  showBackground: true,
  startupModuleType: 'last',
  startupModule: 'quote'
};

// Action 类型
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_SETTING: 'UPDATE_SETTING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED'
};

// Reducer
const settingsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTIONS.SET_SETTINGS:
      return { 
        ...state, 
        settings: { ...DEFAULT_SETTINGS, ...action.payload },
        isLoading: false,
        error: null
      };
    
    case ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value
        }
      };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTIONS.SET_INITIALIZED:
      return { ...state, isInitialized: action.payload };
    
    default:
      return state;
  }
};

// 初始状态
const initialState = {
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  isInitialized: false,
  error: null
};

// Context
const EnhancedSettingsContext = createContext();

// Provider 组件
export const EnhancedSettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // 应用设置到页面
  const applySettings = useCallback((settings) => {
    try {
      const root = document.documentElement;
      
      // 应用主题
      if (settings.theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.style.setProperty('--background-color', '#121212');
        root.style.setProperty('--card-background', '#1e1e1e');
        root.style.setProperty('--border-color', '#333333');
        root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--text-color', '#e0e0e0');
        root.style.setProperty('--text-secondary-color', '#a0a0a0');
      } else {
        root.setAttribute('data-theme', 'light');
        root.style.setProperty('--background-color', '#ffffff');
        root.style.setProperty('--card-background', '#f8f8f8');
        root.style.setProperty('--border-color', '#e0e0e0');
        root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--text-secondary-color', '#666666');
      }
      
      // 应用颜色设置
      if (settings.textColor) {
        root.style.setProperty('--text-color', settings.textColor);
      }
      if (settings.linkColor) {
        root.style.setProperty('--primary-color', settings.linkColor);
      }
      
      // 应用字体设置
      if (settings.fontFamily) {
        root.style.setProperty('--font-family', settings.fontFamily);
      }
      
      // 确保背景管理器已初始化，然后应用背景设置
      if (!backgroundManager.isInitialized) {
        backgroundManager.initialize();
      }
      backgroundManager.applySettings(settings);
      
      console.log('设置应用成功');
    } catch (error) {
      console.error('应用设置失败:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: '应用设置失败' });
    }
  }, []);

  // 初始化设置
  const initializeSettings = useCallback(async () => {
    if (state.isInitialized) return;
    
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      await configManager.initialize();
      const loadedSettings = configManager.get('settings', {});
      
      const mergedSettings = { ...DEFAULT_SETTINGS, ...loadedSettings };
      
      dispatch({ type: ACTIONS.SET_SETTINGS, payload: mergedSettings });
      dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });
      
      // 应用设置
      applySettings(mergedSettings);
      
      console.log('设置初始化成功');
    } catch (error) {
      console.error('设置初始化失败:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: '设置初始化失败' });
      
      // 使用默认设置
      dispatch({ type: ACTIONS.SET_SETTINGS, payload: DEFAULT_SETTINGS });
      dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });
      applySettings(DEFAULT_SETTINGS);
    }
  }, [state.isInitialized, applySettings]);

  // 更新单个设置
  const updateSetting = useCallback(async (key, value) => {
    try {
      // 立即更新状态
      dispatch({ type: ACTIONS.UPDATE_SETTING, payload: { key, value } });
      
      // 获取更新后的设置
      const updatedSettings = { ...state.settings, [key]: value };
      
      // 立即应用设置
      applySettings(updatedSettings);
      
      // 异步保存
      configManager.set(`settings.${key}`, value).catch(error => {
        console.error('保存设置失败:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: '保存设置失败' });
      });
      
    } catch (error) {
      console.error('更新设置失败:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: '更新设置失败' });
    }
  }, [state.settings, applySettings]);

  // 批量更新设置
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const mergedSettings = { ...state.settings, ...newSettings };
      
      dispatch({ type: ACTIONS.SET_SETTINGS, payload: mergedSettings });
      applySettings(mergedSettings);
      
      // 异步保存所有设置
      Object.entries(newSettings).forEach(([key, value]) => {
        configManager.set(`settings.${key}`, value).catch(error => {
          console.error(`保存设置 ${key} 失败:`, error);
        });
      });
      
    } catch (error) {
      console.error('批量更新设置失败:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: '批量更新设置失败' });
    }
  }, [state.settings, applySettings]);

  // 重置设置
  const resetSettings = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_SETTINGS, payload: DEFAULT_SETTINGS });
      applySettings(DEFAULT_SETTINGS);
      
      await configManager.resetConfig();
      console.log('设置已重置');
    } catch (error) {
      console.error('重置设置失败:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: '重置设置失败' });
    }
  }, [applySettings]);

  // 清除错误
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // 自动初始化
  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  const value = {
    ...state,
    updateSetting,
    updateSettings,
    resetSettings,
    clearError,
    initializeSettings,
    applySettings
  };

  return (
    <EnhancedSettingsContext.Provider value={value}>
      {children}
    </EnhancedSettingsContext.Provider>
  );
};

// Hook
export const useEnhancedSettings = () => {
  const context = useContext(EnhancedSettingsContext);
  if (!context) {
    throw new Error('useEnhancedSettings must be used within EnhancedSettingsProvider');
  }
  return context;
};

export default EnhancedSettingsContext;