/**
 * 详情页面 - 展示特定年代或分类下的所有版别
 */
Page({
  data: {
    variants: [],
    title: '',
    filterType: 'all', // all, collected, uncollected
    filteredVariants: []
  },

  onLoad(options) {
    const { id, name, eraId, eraName } = options;
    
    if (eraId) {
      // 按年代加载
      this.loadVariantsByEra(eraId, eraName);
    } else if (id) {
      // 按分类加载
      this.loadVariantsByCategory(id, name);
    }
  },

  /**
   * 根据年代加载版别
   */
  loadVariantsByEra(eraId, eraName) {
    const allVariants = wx.getStorageSync('coinVariants') || [];
    const variants = allVariants.filter(v => v.eraId === parseInt(eraId));
    
    this.setData({
      title: decodeURIComponent(eraName),
      variants: variants,
      filteredVariants: variants
    });
  },

  /**
   * 根据分类加载版别
   */
  loadVariantsByCategory(categoryId, categoryName) {
    const categories = wx.getStorageSync('coinCategories') || [];
    const category = categories.find(c => c.id === parseInt(categoryId));
    
    if (category) {
      const allVariants = wx.getStorageSync('coinVariants') || [];
      const eraIds = category.eras.map(e => e.id);
      const variants = allVariants.filter(v => eraIds.includes(v.eraId));
      
      this.setData({
        title: decodeURIComponent(categoryName),
        variants: variants,
        filteredVariants: variants
      });
    }
  },

  /**
   * 筛选版别
   */
  filterVariants(e) {
    const { type } = e.currentTarget.dataset;
    let filtered = [];

    if (type === 'all') {
      filtered = [...this.data.variants];
    } else if (type === 'collected') {
      filtered = this.data.variants.filter(v => 
        v.subVariants.some(sv => sv.collected)
      );
    } else if (type === 'uncollected') {
      filtered = this.data.variants.filter(v => 
        !v.subVariants.some(sv => sv.collected)
      );
    }

    this.setData({
      filterType: type,
      filteredVariants: filtered
    });
  },

  /**
   * 跳转到上传页面
   */
  goToUpload(e) {
    const { variantId, variantName } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/upload/upload?variantId=${variantId}&variantName=${encodeURIComponent(variantName)}`
    });
  },

  /**
   * 查看图片详情
   */
  previewImages(e) {
    const { images } = e.currentTarget.dataset;
    
    if (images && images.length > 0) {
      wx.previewImage({
        current: images[0],
        urls: images
      });
    }
  }
});
