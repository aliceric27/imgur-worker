<!-- Language Toggle -->
<div align="center">
  <div id="language-toggle" style="margin-bottom: 20px; padding: 10px; background: #f6f8fa; border-radius: 6px; border: 1px solid #d0d7de;" role="toolbar" aria-label="Language selection">
    <button onclick="toggleLanguage('en')" id="btn-en"
            style="background: #0969da; color: white; border: none; padding: 8px 16px; margin: 0 4px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.2s ease;"
            aria-pressed="true" aria-label="Switch to English">
      🇺🇸 English
    </button>
    <button onclick="toggleLanguage('zh')" id="btn-zh"
            style="background: #6e7781; color: white; border: none; padding: 8px 16px; margin: 0 4px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"
            aria-pressed="false" aria-label="Switch to Chinese">
      🇨🇳 中文
    </button>
  </div>
</div>

<script>
// Language toggle functionality with accessibility support
function toggleLanguage(lang) {
  try {
    const enContent = document.getElementById('content-en');
    const zhContent = document.getElementById('content-zh');
    const btnEn = document.getElementById('btn-en');
    const btnZh = document.getElementById('btn-zh');

    if (!enContent || !zhContent || !btnEn || !btnZh) {
      console.warn('Language toggle elements not found');
      return;
    }

    if (lang === 'en') {
      enContent.style.display = 'block';
      zhContent.style.display = 'none';
      btnEn.style.background = '#0969da';
      btnEn.style.fontWeight = 'bold';
      btnEn.setAttribute('aria-pressed', 'true');
      btnZh.style.background = '#6e7781';
      btnZh.style.fontWeight = 'normal';
      btnZh.setAttribute('aria-pressed', 'false');

      // Save preference
      try {
        localStorage.setItem('readme-lang', 'en');
      } catch (e) {
        console.warn('localStorage not available');
      }
    } else {
      enContent.style.display = 'none';
      zhContent.style.display = 'block';
      btnZh.style.background = '#0969da';
      btnZh.style.fontWeight = 'bold';
      btnZh.setAttribute('aria-pressed', 'true');
      btnEn.style.background = '#6e7781';
      btnEn.style.fontWeight = 'normal';
      btnEn.setAttribute('aria-pressed', 'false');

      // Save preference
      try {
        localStorage.setItem('readme-lang', 'zh');
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  } catch (error) {
    console.error('Error in toggleLanguage:', error);
  }
}

// Keyboard navigation support
function handleKeyPress(event, lang) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleLanguage(lang);
  }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  try {
    const savedLang = localStorage.getItem('readme-lang') || 'en';
    toggleLanguage(savedLang);

    // Add keyboard event listeners
    const btnEn = document.getElementById('btn-en');
    const btnZh = document.getElementById('btn-zh');

    if (btnEn) btnEn.addEventListener('keydown', (e) => handleKeyPress(e, 'en'));
    if (btnZh) btnZh.addEventListener('keydown', (e) => handleKeyPress(e, 'zh'));

  } catch (error) {
    console.error('Error initializing language toggle:', error);
    // Fallback to English
    const enContent = document.getElementById('content-en');
    const zhContent = document.getElementById('content-zh');
    if (enContent) enContent.style.display = 'block';
    if (zhContent) zhContent.style.display = 'none';
  }
});

// Fallback for environments without localStorage or JavaScript
(function() {
  try {
    if (typeof localStorage === 'undefined') {
      const enContent = document.getElementById('content-en');
      const zhContent = document.getElementById('content-zh');
      if (enContent) enContent.style.display = 'block';
      if (zhContent) zhContent.style.display = 'none';
    }
  } catch (error) {
    console.warn('Fallback initialization failed:', error);
  }
})();
</script>

<!-- English Content -->
<div id="content-en" style="display: block;">

# Imgur Worker - Image Upload Tool

A modern, responsive image upload tool built with Cloudflare Workers and vanilla JavaScript. This tool provides a seamless way to upload images to Imgur with support for drag-and-drop, paste, and click upload functionality.

## 🌟 Features

- **Multiple Upload Methods**: Drag & drop, paste (Ctrl+V), or click to upload
- **Format Support**: JPEG, PNG, GIF, APNG, TIFF
- **Modern UI**: Bootstrap-based responsive design with dark/light theme toggle
- **Image Management**: View uploaded images, copy links, delete images
- **Local Storage**: Automatically saves upload history
- **CORS Bypass**: Uses Cloudflare Worker as proxy to bypass browser CORS restrictions
- **Chinese Interface**: Fully localized Chinese user interface

## 🚨 Important Configuration Required

**⚠️ CRITICAL: You MUST update the worker URL before deployment!**

In `main.js` (line 43), change:
```javascript
static worker_url = "https://imgur.xxxx.workers.dev/";
```

