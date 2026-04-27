/**
 * 统计页面 - 展示收藏统计数据和图表
 */
Page({
  data: {
    stats: {
      totalVariants: 0,
      collectedVariants: 0,
      totalImages: 0,
      completionRate: 0
    },
    categoryStats: [],
    eraStats: [],
    recentActivity: []
  },

  onShow() {
    this.loadStatistics();
  },

  /**
   * 加载统计数据
   */
  loadStatistics() {
    const variants = wx.getStorageSync('coinVariants') || [];
    const categories = wx.getStorageSync('coinCategories') || [];
    const collection = wx.getStorageSync('userCollection') || [];

    // 计算总体统计
    const totalVariants = this.countTotalVariants(variants);
    const collectedVariants = this.countCollectedVariants(variants);
    const totalImages = this.countTotalImages(variants);
    const completionRate = totalVariants > 0 
      ? Math.round(collectedVariants / totalVariants * 100) 
      : 0;

    // 按分类统计
    const categoryStats = this.calculateCategoryStats(categories, variants);

    // 按年代统计
    const eraStats = this.calculateEraStats(categories, variants);

    this.setData({
      stats: {
        totalVariants,
        collectedVariants,
        totalImages,
        completionRate
      },
      categoryStats,
      eraStats,
      recentActivity: collection.slice(0, 10)
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
   * 计算分类统计
   */
  calculateCategoryStats(categories, variants) {
    return categories.map(category => {
      const eraIds = category.eras.map(e => e.id);
      const categoryVariants = variants.filter(v => eraIds.includes(v.eraId));
      
      let total = 0;
      let collected = 0;
      
      categoryVariants.forEach(v => {
        v.subVariants.forEach(sv => {
          total++;
          if (sv.collected) {
            collected++;
          }
        });
      });

      return {
        name: category.name,
        total,
        collected,
        rate: total > 0 ? Math.round(collected / total * 100) : 0
      };
    });
  },

  /**
   * 计算年代统计
   */
  calculateEraStats(categories, variants) {
    const eraStats = [];
    
    categories.forEach(category => {
      category.eras.forEach(era => {
        const eraVariants = variants.filter(v => v.eraId === era.id);
        
        let total = 0;
        let collected = 0;
        
        eraVariants.forEach(v => {
          v.subVariants.forEach(sv => {
            total++;
            if (sv.collected) {
              collected++;
            }
          });
        });

        eraStats.push({
          eraName: era.name,
          categoryName: category.name,
          total,
          collected,
          rate: total > 0 ? Math.round(collected / total * 100) : 0
        });
      });
    });

    return eraStats;
  },

  /**
   * 查看详情
   */
  goToDetail(e) {
    const { type, id, name } = e.currentTarget.dataset;
    
    if (type === 'category') {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&name=${encodeURIComponent(name)}`
      });
    }
  }
});
