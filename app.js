/**
 * 古钱币收藏小程序 - 主入口文件
 */

wx.cloud.init({
  env: 'cloud1-d9ggzj1gu9463bcea'
});

App({
  onLaunch() {
    this.initStorage();
  },

  /**
   * 初始化本地数据存储
   */
  initStorage() {
    const userCollection = wx.getStorageSync('userCollection');
    if (!userCollection) {
      wx.setStorageSync('userCollection', []);
    }

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
        eras: [
          { id: 101, name: '周' },
          { id: 102, name: '齐' },
          { id: 103, name: '楚' },
          { id: 104, name: '燕' },
          { id: 105, name: '赵' },
          { id: 106, name: '魏' },
          { id: 107, name: '韩' },
          { id: 108, name: '中山' }
        ]
      },
      {
        id: 2,
        name: '秦汉货币',
        eras: [
          { id: 201, name: '秦' },
          { id: 202, name: '西汉' },
          { id: 203, name: '新莽' },
          { id: 204, name: '东汉' }
        ]
      },
      {
        id: 3,
        name: '三国两晋南北朝',
        eras: [
          { id: 301, name: '三国' },
          { id: 302, name: '西晋' },
          { id: 303, name: '东晋' },
          { id: 304, name: '南朝' },
          { id: 305, name: '北朝' }
        ]
      },
      {
        id: 4,
        name: '隋唐货币',
        eras: [
          { id: 401, name: '隋' },
          { id: 402, name: '唐' }
        ]
      },
      {
        id: 5,
        name: '五代十国',
        eras: [
          { id: 501, name: '后梁' },
          { id: 502, name: '后唐' },
          { id: 503, name: '后晋' },
          { id: 504, name: '后汉' },
          { id: 505, name: '后周' },
          { id: 506, name: '南唐' },
          { id: 507, name: '前蜀' },
          { id: 508, name: '后蜀' },
          { id: 509, name: '闽' },
          { id: 510, name: '南汉' },
          { id: 511, name: '楚' }
        ]
      },
      {
        id: 6,
        name: '宋元货币',
        eras: [
          { id: 601, name: '北宋' },
          { id: 602, name: '南宋' },
          { id: 603, name: '辽' },
          { id: 604, name: '金' },
          { id: 605, name: '西夏' },
          { id: 606, name: '元' }
        ]
      },
      {
        id: 7,
        name: '明清货币',
        eras: [
          { id: 701, name: '明' },
          { id: 702, name: '南明' },
          { id: 703, name: '三藩' },
          { id: 704, name: '清' }
        ]
      }
    ];

    wx.setStorageSync('coinCategories', defaultCategories);

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
      // 先秦
      101: ['东周圜钱', '西周圜钱', '平肩弧足空首布', '斜肩弧足空首布'],
      102: ['齐三字刀', '四字刀', '五字刀', '六字刀', '齐明刀', '賹化', '賹四化', '賹六化'],
      103: ['蚁鼻钱', '鬼脸钱', '郢爰金版', '殊布当釿', '四布当釿'],
      104: ['尖首刀', '燕明刀', '明四', '明化', '一化圜钱'],
      105: ['甘丹直刀', '白人直刀', '蔺圜钱', '离石圜钱', '尖足布', '圆足布', '三孔布'],
      106: ['垣字圜钱', '共字圜钱', '安邑釿布', '梁充釿布', '桥足布'],
      107: ['锐角布', '平阳方足布', '新郑方足布', '少曲圜钱'],
      108: ['灵寿尖足布', '中山圆足布', '中山直刀'],
      // 秦汉
      201: ['战国半两', '秦半两'],
      202: ['汉半两', '八铢半两', '四铢半两', '郡国五铢', '三官五铢'],
      203: ['大泉五十', '小泉直一', '货泉', '布泉', '货布', '壮泉四十', '国宝金匮直万'],
      204: ['东汉五铢', '剪轮五铢', '綖环五铢', '四出五铢'],
      // 三国两晋南北朝
      301: ['曹魏五铢', '蜀汉直百五铢', '蜀汉太平百钱', '东吴大泉五百', '东吴大泉当千'],
      302: ['沿用汉五铢', '西晋私铸小五铢'],
      303: ['沈郎五铢', '沿用汉魏旧钱'],
      304: ['孝建四铢', '永光', '景和', '公式女钱', '萧梁五铢', '陈天嘉五铢'],
      305: ['北魏永安五铢', '北齐常平五铢', '北周五行大布', '北周永通万国', '北周布泉'],
      // 隋唐
      401: ['隋五铢', '开皇五铢'],
      402: ['开元通宝', '乾元重宝', '会昌开元', '大历元宝', '建中通宝'],
      // 五代十国
      501: ['开平通宝', '开平元宝'],
      502: ['天成元宝'],
      503: ['天福元宝'],
      504: ['汉元通宝'],
      505: ['周元通宝'],
      506: ['唐国通宝', '大唐通宝', '永通泉货'],
      507: ['永平元宝', '通正元宝', '天汉元宝', '光天元宝', '乾德元宝', '咸康元宝'],
      508: ['广政通宝', '大蜀通宝'],
      509: ['开元通宝', '永隆通宝', '天德重宝'],
      510: ['乾亨通宝', '乾亨重宝'],
      511: ['乾封泉宝'],
      // 宋元
      601: ['宋元通宝', '太平通宝', '淳化元宝', '至道元宝', '咸平元宝', '景德元宝', '祥符元宝', '祥符通宝', '天圣元宝', '明道元宝', '景祐元宝', '宝元通宝', '康定元宝', '庆历重宝', '至和元宝', '至和通宝', '嘉祐元宝', '嘉祐通宝', '治平元宝', '治平通宝', '熙宁元宝', '熙宁通宝', '熙宁重宝', '元丰通宝', '元祐通宝', '绍圣元宝', '绍圣通宝', '元符通宝', '建中靖国元宝', '圣宋元宝', '圣宋通宝', '崇宁通宝', '崇宁重宝', '崇宁元宝', '大观通宝', '政和通宝', '政和重宝', '重和通宝', '宣和通宝', '宣和元宝','靖康元宝','靖康通宝'],
      602: ['建炎通宝', '建炎元宝', '绍兴元宝', '绍兴通宝', '隆兴元宝', '隆兴通宝', '乾道元宝', '乾道通宝', '淳熙元宝', '淳熙通宝', '绍熙元宝', '绍熙通宝', '庆元通宝', '庆元元宝', '嘉泰通宝', '嘉泰元宝', '开禧通宝', '开禧元宝', '嘉定通宝', '嘉定元宝', '大宋元宝', '大宋通宝', '宝庆元宝', '绍定元宝', '端平通宝', '端平元宝', '嘉熙通宝', '嘉熙元宝', '淳祐元宝', '淳祐通宝', '宝祐元宝', '开庆通宝', '景定元宝', '咸淳元宝'],
      603: ['天显通宝', '会同通宝', '天禄通宝', '应历通宝', '保宁通宝', '统和元宝', '重熙通宝', '清宁通宝', '大康通宝', '大安元宝', '寿昌元宝', '乾统元宝', '天庆元宝'],
      604: ['正隆元宝', '大定通宝', '泰和重宝', '阜昌元宝', '贞祐通宝'],
      605: ['西夏文大安宝钱', '贞观宝钱', '乾祐宝钱', '天庆宝钱', '汉文天盛元宝', '乾祐元宝', '皇建元宝', '光定元宝'],
      606: ['大元通宝', '至元通宝', '至大通宝', '元贞通宝', '大德通宝', '至正通宝', '供养钱', '权钞钱'],
      // 明清
      701: ['洪武通宝', '永乐通宝', '宣德通宝', '弘治通宝', '嘉靖通宝', '隆庆通宝', '万历通宝', '泰昌通宝', '天启通宝', '崇祯通宝'],
      702: ['弘光通宝', '隆武通宝', '永历通宝', '大明通宝', '兴朝通宝'],
      703: ['利用通宝', '昭武通宝', '洪化通宝', '裕民通宝'],
      704: ['天命通宝', '天聪通宝', '崇德通宝', '顺治通宝', '康熙通宝', '雍正通宝', '乾隆通宝', '嘉庆通宝', '道光通宝', '咸丰通宝', '咸丰重宝', '咸丰元宝', '同治通宝', '光绪通宝', '宣统通宝']
    };

    const templates = variantTemplates[eraId] || ['通宝'];

    return templates.map((name, index) => ({
      id: startId + index,
      eraId: eraId,
      eraName: eraName,
      name: name,
      collected: false,
      images: []
    }));
  },

  globalData: {
    userInfo: null
  },

  /**
   * 获取统一统计数据
   * 从云数据库获取，返回 Promise
   */
  getStatistics() {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database();

      db.collection('collections').get({
        success: (res) => {
          const cloudData = res.data || [];
          const totalVariants = wx.getStorageSync('coinVariants') || [];

          // 统计已收藏的版别数量（按 variantId 去重）
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

          resolve({
            totalCollected: variantIds.size,
            totalVariants: totalVariants.length,
            totalImages: totalImages,
            totalValue: totalValue
          });
        },
        fail: (err) => {
          console.error('获取统计数据失败:', err);
          // 失败时返回本地存储的数据
          const variants = wx.getStorageSync('coinVariants') || [];
          const collected = variants.filter(v => v.collected).length;
          const images = variants.reduce((sum, v) => sum + (v.images || []).length, 0);
          resolve({
            totalCollected: collected,
            totalVariants: variants.length,
            totalImages: images,
            totalValue: 0
          });
        }
      });
    });
  },

  /**
   * 同步获取统计数据（回调方式，兼容性好）
   */
  getStatisticsSync(callback) {
    this.getStatistics().then(stats => {
      if (callback) callback(stats);
    });
  }
});