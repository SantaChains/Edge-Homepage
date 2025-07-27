/**
 * 背景管理器 - 专门处理背景设置和应用
 */

class BackgroundManager {
  constructor() {
    this.backgroundContainer = null;
    this.currentSettings = null;
    this.isInitialized = false;
  }

  /**
   * 初始化背景管理器
   */
  initialize() {
    if (this.isInitialized) return;

    // 创建专用的背景容器
    this.createBackgroundContainer();
    this.isInitialized = true;
    
    console.log('背景管理器初始化完成');
  }

  /**
   * 创建背景容器
   */
    createBackgroundContainer() {
      // 移除现有的背景容器
      const existingContainer = document.getElementById('homepage-background');
      if (existingContainer) {
        existingContainer.remove();
      }

      // 创建新的背景容器
      this.backgroundContainer = document.createElement('div');
      this.backgroundContainer.id = 'homepage-background';
      this.backgroundContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        transition: all 0.3s ease;
      `;

      const insert = () => {
        // 插入到 html，与 body 平级，确保位于内容下方
        const root = document.documentElement;
        root.insertBefore(this.backgroundContainer, root.firstElementChild);
        console.log('背景容器创建成功');
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insert);
      } else {
        insert();
      }
    }

  /**
   * 应用背景设置
   */
  applySettings(settings) {
    if (!this.isInitialized) {
      this.initialize();
    }

    this.currentSettings = settings;
    console.log('应用背景设置:', settings);

    // 清除现有样式
    this.clearBackground();

    // 重置 body 背景为透明，避免被遮盖
    document.body.style.setProperty('background', 'transparent', 'important');
    document.body.style.backgroundImage = 'none';

    if (!settings || settings.showBackground === false) {
      this.hideBackground();
      return;
    }

    // 根据背景类型应用设置
    switch (settings.backgroundType) {
      case 'color':
        this.applyColorBackground(settings);
        break;
      case 'image':
        this.applyImageBackground(settings);
        break;
      case 'gradient':
        this.applyGradientBackground(settings);
        break;
      default:
        this.applyDefaultBackground();
    }

    // 应用通用效果
    this.applyEffects(settings);
    
    console.log('背景应用完成，容器状态:', this.getCurrentInfo());
  }

  /**
   * 清除背景
   */
  clearBackground() {
    if (this.backgroundContainer) {
      this.backgroundContainer.style.background = '';
      this.backgroundContainer.style.backgroundImage = '';
      this.backgroundContainer.style.backgroundSize = '';
      this.backgroundContainer.style.backgroundPosition = '';
      this.backgroundContainer.style.backgroundRepeat = '';
      this.backgroundContainer.style.backgroundAttachment = '';
      this.backgroundContainer.style.opacity = '';
      this.backgroundContainer.style.filter = '';
    }
  }

  /**
   * 隐藏背景
   */
  hideBackground() {
    if (this.backgroundContainer) {
      this.backgroundContainer.style.display = 'none';
    }
    
    // 设置默认背景色
    const theme = this.currentSettings?.theme || 'light';
    document.body.style.backgroundColor = theme === 'dark' ? '#121212' : '#ffffff';
  }

  /**
   * 应用纯色背景
   */
  applyColorBackground(settings) {
    if (!this.backgroundContainer) return;

    const color = settings.backgroundColor || '#ffffff';
    this.backgroundContainer.style.backgroundColor = color;
    this.backgroundContainer.style.backgroundImage = 'none';
    this.backgroundContainer.style.display = 'block';
  }

  /**
   * 应用图片背景
   */
  applyImageBackground(settings) {
    if (!this.backgroundContainer || !settings.backgroundImage) {
      console.warn('背景容器不存在或图片URL为空');
      return;
    }

    const imageUrl = settings.backgroundImage;
    const fit = settings.backgroundFit || 'cover';

    console.log('应用图片背景:', imageUrl, '适应方式:', fit);

    this.backgroundContainer.style.backgroundImage = `url("${imageUrl}")`;
    this.backgroundContainer.style.backgroundSize = fit;
    this.backgroundContainer.style.backgroundPosition = 'center center';
    this.backgroundContainer.style.backgroundRepeat = 'no-repeat';
    this.backgroundContainer.style.backgroundAttachment = 'fixed';
    this.backgroundContainer.style.display = 'block';

    // 预加载图片以确保显示
    const img = new Image();
    img.onload = () => {
      console.log('背景图片加载成功:', imageUrl);
    };
    img.onerror = () => {
      console.error('背景图片加载失败:', imageUrl);
      this.applyDefaultBackground();
    };
    img.src = imageUrl;
  }

  /**
   * 应用渐变背景
   */
  applyGradientBackground(settings) {
    if (!this.backgroundContainer) return;

    const {
      gradientType = 'linear',
      gradientDirection = 'to right',
      gradientColors = ['#4a90e2', '#9b59b6'],
      gradientStops = [0, 100]
    } = settings;

    if (!gradientColors || gradientColors.length < 2) {
      this.applyDefaultBackground();
      return;
    }

    let gradient;
    if (gradientType === 'radial') {
      gradient = `radial-gradient(circle, ${gradientColors[0]} ${gradientStops[0]}%, ${gradientColors[1]} ${gradientStops[1]}%)`;
    } else {
      gradient = `linear-gradient(${gradientDirection}, ${gradientColors[0]} ${gradientStops[0]}%, ${gradientColors[1]} ${gradientStops[1]}%)`;
    }

    this.backgroundContainer.style.background = gradient;
    this.backgroundContainer.style.backgroundImage = gradient;
    this.backgroundContainer.style.display = 'block';
  }

  /**
   * 应用默认背景
   */
  applyDefaultBackground() {
    if (!this.backgroundContainer) return;

    const theme = this.currentSettings?.theme || 'light';
    const defaultColor = theme === 'dark' ? '#121212' : '#ffffff';
    
    this.backgroundContainer.style.backgroundColor = defaultColor;
    this.backgroundContainer.style.backgroundImage = 'none';
    this.backgroundContainer.style.display = 'block';
  }

  /**
   * 应用背景效果
   */
  applyEffects(settings) {
    if (!this.backgroundContainer) return;

    // 透明度
    const opacity = settings.backgroundOpacity !== undefined ? settings.backgroundOpacity : 1;
    this.backgroundContainer.style.opacity = opacity;

    // 滤镜效果
    const filters = [];
    
    if (settings.backgroundBrightness !== undefined && settings.backgroundBrightness !== 1) {
      filters.push(`brightness(${settings.backgroundBrightness})`);
    }
    
    if (settings.backgroundBlur !== undefined && settings.backgroundBlur > 0) {
      filters.push(`blur(${settings.backgroundBlur}px)`);
    }

    this.backgroundContainer.style.filter = filters.length > 0 ? filters.join(' ') : '';
  }

  /**
   * 预览背景设置（不保存）
   */
  previewSettings(settings) {
    const originalSettings = this.currentSettings;
    this.applySettings(settings);
    
    // 3秒后恢复原设置
    setTimeout(() => {
      if (originalSettings) {
        this.applySettings(originalSettings);
      }
    }, 3000);
  }

  /**
   * 获取当前背景信息
   */
  getCurrentInfo() {
    return {
      isInitialized: this.isInitialized,
      hasContainer: !!this.backgroundContainer,
      containerVisible: this.backgroundContainer?.style.display !== 'none',
      currentSettings: this.currentSettings
    };
  }

  /**
   * 销毁背景管理器
   */
  destroy() {
    if (this.backgroundContainer) {
      this.backgroundContainer.remove();
      this.backgroundContainer = null;
    }
    
    this.currentSettings = null;
    this.isInitialized = false;
  }
}

// 创建全局实例
const backgroundManager = new BackgroundManager();

// 自动初始化背景管理器
const initializeBackgroundManager = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      backgroundManager.initialize();
    });
  } else {
    backgroundManager.initialize();
  }
};

// 立即尝试初始化
initializeBackgroundManager();

export default backgroundManager;