To your actual Cloudflare Worker URL:
```javascript
static worker_url = "https://imgur.YOUR_SUBDOMAIN.workers.dev/";
```

**Replace `YOUR_SUBDOMAIN` with your actual worker subdomain name.**

## 📋 Prerequisites

- Cloudflare account (free tier works)
- Basic knowledge of Cloudflare Workers and Pages
- Text editor for configuration

## 🚀 Setup Instructions

### Step 1: Deploy the Cloudflare Worker

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to "Workers & Pages"

2. **Create a New Worker**
   - Click "Create application"
   - Choose "Create Worker"
   - Give your worker a name (e.g., `imgur-proxy`)
   - Click "Deploy"

3. **Configure the Worker**
   - In the worker editor, replace all content with the code from `worker.js`
   - Click "Save and Deploy"
   - Note your worker URL: `https://imgur-proxy.YOUR_SUBDOMAIN.workers.dev/`

### Step 2: Configure the Frontend Application

1. **Update Worker URL**
   - Open `main.js` in a text editor
   - Find line 43: `static worker_url = "https://imgur.xxxx.workers.dev/";`
   - Replace `xxxx` with your actual worker subdomain
   - Save the file

### Step 3: Deploy the Frontend

#### Option A: Cloudflare Pages (Recommended)

1. **Create Pages Project**
   - In Cloudflare Dashboard, go to "Workers & Pages"
   - Click "Create application" → "Pages"
   - Choose "Upload assets"

2. **Upload Files**
   - Create a ZIP file containing: `index.html`, `main.js`, `style.css`
   - Upload the ZIP file
   - Give your project a name
   - Click "Create Pages"

3. **Access Your Application**
   - Your app will be available at: `https://YOUR_PROJECT.pages.dev`

#### Option B: Static File Hosting

Upload `index.html`, `main.js`, and `style.css` to any static file hosting service:
- GitHub Pages
- Netlify
- Vercel
- Your own web server

## 📁 Project Structure

```
imgur-worker/
├── index.html          # Main HTML file
├── main.js            # Frontend JavaScript (⚠️ REQUIRES URL CONFIG)
├── style.css          # Styling
├── worker.js          # Cloudflare Worker code
└── README.md          # This file
```

## 🎯 Usage

1. **Upload Images**:
   - **Drag & Drop**: Drag image files onto the upload area
   - **Paste**: Copy an image and press `Ctrl+V` anywhere on the page
   - **Click**: Click the upload area to open file selector

2. **Manage Images**:
   - View uploaded images in the preview section
   - Click copy button to copy image URL to clipboard
   - Click delete button to remove images from Imgur

3. **Theme Toggle**:
   - Click the sun/moon icon to switch between light and dark themes

## ⚙️ Configuration Details

### Worker Configuration
The Cloudflare Worker acts as a proxy to bypass CORS restrictions when accessing the Imgur API. It only allows specific paths:
- `/account`
- `/album` 
- `/image`
- `/upload`

### Frontend Configuration
Key configuration in `main.js`:
- `worker_url`: Your Cloudflare Worker URL (MUST BE UPDATED)
- `supportedImageTypes`: Allowed image MIME types
- Client ID is hardcoded for anonymous uploads

## 🔧 Troubleshooting

### Common Issues

1. **"Network Error" when uploading**
   - Check if you updated the `worker_url` in `main.js`
   - Verify your Cloudflare Worker is deployed and accessible

2. **CORS Errors**
   - Ensure the Cloudflare Worker is properly deployed
   - Check that the worker URL in `main.js` matches your actual worker URL

3. **Upload Fails with 400 Error**
   - Check if the image format is supported
   - Verify the image file is not corrupted

### Verification Steps

1. **Test Worker**: Visit your worker URL directly - you should get a 403 error (this is expected)
2. **Test Frontend**: Try uploading a small PNG image
3. **Check Console**: Open browser developer tools to see any error messages

## 🌐 Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

</div>

<!-- Chinese Content -->
<div id="content-zh" style="display: none;">

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

</div>

<!-- Accessibility and Fallback Styles -->
<style>
@media (prefers-reduced-motion: reduce) {
  #language-toggle button {
    transition: none;
  }
}

#language-toggle button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

#language-toggle button:focus {
  outline: 2px solid #0969da;
  outline-offset: 2px;
}

#language-toggle button:active {
  transform: translateY(0);
}

/* Fallback for no-JS environments */
.no-js #content-en {
  display: block !important;
}

.no-js #content-zh {
  display: none !important;
}
</style>

<!-- No-JS Fallback -->
<noscript>
  <style>
    #content-en { display: block !important; }
    #content-zh { display: none !important; }
    #language-toggle { display: none; }
  </style>
  <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 4px;">
    <strong>Note:</strong> JavaScript is disabled. Showing English content only. For the Chinese version, please enable JavaScript or scroll down to find the Chinese section.
  </div>
</noscript>
