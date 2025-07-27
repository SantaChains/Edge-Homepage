import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveToStorage, getFromStorage } from '../../utils/storage';

// 组件导入
import TodoItem from './components/TodoItem';
import TodoModal from './components/TodoModal';

// 图标导入
import AddIcon from '@mui/icons-material/Add';

const TodoContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TodoTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
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

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-color);
  opacity: 0.7;
`;

// 提醒音频
const notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBhxQo97tuHQpCRRAlN/svn0xDxZBi9nkvX0yEBdBitnj7tHQpGxPMzFV0/j/4LlmSTtDWrr/+N6xcVRCQlSl7PXeulpEQFRqwfPo1LVqUkdLXKzr6Nmm9/7kzK1yWk1JVZPf7N7QxbCLdGlaSmaJ2OTdx8mwlX5xXlBcerDR5Oa5zryrfWBXVmFwi8Pf6cqEm7KJbGBdVl1qlMjj6MF6lrCOb2FeW1tkfLHZ6t2j1NzEo4XO3r+TgHRpXFxkdZnH3OC8qqykkHpweGRVX3WUvdnk5dCkqq+jgXBualpcZ4O11uDn0LWvqqmUc2VwbWBcaH6qzeHm1cCjr7CjfGl1cWVfa4q0z9/j2bqhq66mh3JqdGthXnCVw9nj4MWnqK2pjHRpdG9mYGmEsc3e5dC3qKyspIBtcXNrZGFvjrzW4OG8qaWqqJN4a3FyaWVldo+91ODevaqlqaibeGxxcmpmZXCPvdTg3r2qpamom3hscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODevaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODevaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U4N69qqWpqJt4bHFyamZlcI+91ODeuaqluaibeGxxcmpmZXCPvdTg3r2qpamomnhscXJqZmVwj73U');

const Todo = () => {
  // 状态
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add, edit
  const [editingItem, setEditingItem] = useState(null);
  
  // 初始化数据
  useEffect(() => {
    const savedTodos = getFromStorage('homepage-todos', []);
    setTodos(savedTodos);
    
    // 设置通知检查定时器
    const checkNotifications = () => {
      const now = new Date();
      
      savedTodos.forEach(todo => {
        if (todo.notification && !todo.completed) {
          const notificationTime = new Date(todo.notification);
          
          // 如果当前时间在通知时间的前后1分钟内，且尚未通知过
          if (Math.abs(now - notificationTime) < 60000 && !todo.notified) {
            // 显示通知
            if (Notification.permission === 'granted') {
              new Notification('待办提醒', {
                body: todo.name,
                icon: '/icons/icon128.png'
              });
              
              // 播放提示音
              notificationSound.play();
              
              // 标记为已通知
              const updatedTodos = savedTodos.map(item => {
                if (item.id === todo.id) {
                  return { ...item, notified: true };
                }
                return item;
              });
              
              setTodos(updatedTodos);
              saveToStorage('homepage-todos', updatedTodos);
            }
          }
        }
      });
    };
    
    // 每分钟检查一次通知
    const notificationInterval = setInterval(checkNotifications, 60000);
    
    // 请求通知权限
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    return () => {
      clearInterval(notificationInterval);
    };
  }, []);
  
  // 打开添加待办事项模态框
  const openAddTodoModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setShowModal(true);
  };
  
  // 打开编辑待办事项模态框
  const openEditTodoModal = (todo) => {
    setModalMode('edit');
    setEditingItem(todo);
    setShowModal(true);
  };
  
  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
  };
  
  // 保存待办事项
  const saveTodo = (formData) => {
    const newTodo = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name,
      date: formData.date,
      notification: formData.notification,
      completed: formData.completed || false,
      notified: false
    };
    
    let updatedTodos;
    
    if (modalMode === 'edit') {
      // 编辑现有待办事项
      updatedTodos = todos.map(item => 
        item.id === editingItem.id ? newTodo : item
      );
    } else {
      // 添加新待办事项
      updatedTodos = [...todos, newTodo];
    }
    
    setTodos(updatedTodos);
    saveToStorage('homepage-todos', updatedTodos);
    closeModal();
  };
  
  // 删除待办事项
  const deleteTodo = (id) => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      const updatedTodos = todos.filter(item => item.id !== id);
      setTodos(updatedTodos);
      saveToStorage('homepage-todos', updatedTodos);
    }
  };
  
  // 切换待办事项完成状态
  const toggleTodoComplete = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    saveToStorage('homepage-todos', updatedTodos);
  };
  
  // 按日期排序，未完成的在前，已完成的在后
  const sortedTodos = [...todos].sort((a, b) => {
    // 首先按完成状态排序
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // 然后按日期排序
    return new Date(a.date) - new Date(b.date);
  });
  
  return (
    <TodoContainer>
      <TodoHeader>
        <TodoTitle>待办事项</TodoTitle>
        <ActionButton onClick={openAddTodoModal} title="添加待办事项">
          <AddIcon />
        </ActionButton>
      </TodoHeader>
      
      <TodoList>
        {sortedTodos.map(todo => (
          <TodoItem 
            key={todo.id}
            todo={todo}
            onToggleComplete={toggleTodoComplete}
            onEdit={openEditTodoModal}
            onDelete={deleteTodo}
          />
        ))}
        
        {todos.length === 0 && (
          <EmptyState>
            <p>暂无待办事项，点击右上角添加</p>
          </EmptyState>
        )}
      </TodoList>
      
      <TodoModal 
        isOpen={showModal}
        onClose={closeModal}
        onSave={saveTodo}
        todo={editingItem}
      />
    </TodoContainer>
  );
};

export default Todo;
