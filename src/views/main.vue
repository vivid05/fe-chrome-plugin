<!--
    主页面
-->
<template>
  <section class="m-ctn u-pt20 f-ovhidden">
    <div v-show="!showCompName.includes('Ctn')" class="m-main_ctn">
      <div :class="{ 'f-blur': showCompName }">
        <h1 :class="{ 'z-fold': logoFold }" class="f-tc j-logo_ctn f-ovhidden">
          <img class="m-logo u-link" src="/icon.png" alt="icon" @click="toHome" />
        </h1>
        <section>
          <p class="u-c-middle g-mt50">
            <input
              id="search"
              v-model="keywords"
              class="m-s_input g-fs16 u-w300"
              placeholder="请输入关键词或二维码生成地址"
              autocomplete="off"
              type="text"
              autofocus
              @focus="handleInputFocus"
              @blur="handleInputBlur"
              @input="handleInputInput"
            />
            <button s-color="blue" class="u-btn_il j-search g-fs18 g-ml10" @click="setSearchResult">
              Search
            </button>
          </p>
          <ul class="m-searchList u-w420 j-searchList g-center">
            <li v-for="(item, index) in resultList" :key="index" @click="handleResultClick(item)">
              <em
                v-if="item.label"
                class="u-icon_il icon-label"
                :class="getResultLabel(item.label)"
                >{{ item.label }}</em
              >
              <span v-html="getResultText(item)"></span>
            </li>
          </ul>
        </section>
        <section class="g-mt50 g-center">
          <ul class="m-others g-fs14 u-pt10 u-j-middle">
            <li
              class="f-tc"
              title="输入框地址URL或当前页面URL生成二维码"
              @click="showCompName = 'QRCode'"
            >
              <em class="u-icon iconfont icon-erweima g-fs36"></em>
              <span class="g-fs12">生成二维码</span>
            </li>
            <li
              class="f-tc"
              title="本地或在线图片压缩/转为base64字符串"
              @click="showCompName = 'ImageCompressor'"
            >
              <em class="u-icon iconfont icon-compress-file g-fs36"></em>
              <span class="g-fs12">图片压缩/base64</span>
            </li>
            <li class="f-tc" title="rgb/hxb/hex色值换算" @click="showCompName = 'ColorPass'">
              <em class="u-icon iconfont icon-chanyexietong g-fs36"></em>
              <span class="g-fs12">色值换算</span>
            </li>
          </ul>
          <ul class="m-others g-fs14 u-pt30 u-j-middle">
            <li class="f-tc" title="快速中英文翻译" @click="showCompName = 'LangTranslator'">
              <em class="u-icon iconfont icon-fanyi g-center g-fs36"></em>
              <span class="g-fs12">快速翻译</span>
            </li>
            <li
              class="f-tc"
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
              title="快速中英文翻译"
              @click="showCompName = 'ImageEdit'"
            >
              <svg
                id="mx_n_1691465247310"
                t="1691465247309"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1956"
                width="50"
                height="50"
              >
                <path
                  d="M732.8 188.6c27.1 0 53 10.8 72.2 29.9 19.1 19.1 29.9 45.1 29.9 72.2V733c0 27.1-10.8 53-29.9 72.2-19.1 19.1-45.1 29.9-72.2 29.9H290.5c-27.1 0-53-10.8-72.2-29.9-19.1-19.2-29.9-45.2-29.9-72.2V290.7c0-27.1 10.8-53 29.9-72.2 19.1-19.1 45.1-29.9 72.2-29.9h442.3z m0 51H290.5c-27 0-49.4 21.1-51 48l-0.1 3V733c0 27 21.1 49.4 48 51l3 0.1h442.3c27 0 49.4-21.1 51-48l0.1-3V290.7c0-27-21.1-49.4-48-51l-3-0.1z m-17 459.3c9.4 0 17 7.6 17 17s-7.6 17-17 17H307.5c-9.4 0-17-7.6-17-17s7.6-17 17-17h408.3z m-136.1-85c9.4 0 17 7.6 17 17s-7.6 17-17 17H307.5c-9.4 0-17-7.6-17-17s7.6-17 17-17h272.2z m-156-256.3l3 1.9 167.9 118.6 24.7-15.4c17.2-10.7 39.1-10.2 55.8 1.3l2.9 2.1 65.2 51.8c7.1 5.6 8.6 15.7 3.5 23.1-5.2 7.4-15.2 9.5-22.9 4.8l-1.8-1.2-65.2-51.8c-5-4-11.9-4.8-17.7-2.1l-1.9 1-43.9 27.3-186.2-131.7c-5.5-3.9-12.8-4.2-18.5-0.7l-1.9 1.3-85.3 67.7c-7 5.6-17.2 4.7-23.2-1.9-6-6.7-5.8-16.9 0.5-23.3l1.6-1.4 85.3-67.7c16.6-13.3 39.8-14.8 58.1-3.7z m224-84c24.3 0 46.8 13 58.9 34 12.2 21.1 12.2 47 0 68.1-12.2 21.1-34.6 34-58.9 34-37.6 0-68-30.5-68-68.1 0-37.5 30.5-68 68-68z m0 34.1c-12.2 0-23.4 6.5-29.5 17-6.1 10.5-6.1 23.5 0 34s17.3 17 29.5 17c18.8 0 34-15.2 34-34 0.1-18.8-15.2-34-34-34z m0 0"
                  p-id="1957"
                  fill="#8795A8"
                ></path>
              </svg>
              <span class="g-fs12">图片编辑</span>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- 各组件展示 -->
    <div
      v-show="showCompName"
      :class="!showCompName.includes('Ctn') ? 'u-fix_ctn u-c-middle j-fixctn' : 'm-moo_ctn'"
      @click="hideFixCtn"
    >
      <component
        :is="showCompName"
        v-if="showCompName"
        :keywords="keywords"
        :back="() => (showCompName = '')"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getUrlParam } from '@/utils';
