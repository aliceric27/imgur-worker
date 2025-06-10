

# Imgur Worker - 圖片上傳工具

一個基於 Cloudflare Workers 和原生 JavaScript 建構的現代化響應式圖片上傳工具。該工具提供了無縫的圖片上傳體驗，支援拖曳、貼上和點擊上傳功能。

## 🌟 功能特點

- **多種上傳方式**：拖曳上傳、貼上上傳（Ctrl+V）、點擊上傳
- **格式支援**：JPEG、PNG、GIF、APNG、TIFF
- **現代介面**：基於Bootstrap的響應式設計，支援深色/淺色主題切換
- **圖片管理**：查看已上傳圖片、複製連結、刪除圖片
- **本地儲存**：自動儲存上傳歷史
- **跨域解決**：使用Cloudflare Worker作為代理繞過瀏覽器CORS限制
- **中文介面**：完全本地化的中文使用者介面

## 🚨 重要配置要求

**⚠️ 關鍵：部署前必須更新worker URL！**

在 `main.js`（第43行），將：
```javascript
static worker_url = "https://imgur.xxxx.workers.dev/";
```

更改為您實際的Cloudflare Worker URL：
```javascript
static worker_url = "https://imgur.您的子網域.workers.dev/";
```

**請將 `您的子網域` 替換為您實際的worker子網域。**

## 📋 前置要求

- Cloudflare帳戶（免費版即可）
- 基本的Cloudflare Workers和Pages知識
- 文字編輯器用於配置

## 🚀 部署步驟

### 第一步：部署Cloudflare Worker

1. **登入Cloudflare控制台**
   - 訪問 [Cloudflare控制台](https://dash.cloudflare.com/)
   - 導航到"Workers & Pages"

2. **建立新的Worker**
   - 點擊"Create application"
   - 選擇"Create Worker"
   - 為您的worker命名（例如：`imgur-proxy`）
   - 點擊"Deploy"

3. **配置Worker**
   - 在worker編輯器中，用`worker.js`的內容替換所有程式碼
   - 點擊"Save and Deploy"
   - 記錄您的worker URL：`https://imgur-proxy.您的子網域.workers.dev/`

### 第二步：配置前端應用程式

1. **更新Worker URL**
   - 用文字編輯器開啟`main.js`
   - 找到第43行：`static worker_url = "https://imgur.xxxx.workers.dev/";`
   - 將`xxxx`替換為您實際的worker子網域
   - 儲存檔案

### 第三步：部署前端

#### 選項A：Cloudflare Pages（推薦）

1. **建立Pages專案**
   - 在Cloudflare控制台，轉到"Workers & Pages"
   - 點擊"Create application" → "Pages"
   - 選擇"Upload assets"

2. **上傳檔案**
   - 建立包含以下檔案的ZIP：`index.html`、`main.js`、`style.css`
   - 上傳ZIP檔案
   - 為專案命名
   - 點擊"Create Pages"

3. **存取您的應用程式**
   - 您的應用程式將在以下位址可用：`https://您的專案名.pages.dev`

#### 選項B：靜態檔案託管

將`index.html`、`main.js`和`style.css`上傳到任何靜態檔案託管服務：
- GitHub Pages
- Netlify
- Vercel
- 您自己的Web伺服器

## 🎯 使用方法

1. **上傳圖片**：
   - **拖曳上傳**：將圖片檔案拖曳到上傳區域
   - **貼上上傳**：複製圖片後在頁面任意位置按`Ctrl+V`
   - **點擊上傳**：點擊上傳區域開啟檔案選擇器

2. **管理圖片**：
   - 在預覽區域查看已上傳的圖片
   - 點擊複製按鈕將圖片URL複製到剪貼簿
   - 點擊刪除按鈕從Imgur刪除圖片

3. **主題切換**：
   - 點擊太陽/月亮圖示在淺色和深色主題間切換

## 🔧 故障排除

### 常見問題

1. **上傳時出現"網路錯誤"**
   - 檢查是否已更新`main.js`中的`worker_url`
   - 驗證您的Cloudflare Worker已部署且可存取

2. **CORS錯誤**
   - 確保Cloudflare Worker已正確部署
   - 檢查`main.js`中的worker URL是否與實際worker URL匹配

3. **上傳失敗，返回400錯誤**
   - 檢查圖片格式是否受支援
   - 驗證圖片檔案未損壞

### 驗證步驟

1. **測試Worker**：直接訪問您的worker URL - 應該得到403錯誤（這是預期的）
2. **測試前端**：嘗試上傳一個小的PNG圖片
3. **檢查控制台**：開啟瀏覽器開發者工具查看任何錯誤訊息

## 🌐 瀏覽器支援

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 授權條款

本專案為開源專案。您可以根據需要自由修改和散布。
