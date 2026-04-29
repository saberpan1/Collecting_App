/**
 * 首页 - 展示收藏统计和快速入口
 */
Page({
  data: {
    stats: {
      totalCollected: 0,
      totalImages: 0,
      totalValue: 0
    },
    loading: true,
    tabbarList: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/statistics/statistics', text: '统计' },
      { pagePath: 'pages/mine/mine', text: '我的' }
    ],
    selectedTabBar: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.setData({ selectedTabBar: 0 });
    this.loadData();
  },

  /**
   * 加载页面数据
   */
  loadData() {
    this.setData({ loading: true });

    const app = getApp();
    app.getStatistics().then(stats => {
      this.setData({
        stats: stats,
        loading: false
      });
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
