<template>
  <div>
    <!-- 翻译 -->
    <v-translate v-if="type === 'translate'" />

    <!-- 主模块 -->
    <v-main v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getUrlParam } from '@/utils';
import Translate from '@/components/LangTranslator/index.vue';

import Main from './main.vue';

export default defineComponent({
  name: 'App',

  components: {
    'v-main': Main,
    'v-translate': Translate,
  },
  data() {
    return {
      type: getUrlParam('type'),
    };
  },
});
</script>
