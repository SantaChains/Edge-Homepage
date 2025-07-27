import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import appInitializer from './utils/appInitializer';
import configManager from './utils/simpleConfigManager';

// 组件导入
import Header from './components/Header/Header';
import Search from './components/Search/Search';
import ModuleSwitch from './components/ModuleSwitch/ModuleSwitch';
import EnhancedSettingsPanel from './settings/EnhancedSettingsPanel';
import Loading from './components/Loading/Loading';

// 模块导入
import Calendar from './modules/Calendar/Calendar';
import Bookmark from './modules/Bookmark/Bookmark';
import Todo from './modules/Todo/Todo';
import Note from './modules/Note/Note';
import Quote from './modules/Quote/Quote';
import News from './modules/News/News';

// 模式导入
import ZenMode from './modes/ZenMode/ZenMode';
import CurtainMode from './modes/CurtainMode/CurtainMode';

const AppContainer = styled.div`
  min-height: 100vh;
  background: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: var(--font-family, 'Microsoft YaHei', sans-serif);
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;


const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  text-align: center;
  padding: 20px;
`;

const ErrorContent = styled.div`
  max-width: 500px;
  
  h2 {
    color: #e74c3c;
    margin-bottom: 15px;
  }
  
  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  button {
    background: var(--primary-color, #4a90e2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    
    &:hover {
      opacity: 0.9;
    }
  }
`;

// 模块映射
const moduleComponents = {
  calendar: Calendar,
  bookmark: Bookmark,
  todo: Todo,
  note: Note,
  quote: Quote,
  news: News
};

function App() {
  const [currentModule, setCurrentModule] = useState('quote');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('normal');
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 错误边界处理
  const handleError = useCallback((error, errorInfo) => {
    console.error('应用错误:', error, errorInfo);
    setError(error);
  }, []);

  // 初始化应用
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // 使用应用启动管理器初始化
        const result = await appInitializer.initialize({
          delay: 150, // 减少延迟，提升响应速度
          showLoadingScreen: false // 使用自己的加载组件
        });
        
        if (result.success) {
          setCurrentModule(result.startupModule);
          setIsInitialized(true);
          console.log('✅ 应用初始化完成');
          console.log('📱 启动模块:', result.startupModule);
          console.log('⚙️ 设置已应用:', Object.keys(result.settings).length, '项配置');
        } else {
          console.error('❌ 应用初始化失败:', result.error);
          handleError(result.error || new Error(result.message));
          // 即使失败也设置默认状态
          setCurrentModule('quote');
          setIsInitialized(true);
        }
        
      } catch (error) {
        console.error('💥 初始化应用时出错:', error);
        handleError(error);
        // 设置默认状态
        setCurrentModule('quote');
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [handleError]);

  // 处理模块切换
  const handleModuleChange = useCallback((module) => {
    try {
      if (moduleComponents[module]) {
        setCurrentModule(module);
        // 保存当前模块为上次使用的模块
        configManager.set('data.lastActiveModule', module);
      }
    } catch (error) {
      console.error('切换模块时出错:', error);
      handleError(error);
    }
  }, [handleError]);

  // 处理设置更新
  const handleSettingsUpdate = useCallback((newSettings) => {
    try {
      // 使用应用启动管理器更新设置
      appInitializer.updateSettings(newSettings);
    } catch (error) {
      console.error('更新设置时出错:', error);
    }
  }, []);

  // 处理模式切换
  const handleModeChange = useCallback((mode) => {
    try {
      setCurrentMode(mode);
    } catch (error) {
      console.error('切换模式时出错:', error);
      handleError(error);
    }
  }, [handleError]);

  // 渲染当前模块
  const renderCurrentModule = useCallback(() => {
    try {
      const ModuleComponent = moduleComponents[currentModule];
      if (!ModuleComponent) {
        return <div>模块不存在: {currentModule}</div>;
      }
      return <ModuleComponent />;
    } catch (error) {
      console.error('渲染模块时出错:', error);
      return <div>模块加载失败，请刷新页面重试</div>;
    }
  }, [currentModule]);

  // 错误状态
  if (error) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <h2>应用出现错误</h2>
          <p>抱歉，应用遇到了一个错误。请尝试刷新页面。</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary-color)' }}>
            错误信息: {error.message}
          </p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </ErrorContent>
      </ErrorContainer>
    );
  }

  // 加载状态
  if (isLoading || !isInitialized) {
    return <Loading text="正在加载..." subtext="请稍候，正在初始化应用程序" />;
  }

  // 特殊模式渲染
  if (currentMode === 'zen') {
    return (
      <ThemeProvider>
        <SettingsProvider>
          <ZenMode onBack={() => handleModeChange('normal')} />
        </SettingsProvider>
      </ThemeProvider>
    );
  }

  if (currentMode === 'curtain') {
    return (
      <ThemeProvider>
        <SettingsProvider>
          <CurtainMode onBack={() => handleModeChange('normal')} />
        </SettingsProvider>
      </ThemeProvider>
    );
  }

  // 正常模式渲染
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppContainer>
          <Header 
            onSettingsClick={() => setIsSettingsOpen(true)}
            onModeChange={handleModeChange}
            currentMode={currentMode}
            showBackButton={false}
            onBackClick={() => {}}
          />
          
          <MainContent>
            <Search />
            
            <ModuleSwitch 
              activeModule={currentModule}
              onModuleChange={handleModuleChange}
            />
            
            {renderCurrentModule()}
          </MainContent>
          
        <EnhancedSettingsPanel 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSettingsUpdate={handleSettingsUpdate}
        />
        </AppContainer>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;