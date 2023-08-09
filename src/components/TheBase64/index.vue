<template>
  <div class="main" @click.stop="stopPropagation">
    <section>
      <p style="margin-bottom: 10px">请输入要进行 Base64 编码或解码的字符</p>
      <textarea v-model="originTxt" class="u-textarea"></textarea>
    </section>
    <section class="btns">
      <button class="primary" style="margin-right: 10px" @click="onDecode">解码</button>
      <button @click="onEncode">编码</button>
    </section>
    <section>
      <p style="margin-bottom: 10px">Base64 编码或解码的结果：</p>
      <pre class="result-txt">{{ resultTxt }}</pre>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TheBase64',
};
</script>
<script setup>
import { ref } from 'vue';
import { base64decode, base64encode } from './decode';

const originTxt = ref('');
const resultTxt = ref('');

const onEncode = () => {
  if (!originTxt.value) {
    alert('请先输入');
  }
  const result = base64encode(originTxt.value, false);
  resultTxt.value = result;
};
const onDecode = () => {
  if (!originTxt.value) {
    alert('请先输入');
  }
  const text = decodeURIComponent(originTxt.value)
    .replace(/\\r\\n/g, '\\n')
    .replace(/\\n/g, '\n');
  const result = base64decode(text, false, 'text');
  resultTxt.value = JSON.parse(result);
};

const stopPropagation = () => {
  return false;
};
</script>

<style scoped>
.main {
  max-height: 100%;
  overflow-y: auto;
  color: #333;
}
.u-textarea {
  color: #555;
}

.btns {
  margin: 10px 0;
}
.btns > button {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  color: #606266;
  padding: 8px 12px;
  border-radius: 6px;
}
.btns > .primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.btns > .success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.result-txt {
  height: 180px;
  padding: 5px;
  width: 450px;
  overflow-y: scroll;
  background-color: #fff;
}
</style>
