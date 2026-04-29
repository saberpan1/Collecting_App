# 古钱币收藏小程序 - 设计系统文档 v3.0

## 📋 目录

1. [设计理念与原则](#设计理念与原则)
2. [色彩系统](#色彩系统)
3. [排版系统](#排版系统)
4. [间距系统](#间距系统)
5. [圆角系统](#圆角系统)
6. [阴影系统](#阴影系统)
7. [动效系统](#动效系统)
8. [组件库](#组件库)
9. [图标规范](#图标规范)
10. [页面模板](#页面模板)

---

## 设计理念与原则

### 核心理念

**"宁静致远·文化新生"**

以中国传统文化的沉稳内敛为底色，结合现代极简美学，创造出既有文化底蕴又符合当代审美的数字产品。设计上追求"less is more"的克制美学，通过精心设计的留白、层次和动效，传达安静而有力量的设计感受。

### 设计原则

#### 1. 克制 (Restraint)
- 减少视觉噪音，只保留必要元素
- 色彩使用克制，避免过度装饰
- 每个元素都有其存在的理由

#### 2. 层次 (Hierarchy)
- 通过大小、颜色、深浅建立清晰的视觉层次
- 信息优先级明确，主要内容突出
- 次要信息不抢占注意力

#### 3. 呼吸 (Breathing)
- 充足的留白让内容"呼吸"
- 元素之间保持适当间距
- 避免拥挤和信息过载

#### 4. 温度 (Warmth)
- 适度的圆角传递亲和感
- 精心设计的动效增添人情味
- 细节处理体现人文关怀

#### 5. 一致 (Consistency)
- 统一的视觉语言贯穿全局
- 交互模式保持一致
- 降低用户学习成本

---

## 色彩系统

### 设计理念

采用**"水墨"**配色哲学：
- 以黑白灰为基调，传递沉稳内敛
- 以古铜金为点缀，象征历史底蕴
- 色彩饱和度适中，安静而不沉闷

### 主色板 (Primary Palette)

```css
/* 核心色 - 深邃沉稳 */
--color-ink: #1a1a1a;           /* 墨黑 - 主文字、重要元素 */
--color-ink-light: #2d2d2d;      /* 淡墨 - 次要文字 */
--color-ink-lighter: #4a4a4a;    /* 浅墨 - 辅助文字 */

/* 背景色 - 层次分明 */
--color-paper: #ffffff;          /* 宣纸白 - 主要背景 */
--color-paper-warm: #fafaf8;     /* 暖白 - 卡片背景 */
--color-paper-dark: #f5f5f3;      /* 素白 - 分割区域 */
--color-paper-darker: #e8e8e5;   /* 灰白 - 禁用状态 */

/* 点缀色 - 历史底蕴 */
--color-bronze: #c9a962;         /* 古铜金 - 强调、进度 */
--color-bronze-light: #d4b978;   /* 浅金 - 悬停状态 */
--color-bronze-dark: #b8954f;    /* 深金 - 按下状态 */
--color-bronze-bg: rgba(201, 169, 98, 0.08); /* 金色背景 */

/* 功能色 - 清晰传达 */
--color-success: #34c759;        /* 翠绿 - 成功状态 */
--color-success-bg: rgba(52, 199, 89, 0.08);
--color-warning: #ff9500;        /* 琥珀 - 警告状态 */
--color-warning-bg: rgba(255, 149, 0, 0.08);
--color-error: #ff3b30;          /* 朱红 - 错误状态 */
--color-error-bg: rgba(255, 59, 48, 0.08);
--color-info: #007aff;           /* 靛蓝 - 信息状态 */
--color-info-bg: rgba(0, 122, 255, 0.08);

/* 中性色 - 界面元素 */
--color-divider: #eeeeee;        /* 分割线 */
--color-border: #e5e5e5;         /* 边框 */
--color-placeholder: #c7c7c7;    /* 占位符 */
```

### 语义色彩使用

| 用途 | 颜色 | 使用场景 |
|------|------|---------|
| 主要操作 | `--color-ink` | 按钮、链接、重要图标 |
| 次要操作 | `--color-bronze` | 进度条、完成标记、强调 |
| 成功状态 | `--color-success` | 收藏完成、操作成功 |
| 警告状态 | `--color-warning` | 数据异常、注意事项 |
| 错误状态 | `--color-error` | 删除操作、错误提示 |
| 信息状态 | `--color-info` | 提示信息、引导操作 |

### 对比度要求

```
文本类型        最小对比度    推荐对比度
-------------------------------------
正文文字        4.5:1        7:1
大号文字        3:1          4.5:1
图标/装饰        无要求        3:1
背景色差        -            1.5:1
```

---

## 排版系统

### 字体家族

```
中文: PingFang SC, "Source Han Sans CN", "Noto Sans CJK SC"
英文: -apple-system, BlinkMacSystemFont, "SF Pro Display"
数字: "SF Pro Display", "DIN Alternate", Helvetica
备选: Helvetica Neue, STHeiti, sans-serif
```

### 字体尺度 (Type Scale)

```
基础单位: 2rpx (允许 0.5 倍数)

名称          字号      行高      字重      字间距    使用场景
------------------------------------------------------------------------
display      56rpx     1.1      700       -1rpx     超大数字、Hero 区域
h1           44rpx     1.2      600       -0.5rpx   页面大标题
h2           36rpx     1.3      600       -0.3rpx   区块标题
h3           32rpx     1.4      600       0         卡片标题
h4           28rpx     1.5      500       0         列表项标题
body         28rpx     1.6      400       0         正文内容
body-small   26rpx     1.6      400       0         辅助说明
caption      24rpx     1.5      400       0.2rpx    标签、次要信息
overline     22rpx     1.4      600       1rpx      分类标签、全大写
```

### 行高指南

```
文字类型                    推荐行高    说明
-------------------------------------------------
标题 (h1-h2)                1.1-1.3    紧凑排列，突出标题
正文 (body)                 1.6        最佳阅读体验
辅助文字 (caption)          1.5        紧凑但可读
长文本                      1.8        提升阅读流畅度
按钮文字                    1          垂直居中
```

### 字重规范

```
字重名称          数值      使用场景
-------------------------------------
Thin            100       (一般不使用)
Light           300       (一般不使用)
Regular         400       正文、辅助文字
Medium          500       列表项、按钮
Semibold        600       标题、强调
Bold            700       数字、关键词
```

---

## 间距系统

### 基础间距单位

```
基础单位: 4rpx

名称        数值      使用场景
--------------------------------
space-xxs   4rpx      紧凑元素间距
space-xs    8rpx      标签内间距、图标与文字间距
space-sm    12rpx     小组件内间距
space-md    16rpx      标准间距、卡片内间距
space-lg    24rpx      区块间距、卡片间距
space-xl    32rpx      大区块间距
space-2xl   40rpx      页面顶部/底部留白
space-3xl   48rpx      大区块分割
space-4xl   64rpx      页面级留白
```

### 间距使用原则

```
1. 相关元素: 8-12rpx (space-xs ~ space-sm)
2. 独立元素: 16rpx (space-md)
3. 功能区块: 24rpx (space-lg)
4. 内容区块: 32-48rpx (space-xl ~ space-3xl)
5. 页面留白: 24-32rpx (space-lg ~ space-xl)
```

### 常用间距组合

```
元素组合                      推荐间距
----------------------------------
标题与内容                    8rpx
标签与描述                    4rpx
按钮图标与按钮文字            8rpx
列表项内容与箭头              12rpx
卡片标题与卡片内容            16rpx
卡片与卡片                    16rpx
区块标题与区块内容            16rpx
```

---

## 圆角系统

### 圆角尺度

```
名称        数值      使用场景
--------------------------------
radius-xs   4rpx      标签内、小按钮
radius-sm   8rpx      输入框、小卡片
radius-md   12rpx     按钮、标准卡片
radius-lg   16rpx     大按钮、模态框
radius-xl   20rpx     大卡片、特色卡片
radius-2xl  24rpx     全屏卡片
radius-full 9999rpx   圆形头像、胶囊按钮
```

### 圆角使用规则

```
元素类型                    推荐圆角    说明
-------------------------------------------------
文字标签                    4rpx       紧凑感
小按钮 (高度 < 64rpx)       8rpx       标准按钮
中按钮 (64-88rpx)          12rpx       主按钮
大按钮 (高度 > 88rpx)       16rpx       强调按钮
输入框                     8rpx        与按钮协调
小卡片                     12rpx       列表卡片
大卡片                     16-20rpx    特色卡片
模态框                     20-24rpx    居中卡片
底部弹窗                   24rpx 顶部   底部弹出
```

---

## 阴影系统

### 阴影尺度

```
名称          数值                                      用途
--------------------------------------------------------------------------------
shadow-xs    0 1rpx 2rpx rgba(0,0,0,0.04)            轻微层级、标签
shadow-sm    0 2rpx 4rpx rgba(0,0,0,0.04),           标准卡片
             0 4rpx 8rpx rgba(0,0,0,0.04)
shadow-md    0 4rpx 8rpx rgba(0,0,0,0.04),           悬停卡片
             0 8rpx 16rpx rgba(0,0,0,0.06)
shadow-lg    0 8rpx 16rpx rgba(0,0,0,0.06),          弹窗、下拉
             0 16rpx 32rpx rgba(0,0,0,0.08)
shadow-xl    0 16rpx 32rpx rgba(0,0,0,0.08),         大弹窗
             0 24rpx 48rpx rgba(0,0,0,0.1)
shadow-inner  inset 0 2rpx 4rpx rgba(0,0,0,0.04)    输入框凹陷效果
```

### 阴影使用场景

```
场景              推荐阴影      透明度/强度
-------------------------------------
卡片默认          shadow-sm    4-6%
卡片悬停          shadow-md    6-8%
弹窗              shadow-lg    8-10%
下拉菜单          shadow-lg    8-10%
输入框            shadow-inner  4%
导航栏            无阴影        -
底部 TabBar       无阴影        -
```

---

## 动效系统

### 动效原则

```
1. 自然流畅 - 符合物理规律，有加速和减速过程
2. 快速响应 - 交互反馈 < 100ms
3. 克制使用 - 并非所有元素都需要动画
4. 有意义 - 动效应该传达信息，而非仅为装饰
```

### 缓动函数

```
名称              参数                      用途
----------------------------------------------------------------
ease-out          cubic-bezier(0.16, 1, 0.3, 1)    元素进入、自然停止
ease-in           cubic-bezier(0.7, 0, 0.84, 0)   元素离开、自然开始
ease-in-out       cubic-bezier(0.4, 0, 0.2, 1)   元素状态变化
ease-spring       cubic-bezier(0.34, 1.56, 0.64, 1) 弹性效果、强调
linear            linear                    进度条、颜色变化
```

### 时长规范

```
类型              时长          适用场景
------------------------------------
瞬间反馈          100ms        按钮按下、图标切换
快速过渡          150ms        下拉刷新、开关切换
标准过渡          250ms        页面切换、模态框
缓慢过渡          350ms        大卡片展开、数据加载
骨架屏            1500ms       循环动画
```

### 动效使用规范

#### 页面切换
```css
/* 页面进入 */
animation: pageEnter 350ms cubic-bezier(0.16, 1, 0.3, 1);

/* 页面离开 */
animation: pageLeave 250ms cubic-bezier(0.4, 0, 0.2, 1);
```

#### 元素出现
```css
/* 淡入上浮 */
animation: fadeInUp 300ms cubic-bezier(0.16, 1, 0.3, 1);

/* 缩放淡入 */
animation: scaleIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

#### 交互反馈
```css
/* 按钮按下 */
transition: transform 100ms ease-out, opacity 100ms ease-out;

/* 卡片悬停 */
transition: transform 200ms ease-out, box-shadow 200ms ease-out;
```

---

## 组件库

### 按钮 (Button)

#### 尺寸变体

```
尺寸        高度          内边距              字号
-------------------------------------------------
small       64rpx         0 20rpx             24rpx
medium      88rpx         0 28rpx             28rpx
large       104rpx        0 36rpx             32rpx
```

#### 类型变体

```
类型          背景色              文字色          边框
--------------------------------------------------------
primary       --color-ink        #ffffff        none
secondary     --color-paper      --color-ink     2rpx solid --color-border
ghost         transparent        --color-ink     none
danger        --color-error       #ffffff        none
link          transparent        --color-ink     none (带下划线)
```

#### 状态

```
状态          效果
-------------------------
default      正常状态
hover        透明度 0.8、轻微上浮 2rpx
active       缩小至 0.97、阴影减弱
disabled     透明度 0.4、cursor: not-allowed
loading      显示加载图标、文字变化
```

### 卡片 (Card)

#### 类型

```
类型          圆角      阴影        背景
--------------------------------------------
flat          16rpx     none        --color-paper-dark
raised        16rpx     shadow-sm   --color-paper
elevated      20rpx     shadow-md   --color-paper
```

#### 结构

```html
<view class="card">
  <view class="card-header">   <!-- 可选 -->
    <text class="card-title">标题</text>
  </view>
  <view class="card-body">     <!-- 必需 -->
    <!-- 内容 -->
  </view>
  <view class="card-footer">   <!-- 可选 -->
    <!-- 操作按钮 -->
  </view>
</view>
```

### 列表项 (List Item)

#### 类型

```
类型          高度          样式
-----------------------------------
simple       88rpx        单行文字
standard     120rpx       标题 + 副标题
rich         144rpx       图标 + 标题 + 副标题 + 箭头
```

#### 交互

```
状态          效果
-------------------------
default      正常状态
hover        背景色变为 --color-paper-dark
active       背景色变为 --color-paper-darker
```

### 输入框 (Input)

#### 类型

```
类型          样式
----------------------
filled       填充背景色 --color-paper-dark
outlined     描边样式，背景透明
underlined   底部横线，简约风格
```

#### 状态

```
状态          样式
---------------------------------
default      正常显示
focus        边框颜色变为 --color-ink，背景变亮
error        边框颜色变为 --color-error，显示错误提示
success      边框颜色变为 --color-success，显示成功图标
disabled     透明度 0.4，不可交互
```

### 标签 (Tag)

```
类型          背景色                  文字色
-------------------------------------------------
default       --color-paper-dark      --color-ink
accent        --color-bronze-bg      --color-bronze
success       --color-success-bg     --color-success
warning       --color-warning-bg     --color-warning
error         --color-error-bg       --color-error
```

### 进度条 (Progress)

```
类型          样式
--------------------
linear        水平进度条，圆角端点
circular      环形进度
```

---

## 图标规范

### 图标风格

```
类型            描述
-------------------------
线条图标        2rpx 线宽，圆角端点
填充图标        实心，传递重量感
双色调图标      线条 + 填充组合
```

### 常用图标清单

```
功能            线条图标              填充图标
-------------------------------------------------
首页            grid/rectangle        house/home
分类            grid/3x3              folder
统计            chart/pie             chart/bar
我的            user                  user/filled
上传            plus/add              plus-circle
收藏            bookmark              bookmark/filled
删除            trash                 trash
编辑            pencil                pencil
搜索            magnifier             search
返回            arrow/left            chevron/left
更多            dots/more             ellipsis
设置            gear                  cog
帮助            question              help
```

### 图标使用规范

```
字号与图标比例:
图标 32rpx  →  图标尺寸 32rpx
图标 48rpx  →  图标尺寸 48rpx

图标与文字间距:
同行使用时，间距 8rpx (space-xs)
单独使用，居中显示
```

---

## 页面模板

### 标准页面结构

```html
<!-- 页面容器 -->
<view class="page">
  <!-- 导航栏 -->
  <view class="navbar">
    <view class="navbar-left">
      <view class="navbar-back">‹</view>
    </view>
    <view class="navbar-title">页面标题</view>
    <view class="navbar-right"></view>
  </view>

  <!-- 内容区域 -->
  <scroll-view class="content">
    <!-- 区块1 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">区块标题</text>
      </view>
      <view class="section-body">
        <!-- 内容 -->
      </view>
    </view>
  </scroll-view>

  <!-- 底部操作栏 (可选) -->
  <view class="bottom-bar safe-area">
    <button class="btn-primary btn-block">主要操作</button>
  </view>
</view>
```

### 区块间距规范

```
区块之间: 32rpx (space-xl)
区块与边缘: 24rpx (space-lg)
卡片内边距: 24rpx
列表项内边距: 24rpx 水平, 20rpx 垂直
```

---

## 可访问性规范

### 触控区域

```
元素类型                    最小尺寸
---------------------------------
按钮                        88rpx × 88rpx
列表项                      高度 ≥ 88rpx
图标按钮                    88rpx × 88rpx
复选框/单选框              88rpx × 88rpx
输入框                      高度 88rpx
```

### 色彩对比

```
文本类型                    最小对比度
------------------------------------
正文 (≥18px 或 ≥14px bold)   3:1
正文 (<18px 且 <14px bold)   4.5:1
大文本 (≥18px 且 ≥14px bold)  3:1
图标/图形                    3:1
```

### 动效限制

```css
/* 尊重用户减少动效偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 焦点管理

```
1. 模态框打开时，焦点应移至模态框内第一个可交互元素
2. 模态框关闭时，焦点应返回到触发元素
3. Tab 键导航顺序应与视觉顺序一致
```

---

## 设计检查清单

### 视觉一致性
- [ ] 所有页面使用统一的色彩系统
- [ ] 字体大小严格按照尺度表
- [ ] 间距使用规范的值 (4rpx 的倍数)
- [ ] 圆角大小符合元素类型
- [ ] 阴影强度与层级匹配

### 交互一致性
- [ ] 类似操作使用类似的交互模式
- [ ] 反馈及时且形式统一
- [ ] 过渡动画时长一致
- [ ] 状态变化有清晰的可视反馈

### 可访问性
- [ ] 文本与背景对比度 ≥ 4.5:1
- [ ] 触控区域 ≥ 88rpx
- [ ] 关键操作有文字标签
- [ ] 支持系统字体缩放

### 性能
- [ ] 避免不必要的动画
- [ ] 图片资源进行压缩
- [ ] 使用 CSS 动画而非 JS 动画
- [ ] 首屏内容优先加载

---

**设计系统版本**: v3.0
**最后更新**: 2026-04-27
**维护者**: Design Team
