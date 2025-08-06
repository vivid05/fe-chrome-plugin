<template>
  <div @click.stop="stopPropagation">
    <!-- 圆形折叠模型选择器 -->
    <div class="model-selector-circle">
      <div 
        class="model-circle" 
        @click="showModelSelector = !showModelSelector"
        :title="getCurrentModel().name"
        :class="{ 'model-circle--expanded': showModelSelector }"
      >
        <span class="model-icon">🤖</span>
        <span v-if="showModelSelector" class="model-name-expanded">{{ getCurrentModel().name }}</span>
        <span v-if="showModelSelector" class="toggle-arrow" :class="{ 'toggle-arrow--open': showModelSelector }">▼</span>
      </div>

      <!-- 模型选择下拉菜单 -->
      <div v-if="showModelSelector" class="model-dropdown-circle" @click.stop>
        <div
          v-for="model in aiModels"
          :key="model.id"
          class="model-option-circle"
          :class="{ 'model-option-circle--selected': selectedModel === model.id }"
          @click="selectModel(model.id)"
        >
          {{ model.name }}
        </div>
      </div>
    </div>

    <div class="chat">
      <div ref="chatBox" class="chat-box">
        <template v-for="(item, index) in chatList" :key="index">
          <div
            v-if="item.role === 'assistant'"
            class="ai"
            v-html="renderMarkdown(item.content)"
          ></div>
          <div v-else class="self-box">
            <p class="self">{{ item.content }}</p>
          </div>
        </template>
        <div
          v-if="resultTxt"
          :style="{ '--display': isHandleText ? 'inline-block' : 'none' }"
          class="ai cur"
          v-html="renderMarkdown(resultTxt)"
        ></div>
      </div>
      <div v-if="isLoading" class="loading">
        <svg
          t="1692352914771"
          class="icon rotating"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4123"
          width="15"
          height="15"
        >
          <path
            d="M512 249.5c-22.5 0-37.5-15-37.5-37.5V99.5c0-22.5 15-37.5 37.5-37.5s37.5 15 37.5 37.5V212c0 22.5-15 37.5-37.5 37.5z m0 712.5c-22.5 0-37.5-15-37.5-37.5V812c0-22.5 15-37.5 37.5-37.5s37.5 15 37.5 37.5v112.5c0 22.5-15 37.5-37.5 37.5zM212 549.5H99.5C77 549.5 62 534.5 62 512s15-37.5 37.5-37.5H212c22.5 0 37.5 15 37.5 37.5s-15 37.5-37.5 37.5z m712.5 0H812c-22.5 0-37.5-15-37.5-37.5s15-37.5 37.5-37.5h112.5c22.5 0 37.5 15 37.5 37.5s-15 37.5-37.5 37.5z m-153.75-150c-11.25 0-26.25-7.5-33.75-18.75-11.25-18.75-3.75-41.25 15-52.5L849.5 272c18.75-11.25 41.25-3.75 52.5 15s3.75 41.25-15 52.5l-97.5 56.25c-3.75 3.75-11.25 3.75-18.75 3.75z m-615 356.25c-11.25 0-26.25-7.5-33.75-18.75-11.25-18.75-3.75-41.25 15-52.5l97.5-56.25c18.75-11.25 41.25-3.75 52.5 15s3.75 41.25-15 52.5L174.5 752c-7.5 3.75-15 3.75-18.75 3.75z m506.25-465c-7.5 0-11.25 0-18.75-3.75-18.75-11.25-22.5-33.75-15-52.5L684.5 137c11.25-18.75 33.75-22.5 52.5-15 18.75 11.25 22.5 33.75 15 52.5L695.75 272c-7.5 11.25-22.5 18.75-33.75 18.75z m-356.25 615c-7.5 0-11.25 0-18.75-3.75-18.75-11.25-22.5-33.75-15-52.5l56.25-97.5c11.25-15 33.75-22.5 52.5-11.25s22.5 33.75 15 52.5L339.5 887c-7.5 11.25-22.5 18.75-33.75 18.75z m-52.5-506.25c-7.5 0-15 0-18.75-3.75L137 339.5c-18.75-11.25-26.25-33.75-15-52.5s33.75-22.5 52.5-15l97.5 56.25c18.75 11.25 22.5 33.75 11.25 52.5-3.75 11.25-18.75 18.75-30 18.75z m615 356.25c-7.5 0-11.25 0-18.75-3.75L752 695.75c-18.75-11.25-22.5-33.75-15-52.5 11.25-18.75 33.75-22.5 52.5-15L887 684.5c18.75 11.25 22.5 33.75 15 52.5-7.5 11.25-18.75 18.75-33.75 18.75zM362 290.75c-11.25 0-26.25-7.5-33.75-18.75L272 174.5c-7.5-18.75-3.75-41.25 15-52.5s41.25-3.75 52.5 15l56.25 97.5c7.5 18.75 3.75 41.25-15 48.75-7.5 3.75-11.25 7.5-18.75 7.5z m356.25 615c-11.25 0-26.25-7.5-33.75-18.75l-56.25-97.5c-11.25-18.75-3.75-41.25 15-52.5s41.25-3.75 52.5 15L752 849.5c11.25 18.75 3.75 41.25-15 52.5-7.5 3.75-11.25 3.75-18.75 3.75z"
            fill="#6495ED"
            p-id="4124"
          ></path>
        </svg>
      </div>
      <div class="input-box">
        <textarea
          ref="textarea"
          v-model="userInput"
          placeholder="你想问什么?"
          @keyup.enter="onSend"
        />
        <div class="input-controls">
          <button
            class="btn"
            :class="{ 'btn--disable': isLoading || !userInput.trim() }"
            @click="onSend"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheAI',
};
</script>
<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';
import CryptoJS from 'crypto-js';
import OpenAI from 'openai';
import MarkdownIt from 'markdown-it';

