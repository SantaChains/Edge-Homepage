import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
// import { saveToStorage, getFromStorage } from '../../utils/storage'; // 暂时未使用

// 图标导入
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimerIcon from '@mui/icons-material/Timer';

const ZenContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  position: relative;
`;

const ClockContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 40px;
`;

const ClockCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid var(--text-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const ClockCenter = styled.div`
  width: 12px;
  height: 12px;
  background-color: var(--text-color);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const ClockHand = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: bottom center;
  background-color: var(--text-color);
  border-radius: 2px;
  
  &.hour {
    width: 4px;
    height: 60px;
    transform: translate(-50%, -100%) rotate(${props => props.rotation}deg);
  }
  
  &.minute {
    width: 3px;
    height: 90px;
    transform: translate(-50%, -100%) rotate(${props => props.rotation}deg);
  }
  
  &.second {
    width: 2px;
    height: 120px;
    background-color: var(--primary-color);
    transform: translate(-50%, -100%) rotate(${props => props.rotation}deg);
  }
`;

const ClockNumbers = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const ClockNumber = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  transform: rotate(${props => props.rotation}deg);
  
  span {
    display: inline-block;
    transform: rotate(${props => -props.rotation}deg);
    font-size: 18px;
    font-weight: 500;
    color: var(--text-color);
  }
`;

const TimerDisplay = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
  font-family: monospace;
`;

const TimerTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 30px;
  text-align: center;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const ControlButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  svg {
    font-size: 30px;
  }
`;

const TimerControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const TimerInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TimeInput = styled.input`
  width: 60px;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const TimeLabel = styled.span`
  font-size: 16px;
  color: var(--text-color);
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
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const ZenMode = ({ onBack }) => {
  // 状态
  const [mode, setMode] = useState('clock'); // clock, focus, timer
  const [time, setTime] = useState(new Date());
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timerTitle, setTimerTitle] = useState('');
  
  // 定时器引用
  const clockInterval = useRef(null);
  const timerInterval = useRef(null);
  
  // 初始化时钟
  useEffect(() => {
    clockInterval.current = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(clockInterval.current);
    };
  }, []);
  
  // 处理计时器
  useEffect(() => {
    if (timerRunning && !timerPaused) {
      timerInterval.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (mode === 'focus') {
            // 专注模式是倒计时
            if (prev <= 0) {
              clearInterval(timerInterval.current);
              setTimerRunning(false);
              return 0;
            }
            return prev - 1;
          } else {
            // 计时器模式是正计时
            return prev + 1;
          }
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timerInterval.current);
    };
  }, [timerRunning, timerPaused, mode]);
  
  // 启动专注模式
  const startFocus = () => {
    setMode('focus');
    setTimerTitle('番茄专注');
    setTimerSeconds(focusMinutes * 60);
    setTimerRunning(true);
    setTimerPaused(false);
  };
  
  // 启动计时器
  const startTimer = () => {
    setMode('timer');
    setTimerTitle('番茄计时');
    setTimerSeconds(0);
    setTimerRunning(true);
    setTimerPaused(false);
  };
  
  // 暂停计时器
  const pauseTimer = () => {
    setTimerPaused(true);
  };
  
  // 继续计时器
  const resumeTimer = () => {
    setTimerPaused(false);
  };
  
  // 停止计时器
  const stopTimer = () => {
    setTimerRunning(false);
    setTimerPaused(false);
    setMode('clock');
  };
  
  // 返回时钟
  const backToClock = () => {
    setMode('clock');
    setTimerRunning(false);
    setTimerPaused(false);
  };
  
  // 处理专注时间输入变化
  const handleFocusMinutesChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setFocusMinutes(value);
    }
  };
  
  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 计算时钟指针角度
  const getHourRotation = () => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    return (hours * 30) + (minutes * 0.5); // 每小时30度，每分钟0.5度
  };
  
  const getMinuteRotation = () => {
    const minutes = time.getMinutes();
    return minutes * 6; // 每分钟6度
  };
  
  const getSecondRotation = () => {
    const seconds = time.getSeconds();
    return seconds * 6; // 每秒6度
  };
  
  // 渲染时钟数字
  const renderClockNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const rotation = i * 30; // 每个数字间隔30度
      numbers.push(
        <ClockNumber key={i} rotation={rotation}>
          <span style={{ position: 'absolute', top: '10px', width: '100%' }}>
            {i}
          </span>
        </ClockNumber>
      );
    }
    return numbers;
  };
  
  return (
    <ZenContainer>
      <BackButton onClick={onBack} title="返回">
        <ArrowBackIcon />
      </BackButton>
      
      {mode === 'clock' && (
        <>
          <ClockContainer>
            <ClockCircle>
              <ClockNumbers>
                {renderClockNumbers()}
              </ClockNumbers>
              <ClockHand className="hour" rotation={getHourRotation()} />
              <ClockHand className="minute" rotation={getMinuteRotation()} />
              <ClockHand className="second" rotation={getSecondRotation()} />
              <ClockCenter />
            </ClockCircle>
          </ClockContainer>
          
          <ControlsContainer>
            <ControlButton onClick={startFocus} title="开始专注">
              <TimerIcon />
            </ControlButton>
            <ControlButton onClick={startTimer} title="开始计时">
              <PlayArrowIcon />
            </ControlButton>
          </ControlsContainer>
          
          <TimerInput>
            <TimeInput 
              type="number" 
              value={focusMinutes} 
              onChange={handleFocusMinutesChange} 
              min="1"
            />
            <TimeLabel>分钟</TimeLabel>
          </TimerInput>
        </>
      )}
      
      {(mode === 'focus' || mode === 'timer') && (
        <TimerControls>
          <TimerTitle>{timerTitle}</TimerTitle>
          <TimerDisplay>{formatTime(timerSeconds)}</TimerDisplay>
          
          <ControlsContainer>
            {timerRunning && !timerPaused ? (
              <ControlButton onClick={pauseTimer} title="暂停">
                <PauseIcon />
              </ControlButton>
            ) : (
              <ControlButton onClick={resumeTimer} title="继续">
                <PlayArrowIcon />
              </ControlButton>
            )}
            
            <ControlButton onClick={stopTimer} title="停止">
              <StopIcon />
            </ControlButton>
            
            <ControlButton onClick={backToClock} title="返回时钟">
              <ArrowBackIcon />
            </ControlButton>
          </ControlsContainer>
        </TimerControls>
      )}
    </ZenContainer>
  );
};

export default ZenMode;