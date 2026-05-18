/**
 * ECharts 图表沉淀库 - 柱状图配置项
 * 
 * 本文件包含各种柱状图的配置项函数，支持多种样式和交互效果。
 * 
 * 目录：
 * 1. generalBarOption    - 通用柱状图（单系列，支持垂直/水平）
 * 2. MultiBarOption      - 多柱状图（多系列分组柱状图）
 * 3. stackBarOption      - 堆叠柱状图（水平堆叠）
 * 4. baseBarOption       - 基础柱状图（简洁风格）
 * 
 * 依赖：
 * - echarts
 * - countFontsize.js (自适应字体工具)
 */

import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";

// ============================================================================
// 1. generalBarOption - 通用柱状图
// ============================================================================
/**
 * @name generalBarOption
 * @description 通用柱状图配置项，支持垂直/水平方向、渐变色、最大值高亮等功能
 * 
 * @param {Array} data - 数据数组，格式：[{name: '分类名', value: 数值}, ...]
 * @param {String} name - 图表名称，用于tooltip显示
 * @param {String} unit - 单位文本，显示在数值轴
 * @param {String} orientation - 方向：'vertical'(垂直柱状图) | 'horizontal'(水平条形图)
 * @param {Array|String} color - 颜色配置：
 *   - 数组格式 [底部色, 顶部色] 创建渐变效果
 *   - 字符串格式使用单色
 * @param {Object} yAxisConfig - 数值轴配置
 *   - min: 最小值
 *   - max: 最大值
 *   - interval: 刻度间隔
 * @param {Object} otherConfig - 其他配置项
 *   - isWhiteLine: {Boolean} 是否显示柱子顶部白色短横线，默认false
 *   - barWidth: {Number} 柱子宽度，默认12
 *   - isPercentage: {Boolean} 是否显示百分比，默认false
 *   - unitPosition: {String} 单位位置 'left'|'center'|'right'，默认'right'
 *   - isShowXLine: {Boolean} 是否显示X轴轴线，默认true
 *   - isShowYLine: {Boolean} 是否显示Y轴轴线，默认true
 *   - isShowXLabel: {Boolean} 是否显示X轴标签，默认true
 *   - isShowYLabel: {Boolean} 是否显示Y轴标签，默认true
 *   - isMaxColor: {Boolean} 是否对最大值柱子使用特殊颜色，默认true
 *   - maxColor: {Array} 最大值柱子渐变色，默认['rgba(151,153,156,1)', 'rgba(250,250,250,1)']
 *   - showBarValue: {Boolean} 是否显示柱子顶部数值，默认true
 *   - isShowBackground: {Boolean} 是否显示柱子背景条，默认true
 *   - barBorderColor: {Boolean|String} 柱子边框颜色，true使用渐变顶色，字符串自定义颜色
 * 
 * @returns {Object} ECharts option 配置对象
 * 
 * @example
 * // 基础用法
 * const option = generalBarOption(
 *   [{name: '2021', value: 550}, {name: '2022', value: 700}],
 *   '人口数量',
 *   '单位：人',
 *   'vertical',
 *   ['rgba(58, 96, 224, 1)', 'rgba(96, 185, 255, 1)'],
 *   {min: 0, max: 1000, interval: 200},
 *   {isWhiteLine: true, barWidth: 12}
 * );
 */
