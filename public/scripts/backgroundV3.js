const MAIN_MENU_ID = 'fe-tools-main';

const handleTabCreate = url => {
  try {
    chrome.tabs.create({
      url,
    });
  } catch (e) {
    console.warn(e);
  }
};

const CONFIG_LIST = [
  {
    id: 'translate',
    title: '快速翻译',
    contexts: ['all'],
  },
  {
    id: 'copyAntPaste',
    title: '开启表单复制粘贴',
    contexts: ['all'],
  },
  {
    id: 'showImgLink',
    title: '开/关快捷获取图片和时间戳功能',
    contexts: ['all'],
  },
];

// create QRcode
chrome.runtime.onInstalled.addListener(() => {
  // 使用 `chrome.contextMenus.create` 方法替代 `chrome.contextMenus.create`
  CONFIG_LIST.forEach(item => {
    chrome.contextMenus.create({
      title: item.title,
      contexts: item.contexts,
      id: item.id,
      parentId: MAIN_MENU_ID,
    });
  });
});

chrome.contextMenus.create({
  id: MAIN_MENU_ID,
  title: 'Timo工具',
  contexts: ['all'],
  documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*']
});
/**
 * 右键菜单点击事件
 */
chrome.contextMenus.onClicked.addListener((data, tab) => {
  if (data.menuItemId === 'qrCode') {
    handleTabCreate('index.html?search=qrcode&message=' + tab.url);
  } else if (data.menuItemId === 'translate') {
    // 发送消息给 content script 执行脚本
    chrome.tabs.sendMessage(tab.id, {
      action: 'executeScriptAndHandleTabCreate',
      code: 'window.getSelection().toString();',
      type: 'translate',
    });
  } else if (data.menuItemId === 'copyAntPaste') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'showCopyAndPasteBtn',
      type: 'copyAntPaste',
    });
  } else if (data.menuItemId === 'showImgLink') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'showImgLink',
      type: 'showImgLink',
    });
  }
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'handleTabCreate') {
    handleTabCreate(message.url);
  }
});
