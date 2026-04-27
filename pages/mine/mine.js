/**
 * 个人中心页面
 */
Page({
  data: {
    stats: {
      totalCollected: 0,
      totalImages: 0,
      totalCategories: 0
    },
    collection: [],
    showClearConfirm: false
  },

  onShow() {
    this.loadData();
  },

  /**
   * 加载页面数据
   */
  loadData() {
    const collection = wx.getStorageSync('userCollection') || [];
    const variants = wx.getStorageSync('coinVariants') || [];
    const categories = wx.getStorageSync('coinCategories') || [];

    // 统计数据
    const totalCollected = collection.length;
    const totalImages = this.countTotalImages(variants);

    this.setData({
      stats: {
        totalCollected,
        totalImages,
        totalCategories: categories.length
      },
      collection: collection
    });
  },

  /**
   * 统计总图片数
   */
  countTotalImages(variants) {
    let count = 0;
    variants.forEach(variant => {
      variant.subVariants.forEach(sub => {
        count += (sub.images || []).length;
      });
    });
    return count;
  },

  /**
   * 查看收藏详情
   */
  viewCollection(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?variantId=${id}`
    });
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const { images } = e.currentTarget.dataset;
    
    if (images && images.length > 0) {
      wx.previewImage({
        current: images[0],
        urls: images
      });
    }
  },

  /**
   * 删除收藏
   */
  deleteCollection(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个收藏吗？',
      success: (res) => {
        if (res.confirm) {
          // 从收藏列表中删除
          let collection = wx.getStorageSync('userCollection') || [];
          collection = collection.filter(item => item.id !== id);
          wx.setStorageSync('userCollection', collection);

          // 同时更新版别数据
          this.clearVariantImages(id);

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });

          this.loadData();
        }
      }
    });
  },

  /**
   * 清除版别图片
   */
  clearVariantImages(variantId) {
    const variants = wx.getStorageSync('coinVariants') || [];
    
    const clearImages = (list) => {
      for (let variant of list) {
        if (variant.id === variantId) {
          variant.collected = false;
          variant.images = [];
          return true;
        }
        if (variant.subVariants) {
          const found = clearImages(variant.subVariants);
          if (found) return true;
        }
      }
      return false;
    };

    clearImages(variants);
    wx.setStorageSync('coinVariants', variants);
  },

  /**
   * 清空所有数据
   */
  clearAllData() {
    wx.showModal({
      title: '警告',
      content: '确定要清空所有收藏数据吗？此操作不可恢复！',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('userCollection', []);
          this.resetVariants();
          
          wx.showToast({
            title: '已清空所有数据',
            icon: 'success'
          });

          this.loadData();
        }
      }
    });
  },

  /**
   * 重置版别数据
   */
  resetVariants() {
    const variants = wx.getStorageSync('coinVariants') || [];
    
    const resetVariant = (list) => {
      list.forEach(variant => {
        variant.collected = false;
        variant.images = [];
        if (variant.subVariants) {
          variant.subVariants.forEach(sub => {
            sub.collected = false;
            sub.images = [];
          });
        }
      });
    };

    resetVariant(variants);
    wx.setStorageSync('coinVariants', variants);
  },

  /**
   * 导出数据
   */
  exportData() {
    const collection = wx.getStorageSync('userCollection') || [];
    
    if (collection.length === 0) {
      wx.showToast({
        title: '暂无可导出数据',
        icon: 'none'
      });
      return;
    }

    // 生成简单的文本报告
    let report = '古钱币收藏清单\n\n';
    report += `导出时间：${this.formatDate(new Date())}\n`;
    report += `总收藏：${collection.length} 个版别\n\n`;
    report += '====================\n\n';

    collection.forEach((item, index) => {
      report += `${index + 1}. ${item.name}\n`;
      report += `   收藏日期：${item.date}\n`;
      report += `   图片数量：${item.images.length} 张\n\n`;
    });

    // 复制到剪贴板
    wx.setClipboardData({
      data: report,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 关于页面
   */
  showAbout() {
    wx.showModal({
      title: '关于',
      content: '古钱币收藏小程序 v1.0\n\n帮助您整理和记录古钱币收藏，支持按分类、年代管理，上传图片记录版别。',
      showCancel: false
    });
  }
});
