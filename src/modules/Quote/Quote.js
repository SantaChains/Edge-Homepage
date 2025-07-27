import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveToStorage, getFromStorage } from '../../utils/storage';

// 图标导入
import SettingsIcon from '@mui/icons-material/Settings';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import RefreshIcon from '@mui/icons-material/Refresh';

const QuoteContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const QuoteContent = styled.div`
  text-align: center;
  padding: 30px 20px;
  font-size: ${props => props.fontSize}px;
  line-height: 1.5;
  font-weight: 500;
  color: var(--text-color);
  transition: font-size 0.3s ease;
  max-width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuoteControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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
  max-width: 600px;
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

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
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

const Quote = () => {
  // 状态
  const [quotes, setQuotes] = useState(['既然胜负未分，则应力挽狂澜']);
  const [currentQuote, setCurrentQuote] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [showModal, setShowModal] = useState(false);
  const [editText, setEditText] = useState('');
  
  // 初始化数据
  useEffect(() => {
    const savedQuotes = getFromStorage('homepage-quotes', ['既然胜负未分，则应力挽狂澜']);
    const savedFontSize = getFromStorage('homepage-quote-font-size', 24);
    
    setQuotes(savedQuotes);
    setFontSize(savedFontSize);
    
    // 随机选择一条一语
    refreshQuote(savedQuotes);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // 刷新一语
  const refreshQuote = (quotesArray = quotes) => {
    if (quotesArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotesArray.length);
      setCurrentQuote(quotesArray[randomIndex]);
    }
  };
  
  // 增加字体大小
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 48);
    setFontSize(newSize);
    saveToStorage('homepage-quote-font-size', newSize);
  };
  
  // 减小字体大小
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 16);
    setFontSize(newSize);
    saveToStorage('homepage-quote-font-size', newSize);
  };
  
  // 打开配置模态框
  const openConfigModal = () => {
    setEditText(quotes.join('\n'));
    setShowModal(true);
  };
  
  // 关闭配置模态框
  const closeModal = () => {
    setShowModal(false);
  };
  
  // 处理文本变化
  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };
  
  // 保存配置
  const saveConfig = () => {
    // 按行分割，过滤空行
    const newQuotes = editText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // 如果没有内容，使用默认值
    if (newQuotes.length === 0) {
      newQuotes.push('既然胜负未分，则应力挽狂澜');
    }
    
    setQuotes(newQuotes);
    saveToStorage('homepage-quotes', newQuotes);
    
    // 随机选择一条一语
    refreshQuote(newQuotes);
    
    closeModal();
  };
  
  return (
    <QuoteContainer>
      <QuoteContent fontSize={fontSize}>
        "{currentQuote}"
      </QuoteContent>
      
      <QuoteControls>
        <ControlButton onClick={decreaseFontSize} title="减小字体">
          <TextDecreaseIcon />
        </ControlButton>
        <ControlButton onClick={() => refreshQuote()} title="刷新一语">
          <RefreshIcon />
        </ControlButton>
        <ControlButton onClick={openConfigModal} title="配置每日一语">
          <SettingsIcon />
        </ControlButton>
        <ControlButton onClick={increaseFontSize} title="增大字体">
          <TextIncreaseIcon />
        </ControlButton>
      </QuoteControls>
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>配置每日一语</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <TextArea 
              value={editText} 
              onChange={handleTextChange}
              placeholder="每行输入一条一语，留空则使用默认值"
            />
            
            <ButtonGroup>
              <Button className="secondary" onClick={closeModal}>取消</Button>
              <Button className="primary" onClick={saveConfig}>保存</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </QuoteContainer>
  );
};

export default Quote;