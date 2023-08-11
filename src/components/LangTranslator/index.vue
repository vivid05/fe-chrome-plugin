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
        <p
          v-for="item in langList"
          :key="item.value"
          :class="['lang-item', langFrom === item.value ? 'lang-item--active' : '']"
          @click="selectLang('from', item.value)"
        >
          {{ item.label }}
        </p>
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
          @click="selectLang('to', item.value)"
        >
          {{ item.label }}
        </p>
      </div>
      <textarea v-model="resultTxt" class="u-textarea" @click.stop="textFocus"></textarea>
    </section>
    <p v-if="inPopup" class="u-link g-mt10 f-tc g-fs14" s-cr_blue @click.stop="back">返回主页</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AnyFunc } from '@/types/index';
import { getUrlParam } from '@/utils';
import handleTxtTranslate, { translate } from './handleTxtTranslate';

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

      // 在窗口内
      inPopup: getUrlParam('type') !== 'translate',

      // 定时器
      timer: -1 as unknown,
      langFrom: 'cn',
      langTo: 'en',
      langList: [
        { label: '中文', value: 'cn' },
        { label: '英语', value: 'en' },
        { label: '印尼语', value: 'id' },
        { label: '阿语', value: 'ar' },
        { label: '葡语', value: 'pt' },
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

    selectLang(type: string, lang: string) {
      if ((type === 'from' && lang === this.langTo) || (type === 'to' && lang === this.langFrom)) {
        alert('不能同语种翻译');
        return;
      }
      type === 'from' ? (this.langFrom = lang) : (this.langTo = lang);
    },

    onTranslate(text: string) {
      if (
        (this.langFrom === 'cn' && this.langTo === 'en') ||
        (this.langFrom === 'en' && this.langTo === 'cn')
      ) {
        this.handleTranslate(text);
      } else {
        translate(this.langFrom, this.langTo, text)
          .then((res: string) => {
            this.resultTxt = res;
          })
          .catch(e => {
            alert('翻译失败');
            console.error(e);
            this.resultTxt = '';
          });
      }
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
</style>
