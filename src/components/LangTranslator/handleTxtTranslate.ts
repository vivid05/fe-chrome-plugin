import ajax from '@/api/ajax';
import Axios from 'axios';
import CryptoJS from 'crypto-js';
import OpenAI from 'openai';

export default function handleTxtTranslate(txt: string): Promise<string> {
  return new Promise(resolve => {
    ajax
      .handleTranslate({
        doctype: 'json',
        type: 'AUTO',
        i: txt,
      })
      .then((data: any) => {
        let resultTxt = '';
        if (data.translateResult?.length) {
          const resultArr = data.translateResult || [];

          resultArr.forEach((itemArr: any[]) => {
            if (itemArr?.length) {
              itemArr.forEach(item => {
                resultTxt += item.tgt;
              });
            }
          });
        }
        resolve(resultTxt || '');
      });
  });
}
const IS_DEV = import.meta.env.MODE === 'development';

// SiliconFlow AI翻译配置
const AI_API_TOKEN = import.meta.env.VITE_AI_API_TOKEN;
const openai = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1/',
  apiKey: AI_API_TOKEN,
  dangerouslyAllowBrowser: true,
});

// 语言映射，将简写转换为完整语言名称
const LANG_MAP: Record<string, string> = {
  zh: '中文',
  en: '英文',
  ara: '阿拉伯语',
  pt: '葡萄牙语',
  id: '印尼语',
  tr: '土耳其语',
  fil: '菲律宾语',
  ms: '马来语',
  es: '西班牙语',
};

// AI翻译函数
async function translateWithAI(targetLang: string, text: string): Promise<string> {
  try {
    const targetLanguage = LANG_MAP[targetLang] || '英文';

    const completion = await openai.chat.completions.create({
      model: 'moonshotai/Kimi-K2-Instruct',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的翻译助手。请将用户输入的文本翻译成${targetLanguage}。只返回翻译结果，不要添加任何解释或其他内容。`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('AI翻译失败:', error);
    throw error;
  }
}

function generateRandomString(length = 5) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function translate(to: string, text: string) {
  return new Promise(async (resolve, reject) => {
    try {
      // 首先尝试使用AI翻译
      const result = await translateWithAI(to, text);
      if (result) {
        resolve(result);
        return;
      }
    } catch (aiError) {
      console.warn('AI翻译失败，回退到百度翻译:', aiError);
    }

    // AI翻译失败时，回退到原有的百度翻译
    const salt = generateRandomString();
    const str1 = '20240816002124970' + text + salt + 'lbLCGrPdCPggh36Ra8P4';
    const sign = CryptoJS.MD5(str1).toString();

    const api = IS_DEV ? '/translate' : 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    const url = `${api}?q=${text}&from=auto&to=${to}&appid=20240816002124970&salt=${salt}&sign=${sign}`;
    Axios.get(url)
      .then((res: any) => {
        try {
          const result = res.data.trans_result;
          if (result && result.length) {
            resolve(result[0].dst);
          } else {
            reject(new Error('翻译结果为空'));
          }
        } catch (error) {
          reject(error);
        }
      })
      .catch(e => {
        reject(e);
        console.log(e);
      });
  });
}
