/**
 * 收藏详情页
 */
Page({
  data: {
    item: null,
    images: [],
    currentImageIndex: 0,
    formatCreateTime: ''
  },

  onLoad(options) {
    console.log('详情页接收参数:', options);

    if (options.id) {
      this.loadItemById(options.id);
    } else if (options.index !== undefined) {
      const index = parseInt(options.index);
      this.loadItemByIndex(index);
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  /**
   * 根据ID加载收藏
   */
  loadItemById(id) {
    const collection = wx.getStorageSync('userCollection') || [];
    const item = collection.find(i => String(i.id) === String(id) || String(i._id) === String(id));

    if (item) {
      this.setItemData(item);
    } else {
      wx.showToast({ title: '未找到该收藏', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  /**
   * 根据索引加载收藏
   */
  loadItemByIndex(index) {
    const collection = wx.getStorageSync('userCollection') || [];

    if (index >= 0 && index < collection.length) {
      this.setItemData(collection[index]);
    } else {
      wx.showToast({ title: '未找到该收藏', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  /**
   * 设置数据
   */
  setItemData(item) {
    const images = (item.images || []).map(img => {
      let displayUrl = '';
      if (typeof img === 'string') {
        displayUrl = img;
      } else if (img.url) {
        displayUrl = img.url;
      } else if (img.fileID) {
        displayUrl = img.fileID;
      }
      return {
        ...img,
        displayUrl: displayUrl
      };
    });

    let formatCreateTime = '';
    if (item.createTime) {
      if (typeof item.createTime === 'string') {
        formatCreateTime = item.createTime;
      } else if (item.createTime.getTime) {
        formatCreateTime = this.formatDate(new Date(item.createTime));
      } else {
        formatCreateTime = this.formatDate(new Date());
      }
    }

    this.setData({
      item: item,
      images: images,
      formatCreateTime: formatCreateTime
    });

    // 加载云存储图片URL
    this.loadCloudImageUrls();
  },

  /**
   * 加载云存储图片URL
   */
  loadCloudImageUrls() {
    const images = this.data.images;
    if (!images || images.length === 0) return;

    const cloudIds = [];
    const imageMap = {};

    images.forEach((img, index) => {
      if (img.displayUrl && img.displayUrl.startsWith('cloud://')) {
        cloudIds.push(img.displayUrl);
        imageMap[img.displayUrl] = index;
      }
    });

    if (cloudIds.length === 0) return;

    wx.cloud.getTempFileURL({
      fileList: cloudIds,
      success: (res) => {
        const updatedImages = [...images];
        res.fileList.forEach(file => {
          if (file.fileID && file.tempFileURL) {
            const index = imageMap[file.fileID];
            if (index !== undefined) {
              updatedImages[index] = {
                ...updatedImages[index],
                displayUrl: file.tempFileURL
              };
            }
          }
        });
        this.setData({ images: updatedImages });
      },
      fail: (err) => {
        console.error('获取云存储图片失败:', err);
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
    return `${year}-${month}-${day}`;
  },

  /**
   * 图片切换
   */
  onImageChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const currentIndex = e.currentTarget.dataset.index || this.data.currentImageIndex;
    const urls = this.data.images
      .map(img => img.displayUrl)
      .filter(url => url && (url.startsWith('http') || url.startsWith('cloud://')));

    if (urls.length > 0) {
      wx.previewImage({
        current: urls[currentIndex] || urls[0],
        urls: urls
      });
    } else {
      wx.showToast({ title: '图片加载中...', icon: 'none' });
    }
  },

  /**
   * 删除收藏
   */
  deleteItem() {
    if (!this.data.item) return;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏记录吗？',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          this.performDelete();
        }
      }
    });
  },

  /**
   * 执行删除
   */
  performDelete() {
    const item = this.data.item;
    let collection = wx.getStorageSync('userCollection') || [];

    collection = collection.filter(i => {
      const idMatch = (String(i.id) === String(item.id)) || (String(i._id) === String(item._id));
      return !idMatch;
    });

    wx.setStorageSync('userCollection', collection);
    wx.showToast({ title: '已删除', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});