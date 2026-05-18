# ECharts 图表常见需求清单

创建图表前，必须按照本文档逐项确认用户需求，确保最终效果符合预期。

---

## 目录

1. [柱状图 (Bar)](#柱状图-bar)
2. [折线图 (Line)](#折线图-line)
3. [饼图 (Pie)](#饼图-pie)
4. [仪表盘 (Gauge)](#仪表盘-gauge)
5. [雷达图 (Radar)](#雷达图-radar)
6. [通用需求](#通用需求)

---

## 柱状图 (Bar)

### 1. 方向与布局

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 柱子方向 | 垂直(vertical) / 水平(horizontal) | `orientation` |
| 单系列/多系列 | 单系列 / 多系列分组 | 选择 `generalBarOption` 或 `MultiBarOption` |
| 是否堆叠 | 普通 / 堆叠 | 选择 `stackBarOption` |
| 图表边距 | grid 的 top/right/bottom/left | `grid` 配置 |

### 2. 柱子样式

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 柱子宽度 | 数值 (如 12, 15, 20) | `otherConfig.barWidth` |
| 柱子圆角 | 无圆角 / 单侧圆角 / 全圆角 | `itemStyle.borderRadius` |
| 柱子颜色 | 单色 / 双色渐变 / 多色 | `color` 数组 |
| 渐变方向 | 垂直渐变 / 水平渐变 | 自动根据 `orientation` 设置 |
| 柱子边框 | 无边框 / 有边框 / 自定义颜色 | `otherConfig.barBorderColor` |
| 背景条 | 显示 / 隐藏 | `otherConfig.isShowBackground` |
| 顶部短横线 | 显示 / 隐藏（白色装饰线） | `otherConfig.isWhiteLine` |
| 最大值高亮 | 是否用特殊颜色标记最大值 | `otherConfig.isMaxColor`, `otherConfig.maxColor` |
| 柱间距 | 柱子之间的间隔 | `yAxisConfig.barGap` |

### 3. 数值与标签

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 显示数值 | 显示 / 隐藏柱顶数值 | `otherConfig.showBarValue` |
| 数值位置 | top / right / inside | `label.position` |
| 百分比显示 | 显示数值 / 显示百分比 | `otherConfig.isPercentage` |
| 单位文本 | 如 "单位：人" | `unit` |
| 单位位置 | left / center / right | `otherConfig.unitPosition` |

### 4. 坐标轴

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| X轴线 | 显示 / 隐藏 | `otherConfig.isShowXLine` |
| Y轴线 | 显示 / 隐藏 | `otherConfig.isShowYLine` |
| X轴标签 | 显示 / 隐藏 | `otherConfig.isShowXLabel` |
| Y轴标签 | 显示 / 隐藏 | `otherConfig.isShowYLabel` |
| 数值轴范围 | min / max / interval | `yAxisConfig` |
| 分割线 | 显示 / 隐藏虚线 | `splitLine.show` |
| 标签换行 | 超长标签自动换行 | `axisLabel.formatter` |

### 5. 图例

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 图例显示 | 显示 / 隐藏 | `otherConfig.isNeedLegend` |
| 图例位置 | top / bottom / left / right | `legend.right`, `legend.top` |
| 图例图标 | circle / rect / roundRect | `legend.icon` |
| 图例图标大小 | 数值 | `otherConfig.legendIconSize` |

---

## 折线图 (Line)

### 1. 线条样式

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 线条类型 | 折线 / 平滑曲线 | `smooth: true/false` |
| 线条宽度 | 数值 (如 2, 3, 4) | `lineStyle.width` |
| 线条颜色 | 单色 / 渐变 | `lineStyle.color` |
| 虚线/实线 | solid / dashed / dotted | `lineStyle.type` |

### 2. 数据点

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 显示节点 | 显示 / 隐藏 | `symbol: 'circle'/'none'` |
| 节点大小 | 数值 | `symbolSize` |
| 节点颜色 | 与线同色 / 自定义 | `itemStyle.color` |
| 节点边框 | 边框宽度和颜色 | `itemStyle.borderWidth`, `itemStyle.borderColor` |

### 3. 填充区域

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 区域填充 | 无 / 纯色 / 渐变 | `areaStyle` |
| 填充透明度 | 0-1 | `areaStyle.opacity` |
| 是否堆叠 | 普通 / 堆叠面积图 | `stack: 'total'` |

### 4. 坐标轴与图例

同柱状图坐标轴和图例配置

---

## 饼图 (Pie)

### 1. 形状与布局

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 饼图类型 | 实心饼图 / 环形图 | `radius: ['50%', '70%']` |
| 内外半径 | 环形宽度控制 | `radius: [inner, outer]` |
| 位置 | center 居中 / 偏移 | `center: ['50%', '50%']` |
| 扇区间隙 | 有间隙 / 无间隙 | `padAngle` |
| 玫瑰图 | 普通 / 南丁格尔玫瑰图 | `roseType: 'radius'/'area'` |

### 2. 扇区样式

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 扇区颜色 | 纯色 / 渐变色 | `itemStyle.color` |
| 扇区圆角 | 有圆角 / 无圆角 | `itemStyle.borderRadius` |
| 扇区边框 | 边框宽度和颜色 | `itemStyle.borderWidth`, `itemStyle.borderColor` |
| 高亮效果 | hover 时放大 / 阴影 | `emphasis` |

### 3. 标签与引导线

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 标签位置 | outside / inside / center | `label.position` |
| 标签内容 | 名称 / 数值 / 百分比 | `label.formatter` |
| 引导线 | 显示 / 隐藏 | `labelLine.show` |
| 引导线样式 | 颜色、长度 | `labelLine.lineStyle` |

### 4. 中心内容（环形图）

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 中心图片 | 无 / 有图片 | `graphic.elements` |
| 中心文字 | 标题、总数等 | `title` 或 `graphic` |

### 5. 图例

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 图例位置 | right / bottom | `legend.orient`, `legend.right` |
| 图例布局 | 水平 / 垂直 | `legend.orient: 'horizontal'/'vertical'` |
| 滚动图例 | 普通 / 可滚动 | `legend.type: 'scroll'` |

---

## 仪表盘 (Gauge)

### 1. 形状与布局

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 仪表盘类型 | 标准仪表盘 / 圆形进度条 | 选择对应函数 |
| 起止角度 | 默认 / 半圆 / 自定义 | `startAngle`, `endAngle` |
| 半径大小 | 百分比 | `radius` |

### 2. 刻度与轴线

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 轴线宽度 | 数值 | `axisLine.lineStyle.width` |
| 轴线颜色 | 渐变 / 分段颜色 | `axisLine.lineStyle.color` |
| 刻度显示 | 显示 / 隐藏 | `axisTick.show`, `splitLine.show` |
| 刻度标签 | 显示 / 隐藏 | `axisLabel.show` |

### 3. 指针与数值

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 指针显示 | 显示 / 隐藏 | `pointer.show` |
| 指针样式 | 颜色、长度、宽度 | `pointer.itemStyle` |
| 中心数值 | 显示 / 隐藏 | `detail.show` |
| 数值格式 | 整数 / 小数 / 百分比 | `detail.formatter` |
| 单位显示 | 数值下方单位 | `title.text` |

### 4. 装饰元素

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 中心图标 | 无 / 有图片 | `graphic.elements` |
| 外圈装饰 | 虚线圈 / 点状装饰 | 额外 series |

---

## 雷达图 (Radar)

### 1. 形状与布局

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 雷达形状 | 多边形 / 圆形 | `radar.shape: 'polygon'/'circle'` |
| 维度数量 | indicator 数量 | `radar.indicator` |

### 2. 坐标轴

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 轴线显示 | 显示 / 隐藏 | `radar.axisLine.show` |
| 分割线 | 显示 / 隐藏 | `radar.splitLine.show` |
| 分割区域 | 交替颜色 / 透明 | `radar.splitArea` |

### 3. 数据区域

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 区域填充 | 透明度 / 颜色 | `areaStyle` |
| 边框线 | 颜色、宽度 | `lineStyle` |
| 数据点 | 显示 / 隐藏 | `symbol` |

---

## 通用需求

### 1. 颜色配置

| 需求项 | 说明 |
|--------|------|
| 主题色 | 项目统一的颜色风格 |
| 渐变色 | `new echarts.graphic.LinearGradient(...)` |
| 透明度 | 使用 rgba 格式 |

### 2. 响应式适配

| 需求项 | 说明 |
|--------|------|
| 字体自适应 | 使用 `countFontsize()` 包裹所有字体大小 |
| 间距自适应 | 使用 `countFontsize()` 包裹所有间距值 |

### 3. 交互效果

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 提示框 | 显示 / 隐藏 / 自定义格式 | `tooltip` |
| 高亮效果 | hover 时的样式变化 | `emphasis` |
| 图例交互 | 点击切换显示 | `legend.selectedMode` |

### 4. 动画效果

| 需求项 | 常见选项 | 对应配置 |
|--------|----------|----------|
| 入场动画 | 开启 / 关闭 | `animation` |
| 动画时长 | 毫秒数 | `animationDuration` |
| 动画缓动 | linear / ease / bounce | `animationEasing` |

---

## 需求分析示例

用户提供一张柱状图图片，分析步骤：

1. **图表类型**：柱状图
2. **方向**：垂直
3. **系列数**：单系列 → 使用 `generalBarOption`
4. **柱子颜色**：蓝色渐变 → `color: ['#3A60E0', '#60B9FF']`
5. **柱子宽度**：较细 → `barWidth: 12`
6. **柱子圆角**：无 → 默认
7. **背景条**：有灰色背景条 → `isShowBackground: true`
8. **顶部短横线**：有白色短横线 → `isWhiteLine: true`
9. **数值显示**：柱顶显示数值 → `showBarValue: true`
10. **最大值高亮**：最大值柱子是白色 → `isMaxColor: true`
11. **坐标轴**：只显示X轴标签，隐藏轴线 → `isShowXLine: false`, `isShowYLine: false`
12. **图例**：无图例 → 单系列默认无图例
