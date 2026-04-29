/**
 * 自定义TabBar组件
 * 实现精致的图标设计和流畅的交互体验
 */

Component({
  /**
   * 组件的属性定义
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    selected: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件生命周期方法
   */
  lifetimes: {
    attached: function() {
      this.initTabBar();
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 初始化TabBar
     */
    initTabBar: function() {
      const app = getApp();
      if (app.globalData) {
        this.setData({
          selected: app.globalData.selectedTabBar || 0
        });
      }
    },

    /**
     * 处理TabBar点击事件
     */
    onTap: function(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];

      if (item && item.pagePath) {
        wx.reLaunch({
          url: '/' + item.pagePath,
          success: () => {
            this.setData({ selected: index });

            const app = getApp();
            if (app.globalData) {
              app.globalData.selectedTabBar = index;
            }
          }
        });
      }
    }
  }
});