// SiliconFlow AI配置
const AI_API_TOKEN = import.meta.env.VITE_AI_API_TOKEN;
const openai = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1/',
  apiKey: AI_API_TOKEN,
  dangerouslyAllowBrowser: true,
});

const textarea = ref();

// 初始化markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// 模型选择相关
const selectedModel = ref('moonshotai/Kimi-K2-Instruct');
const showModelSelector = ref(false);

// 可用的AI模型列表
const aiModels = [
  {
    id: 'zai-org/GLM-4.5',
    name: 'GLM-4.5',
  },
  {
    id: 'Qwen/Qwen3-235B-A22B-Instruct-2507',
    name: 'Qwen3-235B',
  },
  {
    id: 'moonshotai/Kimi-K2-Instruct',
    name: 'Kimi-K2',
  },
];

onMounted(() => {
  nextTick(() => {
    textarea.value.focus();
  });

  // 点击外部关闭模型选择器
  document.addEventListener('click', event => {
    const modelSelector = document.querySelector('.model-selector');
    const modelDropdown = document.querySelector('.model-dropdown');
    if (
      modelSelector &&
      !modelSelector.contains(event.target) &&
      modelDropdown &&
      !modelDropdown.contains(event.target)
    ) {
      showModelSelector.value = false;
    }
  });
});

const stopPropagation = () => {
  return false;
};

const getWebsocketUrl = () => {
  return new Promise(resolve => {
    const apiKey = '42b7e6264723824af07e90f3e5756b1d';
    const apiSecret = 'MDU3MGUyMTlmMWRjZTVmNTUxYTExMWNl';
    let url = 'wss://spark-api.xf-yun.com/v4.0/chat';
    const host = 'spark-api.xf-yun.com';
    const date = new Date().toUTCString();
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v4.0/chat HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    resolve(url);
  });
};

const isFinished = ref(false);
const isLoading = ref(false);
const chatBox = ref();
const chatList = ref([]);
const resultTxt = ref('');
const userInput = ref('');
const params = ref({
  header: {
    app_id: '3f32ea2e',
    uid: '1',
  },
  parameter: {
    chat: {
      domain: '4.0Ultra',
      temperature: 0.5,
      max_tokens: 4096,
    },
  },
  payload: {
    message: {
      text: [],
    },
  },
});

const updateScroll = () => {
  nextTick(() => {
    const scrollHeight = chatBox.value.scrollHeight;
    chatBox.value.scrollTop = scrollHeight;
  });
};