export const generalBarOption = (
  data,
  name,
  unit,
  orientation,
  color,
  yAxisConfig,
  otherConfig,
) => {
  // 通用柱状图默认示例数据
  const defaultSample = {
    name: "人口数量",
    orientation: "vertical",
    unit: "",
    data: [
      { name: "2021", value: 550 },
      { name: "2022", value: 700 },
      { name: "2023", value: 420 },
      { name: "2024", value: 220 },
      { name: "2025", value: 240 },
    ],
    color: ["rgba(58, 96, 224, 1)", "rgba(96, 185, 255, 1)"],
    yAxisConfig: {
      min: 0,
      max: 1000,
      interval: 200,
    },
  };

  // 如果未传入对应参数，则使用默认示例数据的值
  data = data && data.length ? data : defaultSample.data;
  name = name || defaultSample.name;
  unit = unit || defaultSample.unit;
  orientation = orientation || defaultSample.orientation;
  color = color || defaultSample.color;
  yAxisConfig = yAxisConfig || defaultSample.yAxisConfig;

  // 默认配置项
  const defaultConfig = {
    isWhiteLine: false,    // 是否显示柱子顶部/右侧白色短横线
    barWidth: 12,          // 柱子宽度
    isPercentage: false,   // 是否改为显示百分比
    unitPosition: "right", // 数值轴单位位置 left/middle/right
    isShowXLine: true,     // 是否显示X轴轴线
    isShowYLine: true,     // 是否显示Y轴轴线
    isShowXLabel: true,    // 是否显示X轴标签
    isShowYLabel: true,    // 是否显示Y轴标签
    isMaxColor: true,      // 是否对最大值柱子使用特殊颜色
    maxColor: ['rgba(151, 153, 156, 1)', 'rgba(250, 250, 250, 1)'], // 最大值柱子颜色
    showBarValue: true,    // 是否显示柱子数值
    isShowBackground: true, // 是否显示柱子背景
    barBorderColor: false,  // 柱子边框颜色 true/false/'#ff0000'
  };
  otherConfig = { ...defaultConfig, ...otherConfig };

  // 获取真实的最大值
  const realMax = Math.max(...data.map((item) => item.value));
  
  // 自动计算美观的最大值
  function niceMax(value) {
    if (value <= 10) return 10;
    if (value <= 20) return 20;
    if (value <= 25) return 25;
    if (value <= 50) return 50;
    if (value <= 100) return 100;
    if (value <= 200) return 200;
    if (value <= 500) return 500;
    if (value <= 1000) return 1000;
    return Math.ceil(value / 1000) * 1000;
  }
  const maxValue = yAxisConfig ? yAxisConfig.max : niceMax(realMax);
  const interval = yAxisConfig?.interval !== undefined
    ? { interval: yAxisConfig.interval }
    : {};

  // 处理渐变色 - 支持两个颜色的数组
  let bottomColor, topColor;
  if (Array.isArray(color) && color.length === 2) {
    bottomColor = color[0];
    topColor = color[1];
  } else {
    bottomColor = `${color}00`;
    topColor = color;
  }

  // 渐变色方向配置
  const gradientDirectionMap = {
    horizontal: [1, 0, 0, 0],
    vertical: [0, 0, 0, 1],
  };
  const gradientDirection = gradientDirectionMap[orientation] || [0, 1, 0, 0];

  // 根据方向配置坐标轴
  let xAxis, yAxis, grid;
  if (orientation === "horizontal") {
    // 水平条形图配置
    grid = {
      left: "3%",
      right: "5%",
      bottom: "0%",
      top: unit ? "15%" : "2%",
      containLabel: true,
    };
    xAxis = {
      type: "value",
      show: true,
      axisLine: {
        show: otherConfig.isShowXLine,
        lineStyle: {
          color: fontColor(0.2),
          width: countFontsize(2),
        },
      },
      axisLabel: {
        show: otherConfig.isShowXLabel,
        color: fontColor(0.8),
        fontSize: countFontsize(24),
        fontWeight: 200,
        formatter: function (value) {
          return otherConfig.isPercentage ? value + '%' : String(value);
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: fontColor(0.2),
          type: "dashed",
        },
      },
      min: 0,
      max: maxValue,
      ...interval,
    };
    yAxis = {
      type: "category",
      data: data.map((item) => item.name),
      show: true,
      name: unit,
      nameTextStyle: {
        color: fontColor(0.6),
        fontSize: countFontsize(24),
        align: otherConfig.unitPosition,
      },
      nameGap: countFontsize(16),
      axisLine: {
        show: otherConfig.isShowYLine,
        color: fontColor(0.2),
      },
      axisLabel: {
        show: otherConfig.isShowYLabel,
        color: fontColor(0.6),
        fontSize: countFontsize(24),
        fontWeight: 200,
        showMaxLabel: true,
        showMinLabel: true,
        margin: countFontsize(15),
        align: "right",
        formatter: function (value) {
          const N = 4;
          const parts = (value || "").toString().match(new RegExp('.{1,' + N + '}', 'g')) || [value];
          return parts.join('\n');
        },
        lineHeight: countFontsize(26),
      },
      axisTick: {
        show: false,
        alignWithLabel: true,
        lineStyle: { color: "#fff" },
      },
    };
  } else {
    // 垂直柱状图配置
    grid = {
      left: "3%",
      right: "2%",
      bottom: "1%",
      top: unit ? "15%" : "5%",
      containLabel: true,
    };
    xAxis = {
      type: "category",
      data: data.map((item) => item.name),
      show: true,
      axisLine: {
        color: fontColor(0.2),
        width: countFontsize(2),
        lineStyle: {
          color: '#A9BBEB',
          width: countFontsize(2),
        },
      },
      axisLabel: {
        show: otherConfig.isShowXLabel,
        color: fontColor(0.8),
        fontSize: countFontsize(19),
        fontWeight: 200,
        interval: 0,
        rotate: 0,
        showMaxLabel: true,
        showMinLabel: true,
        margin: countFontsize(25),
        formatter: function (value) {
          const N = 6;
          const parts = (value || "").toString().match(new RegExp('.{1,' + N + '}', 'g')) || [value];
          return parts.join('\n');
        },
        lineHeight: countFontsize(28),
      },
      axisTick: {
        show: false,
        alignWithLabel: true,
        lineStyle: {
          color: fontColor(0.2),
          width: countFontsize(2),
        },
      },
    };
    yAxis = {
      type: "value",
      show: true,
      name: unit,
      nameGap: Math.floor(countFontsize(22)),
      nameLocation: "end",
      nameTextStyle: {
        color: fontColor(0.8),
        fontSize: countFontsize(24),
        fontWeight: 200,
        align: otherConfig.unitPosition,
      },
      axisLine: {
        show: otherConfig.isShowYLine,
        lineStyle: {
          color: fontColor(0.2),
          width: countFontsize(2),
        },
      },
      axisLabel: {
        show: otherConfig.isShowYLabel,
        color: fontColor(0.8),
        fontSize: countFontsize(22),
        fontWeight: 200,
        formatter: function (value) {
          return otherConfig.isPercentage ? value + '%' : String(value);
        },
      },
      splitLine: {
        lineStyle: {
          color: fontColor(0.2),
          type: "dashed",
        },
      },
      min: 0,
      max: maxValue,
      ...interval,
    };
  }

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "none" },
      formatter: function (params) {
        if (!params || !params.length) return "";
        let tooltip = name + "<br/>";
        params.forEach((item) => {
          if (item.seriesName) {
            tooltip += `<span style="display:inline-block;margin-right:6px;border-radius:50%;width:10px;height:10px;background:${item.color};"></span>${item.axisValueLabel}：${item.data}<br/>`;
          }
        });
        return tooltip;
      },
      backgroundColor: "rgba(0,0,0,0.7)",
      textStyle: { color: "#fff", fontSize: 14 },
    },
    grid: grid,
    xAxis: xAxis,
    yAxis: yAxis,
    series: [
      // 柱顶白色短横线（可选）
      otherConfig.isWhiteLine && {
        name: "",
        type: "pictorialBar",
        symbol: "rect",
        symbolSize: orientation === "horizontal"
          ? [1.5, countFontsize(16)]
          : [countFontsize(16), 1.5],
        symbolOffset: orientation === "horizontal"
          ? [0, countFontsize(0)]
          : [countFontsize(0), 0],
        symbolPosition: "end",
        barWidth: countFontsize(16),
        z: 3,
        itemStyle: { normal: { color: "rgba(255,255,255,1)" } },
        data: data.map((item) => item.value),
      },
      // 主柱状图
      {
        name: name,
        type: "bar",
        barWidth: countFontsize(otherConfig.barWidth || 12),
        showBackground: otherConfig.isShowBackground || false,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" },
        data: data.map((item) => item.value),
        itemStyle: {
          borderColor: otherConfig.barBorderColor
            ? otherConfig.barBorderColor === true ? topColor : otherConfig.barBorderColor
            : 'transparent',
          color: function (params) {
            const val = params && (params.data != null ? params.data : params.value);
            // 最大值使用特殊颜色
            if (orientation === "horizontal") {
              if (otherConfig.isMaxColor && val === realMax) {
                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: otherConfig.maxColor[1] || "#FFD700" },
                  { offset: 1, color: otherConfig.maxColor[0] || "#FFD700" },
                ]);
              }
              return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: topColor },
                { offset: 1, color: bottomColor },
              ]);
            } else {
              if (otherConfig.isMaxColor && val === realMax) {
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: otherConfig.maxColor[1] || "#FFD700" },
                  { offset: 1, color: otherConfig.maxColor[0] || "#FFD700" },
                ]);
              }
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: topColor },
                { offset: 1, color: bottomColor },
              ]);
            }
          },
        },
        z: 2,
        label: otherConfig.showBarValue
          ? {
              show: true,
              position: orientation === "horizontal" ? "right" : "top",
              color: fontColor(1),
              fontSize: countFontsize(22),
              formatter: function (params) {
                const val = params && (params.data != null ? params.data : params.value);
                return otherConfig.isPercentage ? val + "%" : String(val);
              },
            }
          : { show: false },
      },
    ].filter(Boolean), // 过滤掉 false 值
  };

  return option;
};

