import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { saveToStorage, getFromStorage } from '../../utils/storage';

// 图标导入
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon2 from '@mui/icons-material/ArrowBack';

const CurtainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  position: relative;
  overflow: hidden;
`;

const MarqueeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const MarqueeText = styled.div`
  font-size: ${props => props.fontSize}px;
  color: var(--text-color);
  white-space: ${props => props.direction === 'left' || props.direction === 'right' ? 'nowrap' : 'pre-wrap'};
  word-break: ${props => props.direction === 'left' || props.direction === 'right' ? 'keep-all' : 'break-word'};
  text-align: center;
  position: absolute;
  width: ${props => props.direction === 'left' || props.direction === 'right' ? 'auto' : '100%'};
  max-width: ${props => props.direction === 'left' || props.direction === 'right' ? 'none' : 'calc(100% - 80px)'};
  padding: ${props => props.direction === 'left' || props.direction === 'right' ? '0 20px' : '0 40px'};
  line-height: 1.4;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transform: ${props => {
    if (props.direction === 'up') return `translateX(-50%) translateY(${props.position}px)`;
    if (props.direction === 'down') return `translateX(-50%) translateY(${props.position}px)`;
    if (props.direction === 'left') return `translateY(-50%) translateX(${props.position}px)`;
    if (props.direction === 'right') return `translateY(-50%) translateX(${props.position}px)`;
    return 'none';
  }};
  
  /* 确保文本在水平滚动时不换行，垂直滚动时居中 */
  ${props => (props.direction === 'left' || props.direction === 'right') && `
    display: inline-block;
    min-width: max-content;
    top: 50%;
  `}
  
  ${props => (props.direction === 'up' || props.direction === 'down') && `
    left: 50%;
  `}
`;

const ControlPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--card-background);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlLabel = styled.span`
  font-size: 14px;
  color: var(--text-color);
  width: 60px;
`;

const ControlButton = styled.button`
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

const SpeedInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const DirectionButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  
  &:hover {
    background-color: #3a7bc8;
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

const DebugPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  z-index: 100;
  max-width: 200px;
  
  .debug-item {
    margin-bottom: 4px;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 70px;
  left: 20px;
  background-color: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  z-index: 100;
  
  &:hover {
    background-color: var(--hover-background);
  }
`;

const CurtainMode = ({ onBack }) => {
  // 状态
  const [text, setText] = useState('欢迎使用幕模式，点击左下角设置按钮可以修改文本内容和滚动方向、速度。');
  const [fontSize, setFontSize] = useState(36);
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState('up'); // up, down, left, right
  const [position, setPosition] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editText, setEditText] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ containerSize: {}, textSize: {} });
  
  // 引用
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const animationRef = useRef(null);
  
  // 初始化数据
  useEffect(() => {
    const savedText = getFromStorage('curtain-text', '欢迎使用幕模式，点击左下角设置按钮可以修改文本内容和滚动方向、速度。');
    const savedFontSize = getFromStorage('curtain-font-size', 36);
    const savedSpeed = getFromStorage('curtain-speed', 1);
    const savedDirection = getFromStorage('curtain-direction', 'up');
    
    setText(savedText);
    setFontSize(savedFontSize);
    setSpeed(savedSpeed);
    setDirection(savedDirection);
    setEditText(savedText);
  }, []);
  
  // 处理动画
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    const updateAnimation = () => {
      // 等待DOM更新后再获取尺寸
      setTimeout(() => {
        if (!containerRef.current || !textRef.current) return;
        
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        // 使用scrollWidth和scrollHeight获取真实的文本尺寸
        const textWidth = textRef.current.scrollWidth;
        const textHeight = textRef.current.scrollHeight;
        
        // 更新调试信息
        setDebugInfo({
          containerSize: { width: containerWidth, height: containerHeight },
          textSize: { width: textWidth, height: textHeight }
        });
        
        let startPosition = 0;
        let endPosition = 0;
        const buffer = 100; // 增加缓冲区确保文本完全离开屏幕
        
        // 根据方向设置起始和结束位置，确保文本完全穿过屏幕
        if (direction === 'up') {
          startPosition = containerHeight + buffer; // 从屏幕底部下方开始
          endPosition = -textHeight - buffer; // 到屏幕顶部上方结束
        } else if (direction === 'down') {
          startPosition = -textHeight - buffer; // 从屏幕顶部上方开始
          endPosition = containerHeight + buffer; // 到屏幕底部下方结束
        } else if (direction === 'left') {
          startPosition = containerWidth + buffer; // 从屏幕右侧外开始
          endPosition = -textWidth - buffer; // 到屏幕左侧外结束
        } else if (direction === 'right') {
          startPosition = -textWidth - buffer; // 从屏幕左侧外开始
          endPosition = containerWidth + buffer; // 到屏幕右侧外结束
        }
        
        // 设置初始位置
        setPosition(startPosition);
        
        // 动画函数
        const animate = () => {
          setPosition(prevPosition => {
            // 计算新位置
            let newPosition;
            if (direction === 'up' || direction === 'left') {
              newPosition = prevPosition - Math.abs(speed);
            } else {
              newPosition = prevPosition + Math.abs(speed);
            }
            
            // 检查是否需要重置位置 - 确保文本完全离开屏幕后才重置
            if ((direction === 'up' || direction === 'left') && newPosition <= endPosition) {
              return startPosition;
            } else if ((direction === 'down' || direction === 'right') && newPosition >= endPosition) {
              return startPosition;
            }
            
            return newPosition;
          });
          
          animationRef.current = requestAnimationFrame(animate);
        };
        
        // 清除之前的动画
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        
        // 启动新动画
        animationRef.current = requestAnimationFrame(animate);
      }, 50);
    };
    
    updateAnimation();
    
    // 监听窗口大小变化
    const handleResize = () => {
      updateAnimation();
    };
    
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, speed, text, fontSize]);
  
  // 增加字体大小
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 4, 72);
    setFontSize(newSize);
    saveToStorage('curtain-font-size', newSize);
  };
  
  // 减小字体大小
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 4, 16);
    setFontSize(newSize);
    saveToStorage('curtain-font-size', newSize);
  };
  
  // 处理速度变化
  const handleSpeedChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setSpeed(value);
      saveToStorage('curtain-speed', value);
    }
  };
  
  // 设置方向
  const setScrollDirection = (dir) => {
    setDirection(dir);
    saveToStorage('curtain-direction', dir);
  };
  
  // 打开设置模态框
  const openSettingsModal = () => {
    setEditText(text);
    setShowModal(true);
  };
  
  // 关闭设置模态框
  const closeModal = () => {
    setShowModal(false);
  };
  
  // 处理文本变化
  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };
  
  // 保存设置
  const saveSettings = () => {
    setText(editText);
    saveToStorage('curtain-text', editText);
    closeModal();
  };
  
  // 切换控制面板显示
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };
  
  // 切换调试面板显示
  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };
  
  return (
    <CurtainContainer ref={containerRef}>
      <BackButton onClick={onBack} title="返回">
        <ArrowBackIcon />
      </BackButton>
      
      <ToggleButton onClick={toggleControls} title="切换控制面板">
        {showControls ? '隐藏控制' : '显示控制'}
      </ToggleButton>
      
      <MarqueeContainer>
        <MarqueeText 
          ref={textRef}
          fontSize={fontSize}
          direction={direction}
          position={position}
        >
          {text}
        </MarqueeText>
      </MarqueeContainer>
      
      {showControls && (
        <ControlPanel>
          <ControlRow>
            <ControlLabel>字体大小</ControlLabel>
            <ControlButton onClick={decreaseFontSize} title="减小字体">
              <TextDecreaseIcon />
            </ControlButton>
            <ControlButton onClick={increaseFontSize} title="增大字体">
              <TextIncreaseIcon />
            </ControlButton>
          </ControlRow>
          
          <ControlRow>
            <ControlLabel>滚动速度</ControlLabel>
            <SpeedInput 
              type="number" 
              value={speed} 
              onChange={handleSpeedChange} 
              step="0.5"
              min="0.1"
              max="10"
            />
          </ControlRow>
          
          <ControlRow>
            <ControlLabel>滚动方向</ControlLabel>
            <DirectionButton 
              active={direction === 'up'} 
              onClick={() => setScrollDirection('up')}
              title="向上滚动"
            >
              <ArrowUpwardIcon />
            </DirectionButton>
            <DirectionButton 
              active={direction === 'down'} 
              onClick={() => setScrollDirection('down')}
              title="向下滚动"
            >
              <ArrowDownwardIcon />
            </DirectionButton>
            <DirectionButton 
              active={direction === 'left'} 
              onClick={() => setScrollDirection('left')}
              title="向左滚动"
            >
              <ArrowBackIcon2 />
            </DirectionButton>
            <DirectionButton 
              active={direction === 'right'} 
              onClick={() => setScrollDirection('right')}
              title="向右滚动"
            >
              <ArrowForwardIcon />
            </DirectionButton>
          </ControlRow>
          
          <ControlRow>
            <ControlButton onClick={openSettingsModal} title="设置文本内容">
              <SettingsIcon />
            </ControlButton>
            <ControlButton onClick={toggleDebug} title="调试信息">
              🐛
            </ControlButton>
          </ControlRow>
        </ControlPanel>
      )}
      
      {showDebug && (
        <DebugPanel>
          <div className="debug-item">
            <strong>容器尺寸:</strong>
          </div>
          <div className="debug-item">
            宽: {debugInfo.containerSize.width}px
          </div>
          <div className="debug-item">
            高: {debugInfo.containerSize.height}px
          </div>
          <div className="debug-item">
            <strong>文本尺寸:</strong>
          </div>
          <div className="debug-item">
            宽: {debugInfo.textSize.width}px
          </div>
          <div className="debug-item">
            高: {debugInfo.textSize.height}px
          </div>
          <div className="debug-item">
            <strong>当前位置:</strong> {Math.round(position)}px
          </div>
          <div className="debug-item">
            <strong>滚动方向:</strong> {direction}
          </div>
          <div className="debug-item">
            <strong>滚动速度:</strong> {speed}px/frame
          </div>
        </DebugPanel>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>设置文本内容</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <TextArea 
              value={editText} 
              onChange={handleTextChange}
              placeholder="输入要显示的文本内容"
            />
            
            <ButtonGroup>
              <Button className="secondary" onClick={closeModal}>取消</Button>
              <Button className="primary" onClick={saveSettings}>保存</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </CurtainContainer>
  );
};

export default CurtainMode;