/**
 * 古钱币收藏小程序工具函数
 */

/**
 * 格式化日期时间
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化简单日期
 */
const formatSimpleDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 压缩图片 (使用微信 API)
 */
const compressImage = (srcPath, quality = 80) => {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src: srcPath,
      quality: quality,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 选择并压缩图片
 */
const chooseAndCompressImage = (options = {}) => {
  const {
    count = 9,
    quality = 80,
    sourceType = ['album', 'camera'],
    sizeType = ['compressed']
  } = options;

  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: count,
      mediaType: ['image'],
      sourceType: sourceType,
      sizeType: sizeType,
      success: async (res) => {
        try {
          const compressedFiles = [];
          
          for (const file of res.tempFiles) {
            const compressed = await compressImage(file.tempFilePath, quality);
            compressedFiles.push(compressed);
          }
          
          resolve(compressedFiles);
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 显示加载提示
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  });
};

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading();
};

/**
 * 显示成功提示
 */
const showSuccess = (title = '操作成功') => {
  wx.showToast({
    title: title,
    icon: 'success'
  });
};

/**
 * 显示错误提示
 */
const showError = (title = '操作失败') => {
  wx.showToast({
    title: title,
    icon: 'none'
  });
};

/**
 * 显示确认对话框
 */
const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm);
      }
    });
  });
};

/**
 * 深度复制对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

/**
 * 防抖函数
 */
const debounce = (func, wait = 300) => {
  let timeout = null;
  
  return function(...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

/**
 * 节流函数
 */
const throttle = (func, wait = 300) => {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
};

/**
 * 验证是否为有效的图片路径
 */
const isValidImagePath = (path) => {
  if (!path || typeof path !== 'string') {
    return false;
  }
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const lowerPath = path.toLowerCase();
  
  return imageExtensions.some(ext => lowerPath.endsWith(ext));
};

/**
 * 获取文件大小 (KB)
 */
const getFileSize = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.getFileInfo({
      filePath: filePath,
      success: (res) => {
        resolve(Math.round(res.size / 1024));
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 保存到相册
 */
const saveToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

module.exports = {
  formatDate,
  formatSimpleDate,
  compressImage,
  chooseAndCompressImage,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  deepClone,
  debounce,
  throttle,
  isValidImagePath,
  getFileSize,
  saveToPhotosAlbum
};
