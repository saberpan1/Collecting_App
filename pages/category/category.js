/**
 * 分类页面 - 展示所有钱币分类
 */
Page({
  data: {
    categories: [],
    selectedCategory: null,
    selectedEra: null,
    tabbarList: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/category/category', text: '分类' },
      { pagePath: 'pages/statistics/statistics', text: '统计' },
      { pagePath: 'pages/mine/mine', text: '我的' }
    ],
    selectedTabBar: 1
  },

  onLoad() {
    this.loadCategories();
  },

  onShow() {
    this.setData({ selectedTabBar: 1 });
    this.loadCategories();
  },

  /**
   * 加载分类数据
   */
  loadCategories() {
    const categories = wx.getStorageSync('coinCategories') || [];
    this.setData({
      categories: categories
    });
  },

  /**
   * 选择分类
   */
  selectCategory(e) {
    const { id } = e.currentTarget.dataset;
    const category = this.data.categories.find(c => c.id === id);
    
    this.setData({
      selectedCategory: category,
      selectedEra: null
    });
  },

  /**
   * 选择年代
   */
  selectEra(e) {
    const { eraId } = e.currentTarget.dataset;
    const era = this.data.selectedCategory.eras.find(e => e.id === eraId);
    
    this.setData({
      selectedEra: era
    });
  },

  /**
   * 跳转到版别列表
   */
  goToVariants(e) {
    const { eraId, eraName } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?eraId=${eraId}&eraName=${encodeURIComponent(eraName)}`
    });
  },

  /**
   * 返回分类列表
   */
  backToCategories() {
    this.setData({
      selectedCategory: null,
      selectedEra: null
    });
  }
});
