/**
 * 收藏品列表页 - 按分类/年代展示收藏品
 */
Page({
  data: {
    title: '收藏品列表',
    type: '',  // 'category' | 'era'
    filterValue: '',
    collections: [],
    loading: true,
    refreshing: false,
    scrollTop: 0
  },

  onLoad(options) {
    const { type, name, eraId } = options;

    const title = name ? decodeURIComponent(name) : '收藏品列表';

    this.setData({
      type: type,
      filterValue: type === 'era' ? eraId : decodeURIComponent(name || ''),
      title: title
    });

    wx.setNavigationBarTitle({ title: title });

    this.loadCollections();
  },

  onShow() {
    this.loadCollections();
  },

  /**
   * 加载收藏品数据
   */
  loadCollections() {
    this.setData({ loading: true });

    const db = wx.cloud.database();
    const { type, filterValue } = this.data;

    db.collection('collections').get({
      success: (res) => {
        let collections = res.data || [];

        // 根据类型筛选
        if (type === 'category') {
          const categories = wx.getStorageSync('coinCategories') || [];
          const category = categories.find(c => c.name === filterValue);
          if (category) {
            const eraIds = category.eras.map(e => e.id);
            const variants = wx.getStorageSync('coinVariants') || [];
            const categoryVariantIds = variants
              .filter(v => eraIds.includes(v.eraId))
              .map(v => v.id);
            collections = collections.filter(c => categoryVariantIds.includes(c.variantId));
          }
        } else if (type === 'era') {
          collections = collections.filter(c => c.variantId && String(c.variantId).startsWith(filterValue));
        }

        // 处理显示数据
        collections = collections.map(item => {
          let displayUrl = '';
          if (item.images && item.images.length > 0) {
            const firstImg = item.images[0];
            if (firstImg.url) {
              displayUrl = firstImg.url;
            } else if (firstImg.fileID) {
              displayUrl = firstImg.fileID;
            }
          }
          return {
            ...item,
            displayUrl: displayUrl
          };
        });

        this.setData({
          collections: collections,
          loading: false
        });
      },
      fail: (err) => {
        console.error('加载收藏品失败:', err);
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  /**
   * 下拉刷新
   */
  onRefresh() {
    this.setData({ refreshing: true });
    this.loadCollections();
    setTimeout(() => {
      this.setData({ refreshing: false });
    }, 500);
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
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 查看详情
   */
  viewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});
