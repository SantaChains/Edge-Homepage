import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

// 图标导入
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--shadow-color);
  transition: all var(--transition-speed);
  
  &:hover {
    box-shadow: 0 5px 15px var(--shadow-color);
  }
`;

const CountdownInfo = styled.div`
  flex: 1;
`;

const CountdownName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const CountdownDate = styled.div`
  font-size: 12px;
  color: var(--text-secondary-color);
`;

const DaysLeft = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.isPast ? 'var(--text-secondary-color)' : 'var(--primary-color)'};
  margin: 0 15px;
  min-width: 60px;
  text-align: center;
`;

const CountdownActions = styled.div`
  display: flex;
  gap: 5px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary-color);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--primary-color);
  }
`;

// 竺纪笠模式的天数转换
const convertToZhuJiLi = (days) => {
  if (days === 0) return '就是今天';
  
  const absDay = Math.abs(days);
  
  // 转换为竺纪笠格式
  const units = ['', '十', '百', '千', '万'];
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  
  if (absDay < 10) return digits[absDay];
  
  let result = '';
  const dayStr = absDay.toString();
  
  for (let i = 0; i < dayStr.length; i++) {
    const digit = parseInt(dayStr[i]);
    const position = dayStr.length - i - 1;
    
    if (digit === 0) {
      // 处理零的情况
      if (result.charAt(result.length - 1) !== '零' && position !== 0) {
        result += '零';
      }
    } else {
      // 非零数字
      if (digit === 1 && position !== 0) {
        // 处理十、百、千位上的"一"，如"一十"简化为"十"
        result += units[position];
      } else {
        result += digits[digit] + units[position];
      }
    }
  }
  
  return result;
};

const CountdownItem = ({ countdown, useZhuJiLi, onEdit, onDelete }) => {
  // 计算剩余天数
  const calculateDaysLeft = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(countdown.date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysLeft = calculateDaysLeft();
  const isPast = daysLeft < 0;
  
  // 格式化显示天数
  const formatDaysLeft = () => {
    if (useZhuJiLi) {
      return convertToZhuJiLi(daysLeft);
    }
    
    if (daysLeft === 0) return '今天';
    if (daysLeft > 0) return `还有 ${daysLeft} 天`;
    return `已过 ${Math.abs(daysLeft)} 天`;
  };
  
  return (
    <CountdownContainer>
      <CountdownInfo>
        <CountdownName>{countdown.name}</CountdownName>
        <CountdownDate>
          {format(new Date(countdown.date), 'yyyy年MM月dd日', { locale: zhCN })}
        </CountdownDate>
      </CountdownInfo>
      
      <DaysLeft isPast={isPast}>
        {formatDaysLeft()}
      </DaysLeft>
      
      <CountdownActions>
        <ActionButton onClick={onEdit} title="编辑">
          <EditIcon fontSize="small" />
        </ActionButton>
        <ActionButton onClick={onDelete} title="删除">
          <DeleteIcon fontSize="small" />
        </ActionButton>
      </CountdownActions>
    </CountdownContainer>
  );
};

export default CountdownItem;