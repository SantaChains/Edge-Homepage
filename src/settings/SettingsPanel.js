import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import configManager from '../utils/simpleConfigManager';
import backgroundManager from '../utils/backgroundManager';
import { handleUrlChange } from '../utils/urlHandler';

// 图标导入
import CloseIcon from '@mui/icons-material/Close';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';

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
`;

const SettingsTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--primary-color);
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
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: var(--primary-color);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 14px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 10px 0;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  font-size: 12px;
  color: var(--text-secondary-color);
  display: block;
  text-align: right;
  margin-top: 5px;
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 45px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
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
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
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
    transform: translateX(26px);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;

const SwitchLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const GradientPreview = styled.div`
  width: 100%;
  height: 50px;
  border-radius: 6px;
  margin-top: 10px;
  background: ${props => props.gradient};
  border: 1px solid var(--border-color);
  position: relative;
  
  &::after {
    content: '预览';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: #3a7bc8;
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background-color: var(--card-background);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }
  }
  
  &.danger {
    background-color: #e74c3c;
    color: white;
    
    &:hover {
      background-color: #c0392b;
      transform: translateY(-1px);
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 10px 16px;
  background-color: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 120px;
  margin-top: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--background-color);
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const StatusMessage = styled.div`
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 14px;
  
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
`;

const ConfigStats = styled.div`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 15px;
  margin-top: 15px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    
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

const SettingsPanel = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [configStats, setConfigStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const fileInputRef = useRef(null);
  const importRef = useRef(null);
  const settingsRef = useRef(settings);

  // 显示状态消息
  const showStatus = (message, type = 'info') => {
    setStatusMessage({ text: message, type });
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // 同步设置引用
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // 初始化配置管理器
  useEffect(() => {
    const initializeConfig = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        
        // 确保配置管理器已初始化
        await configManager.initialize();
        
        // 加载设置
        const loadedSettings = configManager.get('settings', {});
        
        // 防止空设置导致的问题
        const mergedSettings = {
          theme: 'light',
          backgroundType: 'color',
          backgroundColor: '#ffffff',
          showBackground: true,
          textColor: '#333333',
          linkColor: '#4a90e2',
          fontFamily: 'Arial, sans-serif',
          ...loadedSettings
        };
        
        setSettings(mergedSettings);
        
        if (mergedSettings.backgroundImage) {
          setImagePreview(mergedSettings.backgroundImage);
        }
        
        // 确保背景管理器已初始化
        if (!backgroundManager.isInitialized) {
          backgroundManager.initialize();
        }
        
        // 应用设置
        applySettings(mergedSettings);
        
        // 加载统计信息
        setConfigStats(configManager.getStats());
        
        setIsInitialized(true);
        showStatus('配置加载成功', 'success');
      } catch (error) {
        console.error('配置初始化失败:', error);
        showStatus('配置加载失败，使用默认设置', 'error');
        
        // 使用默认设置
        const defaultSettings = {
          theme: 'light',
          backgroundType: 'color',
          backgroundColor: '#ffffff',
          showBackground: true,
          textColor: '#333333',
          linkColor: '#4a90e2',
          fontFamily: 'Arial, sans-serif'
        };
        
        setSettings(defaultSettings);
        applySettings(defaultSettings);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && !isInitialized) {
      initializeConfig();
    }
  }, [isOpen, isInitialized]);

  // 处理设置变化
  const handleSettingChange = async (key, value) => {
    try {
      const updatedSettings = { ...settingsRef.current, [key]: value };
      setSettings(updatedSettings);
      
      // 立即应用设置，提供即时反馈
      applySettings(updatedSettings);
      
      // 异步保存到配置管理器
      configManager.set(`settings.${key}`, value).catch(error => {
        console.error('保存设置失败:', error);
        showStatus('保存设置失败', 'error');
      });
      
      // 更新统计信息
      const stats = configManager.getStats();
      if (stats) {
        setConfigStats(stats);
      }
      
    } catch (error) {
      console.error('应用设置失败:', error);
      showStatus('应用设置失败', 'error');
    }
  };

  // 处理渐变颜色变化
  const handleGradientColorChange = async (index, value) => {
    const updatedColors = [...(settings.gradientColors || ['#4a90e2', '#9b59b6'])];
    updatedColors[index] = value;
    await handleSettingChange('gradientColors', updatedColors);
  };

  // 处理渐变位置变化
  const handleGradientStopChange = async (index, value) => {
    const updatedStops = [...(settings.gradientStops || [0, 100])];
    updatedStops[index] = parseInt(value);
    await handleSettingChange('gradientStops', updatedStops);
  };

  // 处理图片文件选择
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件大小
      if (file.size > 2 * 1024 * 1024) {
        showStatus('图片文件过大，请选择小于2MB的图片', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImagePreview(imageUrl);
        handleSettingChange('backgroundImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理URL或HTML标签输入
  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    
    const processedUrl = handleUrlChange(value);
    
    if (processedUrl) {
      setImagePreview(processedUrl);
      handleSettingChange('backgroundImage', processedUrl);
    } else {
      const srcMatch = value.match(/src=["'](.*?)["']/);
      if (srcMatch && srcMatch[1]) {
        setImagePreview(srcMatch[1]);
        handleSettingChange('backgroundImage', srcMatch[1]);
      } else {
        setImagePreview(value);
        handleSettingChange('backgroundImage', value);
      }
    }
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    handleSettingChange('theme', newTheme);
  };

  // 导出配置
  const exportConfig = () => {
    try {
      configManager.exportConfig();
      showStatus('配置导出成功', 'success');
    } catch (error) {
      console.error('导出配置失败:', error);
      showStatus('导出配置失败', 'error');
    }
  };

  // 导入配置
  const importConfig = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await configManager.importConfig(file);
        
        // 重新加载设置
        const loadedSettings = configManager.get('settings', {});
        setSettings(loadedSettings);
        
        if (loadedSettings.backgroundImage) {
          setImagePreview(loadedSettings.backgroundImage);
        }
        
        // 应用设置
        applySettings(loadedSettings);
        
        // 更新统计信息
        setConfigStats(configManager.getStats());
        
        showStatus('配置导入成功', 'success');
      } catch (error) {
        console.error('导入配置失败:', error);
        showStatus('导入配置失败，文件格式不正确', 'error');
      }
    }
  };

  // 重置配置
  const resetConfig = async () => {
    if (window.confirm('确定要重置所有配置吗？这将删除所有自定义设置。')) {
      try {
        await configManager.resetConfig();
        
        // 重新加载设置
        const loadedSettings = configManager.get('settings', {});
        setSettings(loadedSettings);
        setImagePreview('');
        
        // 应用设置
        applySettings(loadedSettings);
        
        // 更新统计信息
        setConfigStats(configManager.getStats());
        
        showStatus('配置已重置', 'success');
      } catch (error) {
        console.error('重置配置失败:', error);
        showStatus('重置配置失败', 'error');
      }
    }
  };

  // 强制保存配置
  const forceSave = async () => {
    try {
      await configManager.forceSave();
      showStatus('配置保存成功', 'success');
    } catch (error) {
      console.error('保存配置失败:', error);
      showStatus('保存配置失败', 'error');
    }
  };

  // 应用设置到CSS变量和背景
  const applySettings = (settings) => {
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
    
    // 确保背景管理器已初始化，然后应用背景设置
    try {
      if (!backgroundManager.isInitialized) {
        backgroundManager.initialize();
      }
      backgroundManager.applySettings(settings);
      console.log('背景设置应用成功');
    } catch (error) {
      console.error('应用背景设置失败:', error);
      showStatus('背景设置应用失败', 'error');
    }
  };

  // 生成渐变预览
  const getGradientPreview = () => {
    const { gradientType, gradientDirection, gradientColors, gradientStops } = settings;
    return `${gradientType}-gradient(${gradientDirection}, ${gradientColors[0]} ${gradientStops[0]}%, ${gradientColors[1]} ${gradientStops[1]}%)`;
  };

  // 预览背景设置
  const previewBackground = () => {
    const previewSettings = {
      ...settings,
      showBackground: true
    };
    
    console.log('预览背景设置:', previewSettings);
    console.log('背景管理器状态:', backgroundManager.getCurrentInfo());
    
    backgroundManager.previewSettings(previewSettings);
    showStatus('背景预览中，3秒后恢复', 'info');
  };

  // 调试背景功能
  const debugBackground = () => {
    const info = backgroundManager.getCurrentInfo();
    const debugInfo = {
      backgroundManagerInfo: info,
      currentSettings: settings,
      containerElement: document.getElementById('homepage-background'),
      bodyStyles: {
        background: document.body.style.background,
        backgroundImage: document.body.style.backgroundImage
      }
    };
    
    console.log('背景调试信息:', debugInfo);
    showStatus(`调试信息已输出到控制台`, 'info');
  };

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
        <SettingsTitle>设置中心</SettingsTitle>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </SettingsHeader>
      
      <SettingsContent>
        {statusMessage && (
          <StatusMessage className={statusMessage.type}>
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
            <WallpaperIcon />
            背景设置
          </SectionTitle>
          
          <SwitchContainer>
            <SwitchLabel>显示背景</SwitchLabel>
            <Switch>
              <input 
                type="checkbox" 
                checked={settings.showBackground !== false} 
                onChange={(e) => handleSettingChange('showBackground', e.target.checked)}
              />
              <SwitchSlider />
            </Switch>
          </SwitchContainer>
          
          {settings.showBackground !== false && (
            <>
              <FormGroup>
                <Label>背景类型</Label>
                <Select 
                  value={settings.backgroundType || 'color'} 
                  onChange={(e) => handleSettingChange('backgroundType', e.target.value)}
                >
                  <option value="color">纯色</option>
                  <option value="image">图片</option>
                  <option value="gradient">渐变</option>
                </Select>
              </FormGroup>
              
              {settings.backgroundType === 'color' && (
                <FormGroup>
                  <Label>背景颜色</Label>
                  <ColorPicker 
                    type="color" 
                    value={settings.backgroundColor || '#ffffff'} 
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  />
                </FormGroup>
              )}
              
              {settings.backgroundType === 'image' && (
                <>
                  <FormGroup>
                    <Label>背景图片</Label>
                    <FileInputLabel>
                      <WallpaperIcon />
                      选择本地图片
                      <FileInput 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </FileInputLabel>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>或输入图片URL/HTML标签</Label>
                    <Input 
                      type="text" 
                      value={settings.backgroundImage || ''} 
                      onChange={handleImageUrlChange}
                      placeholder="输入URL或HTML标签的src属性"
                    />
                  </FormGroup>
                  
                  {imagePreview && (
                    <ImagePreview>
                      <img src={imagePreview} alt="背景预览" />
                    </ImagePreview>
                  )}
                  
                  <FormGroup>
                    <Label>适应方式</Label>
                    <Select 
                      value={settings.backgroundFit || 'cover'} 
                      onChange={(e) => handleSettingChange('backgroundFit', e.target.value)}
                    >
                      <option value="cover">填充</option>
                      <option value="contain">适应</option>
                      <option value="100% 100%">拉伸</option>
                      <option value="repeat">平铺</option>
                      <option value="auto">居中</option>
                    </Select>
                  </FormGroup>
                </>
              )}
              
              {settings.backgroundType === 'gradient' && (
                <>
                  <FormGroup>
                    <Label>渐变类型</Label>
                    <Select 
                      value={settings.gradientType || 'linear'} 
                      onChange={(e) => handleSettingChange('gradientType', e.target.value)}
                    >
                      <option value="linear">线性渐变</option>
                      <option value="radial">径向渐变</option>
                    </Select>
                  </FormGroup>
                  
                  {settings.gradientType === 'linear' && (
                    <FormGroup>
                      <Label>渐变方向</Label>
                      <Select 
                        value={settings.gradientDirection || 'to right'} 
                        onChange={(e) => handleSettingChange('gradientDirection', e.target.value)}
                      >
                        <option value="to right">从左到右</option>
                        <option value="to left">从右到左</option>
                        <option value="to bottom">从上到下</option>
                        <option value="to top">从下到上</option>
                        <option value="to bottom right">左上到右下</option>
                        <option value="to bottom left">右上到左下</option>
                        <option value="to top right">左下到右上</option>
                        <option value="to top left">右下到左上</option>
                      </Select>
                    </FormGroup>
                  )}
                  
                  <FormGroup>
                    <Label>颜色1</Label>
                    <ColorPicker 
                      type="color" 
                      value={(settings.gradientColors && settings.gradientColors[0]) || '#4a90e2'} 
                      onChange={(e) => handleGradientColorChange(0, e.target.value)}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>位置1</Label>
                    <Slider 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={(settings.gradientStops && settings.gradientStops[0]) || 0} 
                      onChange={(e) => handleGradientStopChange(0, e.target.value)}
                    />
                    <SliderValue>{(settings.gradientStops && settings.gradientStops[0]) || 0}%</SliderValue>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>颜色2</Label>
                    <ColorPicker 
                      type="color" 
                      value={(settings.gradientColors && settings.gradientColors[1]) || '#9b59b6'} 
                      onChange={(e) => handleGradientColorChange(1, e.target.value)}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>位置2</Label>
                    <Slider 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={(settings.gradientStops && settings.gradientStops[1]) || 100} 
                      onChange={(e) => handleGradientStopChange(1, e.target.value)}
                    />
                    <SliderValue>{(settings.gradientStops && settings.gradientStops[1]) || 100}%</SliderValue>
                  </FormGroup>
                  
                  <GradientPreview gradient={getGradientPreview()} />
                </>
              )}
              
              <FormGroup>
                <Label>透明度</Label>
                <Slider 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={settings.backgroundOpacity || 1} 
                  onChange={(e) => handleSettingChange('backgroundOpacity', parseFloat(e.target.value))}
                />
                <SliderValue>{Math.round((settings.backgroundOpacity || 1) * 100)}%</SliderValue>
              </FormGroup>
              
              <FormGroup>
                <Label>亮度</Label>
                <Slider 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1" 
                  value={settings.backgroundBrightness || 1} 
                  onChange={(e) => handleSettingChange('backgroundBrightness', parseFloat(e.target.value))}
                />
                <SliderValue>{Math.round((settings.backgroundBrightness || 1) * 100)}%</SliderValue>
              </FormGroup>
              
              <FormGroup>
                <Label>模糊</Label>
                <Slider 
                  type="range" 
                  min="0" 
                  max="20" 
                  value={settings.backgroundBlur || 0} 
                  onChange={(e) => handleSettingChange('backgroundBlur', parseInt(e.target.value))}
                />
                <SliderValue>{settings.backgroundBlur || 0}px</SliderValue>
              </FormGroup>
              
              <ButtonGroup>
                <Button className="secondary" onClick={previewBackground}>
                  <WallpaperIcon />
                  预览背景
                </Button>
                <Button className="secondary" onClick={debugBackground}>
                  <InfoIcon />
                  调试背景
                </Button>
              </ButtonGroup>
            </>
          )}
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
            所有数据现在存储在根目录的 config.json 文件中，减少了内存占用并提供了更好的数据管理。
            配置文件会自动保存，您也可以手动导出备份。
          </p>
        </SettingsSection>
      </SettingsContent>
    </SettingsContainer>
  );
};

export default SettingsPanel;
