import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--background-color, #ffffff);
  color: var(--text-color, #333333);
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color, rgba(0, 0, 0, 0.1));
  border-top: 4px solid var(--primary-color, #4a90e2);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: var(--text-color, #333333);
  margin-bottom: 10px;
`;

const LoadingSubtext = styled.div`
  font-size: 14px;
  color: var(--text-secondary-color, #666666);
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
`;

const Loading = ({ 
  text = '正在加载...', 
  subtext = '请稍候，正在初始化应用程序',
  showSpinner = true 
}) => {
  return (
    <LoadingContainer>
      {showSpinner && <LoadingSpinner />}
      <LoadingText>{text}</LoadingText>
      {subtext && <LoadingSubtext>{subtext}</LoadingSubtext>}
    </LoadingContainer>
  );
};

export default Loading;