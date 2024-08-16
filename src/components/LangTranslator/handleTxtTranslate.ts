import ajax from '@/api/ajax';
import Axios from 'axios';
import CryptoJS from 'crypto-js';

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

const API_KEY = '42b7e6264723824af07e90f3e5756b1d';
const API_SECRET = 'MDU3MGUyMTlmMWRjZTVmNTUxYTExMWNl';
const IS_DEV = import.meta.env.MODE === 'development';

function getWebsocketUrl(): Promise<string> {
  return new Promise(resolve => {
    const apiKey = API_KEY;
    const apiSecret = API_SECRET;
    let url = IS_DEV ? '/its' : 'https://itrans.xf-yun.com/v1/its';
    const host = 'itrans.xf-yun.com';
    const date = new Date().toUTCString();
    const algorithm = 'hmac-sha256';
    const headers = 'host date request-line';
    const signatureOrigin = `host: ${host}\ndate: ${date}\nPOST /v1/its HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    resolve(url);
  });
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
  const salt = generateRandomString();
  const str1 = '20240816002124970' + text + salt + 'lbLCGrPdCPggh36Ra8P4';
  const sign = CryptoJS.MD5(str1).toString();
  return new Promise(async (resolve, reject) => {
    const api = IS_DEV ? '/translate' : 'https://fanyi-api.baidu.com/api/trans/vip/translate'
    const url = `${api}?q=${text}&from=auto&to=${to}&appid=20240816002124970&salt=${salt}&sign=${sign}`;
    Axios.get(url)
      .then((res: any) => {
        try {
          const result = res.data.trans_result
          if (result && result.length) {
            resolve(result[0].dst)
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
