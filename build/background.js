// 后台脚本，用于处理扩展的后台任务

// 监听安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装时的操作
    console.log('扩展已安装');
    
    // 初始化默认设置
    const defaultSettings = {
      theme: 'light',
      background: {
        type: 'color',
        value: '#ffffff',
        opacity: 1,
        brightness: 1,
        blurAmount: 0,
        size: 'cover',
        repeat: 'no-repeat',
        overlayOpacity: 0
      },
      search: {
        engine: 'bing',
        removeNonUrl: false
      },
      modules: {
        calendar: {
          enabled: true,
          showZhuJiLi: false
        },
        bookmark: {
          enabled: true
        },
        todo: {
          enabled: true,
          notificationSound: true
        },
        note: {
          enabled: true
        },
        quote: {
          enabled: true,
          fontSize: 16,
          quotes: ['既然胜负未分,则应力挽狂澜']
        },
        news: {
          enabled: true,
          sources: []
        }
      },
      zenMode: {
        clockSize: 200,
        focusTime: 25
      },
      curtainMode: {
        fontSize: 24,
        speed: 2,
        direction: 'up'
      }
    };
    
    // 保存默认设置到存储
    chrome.storage.local.set({ 'homepage-settings': defaultSettings }, () => {
      console.log('默认设置已保存');
    });
    
    // 打开欢迎页面
    chrome.tabs.create({ url: 'index.html?welcome=true' });
  } else if (details.reason === 'update') {
    // 更新时的操作
    console.log(`扩展已更新到版本 ${chrome.runtime.getManifest().version}`);
  }
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    // 获取设置
    chrome.storage.local.get('homepage-settings', (data) => {
      sendResponse({ settings: data['homepage-settings'] });
    });
    return true; // 异步响应
  } else if (message.type === 'SAVE_SETTINGS') {
    // 保存设置
    chrome.storage.local.set({ 'homepage-settings': message.settings }, () => {
      sendResponse({ success: true });
    });
    return true; // 异步响应
  } else if (message.type === 'SHOW_NOTIFICATION') {
    // 显示通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: message.title || '提醒',
      message: message.message || '',
      priority: 2
    });
    sendResponse({ success: true });
    return false;
  }
});

// 设置定时器检查待办事项提醒
const checkTodoReminders = () => {
  chrome.storage.local.get('homepage-todos', (data) => {
    const todos = data['homepage-todos'] || [];
    const now = new Date();
    
    todos.forEach(todo => {
      if (todo.notification && !todo.completed && !todo.notified) {
        const notificationTime = new Date(todo.notification);
        
        // 如果当前时间在通知时间的前后1分钟内
        if (Math.abs(now - notificationTime) < 60000) {
          // 显示通知
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: '待办提醒',
            message: todo.name,
            priority: 2
          });
          
          // 标记为已通知
          todo.notified = true;
          chrome.storage.local.set({ 'homepage-todos': todos });
        }
      }
    });
  });
};

// 每分钟检查一次待办事项提醒
setInterval(checkTodoReminders, 60000);