// ============================================================================
// 2. MultiBarOption - 多柱状图（分组柱状图）
// ============================================================================
/**
 * @name MultiBarOption
 * @description 多柱状图/分组柱状图配置项，支持多系列数据分组展示
 * 
 * @param {Array} data - 数据数组，格式：
 *   [{date: '分类名', values: [{name: '系列1', value: 100}, {name: '系列2', value: 200}]}, ...]
 * @param {Array} colors - 颜色数组，每个元素为 [起始色, 结束色] 的渐变配置
 * @param {String} name - 图表名称
 * @param {String} unit - 单位
 * @param {String} orientation - 方向：'vertical' | 'horizontal'
 * @param {Object} yAxisConfig - 数值轴配置
 *   - max: 最大值
 *   - interval: 刻度间隔
 *   - barWidth: 柱子宽度
 *   - barGap: 柱子间距百分比
 * @param {Object} otherConfig - 其他配置
 *   - isNeedLegend: {Boolean} 是否显示图例，默认true
 *   - legendIconSize: {Number} 图例图标大小，默认10
 *   - isShowWhiteLine: {Boolean} 是否显示柱顶白线，默认true
 *   - isShowBarBackground: {Boolean} 是否显示柱子背景，默认true
 *   - isBarBorderColor: {Boolean} 柱子边框颜色，默认true
 *   - isShowXLine: {Boolean} 是否显示X轴轴线，默认true
 *   - isShowYLine: {Boolean} 是否显示Y轴轴线，默认true
 *   - isShowXLabel: {Boolean} 是否显示X轴标签，默认true
 *   - isShowYLabel: {Boolean} 是否显示Y轴标签，默认true
 *   - gridConfig: {Object} 自定义grid配置
 * 
 * @returns {Object} ECharts option 配置对象
 * 
 * @example
 * const option = MultiBarOption(
 *   [
 *     { date: "06:00", values: [{ name: "已完成", value: 100 }, { name: "处理中", value: 150 }] },
 *     { date: "09:00", values: [{ name: "已完成", value: 350 }, { name: "处理中", value: 80 }] },
 *   ],
 *   [["rgba(58, 96, 224, 1)", "rgba(96, 185, 255, 1)"], ["rgba(255, 180, 96, 1)", "rgba(255, 220, 150, 1)"]],
 *   "任务状态",
 *   "",
 *   "vertical",
 *   { max: 400, interval: 100 },
 *   { isShowWhiteLine: true }
 * );
 */
