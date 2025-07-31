# AI翻译功能使用说明

## 概述
翻译功能已升级为使用SiliconFlow AI API进行翻译，同时保留原有的百度翻译作为后备方案。

## 配置方法

1. 获取SiliconFlow API Token
   - 访问 https://cloud.siliconflow.cn/
   - 注册账号并获取API Token

2. 修改配置
   在 `src/components/LangTranslator/handleTxtTranslate.ts` 文件中，将以下行：
   ```typescript
   const AI_API_TOKEN = 'sk-your-api-token'; // 需要替换为实际的API token
   ```
   替换为你的实际API Token：
   ```typescript
   const AI_API_TOKEN = 'sk-xxxxxxxxxxxxxxxx'; // 你的实际API token
   ```

## 功能特性

- **AI优先**: 优先使用AI进行翻译，提供更自然、更准确的翻译结果
- **自动降级**: 当AI翻译失败时，自动回退到百度翻译服务
- **支持语言**: 
  - 中文 (zh)
  - 英文 (en) 
  - 阿拉伯语 (ara)
  - 葡萄牙语 (pt)

## 技术实现

- 使用OpenAI SDK连接SiliconFlow API
- 采用Qwen/Qwen2.5-7B-Instruct模型进行翻译
- 设置合理的温度值(0.3)确保翻译一致性
- 限制最大token数(1000)控制响应长度

## 注意事项

- 请确保API Token有效且有足够的余额
- AI翻译可能比传统翻译API稍慢，但质量更高
- 建议在生产环境中将API Token配置为环境变量