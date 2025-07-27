import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { buildSearchUrl, cleanSearchQuery, isValidUrl } from '../../utils/urlHandler';
import { SettingsContext } from '../../contexts/SettingsContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// 图标导入
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
  position: relative;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(45, 45, 45, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 24px;
  padding: 5px 15px;
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
    : '0 4px 20px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(10px);
  
  &:focus-within {
    box-shadow: ${props => props.theme === 'dark' 
      ? '0 6px 25px rgba(74, 144, 226, 0.3)' 
      : '0 6px 25px rgba(74, 144, 226, 0.2)'};
    transform: translateY(-2px);
    border-color: #4a90e2;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  outline: none;
  
  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#888888' : '#999999'};
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? '#a0a0a0' : '#666666'};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  border-radius: 50%;
  
  &:hover {
    color: #4a90e2;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.1)' 
      : 'rgba(74, 144, 226, 0.1)'};
  }
`;

const CleanButton = styled(SearchButton)`
  margin-right: 5px;
  color: ${props => props.active 
    ? '#4a90e2' 
    : props.theme === 'dark' ? '#a0a0a0' : '#666666'};
  background: ${props => props.active 
    ? props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.2)' 
      : 'rgba(74, 144, 226, 0.1)'
    : 'transparent'};
`;

const EngineButton = styled(SearchButton)`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: 5px;
  font-weight: 500;
  color: #4a90e2;
  padding: 6px 10px;
  border-radius: 12px;
  
  &:hover {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.2)' 
      : 'rgba(74, 144, 226, 0.1)'};
  }
`;

const EngineDropdown = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme === 'dark' 
    ? 'rgba(35, 35, 35, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)'};
  border-radius: 12px;
  box-shadow: ${props => props.theme === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
    : '0 8px 32px rgba(0, 0, 0, 0.15)'};
  padding: 15px;
  z-index: 100;
  width: 90%;
  max-width: 500px;
  display: ${props => props.show ? 'block' : 'none'};
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
`;

const EngineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 15px;
`;

const EngineOption = styled.button`
  background: ${props => props.active 
    ? props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.3)' 
      : 'rgba(74, 144, 226, 0.15)'
    : props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.active 
    ? '#4a90e2' 
    : props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.active 
    ? '#4a90e2' 
    : props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.2)' 
      : 'rgba(74, 144, 226, 0.1)'};
    border-color: #4a90e2;
    color: #4a90e2;
    transform: translateY(-1px);
  }
`;

const CustomEngineForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  padding-top: 15px;
`;

const CustomEngineList = styled.div`
  margin-top: 15px;
  border-top: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  padding-top: 15px;
`;

const CustomEngineItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  margin-bottom: 8px;
  background: ${props => props.isDragging 
    ? props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.2)' 
      : 'rgba(74, 144, 226, 0.1)'
    : props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.03)' 
      : 'rgba(0, 0, 0, 0.02)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.15)' 
      : 'rgba(74, 144, 226, 0.08)'};
    border-color: #4a90e2;
    transform: translateY(-1px);
  }
`;

const DragHandle = styled.div`
  cursor: grab;
  color: ${props => props.theme === 'dark' ? '#888888' : '#999999'};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4a90e2;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const EngineName = styled.div`
  flex: 1;
  font-weight: ${props => props.active ? '500' : 'normal'};
  color: ${props => props.active 
    ? '#4a90e2' 
    : props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  margin-left: 8px;
`;

const EngineUrl = styled.div`
  flex: 2;
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#888888' : '#999999'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? '#888888' : '#999999'};
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #4a90e2;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.1)' 
      : 'rgba(74, 144, 226, 0.1)'};
  }
`;

const TestButton = styled.button`
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.2)' 
      : 'rgba(74, 144, 226, 0.1)'};
    border-color: #4a90e2;
    color: #4a90e2;
  }
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  margin-bottom: 8px;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(74, 144, 226, 0.1)' 
    : 'rgba(74, 144, 226, 0.05)'};
`;

const EditFormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const EditFormButton = styled.button`
  background: ${props => props.primary 
    ? '#4a90e2' 
    : props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.03)'};
  color: ${props => props.primary 
    ? 'white' 
    : props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  border: 1px solid ${props => props.primary 
    ? '#4a90e2' 
    : props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.primary 
      ? '#3a7bc8' 
      : props.theme === 'dark' 
        ? 'rgba(74, 144, 226, 0.2)' 
        : 'rgba(74, 144, 226, 0.1)'};
    border-color: #4a90e2;
    transform: translateY(-1px);
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  width: 80px;
  font-weight: 500;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 6px;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #4a90e2;
    outline: none;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.1)' 
      : 'rgba(74, 144, 226, 0.05)'};
    box-shadow: 0 0 0 3px ${props => props.theme === 'dark' 
      ? 'rgba(74, 144, 226, 0.2)' 
      : 'rgba(74, 144, 226, 0.1)'};
  }
  
  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#888888' : '#999999'};
  }
`;

const AddButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-left: auto;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3a7bc8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const SwitchLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#333333'};
  font-weight: 500;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider2 = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  transition: 0.4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: ${props => props.theme === 'dark' 
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'white'};
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  input:checked + & {
    background: #4a90e2;
  }
  
  input:checked + &:before {
    transform: translateX(20px);
  }
