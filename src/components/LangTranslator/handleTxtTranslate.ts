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

export function translate(from: string, to: string, text: string) {
  return new Promise(async (resolve, reject) => {
    const textString = CryptoJS.enc.Utf8.parse(text);
    const textBase64 = CryptoJS.enc.Base64.stringify(textString);
    const params = {
      header: {
        app_id: '3f32ea2e',
        status: 3,
      },
      parameter: {
        its: {
          from,
          to,
          result: {},
        },
      },
      payload: {
        input_data: {
          encoding: 'utf8',
          status: 3,
          text: textBase64,
        },
      },
    };
    const url: string = await getWebsocketUrl();
    Axios.post(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then((res: any) => {
        try {
          const resultBase64 = res.data.payload.result.text;
          const resultObj = JSON.parse(
            CryptoJS.enc.Base64.parse(resultBase64).toString(CryptoJS.enc.Utf8)
          );
          console.log({ resultObj });
          resolve(resultObj.trans_result.dst);
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