export const MultiBarOption = (
  data,
  colors,
  name,
  unit,
  orientation,
  yAxisConfig,
  otherConfig
) => {
  // 多柱状图默认示例数据
  const defaultSample = {
    name: "任务状态统计",
    unit: "",
    orientation: "vertical",
    data: [
      {
        date: "2021",
        values: [
          { name: "已完成", value: 120 },
          { name: "进行中", value: 80 },
          { name: "未开始", value: 50 }
        ]
      },
      {
        date: "2022",
        values: [
          { name: "已完成", value: 150 },
          { name: "进行中", value: 90 },
          { name: "未开始", value: 40 }
        ]
      },
      {
        date: "2023",
        values: [
          { name: "已完成", value: 180 },
          { name: "进行中", value: 100 },
          { name: "未开始", value: 30 }
        ]
      }
    ],
    colors: [
      ["rgba(58, 96, 224, 1)", "rgba(96, 185, 255, 1)"],
      ["rgba(255, 180, 96, 1)", "rgba(255, 220, 150, 1)"],
      ["rgba(100, 200, 100, 1)", "rgba(150, 255, 150, 1)"]
    ],
    yAxisConfig: {
      max: 300,
      interval: 100,
      barWidth: 15,
      barGap: "100%"
    },
  };

  // 如果未传入对应参数，则使用默认示例数据的值
  data = data && data.length ? data : defaultSample.data;
  name = name || defaultSample.name;
  unit = unit || defaultSample.unit;
  orientation = orientation || defaultSample.orientation;
  colors = colors || defaultSample.colors;
  yAxisConfig = yAxisConfig || defaultSample.yAxisConfig;

  // 默认配置
  const defaultConfig = {
    isNeedLegend: true,
    legendIconSize: 10,
    isShowWhiteLine: true,
    isShowBarBackground: true,
    isBarBorderColor: true,
    isShowXLine: true,
    isShowYLine: true,
    isShowXLabel: true,
    isShowYLabel: true,
    gridConfig: {}
  };
  otherConfig = { ...defaultConfig, ...otherConfig };

  // 提取分类名称和日期数据
  const categoryNames = [...new Set(data.flatMap((item) => item.values.map((v) => v.name)))];
  const dates = data.map((item) => item.date);

  // 创建数据映射函数
  const createSeriesData = (category) =>
    data.map((item) => {
      const found = item.values.find((v) => v.name === category);
      return found ? found.value : 0;
    });

  // 通用样式配置
  const commonStyles = {
    axisLabel: {
      color: fontColor(0.8),
      fontSize: countFontsize(22),
      margin: countFontsize(20),
    },
    axisLine: {
      lineStyle: { color: "rgba(255, 255, 255, 0.2)", width: 2 },
    },
    splitLine: {
      lineStyle: { color: "rgba(255, 255, 255, 0.2)", type: "dashed" },
    },
  };

  // 构造主要柱状图系列
  const mainSeries = categoryNames.map((category, index) => {
    const colorIndex = index % colors.length;
    const colorPair = Array.isArray(colors[colorIndex]) ? colors[colorIndex] : [colors[colorIndex], colors[colorIndex]];
    const startColor = colorPair[0] || 'rgba(58, 96, 224, 1)';
    const endColor = colorPair[1] || 'rgba(96, 185, 255, 1)';
    
    return {
      name: category,
      type: "bar",
      barWidth: countFontsize(yAxisConfig.barWidth || 15),
      barGap: yAxisConfig.barGap || "100%",
      showBackground: otherConfig.isShowBarBackground,
      backgroundStyle: { color: "rgba(180, 180, 180, 0.2)" },
      data: createSeriesData(category),
      itemStyle: {
        borderColor: otherConfig.isBarBorderColor ? endColor : "transparent",
        color: new echarts.graphic.LinearGradient(
          ...(orientation === "horizontal" ? [0, 0, 1, 0] : [0, 1, 0, 0]),
          [
            { offset: 0, color: startColor },
            { offset: 1, color: endColor },
          ]
        ),
      },
    };
  });

  // 构造装饰短横线系列
  const decorativeSeries = otherConfig.isShowWhiteLine ? categoryNames.map((category, index) => ({
    name: "",
    type: "pictorialBar",
    barGap: yAxisConfig.barGap || "100%",
    symbol: "rect",
    symbolSize: orientation === "horizontal"
      ? [2, countFontsize(20)]
      : [countFontsize(20), 2],
    symbolOffset: orientation === "horizontal" ? [0, 0] : [0, 0],
    symbolPosition: "end",
    tooltip: { show: false },
    z: 3,
    itemStyle: { color: "rgba(255, 255, 255, 1)" },
    data: createSeriesData(category),
    barWidth: countFontsize(yAxisConfig.barWidth || 15),
  })) : [];

  // 坐标轴配置
  const isHorizontal = orientation === "horizontal";
  const valueAxisConfig = {
    type: "value",
    show: true,
    name: unit,
    nameGap: Math.floor(countFontsize(22)),
    nameLocation: "end",
    nameTextStyle: {
      color: fontColor(0.8),
      fontSize: countFontsize(24),
      fontWeight: 200,
      align: isHorizontal ? "left" : "center",
    },
    ...commonStyles,
    axisLine: {
      show: isHorizontal ? otherConfig.isShowXLine : otherConfig.isShowYLine,
      ...commonStyles.axisLine
    },
    axisLabel: {
      show: isHorizontal ? otherConfig.isShowXLabel : otherConfig.isShowYLabel,
      ...commonStyles.axisLabel
    },
    min: 0,
    max: yAxisConfig?.max || 800,
    interval: yAxisConfig?.interval || 200,
  };

  const categoryAxisConfig = {
    type: "category",
    data: dates,
    show: true,
    margin: countFontsize(6),
    axisLine: {
      show: isHorizontal ? otherConfig.isShowYLine : otherConfig.isShowXLine,
      color: "rgba(255, 255, 255, 0.2)",
      width: countFontsize(2),
    },
    axisLabel: {
      show: isHorizontal ? otherConfig.isShowYLabel : otherConfig.isShowXLabel,
      ...commonStyles.axisLabel,
      fontWeight: isHorizontal ? 400 : 200,
      interval: isHorizontal ? undefined : 0,
    },
    axisTick: { show: false },
  };

  const [xAxis, yAxis] = isHorizontal
    ? [valueAxisConfig, categoryAxisConfig]
    : [categoryAxisConfig, valueAxisConfig];

  // 默认grid配置
  const defaultGridConfig = {
    left: countFontsize(12),
    right: countFontsize(40),
    bottom: countFontsize(3),
    top: otherConfig.isNeedLegend ? countFontsize(60) : countFontsize(30),
    containLabel: true,
  };

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      axisPointer: { type: "none" },
      formatter: function (param) {
        if (!param) return "";
        let tooltip = param.seriesName + "<br/>";
        tooltip += `<span style="display:inline-block;margin-right:6px;border-radius:50%;width:10px;height:10px;background:${param.color};"></span>${param.name}：${param.data}<br/>`;
        return tooltip;
      },
      backgroundColor: "rgba(0,0,0,0.7)",
      textStyle: { color: "#fff", fontSize: 14 },
    },
    grid: { ...defaultGridConfig, ...otherConfig.gridConfig },
    legend: {
      show: otherConfig.isNeedLegend,
      data: categoryNames.map((name, index) => {
        const colorIndex = index % colors.length;
        const colorPair = Array.isArray(colors[colorIndex]) ? colors[colorIndex] : [colors[colorIndex], colors[colorIndex]];
        const startColor = colorPair[0] || 'rgba(58, 96, 224, 1)';
        const endColor = colorPair[1] || colorPair[0] || 'rgba(96, 185, 255, 1)';
        
        return {
          name: name,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: startColor },
              { offset: 1, color: endColor }
            ]),
            borderWidth: countFontsize(8),
            borderType: "solid",
          },
        };
      }),
      selectedMode: otherConfig.isShowWhiteLine ? false : true,
      icon: "circle",
      right: countFontsize(20),
      itemWidth: countFontsize(otherConfig.legendIconSize),
      itemHeight: countFontsize(otherConfig.legendIconSize),
      itemGap: countFontsize(30),
      symbolKeepAspect: true,
      formatter: function (name) {
        return `{name|${name}}`;
      },
      textStyle: {
        color: fontColor(0.8),
        fontSize: countFontsize(22),
        rich: {
          name: {
            fontSize: countFontsize(22),
            color: fontColor(0.8),
            padding: [0, 0, 0, countFontsize(1)],
          },
        },
        padding: [countFontsize(3), 0, 0, countFontsize(4)],
      },
    },
    xAxis,
    yAxis,
    series: [...mainSeries, ...decorativeSeries],
  };
};

