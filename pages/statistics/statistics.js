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
    scrollTop: 0,
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
    selectedTabBar: 1
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
    this.setData({ selectedTabBar: 1 });
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
    this.setData({ loading: true });

    const db = wx.cloud.database();

    db.collection('collections').get({
      success: (res) => {
        const cloudData = res.data || [];
        const variants = wx.getStorageSync('coinVariants') || [];
        const categories = wx.getStorageSync('coinCategories') || [];

        const categoryStats = this.calculateCategoryStats(categories, cloudData);
        const eraStats = this.calculateEraStats(categories, cloudData);

        // 总体统计
        const variantIds = new Set();
        let totalImages = 0;
        let totalValue = 0;

        cloudData.forEach(item => {
          if (item.variantId) variantIds.add(item.variantId);
          if (item.images) totalImages += item.images.length;
          if (item.price) totalValue += parseFloat(item.price);
        });

        this.setData({
          stats: {
            totalVariants: variants.length,
            collectedVariants: variantIds.size,
            totalImages: totalImages,
            totalValue: totalValue,
            completionRate: variants.length > 0 ? Math.round(variantIds.size / variants.length * 100) : 0
          },
          categoryStats,
          eraStats,
          lastUpdateTime: this.formatTime(new Date()),
          loading: false
        });
      },
      fail: (err) => {
        console.error('加载统计数据失败:', err);
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  /**
   * 计算分类统计
   */
  calculateCategoryStats(categories, cloudData) {
    const variants = wx.getStorageSync('coinVariants') || [];

    return categories.map(category => {
      const eraIds = category.eras.map(e => e.id);

      // 该分类的总版别数
      const categoryVariantCount = variants.filter(v => eraIds.includes(v.eraId)).length;

      // 从云数据中筛选该分类的 variantId（去重）
      const variantIds = new Set();
      cloudData.forEach(item => {
        if (item.variantId) {
          const variant = variants.find(v => v.id === item.variantId);
          if (variant && eraIds.includes(variant.eraId)) {
            variantIds.add(item.variantId);
          }
        }
      });

      return {
        name: category.name,
        total: categoryVariantCount,
        collected: variantIds.size,
        hasCollected: variantIds.size > 0
      };
    });
  },

  /**
   * 计算年代统计
   */
  calculateEraStats(categories, cloudData) {
    const variants = wx.getStorageSync('coinVariants') || [];

    return categories.reduce((eraStats, category) => {
      const eraData = category.eras.map(era => {
        // 该年代的总版别数
        const eraVariantCount = variants.filter(v => v.eraId === era.id).length;

        // 从云数据中筛选该年代的 variantId（去重）
        const variantIds = new Set();
        cloudData.forEach(item => {
          if (item.variantId) {
            const variant = variants.find(v => v.id === item.variantId);
            if (variant && variant.eraId === era.id) {
              variantIds.add(item.variantId);
            }
          }
        });

        return {
          eraName: era.name,
          categoryName: category.name,
          eraId: era.id,
          total: eraVariantCount,
          collected: variantIds.size,
          hasCollected: variantIds.size > 0
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
   * 滚动监听
   */
  onScroll(e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    });
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
      url: `/pages/collection-list/collection-list?type=category&name=${encodeURIComponent(category)}`
    });
  },

  /**
   * 查看年代详情
   */
  viewEraDetail(e) {
    const { era, eraId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/collection-list/collection-list?type=era&name=${encodeURIComponent(era)}&eraId=${eraId}`
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
