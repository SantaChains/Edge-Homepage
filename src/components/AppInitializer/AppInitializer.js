import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { EnhancedSettingsProvider } from '../../contexts/EnhancedSettingsContext';
import PreLoader from '../PreLoader/PreLoader';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const InitializerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const AppContent = styled.div`
  opacity: ${props => props.isReady ? 1 : 0};
  transition: opacity 0.5s ease;
  width: 100%;
  height: 100%;
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.5s ease, visibility 0.5s ease;
  animation: ${props => props.isHiding ? fadeOut : 'none'} 0.5s ease;
`;

const AppInitializer = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  const handleLoadComplete = () => {
    setIsHiding(true);
    
    setTimeout(() => {
      setShowLoader(false);
      setIsAppReady(true);
    }, 500);
  };

  // 监听页面可见性变化，确保设置在页面重新激活时正确应用
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAppReady) {
        // 页面重新激活时，重新应用设置
        const event = new CustomEvent('reapplySettings');
        window.dispatchEvent(event);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAppReady]);

  return (
    <EnhancedSettingsProvider>
      <InitializerWrapper>
        <LoaderOverlay isVisible={showLoader} isHiding={isHiding}>
          <PreLoader onLoadComplete={handleLoadComplete} />
        </LoaderOverlay>
        
        <AppContent isReady={isAppReady}>
          {children}
        </AppContent>
      </InitializerWrapper>
    </EnhancedSettingsProvider>
  );
};

export default AppInitializer;