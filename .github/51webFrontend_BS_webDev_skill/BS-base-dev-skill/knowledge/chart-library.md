# ECharts 图表沉淀库速查表

快速查询所有可用的图表配置项函数。

---

## 目录

1. [柱状图 Bar](#-柱状图-bar-charts)
2. [折线图 Line](#-折线图-line-charts)
3. [饼图 Pie](#-饼图-pie-charts)
4. [仪表盘 Gauge](#-仪表盘-gauge-charts)
5. [雷达图 Radar](#-雷达图-radar-charts)
6. [快速选择指南](#快速选择指南)

---

## 📊 柱状图 (Bar Charts)

| 名称 | 函数名 | 配置文件 | 特点描述 |
|------|--------|----------|----------|
| **通用柱状图** | `generalBarOption` | `bar.js` | 单系列；支持垂直/水平；双色渐变；最大值高亮；柱顶白色短横线；背景条；柱子边框；数值显示；坐标轴控制 |
| **多柱状图** | `MultiBarOption` | `bar.js` | 多系列分组；图例；每系列独立渐变色；柱顶短横线；背景条；支持垂直/水平 |
| **堆叠柱状图** | `stackBarOption` | `bar.js` | 水平堆叠；多维度占比；每段渐变色；右侧圆角；hover边框高亮；顶部图例 |
| **基础柱状图** | `baseBarOption` | `bar.js` | 简洁风格；半透明背景条对比；渐变色填充；柱子边框；支持垂直/水平 |

### 通用柱状图参数速查

```javascript
generalBarOption(data, name, unit, orientation, color, yAxisConfig, otherConfig)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | Array | `[{name: '分类', value: 数值}, ...]` |
| `name` | String | 图表名称（tooltip显示） |
| `unit` | String | 单位文本 |
| `orientation` | String | `'vertical'` / `'horizontal'` |
| `color` | Array | `[底部色, 顶部色]` 渐变 |
| `yAxisConfig` | Object | `{min, max, interval}` |
| `otherConfig` | Object | 见下表 |

**otherConfig 常用配置：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isWhiteLine` | Boolean | false | 柱顶白色短横线 |
| `barWidth` | Number | 12 | 柱子宽度 |
| `isPercentage` | Boolean | false | 百分比显示 |
| `unitPosition` | String | 'right' | 单位位置 |
| `isShowXLine` | Boolean | true | X轴线显示 |
| `isShowYLine` | Boolean | true | Y轴线显示 |
| `isShowXLabel` | Boolean | true | X轴标签显示 |
| `isShowYLabel` | Boolean | true | Y轴标签显示 |
| `isMaxColor` | Boolean | true | 最大值特殊颜色 |
| `maxColor` | Array | 灰白渐变 | 最大值柱子颜色 |
| `showBarValue` | Boolean | true | 显示柱顶数值 |
| `isShowBackground` | Boolean | true | 显示背景条 |
| `barBorderColor` | Boolean/String | false | 柱子边框颜色 |

---

## 📈 折线图 (Line Charts)

| 名称 | 函数名 | 配置文件 | 特点描述 |
|------|--------|----------|----------|
| **基础折线图** | `baseLineOption` | `line.js` | 基础折线；自定义节点颜色和折线颜色；支持多系列 |
| **平滑折线图** | `smoothLineOption` | `line.js` | 平滑曲线；支持堆叠区域；渐变填充；多系列图例 |
| **峰值折线图** | `largeAreaLineOption` | `line.js` | 平滑曲线；随机波动模拟峰值；适合实时数据 |

### 基础折线图参数速查

```javascript
baseLineOption(xData, yData, colors, unit, isDefault)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `xData` | Array | X轴分类数据 |
| `yData` | Array | `[{name: '系列名', data: [...], color: '#xxx'}, ...]` |
| `colors` | Array | 颜色数组（可选） |
| `unit` | String | 单位文本 |

---

## 🥧 饼图 (Pie Charts)

| 名称 | 函数名 | 配置文件 | 特点描述 |
|------|--------|----------|----------|
| **基本饼图** | `baseBarOption` | `pie.js` | 基础环形饼图；支持中心图片；右侧垂直图例 |
| **对比饼图** | `diffBarOption` | `pie.js` | 双数据对比环形图；不同宽度和颜色的环 |
| **双层嵌套饼图** | `doubleBarOption` | `pie.js` | 内外双圈嵌套；不同颜色区分 |
| **环形图** | `ringPieOption` | `pie.js` | 环形图；中心显示总数值和标签 |
| **环形图(带图例)** | `setOption` | `pie.js` | 带中心图片和详细图例的环形图 |
| **动态渐变饼图** | `gradientPieOption` | `pie.js` | 扇区线性渐变色；视觉效果丰富 |
| **引导线饼图** | `pieLeadOption` | `pie.js` | 丰富引导线和图例配置；支持多种布局 |

---

## 📏 仪表盘 (Gauge Charts)

| 名称 | 函数名 | 配置文件 | 特点描述 |
|------|--------|----------|----------|
| **仪表盘** | `gaugeOption` | `gauge.js` | 标准仪表盘；中心图标；渐变色轴线；效率/低效标注 |
| **圆形进度条** | `circleProgressOption` | `gauge.js` | 圆形进度条；外圈装饰环；适合百分比展示 |
| **简易进度条** | `simpleCircleProgressOption` | `gauge.js` | 简化版圆形进度条；无装饰环；更加简洁 |

### 仪表盘参数速查

```javascript
gaugeOption(valueOrConfig, maxValue, minvalue, unit, color, isDefault)
// 或对象形式
gaugeOption({ value, maxValue, minvalue, unit, color })
```

---

## 📡 雷达图 (Radar Charts)

| 名称 | 函数名 | 配置文件 | 特点描述 |
|------|--------|----------|----------|
| **基础雷达图** | `radarOption` | `radar.js` | 基础雷达图；自定义区域透明度和线条颜色 |

---

## 🔗 桑基图 (Sankey Charts)

> 待沉淀

---

## 快速选择指南

### 按场景选择

| 使用场景 | 推荐图表 | 函数名 |
|----------|----------|--------|
| 单系列数据对比 | 通用柱状图 | `generalBarOption` |
| 多系列分组对比 | 多柱状图 | `MultiBarOption` |
| 各部分占总量比例 | 堆叠柱状图 | `stackBarOption` |
| 简单数据展示 | 基础柱状图 | `baseBarOption` |
| 趋势展示 | 平滑折线图 | `smoothLineOption` |
| 占比分布 | 环形图 | `ringPieOption` |
| 进度/完成率 | 圆形进度条 | `circleProgressOption` |
| 多维度对比 | 雷达图 | `radarOption` |

### 按样式选择

| 样式需求 | 推荐配置 |
|----------|----------|
| 垂直柱状图 | `generalBarOption` + `orientation: 'vertical'` |
| 水平条形图 | `generalBarOption` + `orientation: 'horizontal'` |
| 带数值标签 | `generalBarOption` + `showBarValue: true` |
| 百分比显示 | `generalBarOption` + `isPercentage: true` |
| 最大值高亮 | `generalBarOption` + `isMaxColor: true` |
| 柱顶装饰线 | `generalBarOption` + `isWhiteLine: true` |
| 有边框柱子 | `generalBarOption` + `barBorderColor: true` |
| 背景对比条 | `generalBarOption` + `isShowBackground: true` |

---

## 配置文件位置

**项目中：** `src/types/echarts/`
- bar.js - 柱状图
- line.js - 折线图
- pie.js - 饼图
- gauge.js - 仪表盘
- radar.js - 雷达图

**Skill 沉淀库：** `assets/options/`
- 与项目配置保持同步
