<template>
  <div @click.stop="stopPropagation">{{ resultTxt }}</div>
</template>

<script>
export default {
  name: 'TheAI',
};
</script>
<script setup>
import { onMounted, ref } from 'vue';
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

const resultTxt = ref('');
onMounted(async () => {
  const url = await getWebsocketUrl();
  const params = {
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
        text: [{ role: 'user', content: '你好' }],
      },
    },
  };
  const socket = new WebSocket(url);
  socket.addEventListener('open', () => {
    console.log('WebSocket连接已打开');
    socket.send(JSON.stringify(params));
  });
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    const result = data.payload.choices.text[0].content;
    resultTxt.value = resultTxt.value.concat(result);
  });
});
</script>

<style scoped></style>
