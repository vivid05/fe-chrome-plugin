<template>
  <div
    :class="{ 'u-j-middle': !inPopup, 'm-big_translate': !inPopup }"
    class="m-translate"
    style="max-height: 100%; overflow-y: auto"
    @click.stop="stopPropagation"
  >
    <section>
      <div style="display: flex">
        <p>原文（<a class="u-link" s-cr_blue @click="reset">清空</a>）</p>
      </div>
      <textarea
        v-model="originTxt"
        placeholder="输入或粘贴要翻译的内容"
        class="u-textarea"
      ></textarea>
    </section>

    <section>
      <div style="display: flex">
        <p>结果（<a class="u-link" s-cr_blue @click="onTranslate(originTxt)">重新翻译</a>）</p>
        <p
          v-for="item in langList"
          :key="item.value"
          :class="['lang-item', langTo === item.value ? 'lang-item--active' : '']"
          @click="selectLang(item.value)"
        >
          {{ item.label }}
        </p>
      </div>
      <div style="position: relative">
        <textarea
          v-model="resultTxt"
          class="u-textarea"
          placeholder="翻译结果"
          :disabled="isTranslating"
          @click.stop="textFocus"
        ></textarea>
        <div v-if="isTranslating" class="loading-overlay">
          <div class="loading-spinner"></div>
          <span class="loading-text">翻译中...</span>
        </div>
      </div>
    </section>
    <p v-if="inPopup" class="u-link g-mt10 f-tc g-fs14" s-cr_blue @click.stop="back">返回主页</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AnyFunc } from '@/types/index';
import { getUrlParam } from '@/utils';
import handleTxtTranslate, { translate } from './handleTxtTranslate';
import { franc } from 'franc-min';

export default defineComponent({
  name: 'LangTranslator',

  props: {
    back: {
      type: Function as AnyFunc,
      default: () => {},
    },
  },

  data() {
    return {
      // 原文
      originTxt: '',

      // 译文
      resultTxt: '',

      // 翻译中状态
      isTranslating: false,

      // 在窗口内
      inPopup: getUrlParam('type') !== 'translate',

      // 定时器
      timer: -1 as unknown,
      langTo: 'en',
      langList: [
        { label: 'cn', value: 'zh' },
        { label: 'en', value: 'en' },
        { label: 'ar', value: 'ara' },
        { label: 'pt', value: 'pt' },
        { label: 'id', value: 'id' },
        { label: 'tr', value: 'tr' },
        { label: 'fil', value: 'fil' },
        { label: 'ms', value: 'ms' },
        { label: 'es', value: 'es' },
      ],
    };
  },
  watch: {
    originTxt(newval, oldval) {
      if (!newval || newval === oldval) return;
      if (this.timer) {
        clearTimeout(this.timer as number);
      }
      const DEBOUNCE_TIME = 400;

      this.timer = setTimeout(() => {
        this.onTranslate(newval);
      }, DEBOUNCE_TIME);
    },
  },

  async mounted() {
    const val = getUrlParam('value');
    if (val) {
      this.originTxt = decodeURIComponent(val);
    }
  },

  methods: {
    stopPropagation() {
      return false;
    },

    /**
     * 重置输入和结果
     */
    reset() {
      this.originTxt = '';
      this.resultTxt = '';
    },

    /**
     * 自动选中
     */
    textFocus(e: Event) {
      if (!e || !(e.target instanceof HTMLInputElement)) return;
      e.target.select();
    },

    selectLang(lang: string) {
      this.langTo = lang;
      if (this.originTxt.trim()) {
        this.onTranslate(this.originTxt);
      }
    },

    onTranslate(text: string) {
      if (this.isTranslating) return; // 防止重复请求

      const langFrom = franc(text, {
        minLength: 2,
        only: ['cmn', 'eng', 'ind', 'arb', 'por', 'tur', 'spa'],
      });
      if (langFrom !== 'cmn') {
        this.langTo = 'zh';
      }

      this.isTranslating = true;
      this.resultTxt = ''; // 清空之前的结果

      translate(this.langTo, text)
        .then((res: unknown) => {
          this.resultTxt = res as string;
        })
        .catch(e => {
          alert('翻译失败');
          console.error(e);
          this.resultTxt = '';
        })
        .finally(() => {
          this.isTranslating = false;
        });
    },

    /**
     * 翻译
     */
    async handleTranslate(txt: string) {
      try {
        this.resultTxt = await handleTxtTranslate(txt);
      } catch (e) {
        alert('翻译失败');
        console.error(e);
        this.resultTxt = '';
      }
    },
  },
});
</script>

<style scoped>
.lang-item {
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
}
.lang-item--active {
  font-size: 15px;
  font-weight: bold;
  color: #8f57ff;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 4px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #8f57ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  font-size: 12px;
  color: #666;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.u-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
