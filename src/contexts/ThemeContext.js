import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

// 创建上下文
const ThemeContext = createContext();

// 主题提供者组件
export const ThemeProvider = ({ children }) => {
  // 状态
  const [theme, setTheme] = useState('light');
  
  // 初始化主题
  useEffect(() => {
    const savedTheme = getFromStorage('homepage-theme', 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  
  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 添加额外的深色模式适配
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    saveToStorage('homepage-theme', newTheme);
  };
  
  // 设置特定主题
  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
    saveToStorage('homepage-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子，用于访问主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider内部使用');
  }
  return context;
};