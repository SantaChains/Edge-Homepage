import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

// 图标导入
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TodoItemContainer = styled.div`
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
  
  ${props => props.completed && `
    opacity: 0.7;
  `}
`;

const TodoCheckbox = styled.div`
  margin-right: 15px;
  cursor: pointer;
  color: ${props => props.checked ? 'var(--primary-color)' : 'var(--text-color)'};
`;

const TodoContent = styled.div`
  flex: 1;
`;

const TodoName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? 'var(--text-secondary-color)' : 'var(--text-color)'};
`;

const TodoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-secondary-color);
`;

const TodoDate = styled.span`
  display: flex;
  align-items: center;
`;

const TodoNotification = styled.span`
  display: flex;
  align-items: center;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary-color)'};
`;

const TodoActions = styled.div`
  display: flex;
  gap: 5px;
`;

const TodoActionButton = styled.button`
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

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  // 格式化日期
  const formatDate = (date) => {
    return format(new Date(date), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  };
  
  return (
    <TodoItemContainer completed={todo.completed}>
      <TodoCheckbox 
        checked={todo.completed} 
        onClick={() => onToggleComplete(todo.id)}
      >
        {todo.completed ? (
          <CheckCircleIcon />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
      </TodoCheckbox>
      
      <TodoContent>
        <TodoName completed={todo.completed}>{todo.name}</TodoName>
        <TodoMeta>
          <TodoDate>
            {formatDate(todo.date)}
          </TodoDate>
          {todo.notification && (
            <TodoNotification active={!todo.completed}>
              {todo.completed ? (
                <NotificationsOffIcon fontSize="small" />
              ) : (
                <NotificationsIcon fontSize="small" />
              )}
              {formatDate(todo.notification)}
            </TodoNotification>
          )}
        </TodoMeta>
      </TodoContent>
      
      <TodoActions>
        <TodoActionButton onClick={() => onEdit(todo)}>
          <EditIcon fontSize="small" />
        </TodoActionButton>
        <TodoActionButton onClick={() => onDelete(todo.id)}>
          <DeleteIcon fontSize="small" />
        </TodoActionButton>
      </TodoActions>
    </TodoItemContainer>
  );
};

export default TodoItem;