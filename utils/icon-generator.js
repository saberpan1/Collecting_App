/**
 * 图标生成脚本 - 精致图标设计 v2.0
 * 基于古钱币文化元素的设计系统
 *
 * 使用方法:
 * 1. 选择设计方案
 * 2. 复制 SVG 内容到在线工具生成 PNG
 * 3. 放入 images/tabbar/ 目录
 */

// ============================================
// 图标设计方案 - 精致图标 v2.0
// ============================================

const精致Icons = {
  // 首页 - 古钱币
  coin: {
    inactive: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 外圆 -->
        <circle cx="40.5" cy="40.5" r="28" stroke="#c4c4c4" stroke-width="3"/>
        <!-- 内圆 -->
        <circle cx="40.5" cy="40.5" r="18" stroke="#c4c4c4" stroke-width="2"/>
        <!-- 方孔 -->
        <rect x="33" y="33" width="15" height="15" stroke="#c4c4c4" stroke-width="2" rx="2" transform="rotate(45 40.5 40.5)"/>
      </svg>
    `,
    active: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 外圆 -->
        <circle cx="40.5" cy="40.5" r="28" stroke="#1a1a1a" stroke-width="3"/>
        <!-- 内圆 -->
        <circle cx="40.5" cy="40.5" r="18" stroke="#1a1a1a" stroke-width="2"/>
        <!-- 方孔 -->
        <rect x="33" y="33" width="15" height="15" stroke="#1a1a1a" stroke-width="2" rx="2" transform="rotate(45 40.5 40.5)"/>
        <!-- 发光效果 -->
        <circle cx="40.5" cy="40.5" r="28" stroke="#1a1a1a" stroke-width="1" opacity="0.3"/>
      </svg>
    `
  },

  // 分类 - 典籍书架
  book: {
    inactive: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 书脊1 -->
        <rect x="22" y="25" width="8" height="36" rx="2" fill="#c4c4c4"/>
        <rect x="25" y="30" width="2" height="26" fill="rgba(255,255,255,0.3)"/>
        <!-- 书脊2 -->
        <rect x="36" y="32" width="8" height="29" rx="2" fill="#c4c4c4"/>
        <rect x="39" y="37" width="2" height="19" fill="rgba(255,255,255,0.3)"/>
        <!-- 书脊3 -->
        <rect x="50" y="20" width="8" height="41" rx="2" fill="#c4c4c4"/>
        <rect x="53" y="25" width="2" height="31" fill="rgba(255,255,255,0.3)"/>
      </svg>
    `,
    active: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 书脊1 -->
        <rect x="22" y="28" width="8" height="33" rx="2" fill="#1a1a1a"/>
        <rect x="25" y="33" width="2" height="23" fill="rgba(255,255,255,0.4)"/>
        <!-- 书脊2 -->
        <rect x="36" y="25" width="8" height="36" rx="2" fill="#1a1a1a"/>
        <rect x="39" y="30" width="2" height="26" fill="rgba(255,255,255,0.4)"/>
        <!-- 书脊3 -->
        <rect x="50" y="31" width="8" height="30" rx="2" fill="#1a1a1a"/>
        <rect x="53" y="36" width="2" height="20" fill="rgba(255,255,255,0.4)"/>
      </svg>
    `
  },

  // 统计 - 上升曲线
  chart: {
    inactive: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 点1 -->
        <rect x="18" y="50" width="10" height="10" rx="2" fill="#c4c4c4" opacity="0.5"/>
        <!-- 连接线1 -->
        <line x1="28" y1="53" x2="36" y2="44" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round"/>
        <!-- 点2 -->
        <rect x="36" y="44" width="14" height="14" rx="2" fill="#c4c4c4" opacity="0.7"/>
        <!-- 连接线2 -->
        <line x1="50" y1="48" x2="58" y2="38" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round"/>
        <!-- 点3 -->
        <circle cx="58" cy="32" r="8" fill="#c4c4c4"/>
      </svg>
    `,
    active: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 点1 -->
        <rect x="18" y="48" width="12" height="12" rx="2" fill="#1a1a1a" opacity="0.6"/>
        <!-- 连接线1 -->
        <line x1="30" y1="52" x2="38" y2="42" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 点2 -->
        <rect x="38" y="38" width="16" height="16" rx="2" fill="#1a1a1a" opacity="0.8"/>
        <!-- 连接线2 -->
        <line x1="54" y1="44" x2="62" y2="34" stroke="#1a1a1a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 点3 -->
        <circle cx="62" cy="28" r="10" fill="#1a1a1a"/>
        <!-- 发光效果 -->
        <circle cx="62" cy="28" r="14" stroke="#1a1a1a" stroke-width="1" opacity="0.2"/>
      </svg>
    `
  },

  // 我的 - 印章
  seal: {
    inactive: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 外框 -->
        <rect x="22" y="22" width="36" height="36" stroke="#c4c4c4" stroke-width="3" rx="4" transform="rotate(45 40.5 40.5)"/>
        <!-- 内框 -->
        <rect x="30" y="30" width="20" height="20" stroke="#c4c4c4" stroke-width="2" rx="3" transform="rotate(45 40.5 40.5)"/>
        <!-- 中心点 -->
        <circle cx="40.5" cy="40.5" r="5" fill="#c4c4c4"/>
      </svg>
    `,
    active: `
      <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 外框 -->
        <rect x="22" y="22" width="36" height="36" stroke="#1a1a1a" stroke-width="3" rx="4" transform="rotate(45 40.5 40.5)"/>
        <!-- 内框 -->
        <rect x="30" y="30" width="20" height="20" stroke="#1a1a1a" stroke-width="2" rx="3" transform="rotate(45 40.5 40.5)"/>
        <!-- 中心点 -->
        <circle cx="40.5" cy="40.5" r="5" fill="#1a1a1a"/>
        <!-- 发光效果 -->
        <rect x="22" y="22" width="36" height="36" stroke="#1a1a1a" stroke-width="1" rx="4" opacity="0.3" transform="rotate(45 40.5 40.5)"/>
      </svg>
    `
  }
};

// ============================================
// 使用说明
// ============================================

/*
图标生成步骤:

1. 复制上方 SVG 代码

2. 访问在线 SVG to PNG 转换器:
   - https://svgtopng.com/
   - https://www.iloveimg.com/convert-to-png/svg-to-png

3. 设置输出尺寸:
   - 基础尺寸: 81×81px
   - @2x 尺寸: 162×162px (用于高清屏幕)

4. 下载并命名:
   首页:
   - coin-inactive.png
   - coin-active.png

   分类:
   - book-inactive.png
   - book-active.png

   统计:
   - chart-inactive.png
   - chart-active.png

   我的:
   - seal-inactive.png
   - seal-active.png

5. 放入目录: images/tabbar/

===========================================

颜色值参考:

未选中态:
- 主色: #c4c4c4
- 透明度变化: 50%, 70%

选中态:
- 主色: #1a1a1a
- 发光: rgba(26, 26, 26, 0.2-0.3)

===========================================

设计理念:

图标融合了古钱币收藏的文化元素:
- 首页: 古钱币造型 (圆形方孔)
- 分类: 典籍书架 (文化传承)
- 统计: 上升曲线 (收藏进度)
- 我的: 印章 (个人印记)

整体风格遵循 Apple 级极简美学:
- 简洁的几何形状
- 柔和的过渡动画
- 统一的视觉语言
*/

console.log('古钱币收藏小程序 - 精致图标生成工具');
console.log('使用说明请查看上方注释');