/**
 * 上传页面 - 用户上传古钱币图片
 */
Page({
  data: {
    variantId: '',
    variantName: '',
    images: [],
    maxImages: 9,
    isUploading: false,
    imageType: 'front', // front, back, other
    note: ''
  },

  onLoad(options) {
    const { variantId, variantName } = options;
    
    if (variantId) {
      // 加载已有图片
      const variants = wx.getStorageSync('coinVariants') || [];
      const variant = this.findVariantById(variants, parseInt(variantId));
      
      if (variant) {
        this.setData({
          variantId: variantId,
          variantName: decodeURIComponent(variantName || variant.name),
          images: variant.images || []
        });
      } else {
        this.setData({
          variantId: variantId,
          variantName: decodeURIComponent(variantName || '未知版别')
        });
      }
    }
  },

  /**
   * 递归查找版别
   */
  findVariantById(variants, id) {
    for (let variant of variants) {
      if (variant.id === id) {
        return variant;
      }
      if (variant.subVariants) {
        const found = variant.subVariants.find(sv => sv.id === id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  },

  /**
   * 选择图片
   */
  chooseImage() {
    const that = this;
    const remaining = this.data.maxImages - this.data.images.length;
    
    if (remaining <= 0) {
      wx.showToast({
        title: '最多上传 9 张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success(res) {
        const tempFiles = res.tempFiles;
        const newImages = tempFiles.map(file => ({
          url: file.tempFilePath || file.tempFileID,
          type: that.data.imageType,
          note: that.data.note,
          createTime: new Date().getTime()
        }));

        that.setData({
          images: [...that.data.images, ...newImages]
        });
      }
    });
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.images.map(img => img.url);
    
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },

  /**
   * 删除图片
   */
  deleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    images.splice(index, 1);
    
    this.setData({
      images: images
    });
  },

  /**
   * 切换图片类型
   */
  changeImageType(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      imageType: type
    });
  },

  /**
   * 输入备注
   */
  onNoteInput(e) {
    this.setData({
      note: e.detail.value
    });
  },

  /**
   * 保存图片
   */
  saveImages() {
    if (this.data.images.length === 0) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isUploading: true
    });

    // 模拟上传延迟
    setTimeout(() => {
      this.updateVariantData();
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      this.setData({
        isUploading: false
      });

      // 延迟返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 500);
  },

  /**
   * 更新版别数据
   */
  updateVariantData() {
    const variants = wx.getStorageSync('coinVariants') || [];
    const variantId = parseInt(this.data.variantId);
    
    // 查找并更新版别
    const updateVariant = (list) => {
      for (let variant of list) {
        if (variant.id === variantId) {
          variant.collected = true;
          variant.images = this.data.images;
          return true;
        }
        if (variant.subVariants) {
          const found = updateVariant(variant.subVariants);
          if (found) return true;
        }
      }
      return false;
    };

    updateVariant(variants);
    wx.setStorageSync('coinVariants', variants);

    // 同时更新用户收藏记录
    this.updateUserCollection(variantId);
  },

  /**
   * 更新用户收藏记录
   */
  updateUserCollection(variantId) {
    let collection = wx.getStorageSync('userCollection') || [];
    
    // 检查是否已存在
    const exists = collection.find(item => item.id === variantId);
    
    if (!exists) {
      const newCollection = {
        id: variantId,
        name: this.data.variantName,
        images: this.data.images,
        date: this.formatDate(new Date())
      };
      
      collection.unshift(newCollection);
      wx.setStorageSync('userCollection', collection);
    } else {
      // 更新已有记录
      collection = collection.map(item => {
        if (item.id === variantId) {
          return {
            ...item,
            images: this.data.images
          };
        }
        return item;
      });
      wx.setStorageSync('userCollection', collection);
    }
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
});