// ============================================================================
// 3. stackBarOption - 堆叠柱状图
// ============================================================================
/**
 * @name stackBarOption
 * @description 水平堆叠柱状图配置项，适用于多维度占比展示
 * 
 * @param {Array} yData - Y轴分类数据，如 ['楼栋A', '楼栋B', '楼栋C']
 * @param {Array} values - 二维数组，每个系列的数据值 [[20,40,30], [30,20,50], [60,50,30]]
 * @param {Array} legendTitles - 图例标题数组，如 ['优', '良', '差']
 * @param {Array} colors - 颜色配置数组，每项为 {start: '起始色', end: '结束色'}
 * @param {Boolean} isDefault - 是否使用默认数据
 * 
 * @returns {Object} ECharts option 配置对象
 * 
 * @example
 * const option = stackBarOption(
 *   ['楼栋A', '楼栋B', '楼栋C'],
 *   [[20, 40, 30], [30, 20, 50], [60, 50, 30]],
 *   ['优', '良', '差'],
 *   [
 *     { start: 'rgba(19, 126, 51, 0.1)', end: 'rgba(163, 248, 189, 1)' },
 *     { start: 'rgba(139, 104, 22, 0.1)', end: 'rgba(255, 210, 104, 1)' },
 *     { start: 'rgba(136, 33, 33, 0.1)', end: 'rgba(255, 106, 106, 1)' }
 *   ]
 * );
 */