`;

const Search = () => {
  const { settings, updateSpecificSettings } = useContext(SettingsContext);
  const [query, setQuery] = useState('');
  const [autoClean, setAutoClean] = useState(false);
  const [removeNonUrl, setRemoveNonUrl] = useState(false);
  const [engine, setEngine] = useState('bing');
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [customEngineName, setCustomEngineName] = useState('');
  const [customEngineUrl, setCustomEngineUrl] = useState('');
  const [customEngines, setCustomEngines] = useState([]);
  const [editingEngine, setEditingEngine] = useState(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const testQuery = '测试查询[移除]';
  
  const dropdownRef = useRef(null);
  const searchFormRef = useRef(null);
  
  // 获取当前主题
  const currentTheme = (settings && settings.theme) ? settings.theme : 'light';
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        if (dropdownRef.current && searchFormRef.current && event.target) {
          if (!dropdownRef.current.contains(event.target) &&
              !searchFormRef.current.contains(event.target)) {
            setShowEngineDropdown(false);
          }
        }
      } catch (error) {
        console.error('处理点击外部事件时出错:', error);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 初始化设置
  useEffect(() => {
    if (settings && settings.search) {
      setAutoClean(settings.search.autoCleanUrl || false);
      setRemoveNonUrl(settings.search.removeNonUrl || false);
      setEngine(settings.search.defaultEngine || 'bing');
      setCustomEngines(Array.isArray(settings.search.customEngines) ? settings.search.customEngines : []);
    }
  }, [settings]);
  
  // 处理搜索提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      let processedQuery = query;
      let originalIsUrl = false;
      
      // 首先检查原始查询是否是有效URL
      if (isValidUrl && (isValidUrl(query) || query.startsWith('file:/') || query.startsWith('http'))) {
        originalIsUrl = true;
        
        // 如果是URL，直接跳转
        if (!autoClean) {
          if (settings && settings.search && settings.search.openInNewTab) {
            window.open(query, '_blank');
          } else {
            window.location.href = query;
          }
          return;
        }
      }
      
      // 如果启用了URL清理
      if (autoClean && cleanSearchQuery) {
        processedQuery = cleanSearchQuery(query);
        
        // 如果清理后的查询是有效URL，直接跳转
        if (isValidUrl && (isValidUrl(processedQuery) || processedQuery.startsWith('file:/') || processedQuery.startsWith('http'))) {
          if (settings && settings.search && settings.search.openInNewTab) {
            window.open(processedQuery, '_blank');
          } else {
            window.location.href = processedQuery;
          }
          return;
        }
        
        // 如果原始查询是URL但清理后不是，使用原始URL
        if (originalIsUrl) {
          if (settings && settings.search && settings.search.openInNewTab) {
            window.open(query, '_blank');
          } else {
            window.location.href = query;
          }
          return;
        }
      }
      
      // 如果不是URL，使用搜索引擎
      const customEngine = Array.isArray(customEngines) ? customEngines.find(e => e && e.id === engine) : null;
      
      let searchUrl;
      if (customEngine && customEngine.url) {
        searchUrl = customEngine.url.replace('{query}', encodeURIComponent(processedQuery));
      } else if (buildSearchUrl) {
        searchUrl = buildSearchUrl(processedQuery, engine, removeNonUrl, customEngines);
      } else {
        // 后备搜索URL
        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(processedQuery)}`;
      }
      
      if (settings && settings.search && settings.search.openInNewTab) {
        window.open(searchUrl, '_blank');
      } else {
        window.location.href = searchUrl;
      }
    } catch (error) {
      console.error('搜索处理错误:', error);
      // 使用默认搜索引擎作为后备
      const backupUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      window.open(backupUrl, '_blank');
    }
  };
  
  // 处理输入变化
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  // 切换自动清理URL
  const toggleAutoClean = () => {
    const newValue = !autoClean;
    setAutoClean(newValue);
    if (updateSpecificSettings) {
      updateSpecificSettings('search.autoCleanUrl', newValue);
    }
  };
  
  // 切换移除非URL字符
  // const toggleRemoveNonUrl = () => {
  //   const newValue = !removeNonUrl;
  //   setRemoveNonUrl(newValue);
  //   if (updateSpecificSettings) {
  //     updateSpecificSettings('search.removeNonUrl', newValue);
  //   }
  // };
  
  // 切换搜索引擎
  const changeEngine = (newEngine) => {
    setEngine(newEngine);
    if (updateSpecificSettings) {
      updateSpecificSettings('search.defaultEngine', newEngine);
    }
    setShowEngineDropdown(false);
  };
  
  // 添加自定义搜索引擎
  const addCustomEngine = () => {
    if (!customEngineName.trim() || !customEngineUrl.trim() || !customEngineUrl.includes('{query}')) {
      alert('请输入有效的名称和URL，URL中必须包含{query}作为搜索词的占位符');
      return;
    }
    
    const newEngine = {
      id: `custom_${Date.now()}`,
      name: customEngineName,
      url: customEngineUrl
    };
    
    const updatedEngines = [...customEngines, newEngine];
    setCustomEngines(updatedEngines);
    if (updateSpecificSettings) {
      updateSpecificSettings('search.customEngines', updatedEngines);
    }
    
    // 切换到新添加的引擎
    setEngine(newEngine.id);
    if (updateSpecificSettings) {
      updateSpecificSettings('search.defaultEngine', newEngine.id);
    }
    
    // 清空输入框
    setCustomEngineName('');
    setCustomEngineUrl('');
  };
  
  // 开始编辑自定义搜索引擎
  const startEditEngine = (engine) => {
    setEditingEngine(engine.id);
    setEditName(engine.name);
    setEditUrl(engine.url);
  };
  
  // 保存编辑的自定义搜索引擎
  const saveEditEngine = () => {
    if (!editName.trim() || !editUrl.trim() || !editUrl.includes('{query}')) {
      alert('请输入有效的名称和URL，URL中必须包含{query}作为搜索词的占位符');
      return;
    }
    
    const updatedEngines = customEngines.map(engine => 
      engine && engine.id === editingEngine 
        ? { ...engine, name: editName, url: editUrl } 
        : engine
    );
    
    setCustomEngines(updatedEngines);
    if (updateSpecificSettings) {
      updateSpecificSettings('search.customEngines', updatedEngines);
    }
    
    // 取消编辑状态
    cancelEditEngine();
  };
  
  // 取消编辑
  const cancelEditEngine = () => {
    setEditingEngine(null);
    setEditName('');
    setEditUrl('');
  };
  
  // 删除自定义搜索引擎
  const deleteEngine = (engineId) => {
    if (window.confirm('确定要删除这个搜索引擎吗？')) {
      const updatedEngines = customEngines.filter(engine => engine && engine.id !== engineId);
      setCustomEngines(updatedEngines);
      if (updateSpecificSettings) {
        updateSpecificSettings('search.customEngines', updatedEngines);
      }
      
      // 如果删除的是当前选中的引擎，切换到默认引擎
      if (engine === engineId) {
        setEngine('bing');
        if (updateSpecificSettings) {
          updateSpecificSettings('search.defaultEngine', 'bing');
        }
      }
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = (result) => {
    try {
      if (!result || !result.destination || !Array.isArray(customEngines)) return;
      
      const sourceIndex = result.source?.index;
      const destinationIndex = result.destination?.index;
      
      if (sourceIndex === undefined || destinationIndex === undefined || sourceIndex === destinationIndex) return;
      
      const updatedEngines = [...customEngines];
      const [removed] = updatedEngines.splice(sourceIndex, 1);
      updatedEngines.splice(destinationIndex, 0, removed);
      
      setCustomEngines(updatedEngines);
      if (updateSpecificSettings) {
        updateSpecificSettings('search.customEngines', updatedEngines);
      }
    } catch (error) {
      console.error('处理拖拽时出错:', error);
    }
  };
  
  // 测试自定义搜索引擎
  const testEngine = (engineUrl) => {
    try {
      // 处理测试查询
      let processedQuery = testQuery;
      if (autoClean && cleanSearchQuery) {
        processedQuery = cleanSearchQuery(testQuery);
      }
      
      const testUrl = engineUrl.replace('{query}', encodeURIComponent(processedQuery));
      window.open(testUrl, '_blank');
    } catch (error) {
      console.error('测试搜索引擎失败:', error);
      alert('测试失败，请检查URL格式');
    }
  };
  
  // 获取当前引擎名称
  const getCurrentEngineName = () => {
    const predefinedEngines = {
      'bing': '必应',
      'google': '谷歌',
      'baidu': '百度',
      'sogou': '搜狗',
      'mita': '秘塔AI'
    };
    
    if (predefinedEngines[engine]) {
      return predefinedEngines[engine];
    }
    
    const customEngine = Array.isArray(customEngines) ? customEngines.find(e => e && e.id === engine) : null;
    return (customEngine && customEngine.name) ? customEngine.name : '必应';
  };
  
  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit} ref={searchFormRef} theme={currentTheme}>
        <EngineButton 
          type="button" 
          onClick={() => setShowEngineDropdown(!showEngineDropdown)}
          title="选择搜索引擎"
          theme={currentTheme}
        >
          {getCurrentEngineName()}
          <ArrowDropDownIcon fontSize="small" />
        </EngineButton>
        <SearchInput
          type="text"
          placeholder="搜索或输入网址"
          value={query}
          onChange={handleInputChange}
          autoFocus
          theme={currentTheme}
        />
        <CleanButton
          type="button"
          onClick={toggleAutoClean}
          active={autoClean}
          title={autoClean ? '已启用URL清理' : '已禁用URL清理'}
          theme={currentTheme}
        >
          <CleaningServicesIcon fontSize="small" />
        </CleanButton>
        <SearchButton type="submit" title="搜索" theme={currentTheme}>
          <SearchIcon />
        </SearchButton>
      </SearchForm>
      
      {showEngineDropdown && (
        <EngineDropdown show={showEngineDropdown} ref={dropdownRef} theme={currentTheme}>
          <EngineGrid>
            <EngineOption
              onClick={() => changeEngine('bing')}
              active={engine === 'bing'}
              theme={currentTheme}
            >
              必应
            </EngineOption>
            <EngineOption
              onClick={() => changeEngine('google')}
              active={engine === 'google'}
              theme={currentTheme}
            >
              谷歌
            </EngineOption>
            <EngineOption
              onClick={() => changeEngine('baidu')}
              active={engine === 'baidu'}
              theme={currentTheme}
            >
              百度
            </EngineOption>
            <EngineOption
              onClick={() => changeEngine('sogou')}
              active={engine === 'sogou'}
              theme={currentTheme}
            >
              搜狗
            </EngineOption>
            <EngineOption
              onClick={() => changeEngine('mita')}
              active={engine === 'mita'}
              theme={currentTheme}
            >
              秘塔AI
            </EngineOption>
            
            {Array.isArray(customEngines) && customEngines.map(customEngine => (
              customEngine && customEngine.id ? (
                <EngineOption
                  key={customEngine.id}
                  onClick={() => changeEngine(customEngine.id)}
                  active={engine === customEngine.id}
                  theme={currentTheme}
                >
                  {customEngine.name || '未命名'}
                </EngineOption>
              ) : null
            ))}
          </EngineGrid>
          
          <CustomEngineForm theme={currentTheme}>
            <FormRow>
              <Label theme={currentTheme}>名称:</Label>
              <Input 
                type="text" 
                value={customEngineName}
                onChange={(e) => setCustomEngineName(e.target.value)}
                placeholder="自定义引擎名称"
                theme={currentTheme}
              />
            </FormRow>
            <FormRow>
              <Label theme={currentTheme}>URL:</Label>
              <Input 
                type="text" 
                value={customEngineUrl}
                onChange={(e) => setCustomEngineUrl(e.target.value)}
                placeholder="https://example.com/search?q={query}"
                theme={currentTheme}
              />
            </FormRow>
            <FormRow>
              <SwitchContainer>
                <SwitchLabel theme={currentTheme}>URL清理</SwitchLabel>
                <Switch>
                  <input 
                    type="checkbox" 
                    checked={autoClean} 
                    onChange={toggleAutoClean}
                  />
                  <Slider2 theme={currentTheme} />
                </Switch>
              </SwitchContainer>
              <AddButton onClick={addCustomEngine}>添加自定义引擎</AddButton>
            </FormRow>
          </CustomEngineForm>
          
          {Array.isArray(customEngines) && customEngines.length > 0 && (
            <CustomEngineList theme={currentTheme}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="custom-engines">
                  {(provided) => {
                    if (!provided || !provided.innerRef) {
                      return (
                        <div>
                          {customEngines.map((customEngine, index) => {
                            if (!customEngine || !customEngine.id) return null;
                            return (
                              <CustomEngineItem key={customEngine.id} theme={currentTheme}>
                                <EngineName active={engine === customEngine.id} theme={currentTheme}>
                                  {customEngine.name || '未命名'}
                                </EngineName>
                                <EngineUrl theme={currentTheme}>{customEngine.url || ''}</EngineUrl>
                              </CustomEngineItem>
                            );
                          })}
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        {...(provided.droppableProps || {})}
                        ref={provided.innerRef}
                      >
                      {customEngines.map((customEngine, index) => {
                        if (!customEngine || !customEngine.id) return null;
                        
                        if (editingEngine === customEngine.id) {
                          return (
                            <EditForm key={customEngine.id} theme={currentTheme}>
                              <FormRow>
                                <Label theme={currentTheme}>名称:</Label>
                                <Input 
                                  type="text" 
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  theme={currentTheme}
                                />
                              </FormRow>
                              <FormRow>
                                <Label theme={currentTheme}>URL:</Label>
                                <Input 
                                  type="text" 
                                  value={editUrl}
                                  onChange={(e) => setEditUrl(e.target.value)}
                                  theme={currentTheme}
                                />
                              </FormRow>
                              <EditFormButtons>
                                <EditFormButton onClick={cancelEditEngine} theme={currentTheme}>
                                  <CloseIcon fontSize="small" /> 取消
                                </EditFormButton>
                                <EditFormButton primary onClick={saveEditEngine} theme={currentTheme}>
                                  <CheckIcon fontSize="small" /> 保存
                                </EditFormButton>
                              </EditFormButtons>
                            </EditForm>
                          );
                        }
                        
                        return (
                          <Draggable 
                            key={customEngine.id} 
                            draggableId={customEngine.id} 
                            index={index}
                          >
                            {(provided, snapshot) => {
                              if (!provided || !provided.innerRef) {
                                return (
                                  <CustomEngineItem theme={currentTheme}>
                                    <EngineName active={engine === customEngine.id} theme={currentTheme}>
                                      {customEngine.name || '未命名'}
                                    </EngineName>
                                    <EngineUrl theme={currentTheme}>{customEngine.url || ''}</EngineUrl>
                                  </CustomEngineItem>
                                );
                              }
                              
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={provided.draggableProps?.style || {}}
                                >
                                  <CustomEngineItem
                                    isDragging={snapshot?.isDragging || false}
                                    theme={currentTheme}
                                  >
                                    <DragHandle {...(provided.dragHandleProps || {})} theme={currentTheme}>
                                      <DragIndicatorIcon />
                                    </DragHandle>
                                    <EngineName active={engine === customEngine.id} theme={currentTheme}>
                                      {customEngine.name || '未命名'}
                                    </EngineName>
                                    <EngineUrl theme={currentTheme}>{customEngine.url || ''}</EngineUrl>
                                    <ActionButtons>
                                      <TestButton 
                                        onClick={() => testEngine(customEngine.url)}
                                        title="测试搜索引擎"
                                        theme={currentTheme}
                                      >
                                        测试
                                      </TestButton>
                                      <ActionButton 
                                        onClick={() => startEditEngine(customEngine)}
                                        title="编辑"
                                        theme={currentTheme}
                                      >
                                        <EditIcon fontSize="small" />
                                      </ActionButton>
                                      <ActionButton 
                                        onClick={() => deleteEngine(customEngine.id)}
                                        title="删除"
                                        theme={currentTheme}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </ActionButton>
                                    </ActionButtons>
                                  </CustomEngineItem>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
                </Droppable>
              </DragDropContext>
            </CustomEngineList>
          )}
        </EngineDropdown>
      )}
    </SearchContainer>
  );
};

export default Search;
