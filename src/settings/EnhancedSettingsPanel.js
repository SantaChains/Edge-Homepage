import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import configManager from '../utils/simpleConfigManager';
import backgroundManager from '../utils/backgroundManager';

// 图标导入
import CloseIcon from '@mui/icons-material/Close';
// import WallpaperIcon from '@mui/icons-material/Wallpaper'; // 暂时未使用
import TextFormatIcon from '@mui/icons-material/TextFormat';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const SettingsContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-420px'};
  width: 420px;
  height: 100vh;
  background-color: var(--card-background);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--primary-color), #3a7bc8);
  color: white;
`;

const SettingsTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const SettingsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const SettingsSection = styled.div`
  margin-bottom: 30px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
  
  svg {
    color: var(--primary-color);
    font-size: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;

// const Slider = styled.input` // 暂时未使用
// const SliderValue = styled.span` // 暂时未使用

const ColorPicker = styled.input`
  width: 100%;
  height: 50px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 30px;
  
  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + & {
    background-color: var(--primary-color);
  }
  
  input:checked + &:before {
    transform: translateX(30px);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const SwitchLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: #3a7bc8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
    }
  }
  
  &.secondary {
    background-color: var(--card-background);
    color: var(--text-color);
    border: 2px solid var(--border-color);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
      border-color: var(--primary-color);
    }
  }
  
  &.danger {
    background-color: #e74c3c;
    color: white;
    
    &:hover {
      background-color: #c0392b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 12px 18px;
  background-color: var(--card-background);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    border-color: var(--primary-color);
  }
`;

const StatusMessage = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  
  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.info {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
  
  &.warning {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }
`;

const ConfigStats = styled.div`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .stat-label {
    color: var(--text-secondary-color);
  }
  
  .stat-value {
    font-weight: bold;
    color: var(--primary-color);
  }
`;

const EnhancedSettingsPanel = ({ isOpen, onClose, onSettingsUpdate }) => {
  const [settings, setSettings] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [configStats, setConfigStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const saveTimeoutRef = useRef(null);
  const importRef = useRef(null);


  // 显示状态消息
  const showStatus = useCallback((message, type = 'info') => {
    const icons = {
      success: <CheckCircleIcon />,
      error: <ErrorIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />
    };
    
    setStatusMessage({ 
      text: message, 
      type, 
      icon: icons[type] || icons.info 
    });
    
    setTimeout(() => setStatusMessage(''), 4000);
  }, []);

  // 防抖保存函数
  const debouncedSave = useCallback((key, value) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await configManager.set(`settings.${key}`, value);
        setHasUnsavedChanges(false);
        showStatus('设置已保存', 'success');
      } catch (error) {
        console.error('保存设置失败:', error);
        showStatus('保存设置失败', 'error');
      }
    }, 500);
  }, [showStatus]);

  // 应用设置到CSS变量和背景
  const applySettings = useCallback((settings) => {
    const root = document.documentElement;
    
    // 应用主题
    if (settings.theme === 'dark') {
      root.style.setProperty('--background-color', '#121212');
      root.style.setProperty('--card-background', '#1e1e1e');
      root.style.setProperty('--border-color', '#333333');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--text-color', '#e0e0e0');
      root.style.setProperty('--text-secondary-color', '#a0a0a0');
    } else {
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
    
    // 使用背景管理器应用背景设置
    backgroundManager.applySettings(settings);
  }, []);

  // 初始化配置管理器
  useEffect(() => {
    const initializeConfig = async () => {
      try {
        setIsLoading(true);
        await configManager.initialize();
        
        // 加载设置
        const loadedSettings = configManager.get('settings', {});
        setSettings(loadedSettings);
        
        // 应用设置
        applySettings(loadedSettings);
        
        // 加载统计信息
        setConfigStats(configManager.getStats());
        
        showStatus('配置加载成功', 'success');
      } catch (error) {
        console.error('配置初始化失败:', error);
        showStatus('配置加载失败，使用默认设置', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      initializeConfig();
    }
  }, [isOpen, showStatus, applySettings]);

  // 处理设置变化
  const handleSettingChange = useCallback(async (key, value) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      setHasUnsavedChanges(true);
      
      // 立即应用设置
      applySettings(updatedSettings);
      
      // 通知父组件设置已更新
      if (onSettingsUpdate) {
        onSettingsUpdate(updatedSettings);
      }
      
      // 防抖保存
      debouncedSave(key, value);
      
      // 更新统计信息
      setConfigStats(configManager.getStats());
      
    } catch (error) {
      console.error('处理设置变化失败:', error);
      showStatus('设置更新失败', 'error');
    }
  }, [settings, debouncedSave, showStatus, onSettingsUpdate]);

  // 切换主题
  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    handleSettingChange('theme', newTheme);
  }, [settings.theme, handleSettingChange]);

  // 导出配置
  const exportConfig = useCallback(() => {
    try {
      configManager.exportConfig();
      showStatus('配置导出成功', 'success');
    } catch (error) {
      console.error('导出配置失败:', error);
      showStatus('导出配置失败', 'error');
    }
  }, [showStatus]);

  // 导入配置
  const importConfig = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await configManager.importConfig(file);
        
        // 重新加载设置
        const loadedSettings = configManager.get('settings', {});
        setSettings(loadedSettings);
        
        // 应用设置
        applySettings(loadedSettings);
        
        // 通知父组件设置已更新
        if (onSettingsUpdate) {
          onSettingsUpdate(loadedSettings);
        }
        
        // 更新统计信息
        setConfigStats(configManager.getStats());
        
        showStatus('配置导入成功', 'success');
      } catch (error) {
        console.error('导入配置失败:', error);
        showStatus('导入配置失败，文件格式不正确', 'error');
      }
    }
  }, [showStatus, onSettingsUpdate, applySettings]);

  // 重置配置
  const resetConfig = useCallback(async () => {
    if (window.confirm('确定要重置所有配置吗？这将删除所有自定义设置。')) {
      try {
        await configManager.resetConfig();
        
        // 重新加载设置
        const loadedSettings = configManager.get('settings', {});
        setSettings(loadedSettings);
        
        // 应用设置
        applySettings(loadedSettings);
        
        // 通知父组件设置已更新
        if (onSettingsUpdate) {
          onSettingsUpdate(loadedSettings);
        }
        
        // 更新统计信息
        setConfigStats(configManager.getStats());
        
        showStatus('配置已重置', 'success');
      } catch (error) {
        console.error('重置配置失败:', error);
        showStatus('重置配置失败', 'error');
      }
    }
  }, [showStatus, onSettingsUpdate, applySettings]);

  // 强制保存配置
  const forceSave = useCallback(async () => {
    try {
      await configManager.forceSave();
      setHasUnsavedChanges(false);
      showStatus('配置保存成功', 'success');
    } catch (error) {
      console.error('保存配置失败:', error);
      showStatus('保存配置失败', 'error');
    }
  }, [showStatus]);

  // 应用设置到CSS变量和背景
  if (isLoading) {
    return (
      <SettingsContainer isOpen={isOpen}>
        <SettingsHeader>
          <SettingsTitle>设置</SettingsTitle>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </SettingsHeader>
        <SettingsContent>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <StorageIcon style={{ fontSize: '48px', color: 'var(--primary-color)' }} />
            <p>正在加载配置...</p>
          </div>
        </SettingsContent>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer isOpen={isOpen}>
      <SettingsHeader>
        <SettingsTitle>
          增强设置中心
          {hasUnsavedChanges && <span style={{ fontSize: '12px', opacity: 0.8 }}> (有未保存的更改)</span>}
        </SettingsTitle>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </SettingsHeader>
      
      <SettingsContent>
        {statusMessage && (
          <StatusMessage className={statusMessage.type}>
            {statusMessage.icon}
            {statusMessage.text}
          </StatusMessage>
        )}

        <SettingsSection>
          <SectionTitle>
            <DarkModeIcon />
            主题设置
          </SectionTitle>
          
          <SwitchContainer>
            <SwitchLabel>深色模式</SwitchLabel>
            <Switch>
              <input 
                type="checkbox" 
                checked={settings.theme === 'dark'} 
                onChange={toggleTheme}
              />
              <SwitchSlider />
            </Switch>
          </SwitchContainer>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>
            <HomeIcon />
            启动界面
          </SectionTitle>
          
          <FormGroup>
            <Label>启动时显示</Label>
            <Select 
              value={settings.startupModuleType || 'last'} 
              onChange={(e) => handleSettingChange('startupModuleType', e.target.value)}
            >
              <option value="last">继承上次界面</option>
              <option value="specific">指定界面</option>
            </Select>
          </FormGroup>
          
          {settings.startupModuleType === 'specific' && (
            <FormGroup>
              <Label>指定界面</Label>
              <Select 
                value={settings.startupModule || 'quote'} 
                onChange={(e) => handleSettingChange('startupModule', e.target.value)}
              >
                <option value="calendar">📅 日历</option>
                <option value="bookmark">🔖 书签</option>
                <option value="todo">✅ 待办</option>
                <option value="note">📝 笔记</option>
                <option value="quote">💭 一语</option>
                <option value="news">📰 新闻</option>
              </Select>
            </FormGroup>
          )}
          
          <ButtonGroup>
            <Button className="secondary" onClick={() => window.location.reload()}>
              <RefreshIcon />
              重新启动
            </Button>
          </ButtonGroup>
        </SettingsSection>
        
        <SettingsSection>
          <SectionTitle>
            <TextFormatIcon />
            文字设置
          </SectionTitle>
          
          <FormGroup>
            <Label>文字颜色</Label>
            <ColorPicker 
              type="color" 
              value={settings.textColor || '#000000'} 
              onChange={(e) => handleSettingChange('textColor', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>链接颜色</Label>
            <ColorPicker 
              type="color" 
              value={settings.linkColor || '#4a90e2'} 
              onChange={(e) => handleSettingChange('linkColor', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>字体</Label>
            <Select 
              value={settings.fontFamily || 'Arial, sans-serif'} 
              onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
              <option value="'SimSun', serif">宋体</option>
              <option value="'SimHei', sans-serif">黑体</option>
              <option value="'KaiTi', serif">楷体</option>
              <option value="'FangSong', serif">仿宋</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
            </Select>
          </FormGroup>
        </SettingsSection>
        
        <SettingsSection>
          <SectionTitle>
            <StorageIcon />
            配置管理
          </SectionTitle>
          
          <ButtonGroup>
            <Button className="primary" onClick={exportConfig}>
              <BackupIcon />
              导出配置
            </Button>
            
            <FileInputLabel>
              <RestoreIcon />
              导入配置
              <FileInput 
                type="file" 
                accept=".json" 
                ref={importRef}
                onChange={importConfig}
              />
            </FileInputLabel>
          </ButtonGroup>
          
          <ButtonGroup>
            <Button className="secondary" onClick={forceSave}>
              <StorageIcon />
              强制保存
            </Button>
            
            <Button className="danger" onClick={resetConfig}>
              <RefreshIcon />
              重置配置
            </Button>
          </ButtonGroup>
          
          {configStats && (
            <ConfigStats>
              <div className="stat-item">
                <span className="stat-label">配置版本:</span>
                <span className="stat-value">{configStats.version}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">最后更新:</span>
                <span className="stat-value">{new Date(configStats.lastUpdated).toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">数据大小:</span>
                <span className="stat-value">{(configStats.dataSize / 1024).toFixed(2)} KB</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">书签数量:</span>
                <span className="stat-value">{configStats.bookmarksCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">待办数量:</span>
                <span className="stat-value">{configStats.todosCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">笔记数量:</span>
                <span className="stat-value">{configStats.notesCount}</span>
              </div>
            </ConfigStats>
          )}
        </SettingsSection>
        
        <SettingsSection>
          <SectionTitle>
            <InfoIcon />
            系统信息
          </SectionTitle>
          
          <ConfigStats>
            <div className="stat-item">
              <span className="stat-label">存储方式:</span>
              <span className="stat-value">config.json 文件</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">自动保存:</span>
              <span className="stat-value">已启用</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">备份间隔:</span>
              <span className="stat-value">24小时</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">配置文件:</span>
              <span className="stat-value">./config.json</span>
            </div>
          </ConfigStats>
          
          <p style={{ fontSize: '12px', color: 'var(--text-secondary-color)', marginTop: '15px' }}>
            增强设置面板提供了更好的用户体验和配置管理功能。
            所有设置都会自动保存，您也可以手动导出备份。
          </p>
        </SettingsSection>
      </SettingsContent>
    </SettingsContainer>
  );
};

export default EnhancedSettingsPanel;