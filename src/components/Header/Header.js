import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDateTime } from '../../utils/dateTime';
import { useTheme } from '../../contexts/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const HeaderContainer = styled.header`
  text-align: center;
  padding: 20px 0;
  position: relative;
`;

const TimeDisplay = styled.div`
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 5px;
  color: var(--text-color);
`;

const DateDisplay = styled.div`
  font-size: 1.2rem;
  color: var(--text-secondary-color);
`;

const HeaderButtons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const HeaderButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &.theme {
    background-color: var(--primary-color);
    color: white;
  }
  
  &.settings {
    background-color: #6c5ce7;
    color: white;
  }
  
  &.zen {
    background-color: #00b894;
    color: white;
  }
  
  &.curtain {
    background-color: #e17055;
    color: white;
  }
`;

const Header = ({ onSettingsClick, onModeChange, currentMode, onBackClick, showBackButton }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    // 更新时间和日期
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(formatDateTime(now, 'HH:mm:ss'));
      setCurrentDate(formatDateTime(now, 'yyyy年MM月dd日 EEEE'));
    };
    
    // 立即更新一次
    updateDateTime();
    
    // 设置定时器，每秒更新一次
    const timer = setInterval(updateDateTime, 1000);
    
    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, []);
  
  return (
    <HeaderContainer>
      {showBackButton && (
        <BackButton onClick={onBackClick} title="返回">
          <ArrowBackIcon />
        </BackButton>
      )}
      <TimeDisplay>{currentTime}</TimeDisplay>
      <DateDisplay>{currentDate}</DateDisplay>
      <HeaderButtons>
        <HeaderButton 
          className="theme"
          onClick={toggleTheme} 
          title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
        >
          {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </HeaderButton>
        
        <HeaderButton 
          className="zen"
          onClick={() => onModeChange && onModeChange('zen')} 
          title="禅模式"
        >
          <SelfImprovementIcon />
        </HeaderButton>
        
        <HeaderButton 
          className="curtain"
          onClick={() => onModeChange && onModeChange('curtain')} 
          title="幕模式"
        >
          <TheaterComedyIcon />
        </HeaderButton>
        
        <HeaderButton 
          className="settings"
          onClick={onSettingsClick} 
          title="设置"
        >
          <SettingsIcon />
        </HeaderButton>
      </HeaderButtons>
    </HeaderContainer>
  );
};

export default Header;