export const stackBarOption = (
  yData,
  values,
  legendTitles,
  colors,
  isDefault = false
) => {
  // 默认数据设置
  if (isDefault) {
    yData = ['行政科学楼', '住院医技', '共享大厅', '门诊', '共享医技', '外科住院楼'];
    values = [
      [20, 40, 30, 50, 25, 30],
      [30, 20, 50, 20, 30, 40],
      [60, 50, 30, 40, 55, 40]
    ];
    legendTitles = ['优', '良', '差'];
    colors = [
      { start: 'rgba(19, 126, 51, 0.1000)', end: 'rgba(163, 248, 189, 1)' },
      { start: 'rgba(139, 104, 22, 0.1000)', end: 'rgba(255, 210, 104, 1)' },
      { start: 'rgba(136, 33, 33, 0.1000)', end: 'rgba(255, 106, 106, 1)' }
    ];
  }

  // 构建系列数据
  const series = [];
  for (let i = 0; i < values.length; i++) {
    series.push({
      name: legendTitles[i],
      type: 'bar',
      stack: '总量',
      barWidth: countFontsize(20),
      emphasis: {
        disabled: false,
        itemStyle: {
          borderWidth: countFontsize(5),
          borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colors[i].start },
            { offset: 1, color: colors[i].end }
          ], false)
        }
      },
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colors[i].start },
            { offset: 1, color: colors[i].end }
          ], false),
          borderRadius: [0, 20, 20, 0]
        }
      },
      data: values[i]
    });
  }

  const option = {
    backgroundColor: 'transparent',
    legend: {
      show: true,
      top: 0,
      right: countFontsize(40),
      itemGap: countFontsize(50),
      type: 'plain',
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: countFontsize(22),
        fontWeight: 400,
        fontFamily: 'PingFangSC-Regular, PingFangSC-Regular'
      },
      itemHeight: countFontsize(22),
      itemWidth: countFontsize(22)
    },
    grid: {
      top: countFontsize(30),
      left: countFontsize(30),
      right: countFontsize(20),
      bottom: countFontsize(5),
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      padding: 1,
      textStyle: { fontSize: countFontsize(14), color: '#FFFFFF' }
    },
    xAxis: [{ type: 'value', show: false }],
    yAxis: [{
      type: 'category',
      axisTick: { show: false },
      axisLine: { show: false, lineStyle: { color: '#fff' } },
      axisLabel: { color: '#fff', fontSize: countFontsize(22) },
      data: yData
    }],
    series
  };

  return option;
};

