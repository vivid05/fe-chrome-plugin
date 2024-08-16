import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

const DEV_PORT = 8082;

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //设置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
  server: {
    port: DEV_PORT, //启动端口
    hmr: {
      host: 'localhost',
      port: DEV_PORT,
    },
    // 设置代理
    proxy: {
      '/fe-tools': {
        target: 'https://blog.michealwayne.cn/',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
      '/translate': {
        target: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/translate/, ''),
      },
      '/its': {
        target: 'https://itrans.xf-yun.com/v1/',
        secure: false,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/its/, ''),
      },
      '/chat': {
        target: 'ws://spark-api.xf-yun.com/v1.1/',
        secure: false,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/chat/, ''),
      },
    },
  },
});
