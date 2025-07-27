import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
// import zhCN from 'date-fns/locale/zh-CN'; // 暂时未使用

// 图标导入
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-color);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: #3a7bc8;
    }
  }
  
  &.secondary {
    background-color: var(--card-background);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const NotificationToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#3a7bc8' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const TodoModal = ({ isOpen, onClose, onSave, todo = null }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hasNotification, setHasNotification] = useState(false);
  const [notificationDate, setNotificationDate] = useState('');
  const [notificationTime, setNotificationTime] = useState('');
  const [completed, setCompleted] = useState(false);
  
  // 初始化表单数据
  useEffect(() => {
    if (todo) {
      setName(todo.name);
      
      const todoDate = new Date(todo.date);
      setDate(format(todoDate, 'yyyy-MM-dd'));
      setTime(format(todoDate, 'HH:mm'));
      
      setCompleted(todo.completed || false);
      
      if (todo.notification) {
        setHasNotification(true);
        const notifDate = new Date(todo.notification);
        setNotificationDate(format(notifDate, 'yyyy-MM-dd'));
        setNotificationTime(format(notifDate, 'HH:mm'));
      } else {
        setHasNotification(false);
        setNotificationDate('');
        setNotificationTime('');
      }
    } else {
      const now = new Date();
      setName('');
      setDate(format(now, 'yyyy-MM-dd'));
      setTime(format(now, 'HH:mm'));
      setCompleted(false);
      setHasNotification(false);
      setNotificationDate('');
      setNotificationTime('');
    }
  }, [todo, isOpen]);
  
  // 处理表单输入变化
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  
  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };
  
  const handleNotificationDateChange = (e) => {
    setNotificationDate(e.target.value);
  };
  
  const handleNotificationTimeChange = (e) => {
    setNotificationTime(e.target.value);
  };
  
  const toggleNotification = () => {
    if (!hasNotification) {
      // 默认设置为当前日期和时间
      const now = new Date();
      setNotificationDate(format(now, 'yyyy-MM-dd'));
      setNotificationTime(format(now, 'HH:mm'));
    }
    setHasNotification(!hasNotification);
  };
  
  const toggleCompleted = () => {
    setCompleted(!completed);
  };
  
  // 保存待办事项
  const handleSave = () => {
    if (!name.trim()) {
      alert('请填写待办事项名称');
      return;
    }
    
    if (!date || !time) {
      alert('请选择日期和时间');
      return;
    }
    
    // 创建日期对象
    const todoDate = new Date(`${date}T${time}`);
    
    // 创建通知日期对象（如果有）
    let notificationDateTime = null;
    if (hasNotification && notificationDate && notificationTime) {
      notificationDateTime = new Date(`${notificationDate}T${notificationTime}`);
    }
    
    onSave({
      name: name.trim(),
      date: todoDate.toISOString(),
      notification: notificationDateTime ? notificationDateTime.toISOString() : null,
      completed
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{todo ? '编辑待办事项' : '添加待办事项'}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <FormGroup>
          <Label>名称</Label>
          <Input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            placeholder="待办事项名称"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>日期</Label>
          <Input 
            type="date" 
            value={date} 
            onChange={handleDateChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>时间</Label>
          <Input 
            type="time" 
            value={time} 
            onChange={handleTimeChange}
          />
        </FormGroup>
        
        <FormGroup>
          <NotificationToggle>
            <Label>提醒</Label>
            <ToggleButton 
              active={hasNotification} 
              onClick={toggleNotification}
            >
              {hasNotification ? (
                <>
                  <NotificationsIcon fontSize="small" />
                  开启
                </>
              ) : (
                <>
                  <NotificationsOffIcon fontSize="small" />
                  关闭
                </>
              )}
            </ToggleButton>
          </NotificationToggle>
          
          {hasNotification && (
            <>
              <FormGroup>
                <Label>提醒日期</Label>
                <Input 
                  type="date" 
                  value={notificationDate} 
                  onChange={handleNotificationDateChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>提醒时间</Label>
                <Input 
                  type="time" 
                  value={notificationTime} 
                  onChange={handleNotificationTimeChange}
                />
              </FormGroup>
            </>
          )}
        </FormGroup>
        
        <FormGroup>
          <Checkbox onClick={toggleCompleted}>
            <input 
              type="checkbox" 
              checked={completed} 
              onChange={() => {}}
            />
            <span>已完成</span>
          </Checkbox>
        </FormGroup>
        
        <ButtonGroup>
          <Button className="secondary" onClick={onClose}>取消</Button>
          <Button className="primary" onClick={handleSave}>保存</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default TodoModal;