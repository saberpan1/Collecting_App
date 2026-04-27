/**
 * 首页 - 展示推荐钱币和快速入口
 */
Page({
  data: {
    categories: [],
    recentCollection: [],
    stats: {
      totalVariants: 0,
      collectedVariants: 0,
      totalImages: 0
    }
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  /**
   * 加载页面数据
   */
  loadData() {
    const categories = wx.getStorageSync('coinCategories') || [];
    const userCollection = wx.getStorageSync('userCollection') || [];
    const variants = wx.getStorageSync('coinVariants') || [];

    // 计算统计数据
    const totalVariants = this.countTotalVariants(variants);
    const collectedVariants = this.countCollectedVariants(variants);
    const totalImages = this.countTotalImages(variants);

    this.setData({
      categories: categories.slice(0, 4),
      recentCollection: userCollection.slice(0, 6),
      stats: {
        totalVariants,
        collectedVariants,
        totalImages
      }
    });
  },

  /**
   * 统计总版别数
   */
  countTotalVariants(variants) {
    let count = 0;
    variants.forEach(variant => {
      count += variant.subVariants.length;
    });
    return count;
  },

  /**
   * 统计已收藏版别数
   */
  countCollectedVariants(variants) {
    let count = 0;
    variants.forEach(variant => {
      variant.subVariants.forEach(sub => {
        if (sub.collected) {
          count++;
        }
      });
    });
    return count;
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
   * 跳转到分类页面
   */
  goToCategory() {
    wx.switchTab({
      url: '/pages/category/category'
    });
  },

  /**
   * 跳转到统计页面
   */
  goToStatistics() {
    wx.switchTab({
      url: '/pages/statistics/statistics'
    });
  },

  /**
   * 跳转到详情页面
   */
  goToDetail(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&name=${encodeURIComponent(name)}`
    });
  },

  /**
   * 跳转到上传页面
   */
  goToUpload() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  }
});
