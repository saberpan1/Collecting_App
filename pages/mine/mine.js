/**
 * 个人中心 - 简化调试版
 */
Page({
  data: {
    stats: {
      totalCollected: 0,
      totalImages: 0,
      totalValue: 0
    },
    collection: [],
    displayList: [],
    searchKeyword: '',
    searchResult: [],
    isSearching: false,
    refreshing: false,
    tabbarList: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/category/category', text: '分类' },
      { pagePath: 'pages/statistics/statistics', text: '统计' },
      { pagePath: 'pages/mine/mine', text: '我的' }
    ],
    selectedTabBar: 3
  },

  onShow() {
    console.log('onShow 被调用');
    this.setData({ selectedTabBar: 3 });
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    console.log('loadData 被调用');
    // 先从本地存储加载，确保页面能显示
    this.loadFromLocalStorage();
  },

  /**
   * 从本地存储加载
   */
  loadFromLocalStorage() {
    console.log('从本地存储加载...');
    const collection = wx.getStorageSync('userCollection') || [];
    console.log('本地数据:', collection);

    let totalImages = 0;
    let totalValue = 0;

    collection.forEach(item => {
      if (item.images) {
        totalImages += item.images.length;
      }
      if (item.price) {
        totalValue += parseFloat(item.price);
      }
    });

    const displayList = collection.map(item => {
      let displayUrl = '';
      if (item.images && item.images.length > 0) {
        displayUrl = item.images[0].url || item.images[0] || '';
      }
      return {
        ...item,
        _id: item.id || item._id || Date.now(),
        displayUrl: displayUrl
      };
    });

    console.log('displayList:', displayList);

    this.setData({
      collection: collection,
      displayList: displayList,
      stats: {
        totalCollected: collection.length,
        totalImages: totalImages,
        totalValue: totalValue.toFixed(2)
      }
    });

    console.log('数据设置完成');
  },

  /**
   * 下拉刷新
   */
  onRefresh() {
    console.log('下拉刷新');
    this.setData({ refreshing: true });
    this.loadData();
    setTimeout(() => {
      this.setData({ refreshing: false });
    }, 500);
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    console.log('搜索:', keyword);
    this.setData({ searchKeyword: keyword });

    if (keyword) {
      const results = this.data.collection.filter(item => {
        const name = (item.name || '').toLowerCase();
        return name.includes(keyword.toLowerCase());
      });

      const searchResult = results.map(item => {
        let displayUrl = '';
        if (item.images && item.images.length > 0) {
          displayUrl = item.images[0].url || item.images[0] || '';
        }
        return {
          ...item,
          _id: item.id || item._id || Date.now(),
          displayUrl: displayUrl
        };
      });

      this.setData({
        isSearching: true,
        searchResult: searchResult,
        displayList: searchResult
      });
    } else {
      this.setData({
        isSearching: false,
        searchResult: [],
        displayList: this.data.collection
      });
    }
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchKeyword: '',
      isSearching: false,
      searchResult: [],
      displayList: this.data.collection
    });
  },

  /**
   * 退出搜索
   */
  exitSearch() {
    this.clearSearch();
  },

  /**
   * 卡片点击 - 跳转到详情页
   */
  onCardTap(e) {
    const { id } = e.currentTarget.dataset;
    console.log('点击卡片, id:', id);

    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  /**
   * 删除收藏
   */
  deleteCollection(e) {
    const { id } = e.currentTarget.dataset;
    console.log('删除, id:', id);

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏记录吗？',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          let collection = wx.getStorageSync('userCollection') || [];
          collection = collection.filter(item => !(item.id == id || item._id == id));
          wx.setStorageSync('userCollection', collection);
          this.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  /**
   * 跳转上传页
   */
  goToUpload() {
    wx.reLaunch({ url: '/pages/upload/upload' });
  }
});