/**
 * 上传页 - 全面UI优化版
 */
Page({
  data: {
    // 步骤状态
    currentStep: 1,

    // 版别选择相关
    categories: [],
    selectedCategory: null,
    selectedEra: null,
    selectedVariant: null,
    categoryIndex: -1,
    eraIndex: -1,
    variantIndex: -1,
    variants: [],

    // 图片上传相关
    images: [],
    maxImages: 9,
    imageType: 'front',
    note: '',
    price: '',
    isUploading: false,

    // 新建版别相关
    showCreateModal: false,
    newVariantName: '',
    isCreatingVariant: false
  },

  onLoad(options) {
    this.loadCategories();

    if (options.eraId) {
      this.autoSelectFromParams(options);
    }
  },

  onShow() {
    // 页面显示时，刷新云存储图片的访问链接
    this.refreshCloudImageUrls();
  },

  /**
   * 刷新云存储图片的访问链接
   * cloud:// 格式需要转换为临时下载链接才能显示
   */
  refreshCloudImageUrls() {
    const { images } = this.data;
    if (!images || images.length === 0) return;

    const hasCloudImage = images.some(img => img.url && img.url.startsWith('cloud://'));
    if (!hasCloudImage) return;

    // 获取云存储临时链接
    const cloudPaths = images
      .filter(img => img.url && img.url.startsWith('cloud://'))
      .map(img => img.url);

    wx.cloud.getTempFileURL({
      fileList: cloudPaths,
      success: (res) => {
        const urlMap = {};
        res.fileList.forEach(file => {
          urlMap[file.fileID] = file.tempFileURL;
        });

        // 更新图片URL
        const updatedImages = images.map(img => {
          if (img.url && urlMap[img.url]) {
            return { ...img, url: urlMap[img.url] };
          }
          return img;
        });

        this.setData({ images: updatedImages });
      },
      fail: (err) => {
        console.error('获取云存储链接失败:', err);
      }
    });
  },

  /**
   * 加载分类数据
   */
  loadCategories() {
    const categories = wx.getStorageSync('coinCategories') || [];
    console.log('加载分类数据:', categories);
    this.setData({ categories });
  },

  /**
   * 根据参数自动选择
   */
  autoSelectFromParams(options) {
    const categories = wx.getStorageSync('coinCategories') || [];
    const variants = wx.getStorageSync('coinVariants') || [];
    const eraId = parseInt(options.eraId);

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const era = category.eras.find(e => e.id === eraId);

      if (era) {
        const eraVariants = variants.filter(v => v.eraId === eraId);

        this.setData({
          categoryIndex: i,
          selectedCategory: category,
          selectedEra: era,
          variants: eraVariants
        });

        if (options.variantId) {
          const variantId = parseInt(options.variantId);
          const variantIndex = eraVariants.findIndex(v => v.id === variantId);

          if (variantIndex >= 0) {
            this.setData({
              variantIndex: variantIndex,
              selectedVariant: eraVariants[variantIndex]
            });
          }
        }
        break;
      }
    }
  },

  /**
   * 分类选择变化
   */
  onCategoryChange(e) {
    const index = e.detail.value;
    const category = this.data.categories[index];
    const variants = [];

    this.setData({
      categoryIndex: index,
      selectedCategory: category,
      selectedEra: null,
      selectedVariant: null,
      eraIndex: -1,
      variantIndex: -1,
      variants: variants
    });
  },

  /**
   * 年代选择变化
   */
  onEraChange(e) {
    const index = e.detail.value;
    const era = this.data.selectedCategory.eras[index];
    const variants = this.getVariantsByEra(era.id);

    this.setData({
      eraIndex: index,
      selectedEra: era,
      selectedVariant: null,
      variantIndex: -1,
      variants: variants
    });
  },

  /**
   * 版别选择变化
   */
  onVariantChange(e) {
    const index = e.detail.value;
    const variant = this.data.variants[index];

    this.setData({
      variantIndex: index,
      selectedVariant: variant
    });
  },

  /**
   * 根据年代获取版别
   */
  getVariantsByEra(eraId) {
    const allVariants = wx.getStorageSync('coinVariants') || [];
    console.log('getVariantsByEra eraId:', eraId, 'type:', typeof eraId);
    console.log('allVariants sample:', allVariants.slice(0, 3));
    const result = allVariants.filter(v => v.eraId === eraId);
    console.log('filtered variants:', result);
    return result;
  },

  /**
   * 显示新建版别弹窗
   */
  showCreateVariant() {
    this.setData({
      showCreateModal: true,
      newVariantName: ''
    });
  },

  /**
   * 隐藏新建版别弹窗
   */
  hideCreateVariant() {
    this.setData({
      showCreateModal: false
    });
  },

  /**
   * 输入新版别名称
   */
  onNewVariantInput(e) {
    this.setData({
      newVariantName: e.detail.value
    });
  },

  /**
   * 创建新版别
   */
  createNewVariant() {
    const { newVariantName, selectedEra } = this.data;

    if (!newVariantName.trim()) {
      wx.showToast({ title: '请输入版别名称', icon: 'none' });
      return;
    }

    const allVariants = wx.getStorageSync('coinVariants') || [];
    const maxId = allVariants.reduce((max, v) => Math.max(max, v.id), 0);

    const newVariant = {
      id: maxId + 1,
      eraId: selectedEra.id,
      eraName: selectedEra.name,
      name: newVariantName,
      collected: false,
      images: []
    };

    allVariants.push(newVariant);
    wx.setStorageSync('coinVariants', allVariants);

    const variants = this.getVariantsByEra(selectedEra.id);
    const variantIndex = variants.findIndex(v => v.id === newVariant.id);

    this.setData({
      variants: variants,
      variantIndex: variantIndex,
      selectedVariant: newVariant,
      showCreateModal: false
    });

    wx.showToast({ title: '创建成功', icon: 'success' });
  },

  /**
   * 获取图片类型名称
   */
  getTypeName(type) {
    const typeMap = {
      'front': '正面',
      'back': '背面',
      'detail': '细节',
      'other': '其他'
    };
    return typeMap[type] || '图片';
  },

  /**
   * 选择图片
   */
  chooseImage() {
    const that = this;
    const remaining = this.data.maxImages - this.data.images.length;

    if (remaining <= 0) {
      wx.showToast({ title: '最多上传 9 张图片', icon: 'none' });
      return;
    }

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success(res) {
        const tempFiles = res.tempFiles;
        const newImages = tempFiles.map((file, index) => ({
          id: new Date().getTime() + index,
          url: file.tempFilePath || file.tempFileID,
          type: that.data.imageType,
          note: that.data.note,
          createTime: new Date().getTime(),
          uploading: false,
          error: false
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
   * 输入入手价格
   */
  onPriceInput(e) {
    this.setData({
      price: e.detail.value
    });
  },

  /**
   * 步骤导航
   */
  goToStep2() {
    if (!this.data.selectedVariant) {
      wx.showToast({ title: '请先选择版别', icon: 'none' });
      return;
    }
    this.setData({ currentStep: 2 });
  },

  backToStep1() {
    this.setData({ currentStep: 1 });
  },

  goToStep3() {
    this.setData({ currentStep: 3 });
  },

  /**
   * 保存图片（上传到云存储）
   */
  saveImages() {
    if (this.data.images.length === 0) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
      return;
    }

    this.setData({ isUploading: true });

    const cloudImages = [];
    let completed = 0;

    this.data.images.forEach((img, index) => {
      // 检查是否是临时文件，需要上传到云
      const isTempFile = img.url && (img.url.startsWith('http://tmp') || img.url.startsWith('wxfile://'));

      if (isTempFile) {
        // 上传到云存储
        const cloudPath = `coins/${Date.now()}_${index}.jpg`;

        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: img.url,
          success: (res) => {
            cloudImages.push({
              id: img.id,
              url: res.fileID,  // 云存储ID，格式为 cloud://xxx
              type: img.type,
              note: img.note,
              createTime: img.createTime
            });
            completed++;
            this.checkSaveComplete(cloudImages, completed);
          },
          fail: (err) => {
            console.error('上传云存储失败:', err);
            wx.showToast({ title: '上传失败，请重试', icon: 'none' });
            this.setData({ isUploading: false });
          }
        });
      } else {
        // 已经是云存储ID或持久路径
        cloudImages.push(img);
        completed++;
        this.checkSaveComplete(cloudImages, completed);
      }
    });
  },

  /**
   * 检查是否全部保存完成
   */
  checkSaveComplete(cloudImages, completed) {
    if (completed === this.data.images.length) {
      this.data.images = cloudImages;

      // 保存到云数据库
      this.saveToCloudDatabase();

      this.setData({
        isUploading: false,
        currentStep: 3
      });
      wx.showToast({ title: '保存成功', icon: 'success' });
    }
  },

  /**
   * 保存到云数据库
   */
  saveToCloudDatabase() {
    const db = wx.cloud.database();
    const { selectedVariant, images, selectedCategory, selectedEra, price, note } = this.data;

    // 构建藏品数据
    const collectionData = {
      variantId: selectedVariant.id,
      name: selectedVariant.name,
      images: images.map(img => ({
        fileID: img.url,
        type: img.type,
        note: img.note || '',
        createTime: img.createTime || Date.now()
      })),
      categoryName: selectedCategory?.name || '',
      eraName: selectedEra?.name || '',
      variantName: selectedVariant?.name || '',
      date: this.formatDate(new Date()),
      price: price || 0,
      note: note || '',
      createTime: db.serverDate()
    };

    // 添加到云数据库
    db.collection('collections').add({
      data: collectionData,
      success: (res) => {
        console.log('藏品已存入云数据库', res);
        // 同时更新本地存储
        this.updateVariantData();
        // 重置表单
        this.resetForm();
      },
      fail: (err) => {
        console.error('存入云数据库失败:', err);
        // 即使云数据库失败，也保存到本地
        this.updateVariantData();
        this.resetForm();
      }
    });
  },

  /**
   * 重置表单
   */
  resetForm() {
    this.setData({
      images: [],
      note: '',
      price: '',
      currentStep: 1,
      selectedCategory: null,
      selectedEra: null,
      selectedVariant: null,
      categoryIndex: -1,
      eraIndex: -1,
      variantIndex: -1,
      variants: []
    });
  },

  /**
   * 更新版别数据
   */
  updateVariantData() {
    const variants = wx.getStorageSync('coinVariants') || [];
    const variantId = this.data.selectedVariant.id;

    for (let variant of variants) {
      if (variant.id === variantId) {
        variant.collected = true;
        variant.images = this.data.images;
        break;
      }
    }

    wx.setStorageSync('coinVariants', variants);

    this.updateUserCollection(variantId);
  },

  /**
   * 更新用户收藏记录
   */
  updateUserCollection(variantId) {
    let collection = wx.getStorageSync('userCollection') || [];
    const { selectedVariant } = this.data;

    const exists = collection.find(item => item.id === variantId);

    if (!exists) {
      const newCollection = {
        id: variantId,
        name: selectedVariant.name,
        images: this.data.images,
        date: this.formatDate(new Date()),
        category: this.data.selectedCategory?.name,
        era: this.data.selectedEra?.name,
        variant: selectedVariant.name
      };

      collection.unshift(newCollection);
      wx.setStorageSync('userCollection', collection);
    } else {
      collection = collection.map(item => {
        if (item.id === variantId) {
          return {
            ...item,
            images: this.data.images,
            date: this.formatDate(new Date())
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
  },

  /**
   * 完成页操作
   */
  goToHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  continueUpload() {
    this.setData({
      currentStep: 1,
      images: [],
      note: '',
      selectedCategory: null,
      selectedEra: null,
      selectedVariant: null,
      categoryIndex: -1,
      eraIndex: -1,
      variantIndex: -1,
      variants: []
    });
    this.loadCategories();
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 阻止触摸移动
   */
  preventTouchMove() {
    return false;
  }
});