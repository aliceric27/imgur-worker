var imgurTool;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deleteBtnClick(element) {
  const hash = element.getAttribute("deletehash");
  imgurTool.deleteImage(hash, element);
}

function copyImageUrl(element) {
  element.select();
  element.setSelectionRange(0, 99999);
  try {
    navigator.clipboard.writeText(element.value);
    showToast("已複製連結到剪貼簿");
  } catch (err) {
    document.execCommand("copy");
  }
}

// 顯示一個簡單的toast通知
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 1500);
  }, 10);
}

class ImgurAPI {
  static accesstoken = null;
  static imgur_url = "https://api.imgur.com";
  static worker_url = "https://imgur.xxxx.workers.dev/";
  //static worker_url = 'http://127.0.0.1:8787';

  static get_headers() {
    let headers = new Headers();
    if (this.accesstoken) {
      //headers.set('accesstoken', this.accesstoken);
      headers.set("authorization", "Bearer " + this.accesstoken);
    }
    return headers;
  }

  static uploadImage(payload) {
    return fetch(`${this.worker_url}/3/upload?client_id=d70305e7c3ac5c6`, {
      method: "POST",
      headers: this.get_headers(),
      body: payload
    });
  }

  static deleteImage(hash) {
    return fetch(
      `${this.imgur_url}/3/image/${hash}?client_id=d70305e7c3ac5c6`,
      {
        method: "DELETE",
        headers: this.get_headers()
      }
    );
  }
}