import { getMarkTree, jumpAction } from '@/utils/chrome';
import ajax from '@/api/ajax';
import { DEFAULT_SEARCH_LIST } from '@/constant';

import CompMap from '@/components/';

export default defineComponent({
  name: 'MainContent',

  components: {
    ...CompMap,
  },

  data(): {
    keywords: string;
    markList: Array<{ title?: string; [key: string]: unknown }>;
    logoFold: string | boolean;

    showCompName: string;

    resultList: Array<{
      link: string;
      name: string;
      label?: 'tools' | 'mark';
      type?: string;
      color?: string;
      children?: any;
    }>;
    feToolsList: Array<{ name: string; link: string; desc: string; target: any; children?: any }>;
  } {
    return {
      // 搜索关键词
      keywords: '',
      // 本地书签信息
      markList: [],
      // logo折叠
      logoFold: '',

      // 当前展示的组件
      showCompName: getUrlParam('search') ? 'QRCode' : '',
      // 搜索结果
      resultList: [],
      // 远程工具信息列表
      feToolsList: [],
    };
  },

  beforeMount() {
    const _msg = getUrlParam('message');
    if (_msg) {
      this.keywords = _msg;
      this.setSearchResult();
    }
    getMarkTree((list: any) => (this.markList = list));
    ajax
      .getFeTools()
      .then((data: any) => {
        const list = this.handleFEToolsList(data.list);
        this.feToolsList = list;
      })
      .catch((e: Error) => {
        alert(e?.message || '链接信息获取失败');
      });
  },

  methods: {
    /**
     * 前往简易postman
     */
    toPostMan() {
      jumpAction('index.html?type=postman');
    },

    /**
     * 去fe-tools主页
     */
    toHome() {
      jumpAction('https://github.com/MichealWayne/fe-tools');
    },

    /**
     * 输入框聚焦时，logo隐藏
     */
    handleInputFocus() {
      if (this.keywords) this.logoFold = true;
    },

    /**
     * 输入框失去焦点时，logo展示
     */
    handleInputBlur() {
      if (!this.keywords) {
        this.resultList = [];
        this.logoFold = false;
      }
    },

    /**
     * 输入时
     */
    handleInputInput() {
      if (this.keywords) {
        this.logoFold = true;
        this.setSearchResult();
      }
    },

    /**
     * 检索结果的点击
     */
    handleResultClick(item: any) {
      if (item.type === 'qr') {
        // qr code
        this.showCompName = 'QRCode';
      } else {
        jumpAction(item.link);
      }
    },

    /**
     * 结果的展示文案
     */
    getResultText(item: any) {
      return item.type === 'qr' ? '生成二维码' : item.name;
    },

    /**
     * 结果的展示标签
     */
    getResultLabel(type?: 'tools' | 'mark') {
      if (!type) return '';
      return {
        tools: 's-simple',
        mark: 's-red',
      }[type];
    },

    /**
     * 处理结果
     */
    handleFEToolsList(list: any): Array<{
      name: string;
      link: string;
      desc: string;
      target: any;
      children?: any;
    }> {
      const handleList = (
        data: any
      ): Array<{
        name: string;
        link: string;
        desc: string;
        target: any;
        children?: any;
      }> => {
        const result = [];
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.link && item.name) {
              result.push({
                name: item.name,
                link: item.link,
                desc: item.desc,
                target: item.target,
              });
            }

            if (item.children?.length) {
              result.push(...handleList(item.children));
            }
          });
        } else if (data.link && data.name) {
          result.push({
            name: data.name,
            link: data.link,
            desc: data.desc,
            target: data.target,
          });
        }
        return result;
      };

      return handleList(list);
    },

    // eslint-disable-next-line complexity
    setSearchResult() {
      const keywords = this.keywords.toLowerCase();

      if (keywords.startsWith('http')) {
        // link
        this.resultList = [
          {
            type: 'qr',
            link: '',
            name: 'qr',
          },
        ];
        return;
      }

      const resultList: Array<{
        link: string;
        name: string;
        label?: 'tools' | 'mark';
        type?: string;
        color?: string;
        children?: any;
      }> = [];
      if (keywords && keywords.length > 2) {
        const FEToolsData = this.feToolsList || [];

        FEToolsData.forEach(item => {
          const IS_SUPPORT_KEYWORDS =
            item.name.includes(keywords) ||
            (item.desc && item.desc.includes(keywords)) ||
            (item.target && item.target.join(' | ').includes(keywords));

          if (IS_SUPPORT_KEYWORDS) {
            if (!item.link) {
              if (item.children?.length) {
                item.children.map((child: any) => {
                  resultList.push({
                    label: 'tools',
                    color: 'orange',
                    link: child.link,
                    name:
                      child.name.replace(keywords, `<strong>${keywords}</strong>`) +
                      ` <em>(${child.desc})</em>`,
                  });
                });
              }
            } else {
              resultList.push({
                label: 'tools',
                color: 'orange',
                link: item.link,
                name:
                  item.name.replace(keywords, `<strong>${keywords}</strong>`) +
                  ` <em s-ft_sub_>(${item.desc})</em>`,
              });
            }
          }
        });
      }

      // 收藏夹
      const MarkList = this.markList || [];
      if (MarkList) {
        MarkList.forEach(item => {
          if (item.title?.toLowerCase().includes(keywords)) {
            resultList.push({
              link: item.url as string,
              name: item.title.replace(keywords, `<strong>${keywords}</strong>`) as string,
              color: 'red',
              label: 'mark',
            });
          }
        });
      }

      DEFAULT_SEARCH_LIST.forEach(item => {
        resultList.push({
          link: item.link + keywords,
          name: `在${item.name}中搜索: <strong>${keywords}</strong>`,
        });
      });
      this.resultList = resultList;
    },

    hideFixCtn() {
      if (this.showCompName.includes('Ctn')) {
        return;
      }
      this.showCompName = '';
    },
  },
});
</script>
