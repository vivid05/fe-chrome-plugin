<template>
  <div @click.stop="stopPropagation">
    <div class="chat">
      <div ref="chatBox" class="chat-box">
        <template v-for="(item, index) in chatList" :key="index">
          <p v-if="item.role === 'assistant'" class="ai">{{ item.content }}</p>
          <div v-else class="self-box">
            <p class="self">{{ item.content }}</p>
          </div>
        </template>
        <p v-if="resultTxt" class="ai">{{ resultTxt }}</p>
      </div>
      <div class="input-box">
        <textarea v-model="userInput" placeholder="你想问什么?" @keyup.enter="onSend" />
        <div
          class="btn"
          :class="{ 'btn--disable': isLoading || !userInput.trim() }"
          @click="onSend"
        >
          发送
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
import { ref, nextTick } from 'vue';
import CryptoJS from 'crypto-js';

const stopPropagation = () => {
  return false;
};

const getWebsocketUrl = () => {
  return new Promise(resolve => {
    const apiKey = '42b7e6264723824af07e90f3e5756b1d';
    const apiSecret = 'MDU3MGUyMTlmMWRjZTVmNTUxYTExMWNl';
    let url = 'ws://spark-api.xf-yun.com/v1.1/chat';
    const host = 'spark-api.xf-yun.com';
    const date = new Date().toUTCString();
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    resolve(url);
  });
};

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
      domain: 'general',
      temperature: 0.5,
      max_tokens: 1024,
    },
  },
  payload: {
    message: {
      text: [],
    },
  },
});

const onSend = async () => {
  if (!userInput.value.trim() || isLoading.value) {
    return;
  }
  chatList.value.push({ role: 'user', content: userInput.value });
  params.value.payload.message.text = chatList.value;
  nextTick(() => {
    const scrollHeight = chatBox.value.scrollHeight;
    chatBox.value.scrollTop = scrollHeight;
  });
  const url = await getWebsocketUrl();
  let socket = null;
  isLoading.value = true;
  socket = new WebSocket(url);
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify(params.value));
    userInput.value = '';
  });
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    const result = data.payload.choices.text[0].content;
    resultTxt.value = resultTxt.value.concat(result);
    nextTick(() => {
      const scrollHeight = chatBox.value.scrollHeight;
      chatBox.value.scrollTop = scrollHeight;
    });
  });
  socket.addEventListener('close', () => {
    chatList.value.push({ role: 'assistant', content: resultTxt.value });
    resultTxt.value = '';
    isLoading.value = false;
  });
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
  height: 336px;
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
}
.input-box textarea {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  width: 360px;
  outline: #8f57ff;
  resize: none;
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
}
</style>
