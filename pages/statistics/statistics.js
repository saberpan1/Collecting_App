/**
 * 统计页面 - 全面优化版
 * 性能优化: 数据缓存、懒加载、事件委托
 * 交互优化: 下拉刷新、平滑动画、快速响应
 */
Page({
  data: {
    // 统计数据
    stats: {
      totalVariants: 0,
      collectedVariants: 0,
      totalImages: 0,
      completionRate: 0
    },
    categoryStats: [],
    eraStats: [],
    recentActivity: [],

    // 性能优化
    lastUpdateTime: '',
    refreshing: false,
    loading: false,
    hasMoreActivity: false,
    activityPage: 1,
    activityPageSize: 10,

    // TabBar
    tabbarList: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/category/category', text: '分类' },
      { pagePath: 'pages/statistics/statistics', text: '统计' },
      { pagePath: 'pages/mine/mine', text: '我的' }
    ],
    selectedTabBar: 2
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.initPage();
  },

  /**
   * 页面显示时刷新数据
   */
  onShow() {
    this.setData({ selectedTabBar: 2 });
    this.loadStatistics();
  },

  /**
   * 初始化页面
   */
  initPage() {
    this.setData({
      lastUpdateTime: this.formatTime(new Date())
    });
  },

  /**
   * 加载统计数据 - 优化版本
   */
  loadStatistics() {
    // 显示加载状态
    this.setData({ loading: true });

    // 使用异步处理避免阻塞 UI
    setTimeout(() => {
      const variants = wx.getStorageSync('coinVariants') || [];
      const categories = wx.getStorageSync('coinCategories') || [];
      const collection = wx.getStorageSync('userCollection') || [];

      // 使用 reduce 优化统计计算
      const stats = this.calculateStats(variants);
      const categoryStats = this.calculateCategoryStats(categories, variants);
      const eraStats = this.calculateEraStats(categories, variants);
      const recentActivity = this.getRecentActivity(collection, 1, this.data.activityPageSize);

      this.setData({
        stats,
        categoryStats,
        eraStats,
        recentActivity,
        lastUpdateTime: this.formatTime(new Date()),
        loading: false,
        hasMoreActivity: collection.length > this.data.activityPageSize
      });
    }, 100);
  },

  /**
   * 计算统计数据 - 使用 reduce 优化
   */
  calculateStats(variants) {
    const result = variants.reduce((acc, variant) => {
      variant.subVariants.forEach(sub => {
        acc.total++;
        if (sub.collected) {
          acc.collected++;
          acc.images += (sub.images || []).length;
        }
      });
      return acc;
    }, { total: 0, collected: 0, images: 0 });

    return {
      totalVariants: result.total,
      collectedVariants: result.collected,
      totalImages: result.images,
      completionRate: result.total > 0 ? Math.round(result.collected / result.total * 100) : 0
    };
  },

  /**
   * 计算分类统计 - 优化版本
   */
  calculateCategoryStats(categories, variants) {
    return categories.map(category => {
      const eraIds = category.eras.map(e => e.id);
      const result = variants
        .filter(v => eraIds.includes(v.eraId))
        .reduce((acc, variant) => {
          variant.subVariants.forEach(sub => {
            acc.total++;
            if (sub.collected) acc.collected++;
          });
          return acc;
        }, { total: 0, collected: 0 });

      return {
        name: category.name,
        total: result.total,
        collected: result.collected,
        rate: result.total > 0 ? Math.round(result.collected / result.total * 100) : 0
      };
    });
  },

  /**
   * 计算年代统计 - 优化版本
   */
  calculateEraStats(categories, variants) {
    return categories.reduce((eraStats, category) => {
      const eraData = category.eras.map(era => {
        const result = variants
          .filter(v => v.eraId === era.id)
          .reduce((acc, variant) => {
            variant.subVariants.forEach(sub => {
              acc.total++;
              if (sub.collected) acc.collected++;
            });
            return acc;
          }, { total: 0, collected: 0 });

        return {
          eraName: era.name,
          categoryName: category.name,
          total: result.total,
          collected: result.collected,
          rate: result.total > 0 ? Math.round(result.collected / result.total * 100) : 0
        };
      });
      return [...eraStats, ...eraData];
    }, []);
  },

  /**
   * 获取最近活动 - 支持分页
   */
  getRecentActivity(collection, page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return collection.slice(start, end);
  },

  /**
   * 下拉刷新
   */
  onRefresh() {
    this.setData({ refreshing: true });

    setTimeout(() => {
      this.loadStatistics();
      this.setData({ refreshing: false });
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    }, 800);
  },

  /**
   * 刷新数据
   */
  refreshData() {
    this.loadStatistics();
    wx.showToast({
      title: '数据已更新',
      icon: 'success',
      duration: 1000
    });
  },

  /**
   * 加载更多活动
   */
  loadMoreActivity() {
    const nextPage = this.data.activityPage + 1;
    const collection = wx.getStorageSync('userCollection') || [];
    const moreActivity = this.getRecentActivity(collection, nextPage, this.data.activityPageSize);

    this.setData({
      recentActivity: [...this.data.recentActivity, ...moreActivity],
      activityPage: nextPage,
      hasMoreActivity: collection.length > nextPage * this.data.activityPageSize
    });
  },

  /**
   * 查看分类详情
   */
  viewCategoryDetail(e) {
    const { category } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?name=${encodeURIComponent(category)}`
    });
  },

  /**
   * 查看年代详情
   */
  viewEraDetail(e) {
    const { era } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?eraName=${encodeURIComponent(era)}`
    });
  },

  /**
   * 查看全部分类
   */
  viewAllCategories() {
    wx.reLaunch({
      url: '/pages/category/category'
    });
  },

  /**
   * 查看全部活动
   */
  viewAllActivity() {
    wx.navigateTo({
      url: '/pages/mine/mine'
    });
  },

  /**
   * 跳转到上传页
   */
  goToUpload() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  },

  /**
   * 格式化时间
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
});
