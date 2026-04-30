/**
 * 个人中心 - 收藏展示版
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
    scrollTop: 0,
    tabbarList: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/statistics/statistics', text: '统计' },
      { pagePath: 'pages/mine/mine', text: '我的' }
    ],
    selectedTabBar: 2
  },

  onShow() {
    this.setData({ selectedTabBar: 2 });
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    this.loadFromCloudDatabase();
  },

  /**
   * 从云数据库加载收藏数据
   */
  loadFromCloudDatabase() {
    const db = wx.cloud.database();

    db.collection('collections').orderBy('createTime', 'desc').get({
      success: (res) => {
        const cloudData = res.data || [];

        if (cloudData.length > 0) {
          this.processCloudCollection(cloudData);
        } else {
          this.setData({
            collection: [],
            displayList: [],
            stats: { totalCollected: 0, totalImages: 0, totalValue: 0 }
          });
        }
      },
      fail: (err) => {
        console.error('从云数据库加载失败:', err);
        this.loadFromLocalStorage();
      }
    });
  },

  /**
   * 处理云数据库数据
   */
  processCloudCollection(cloudData) {
    const variantIds = new Set();
    let totalImages = 0;
    let totalValue = 0;

    cloudData.forEach(item => {
      if (item.variantId) {
        variantIds.add(item.variantId);
      }
      if (item.images) {
        totalImages += item.images.length;
      }
      if (item.price) {
        totalValue += parseFloat(item.price);
      }
    });

    const displayList = cloudData.map(item => {
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
        _id: item._id,
        displayUrl: displayUrl
      };
    });

    this.setData({
      collection: cloudData,
      displayList: displayList,
      stats: {
        totalCollected: variantIds.size,
        totalImages: totalImages,
        totalValue: totalValue.toFixed(2)
      }
    });

    if (this.data.isSearching) {
      this.performSearch(this.data.searchKeyword);
    }
  },

  /**
   * 从本地存储加载
   */
  loadFromLocalStorage() {
    const collection = wx.getStorageSync('userCollection') || [];
    this.processCloudCollection(collection);
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
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });

    if (keyword) {
      this.performSearch(keyword);
    } else {
      this.setData({
        isSearching: false,
        searchResult: [],
        displayList: this.data.collection
      });
    }
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    const results = this.data.collection.filter(item => {
      const name = (item.name || '').toLowerCase();
      const era = (item.eraName || '').toLowerCase();
      const variant = (item.variantName || '').toLowerCase();
      const search = keyword.toLowerCase();

      return name.includes(search) || era.includes(search) || variant.includes(search);
    });

    const searchResult = results.map(item => {
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
        _id: item._id,
        displayUrl: displayUrl
      };
    });

    this.setData({
      isSearching: true,
      searchResult: searchResult,
      displayList: searchResult
    });
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

    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  /**
   * 删除收藏
   */
  deleteCollection(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏记录吗？',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          this.deleteFromDatabase(id);
        }
      }
    });
  },

  /**
   * 从数据库删除
   */
  deleteFromDatabase(id) {
    const db = wx.cloud.database();

    db.collection('collections').doc(id).remove({
      success: () => {
        wx.showToast({ title: '已删除', icon: 'success' });
        this.loadData();
      },
      fail: (err) => {
        console.error('删除失败:', err);
        wx.showToast({ title: '删除失败', icon: 'none' });
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