// 获取当前选中的模型信息
const getCurrentModel = () => {
  return aiModels.find(model => model.id === selectedModel.value) || aiModels[0];
};

// 选择模型
const selectModel = modelId => {
  selectedModel.value = modelId;
  showModelSelector.value = false;
};

// 新的AI问答函数使用SiliconFlow API
const chatWithSiliconFlow = async messages => {
  try {
    // 构建包含系统提示词的消息数组
    const systemMessage = {
      role: 'system',
      content:
        '你是一个友好、有趣的AI助手。请在回复中适当使用emoji表情来增强表达效果，让对话更加生动有趣。根据内容情感和语境选择合适的emoji，但不要过度使用。保持专业且友好的语气。',
    };

    const messagesWithSystem = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: selectedModel.value,
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        displayText(content);
      }
    }

    // 标记完成状态
    isFinished.value = true;
    // 确保显示完最后的文本
    if (!displayInterval && fullResponse) {
      displayText('');
    }

    return fullResponse;
  } catch (error) {
    console.error('SiliconFlow AI请求失败:', error);
    throw error;
  }
};

const onSend = async () => {
  if (!userInput.value.trim() || isLoading.value) {
    return;
  }

  chatList.value.push({ role: 'user', content: userInput.value });
  updateScroll();
  isLoading.value = true;
  isFinished.value = false; // 重置完成状态
  userInput.value = '';

  try {
    // 首先尝试使用SiliconFlow AI API
    await chatWithSiliconFlow(chatList.value);
  } catch (aiError) {
    console.warn('SiliconFlow AI请求失败，回退到原WebSocket接口:', aiError);

    // 回退到原有的WebSocket接口
    try {
      params.value.payload.message.text = chatList.value;
      const url = await getWebsocketUrl();
      let socket = null;

      socket = new WebSocket(url);
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify(params.value));
      });
      socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        const result = data.payload.choices.text[0].content;
        isFinished.value = data.header.status === 2;
        displayText(result);
      });
      socket.addEventListener('close', () => {
        isLoading.value = false;
      });
      socket.addEventListener('error', () => {
        isLoading.value = false;
        alert('AI服务暂时不可用，请稍后再试');
      });
    } catch (wsError) {
      console.error('WebSocket连接也失败:', wsError);
      isLoading.value = false;
      alert('AI服务暂时不可用，请稍后再试');
    }
  }
};

let displayInterval;
let currentText = '';
let charIndex = 0;

const displayText = newText => {
  currentText += newText;

  if (!displayInterval) {
    displayInterval = setInterval(displayCharacter, 20);
  }
};

const isHandleText = ref(false);
// 渲染markdown
const renderMarkdown = text => {
  return md.render(text);
};

const displayCharacter = () => {
  isHandleText.value = true;
  if (charIndex < currentText.length) {
    resultTxt.value += currentText[charIndex];
    updateScroll();
    charIndex++;
  } else {
    if (isFinished.value || currentText.length === 0) {
      if (resultTxt.value) {
        chatList.value.push({ role: 'assistant', content: resultTxt.value });
      }
      resultTxt.value = '';
      isHandleText.value = false;
      isLoading.value = false; // 确保loading状态结束
    }
    clearInterval(displayInterval);
    displayInterval = null;
    currentText = '';
    charIndex = 0;
  }
};
</script>

<style scoped>
.chat {
  position: relative;
  width: 460px;
  height: 450px;
  background-color: #efede6;
  font-size: 16px;
  padding: 20px;
}
.chat-box {
  height: 380px;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
.chat-box::-webkit-scrollbar {
  display: none;
}
.ai {
  white-space: break-spaces;
  width: fit-content;
  color: #1c1917;
  border-radius: 10px;
  padding: 8px 12px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.024) 0px 0px 5px,
    rgba(0, 0, 0, 0.05) 0px 1px 2px;
  margin-bottom: 20px;
}

/* Markdown样式 */
.ai h1,
.ai h2,
.ai h3,
.ai h4,
.ai h5,
.ai h6 {
  margin: 0.5em 0;
  font-weight: bold;
}

