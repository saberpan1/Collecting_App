/**
 * 古钱币收藏小程序 - 主入口文件
 */
App({
  onLaunch() {
    // 初始化本地存储
    this.initStorage();
  },

  /**
   * 初始化本地数据存储
   */
  initStorage() {
    // 初始化用户收藏数据
    const userCollection = wx.getStorageSync('userCollection');
    if (!userCollection) {
      wx.setStorageSync('userCollection', []);
    }

    // 初始化钱币分类数据
    const coinCategories = wx.getStorageSync('coinCategories');
    if (!coinCategories) {
      this.initDefaultCategories();
    }
  },

  /**
   * 初始化默认分类数据
   */
  initDefaultCategories() {
    const defaultCategories = [
      {
        id: 1,
        name: '先秦货币',
        icon: '/images/category-qin.png',
        eras: [
          { id: 101, name: '战国', years: '公元前 475-221 年' },
          { id: 102, name: '秦朝', years: '公元前 221-207 年' }
        ]
      },
      {
        id: 2,
        name: '汉唐货币',
        icon: '/images/category-han.png',
        eras: [
          { id: 201, name: '汉朝', years: '公元前 202-公元 220 年' },
          { id: 202, name: '唐朝', years: '618-907 年' }
        ]
      },
      {
        id: 3,
        name: '宋元货币',
        icon: '/images/category-song.png',
        eras: [
          { id: 301, name: '宋朝', years: '960-1279 年' },
          { id: 302, name: '元朝', years: '1271-1368 年' }
        ]
      },
      {
        id: 4,
        name: '明清货币',
        icon: '/images/category-ming.png',
        eras: [
          { id: 401, name: '明朝', years: '1368-1644 年' },
          { id: 402, name: '清朝', years: '1644-1912 年' }
        ]
      },
      {
        id: 5,
        name: '民国货币',
        icon: '/images/category-min.png',
        eras: [
          { id: 501, name: '民国', years: '1912-1949 年' }
        ]
      }
    ];

    wx.setStorageSync('coinCategories', defaultCategories);

    // 初始化版别数据
    const defaultVariants = this.generateDefaultVariants(defaultCategories);
    wx.setStorageSync('coinVariants', defaultVariants);
  },

  /**
   * 生成默认版别数据
   */
  generateDefaultVariants(categories) {
    const variants = [];
    let variantId = 1;

    categories.forEach(category => {
      category.eras.forEach(era => {
        // 为每个年代生成一些默认版别
        const eraVariants = this.getEraVariants(era.id, era.name, variantId);
        variants.push(...eraVariants);
        variantId += eraVariants.length;
      });
    });

    return variants;
  },

  /**
   * 根据年代获取默认版别
   */
  getEraVariants(eraId, eraName, startId) {
    const variantTemplates = {
      101: ['刀币', '布币', '圜钱', '蚁鼻钱'],
      102: ['半两', '秦半两'],
      201: ['五铢', '货泉', '大泉五十'],
      202: ['开元通宝', '乾元重宝'],
      301: ['宋元通宝', '太平通宝', '淳化元宝', '至道元宝'],
      302: ['大元通宝', '至大通宝'],
      401: ['洪武通宝', '永乐通宝', '宣德通宝'],
      402: ['顺治通宝', '康熙通宝', '雍正通宝', '乾隆通宝', '嘉庆通宝'],
      501: ['开国纪念币', '袁大头', '孙小头']
    };

    const templates = variantTemplates[eraId] || ['通宝'];
    
    return templates.map((name, index) => ({
      id: startId + index,
      eraId: eraId,
      eraName: eraName,
      name: name,
      subVariants: this.generateSubVariants(name, startId + index),
      collected: false,
      images: []
    }));
  },

  /**
   * 生成子版别 (不同面文)
   */
  generateSubVariants(variantName, baseId) {
    const subVariants = [
      { id: baseId * 100 + 1, name: `${variantName} - 小平`, collected: false, images: [] },
      { id: baseId * 100 + 2, name: `${variantName} - 折二`, collected: false, images: [] },
      { id: baseId * 100 + 3, name: `${variantName} - 折三`, collected: false, images: [] },
      { id: baseId * 100 + 4, name: `${variantName} - 当十`, collected: false, images: [] }
    ];

    return subVariants;
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null
  }
});
