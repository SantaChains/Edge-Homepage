import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import configManager from '../../utils/simpleConfigManager';
import backgroundManager from '../../utils/backgroundManager';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const PreLoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme === 'dark' ? '#121212' : '#ffffff'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
  animation: ${fadeIn} 0.3s ease;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  border-top: 3px solid #4a90e2;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333'};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const LoadingSubText = styled.div`
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#666'};
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4a90e2, #5ba0f2);
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const PreLoader = ({ onLoadComplete, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('正在初始化...');
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadApp = async () => {
      try {
        // 步骤1: 检测主题
        setLoadingText('检测主题设置...');
        setProgress(10);
        
        const savedTheme = localStorage.getItem('homepage-theme') || 'light';
        setTheme(savedTheme);
        
        // 应用主题到文档
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        await new Promise(resolve => setTimeout(resolve, 200));

        // 步骤2: 初始化配置管理器
        setLoadingText('加载配置文件...');
        setProgress(30);
        
        await configManager.initialize();
        await new Promise(resolve => setTimeout(resolve, 300));

        // 步骤3: 初始化背景管理器
        setLoadingText('初始化背景系统...');
        setProgress(50);
        
        if (!backgroundManager.isInitialized) {
          backgroundManager.initialize();
        }
        await new Promise(resolve => setTimeout(resolve, 200));

        // 步骤4: 应用保存的设置
        setLoadingText('应用用户设置...');
        setProgress(70);
        
        const settings = configManager.get('settings', {});
        if (Object.keys(settings).length > 0) {
          // 应用主题设置
          if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
            setTheme(settings.theme);
          }
          
          // 应用背景设置
          backgroundManager.applySettings(settings);
          
          // 应用CSS变量
          applyGlobalSettings(settings);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));

        // 步骤5: 完成加载
        setLoadingText('准备就绪');
        setProgress(100);
        
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsLoading(false);
        setTimeout(() => {
          onLoadComplete && onLoadComplete();
        }, 500);

      } catch (error) {
        console.error('应用加载失败:', error);
        setLoadingText('加载失败，使用默认设置');
        
        // 即使失败也要完成加载
        setTimeout(() => {
          setIsLoading(false);
          onLoadComplete && onLoadComplete();
        }, 1000);
      }
    };

    loadApp();
  }, [onLoadComplete]);

  const applyGlobalSettings = (settings) => {
    const root = document.documentElement;
    
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
  };

  if (!isLoading) {
    return children;
  }

  return (
    <PreLoaderContainer theme={theme}>
      <LoadingSpinner theme={theme} />
      <LoadingText theme={theme}>{loadingText}</LoadingText>
      <LoadingSubText theme={theme}>
        正在为您准备个性化体验
      </LoadingSubText>
      <ProgressBar theme={theme}>
        <ProgressFill progress={progress} />
      </ProgressBar>
    </PreLoaderContainer>
  );
};

export default PreLoader;