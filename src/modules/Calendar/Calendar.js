import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';
import { saveToStorage, getFromStorage } from '../../utils/storage';

// 组件导入
import CountdownItem from './components/CountdownItem';
import CountdownModal from './components/CountdownModal';

// 图标导入
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CalendarTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const MonthTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const NavButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 30px;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-weight: 500;
  padding: 10px 0;
  color: var(--text-secondary-color);
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  
  ${props => props.isCurrentMonth ? `
    color: var(--text-color);
  ` : `
    color: var(--text-secondary-color);
    opacity: 0.5;
  `}
  
  ${props => props.isToday && `
    background-color: var(--primary-color);
    color: white;
  `}
  
  &:hover {
    background-color: ${props => props.isToday ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const CountdownSection = styled.div`
  margin-top: 30px;
`;

const CountdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CountdownTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary-color)'};
`;

const CountdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--text-color);
  opacity: 0.7;
`;

const Calendar = () => {
  // 状态
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [countdowns, setCountdowns] = useState([]);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState(null);
  const [useZhuJiLi, setUseZhuJiLi] = useState(false);
  
  // 初始化数据
  useEffect(() => {
    const savedCountdowns = getFromStorage('homepage-countdowns', []);
    const savedUseZhuJiLi = getFromStorage('homepage-use-zhujili', false);
    setCountdowns(savedCountdowns);
    setUseZhuJiLi(savedUseZhuJiLi);
  }, []);
  
  // 处理月份导航
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // 渲染日历头部（星期几）
  const renderWeekdays = () => {
    const weekdays = [];
    const start = startOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      weekdays.push(
        <WeekdayHeader key={i}>
          {format(day, 'E', { locale: zhCN })}
        </WeekdayHeader>
      );
    }
    
    return weekdays;
  };
  
  // 渲染日历单元格
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <DayCell
            key={day}
            isToday={isSameDay(day, new Date())}
            isCurrentMonth={isSameMonth(day, monthStart)}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
          </DayCell>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <React.Fragment key={day}>
          {days}
        </React.Fragment>
      );
      days = [];
    }
    
    return rows;
  };
  
  // 打开添加倒数日模态框
  const openAddCountdownModal = () => {
    setEditingCountdown(null);
    setShowCountdownModal(true);
  };
  
  // 打开编辑倒数日模态框
  const openEditCountdownModal = (countdown) => {
    setEditingCountdown(countdown);
    setShowCountdownModal(true);
  };
  
  // 关闭倒数日模态框
  const closeCountdownModal = () => {
    setShowCountdownModal(false);
    setEditingCountdown(null);
  };
  
  // 保存倒数日
  const saveCountdown = (data) => {
    let updatedCountdowns;
    
    if (editingCountdown) {
      // 编辑现有倒数日
      updatedCountdowns = countdowns.map(item => 
        item.id === editingCountdown.id ? { ...data, id: editingCountdown.id } : item
      );
    } else {
      // 添加新倒数日
      updatedCountdowns = [...countdowns, { ...data, id: Date.now() }];
    }
    
    setCountdowns(updatedCountdowns);
    saveToStorage('homepage-countdowns', updatedCountdowns);
    closeCountdownModal();
  };
  
  // 删除倒数日
  const deleteCountdown = (id) => {
    if (window.confirm('确定要删除这个倒数日吗？')) {
      const updatedCountdowns = countdowns.filter(item => item.id !== id);
      setCountdowns(updatedCountdowns);
      saveToStorage('homepage-countdowns', updatedCountdowns);
    }
  };
  
  // 切换竺纪笠模式
  const toggleZhuJiLi = () => {
    const newValue = !useZhuJiLi;
    setUseZhuJiLi(newValue);
    saveToStorage('homepage-use-zhujili', newValue);
  };
  
  // 计算倒数天数
  const calculateDaysLeft = (targetDate) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // 按日期排序倒数日
  const sortedCountdowns = [...countdowns].sort((a, b) => {
    const daysLeftA = calculateDaysLeft(a.date);
    const daysLeftB = calculateDaysLeft(b.date);
    
    // 将过去的日期放在后面
    if ((daysLeftA < 0 && daysLeftB < 0) || (daysLeftA >= 0 && daysLeftB >= 0)) {
      return Math.abs(daysLeftA) - Math.abs(daysLeftB);
    }
    
    return daysLeftA < 0 ? 1 : -1;
  });
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>日历</CalendarTitle>
        <ActionButtons>
          <ActionButton onClick={openAddCountdownModal} title="添加倒数日">
            <AddIcon />
          </ActionButton>
        </ActionButtons>
      </CalendarHeader>
      
      <MonthNavigator>
        <NavButton onClick={prevMonth}>
          <ArrowBackIosNewIcon fontSize="small" />
        </NavButton>
        <MonthTitle>
          {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
        </MonthTitle>
        <NavButton onClick={nextMonth}>
          <ArrowForwardIosIcon fontSize="small" />
        </NavButton>
      </MonthNavigator>
      
      <CalendarGrid>
        {renderWeekdays()}
        {renderCells()}
      </CalendarGrid>
      
      <CountdownSection>
        <CountdownHeader>
          <CountdownTitle>
            倒数日
            <ToggleButton 
              active={useZhuJiLi} 
              onClick={toggleZhuJiLi}
              title={useZhuJiLi ? "关闭竺纪笠模式" : "开启竺纪笠模式"}
            >
              {useZhuJiLi ? <ToggleOnIcon /> : <ToggleOffIcon />}
              竺纪笠
            </ToggleButton>
          </CountdownTitle>
        </CountdownHeader>
        
        <CountdownList>
          {sortedCountdowns.map(countdown => (
            <CountdownItem 
              key={countdown.id}
              countdown={countdown}
              useZhuJiLi={useZhuJiLi}
              onEdit={() => openEditCountdownModal(countdown)}
              onDelete={() => deleteCountdown(countdown.id)}
            />
          ))}
          
          {countdowns.length === 0 && (
            <EmptyState>
              <p>暂无倒数日，点击右上角添加</p>
            </EmptyState>
          )}
        </CountdownList>
      </CountdownSection>
      
      <CountdownModal 
        isOpen={showCountdownModal}
        onClose={closeCountdownModal}
        onSave={saveCountdown}
        countdown={editingCountdown}
      />
    </CalendarContainer>
  );
};

export default Calendar;