class ImgurTool {
  constructor() {
    this.g_images = [];
    // 支援的圖片MIME類型
    this.supportedImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/png',
      'image/apng',
      'image/tiff'
    ];
    this.initializeElements();
    this.bindEventListeners();
    this.loadConfig();
    this.detectSystemTheme();
    this.restoreImages();
    console.log(this);
  }

  loadConfig() {
    let images = localStorage.getItem("imgur_images");
    if (images) {
      this.g_images = JSON.parse(images);
    }
  }

  saveConfig() {
    if (this.g_images.length > 0) {
      localStorage.setItem("imgur_images", JSON.stringify(this.g_images));
    } else {
      localStorage.removeItem("imgur_images");
    }
  }

  initializeElements() {
    this.elements = {
      upload_progress: document.querySelector("#uploadProgress"),
      upload_progress_bar: document.querySelector(".progress-bar"),
      image_list: document.querySelector("#imageList"),
      paste_area: document.querySelector("#pasteArea"),
      theme_toggle: document.querySelector("#themeToggle"),
      theme_toggle_preview: document.querySelector("#themeTogglePreview"),
      upload_view: document.querySelector("#uploadView"),
      preview_view: document.querySelector("#previewView"),
      back_to_upload: document.querySelector("#backToUpload"),
      add_more_button: document.querySelector("#addMoreButton")
    };

    // Create hidden file input for click-to-upload functionality
    this.createFileInput();
  }

  createFileInput() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    // 只接受支援的圖片格式
    this.fileInput.accept = this.supportedImageTypes.join(',');
    this.fileInput.multiple = true;
    this.fileInput.style.display = 'none';
    document.body.appendChild(this.fileInput);

    // Handle file selection
    this.fileInput.addEventListener('change', (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        this.handleFileUpload(files);
      }
      // Reset the input so the same file can be selected again
      this.fileInput.value = '';
    });
  }

  bindEventListeners() {
    // 為整個文件添加粘貼事件
    document.addEventListener('paste', (event) => this.handlePaste(event));
    
    // 點擊粘貼區域直接打開文件選擇器
    this.elements.paste_area.addEventListener('click', () => {
      this.openFileSelector();
    });
    
    // 拖放上傳功能
    this.elements.paste_area.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.elements.paste_area.classList.add('drag-over');
    });
    
    this.elements.paste_area.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this.elements.paste_area.classList.remove('drag-over');
    });
    
    this.elements.paste_area.addEventListener('drop', (e) => {
      e.preventDefault();
      this.elements.paste_area.classList.remove('drag-over');

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const { validFiles, invalidFiles } = this.validateFiles(files);

        if (invalidFiles.length > 0) {
          const fileNames = invalidFiles.map(f => f.name).join(', ');
          showToast(`不支援的檔案格式: ${fileNames}。僅支援 JPG、PNG、GIF、APNG、TIFF 格式`);
        }

        if (validFiles.length > 0) {
          this.handleFileUpload(validFiles);
        } else if (invalidFiles.length > 0) {
          // 如果只有無效檔案，不進行上傳
          return;
        } else {
          showToast("請拖入圖片檔案");
        }
      }
    });

    // 主題切換
    this.elements.theme_toggle.addEventListener('click', () => this.toggleTheme());
    this.elements.theme_toggle_preview.addEventListener('click', () => this.toggleTheme());
    
    // 返回上傳頁面
    this.elements.back_to_upload.addEventListener('click', () => this.showUploadView());
    
    // 預覽頁面的添加更多按鈕 - 直接打開文件選擇器
    this.elements.add_more_button.addEventListener('click', () => {
      this.openFileSelector();
    });
  }

  // 檢測系統主題
  detectSystemTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else {
      // 如果用戶未設置主題，則使用系統主題
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
      }
    }
  }

  // 切換主題
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // 打開文件選擇器
  openFileSelector() {
    this.fileInput.click();
  }

  // 驗證文件類型
  validateFileType(file) {
    return this.supportedImageTypes.includes(file.type);
  }

  // 驗證多個文件並返回有效文件和錯誤信息
  validateFiles(files) {
    const validFiles = [];
    const invalidFiles = [];

    for (const file of files) {
      if (this.validateFileType(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    }

    return { validFiles, invalidFiles };
  }

  // 處理粘貼事件
  handlePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let hasImage = false;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();

        // 驗證粘貼的圖片格式
        if (this.validateFileType(blob)) {
          hasImage = true;
          this.handleFileUpload([blob]);
        } else {
          showToast(`不支援的圖片格式: ${blob.type}。僅支援 JPG、PNG、GIF、APNG、TIFF 格式`);
          hasImage = true; // 防止瀏覽器默認行為
        }
        break;
      }
    }

    if (hasImage) {
      event.preventDefault();
    }
  }
  
  // 處理文件上傳
  handleFileUpload(files) {
    if (files.length === 0) return;

    // 先驗證所有文件
    const { validFiles, invalidFiles } = this.validateFiles(files);

    // 顯示無效文件的錯誤信息
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map(f => f.name || '未知檔案').join(', ');
      showToast(`不支援的檔案格式: ${fileNames}。僅支援 JPG、PNG、GIF、APNG、TIFF 格式`);
    }

    // 如果沒有有效文件，不進行上傳
    if (validFiles.length === 0) {
      return;
    }

    this.showUploadProgress();
    let uploadPromises = [];
    let successCount = 0;
    let errorCount = 0;

    for (let file of validFiles) {
      const formData = new FormData();
      // 為粘貼的blob創建文件名
      let fileName = file.name || `pasted_image_${new Date().getTime()}.png`;
      formData.append("image", new File([file], fileName, { type: file.type }));
      formData.append("type", "file");
      formData.append("name", fileName);

      let promise = ImgurAPI.uploadImage(formData)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          if (json.success) {
            this.appendImage(json.data);
            this.updateUploadProgress(++successCount, validFiles.length);
          } else {
            // 處理服務器返回的錯誤
            errorCount++;
            const errorMsg = json.data?.error || '上傳失敗';
            showToast(`上傳失敗: ${errorMsg}`);
          }
        })
        .catch((error) => {
          errorCount++;
          console.error('Upload error:', error);
          showToast(`上傳失敗: ${fileName} - 網路錯誤或服務器問題`);
        });
      uploadPromises.push(promise);

      // 圖片間的上傳間隔
      if (validFiles.length > 1) {
        sleep(1000);
      }
    }

    Promise.all(uploadPromises).then(() => {
      this.hideUploadProgress();

      // 顯示上傳結果摘要
      if (successCount > 0 && errorCount === 0) {
        showToast(`成功上傳 ${successCount} 張圖片`);
        this.showPreviewView();
      } else if (successCount > 0 && errorCount > 0) {
        showToast(`成功上傳 ${successCount} 張圖片，${errorCount} 張失敗`);
        this.showPreviewView();
      } else if (errorCount > 0) {
        showToast(`所有圖片上傳失敗`);
      }
    });
  }
  
  // 顯示上傳進度
  showUploadProgress() {
    this.elements.upload_progress.classList.remove("d-none");
  }
  
  // 隱藏上傳進度
  hideUploadProgress() {
    this.elements.upload_progress.classList.add("d-none");
  }
  
  // 顯示上傳頁面
  showUploadView() {
    this.elements.preview_view.classList.remove('active');
    this.elements.upload_view.classList.add('active');
  }
  
  // 顯示預覽頁面
  showPreviewView() {
    this.elements.upload_view.classList.remove('active');
    this.elements.preview_view.classList.add('active');
  }

  restoreImages() {
    this.g_images.forEach((json) => this.appendImage(json));
  }

  updateUploadProgress(current, total) {
    const percentage = (current / total) * 100;
    this.elements.upload_progress_bar.style.width = `${percentage}%`;
  }

  appendImage(json) {
    console.log(json);

    const template = document.querySelector(".image-template");
    const clone = template.cloneNode(true);
    clone.classList.remove("image-template");

    const img = clone.querySelector("img");
    const input = clone.querySelector(".image-url");
    const imgName = clone.querySelector(".image-name");
    const uploadTime = clone.querySelector(".upload-time");
    const fileSize = clone.querySelector(".file-size");
    const deleteBtn = clone.querySelector("button");

    fetch(json.link)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        img.src = url;
      });

    img.alt = json.name;
    input.value = json.link;
    deleteBtn.setAttribute("deletehash", json.deletehash);

    imgName.textContent = `檔案名稱: ${json.name}`;
    uploadTime.textContent = `上傳時間: ${new Date(
      json.datetime * 1000
    ).toLocaleString()}`;
    fileSize.textContent = `檔案大小: ${this.formatFileSize(json.size)}`;

    if (!this.g_images.some(img => img.deletehash === json.deletehash)) {
      this.g_images.push(json);
      this.saveConfig();
    }

    // 將新圖片插入到add-more按鈕之前
    const addMoreContainer = this.elements.image_list.querySelector('.add-more-container');
    if (addMoreContainer) {
      this.elements.image_list.insertBefore(clone, addMoreContainer);
    } else {
      this.elements.image_list.appendChild(clone);
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KiB", "MiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async deleteImage(hash, element) {
    const response = await ImgurAPI.deleteImage(hash);
    if (!response.ok) return;
    const json = await response.json();
    if (json.success) {
      this.g_images = this.g_images.filter((img) => img.deletehash !== hash);
      this.saveConfig();
      element.closest(".image-block").remove();
      showToast("圖片已成功刪除");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  imgurTool = new ImgurTool();
  
  // 添加Toast樣式
  const style = document.createElement('style');
  style.textContent = `
    .toast-notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9999;
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .toast-notification.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    html[data-bs-theme="light"] .toast-notification {
      background: rgba(0,0,0,0.8);
    }
    html[data-bs-theme="dark"] .toast-notification {
      background: rgba(255,255,255,0.2);
    }
  `;
  document.head.appendChild(style);
});