.ai h1 {
  font-size: 1.5em;
}
.ai h2 {
  font-size: 1.3em;
}
.ai h3 {
  font-size: 1.1em;
}

.ai p {
  margin: 0.5em 0;
  line-height: 1.5;
}

.ai code {
  background-color: #f1f3f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.ai pre {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.ai pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
}

.ai blockquote {
  border-left: 4px solid #ddd;
  margin: 0.5em 0;
  padding-left: 12px;
  color: #666;
}

.ai ul,
.ai ol {
  margin: 0.5em 0;
  padding-left: 20px;
}

.ai li {
  margin: 0.2em 0;
}

.ai strong {
  font-weight: bold;
}

.ai em {
  font-style: italic;
}

.ai a {
  color: #007bff;
  text-decoration: none;
}

.ai a:hover {
  text-decoration: underline;
}

.ai table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}

.ai th,
.ai td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.ai th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.cur {
  position: relative;
}
.cur::after {
  content: '';
  height: 22px;
  width: 3px;
  margin-left: 3px;
  position: absolute;
  bottom: 8px;
  background-color: #000;
  display: var(--display);
  font-size: 16px;
  line-height: 22px;
  animation: flashing 1s infinite;
  transition: all 0.1s linear;
}
@keyframes flashing {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.self-box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.self {
  width: fit-content;
  color: #1c1917;
  border-radius: 10px;
  padding: 8px 12px;
  background-color: #dad3c8;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 0.5px, rgba(0, 0, 0, 0.024) 0px 0px 5px,
    rgba(0, 0, 0, 0.05) 0px 1px 2px;
}
.input-box {
  position: absolute;
  bottom: 20px;
  display: flex;
}
.input-box textarea {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  width: 360px;
  outline: #8f57ff;
  resize: none;
}
.loading {
  text-align: center;
  height: 15px;
  margin-top: -3px;
}
.rotating {
  animation: rotating 0.5s linear infinite;
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.btn {
  cursor: pointer;
  float: right;
  margin-left: 20px;
  width: fit-content;
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
  border: 1px solid #dcdfe6;
  padding: 8px 12px;
  border-radius: 6px;
}
.btn--disable {
  background-color: #b3e19d;
  border-color: #b3e19d;
  cursor: not-allowed;
}

/* 圆形折叠模型选择器样式 */
.model-selector-circle {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1000;
}

.model-circle {
  display: flex;
  align-items: center;
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(200, 200, 200, 0.8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  width: 24px;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  will-change: transform, width, border-radius, padding;
}

.model-circle--expanded {
  border-radius: 12px;
  width: auto;
  padding: 4px 8px;
  min-width: 80px;
}

.model-circle:hover {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: scale(1.05) translateZ(0);
}

.model-circle:active,
.model-circle:focus {
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.model-icon {
  font-size: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: margin;
}

.model-circle--expanded .model-icon {
  margin-right: 4px;
}

.model-name-expanded {
  font-size: 9px;
  color: #555;
  font-weight: 500;
  margin-right: 2px;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  animation: slideInFade 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  will-change: opacity, transform;
}

.toggle-arrow {
  font-size: 8px;
  color: #777;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 2px;
  opacity: 0;
  transform: translateX(-5px);
  animation: slideInFade 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
  will-change: opacity, transform;
}

.toggle-arrow--open {
  transform: rotate(180deg);
}

@keyframes slideInFade {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.model-dropdown-circle {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(200, 200, 200, 0.8);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  z-index: 1001;
  min-width: 80px;
  overflow: hidden;
  animation: slideDownSmooth 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top left;
  will-change: opacity, transform;
}

@keyframes slideDownSmooth {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.model-option-circle {
  padding: 6px 8px;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 10px;
  color: #333;
  border-bottom: 1px solid rgba(240, 240, 240, 0.5);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  will-change: background-color;
}

.model-option-circle:last-child {
  border-bottom: none;
}

.model-option-circle:hover {
  background-color: rgba(248, 249, 250, 0.8);
}

.model-option-circle--selected {
  background-color: rgba(33, 150, 243, 0.1);
  color: #1976d2;
  font-weight: 500;
}

/* 输入控制样式 */
.input-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>
