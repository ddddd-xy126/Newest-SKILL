import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";

import {
  defaultGradientColumnOptionData,
  defaultHorizontalColumnOptionData,
  taskStatusColumnData,
  taskStatusColorList,
} from "../defaultData.js";

export const baseBarOption = (
  data,
  name,
  unit,
  orientation,
  yAxisConfig, //是否传入数值轴最大值和间隔
  color,
  isDefault = false
) => {
  // 默认数据设置
  if (isDefault) {
    const defaultData = defaultHorizontalColumnOptionData();
    data = defaultData.data;
    name = defaultData.text;
    unit = defaultData.unit;
    orientation = defaultData.orientation; // 横向(vertical) || 纵向(horizontal)
    color = defaultData.color; // 颜色
  }

  // 获取真实的最大值
  const realMax = Math.max(...data.map((item) => item.value));
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
  const interval =
    yAxisConfig?.interval !== undefined
      ? { interval: yAxisConfig.interval }
      : {};

  // 渐变色方向
  const gradientDirectionMap = {
    horizontal: [1, 0, 0, 0],
    vertical: [0, 0, 0, 1],
  };
  const gradientDirection = gradientDirectionMap[orientation] || [0, 1, 0, 0];

  // 判断垂直还是水平
  let xAxis, yAxis, grid;
  if (orientation === "horizontal") {
    // 水平
    (grid = {
      left: "0%",
      right: "5%",
      bottom: "0%",
      top: unit ? "15%" : "2%",
      containLabel: true,
    }),
      (xAxis = {
        type: "value",
        show: true,
        // axisLine: {
        // x轴轴线
        //   show: false,
        //   // lineStyle: {
        //   //   color: fontColor(0.2),
        //   //   width: countFontsize(2),
        //   // },
        // },
        axisLabel: {
          color: fontColor(0.8),
          fontSize: countFontsize(24),
          fontWeight: 200,
          formatter: function (value) {
            return String(value);
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
      });
    yAxis = {
      type: "category",
      data: data.map((item) => item.name),
      show: true,
      name: unit,
      nameTextStyle: {
        // 控制单位字体样式
        color: fontColor(0.6),
        fontSize: countFontsize(24),
        align: "right", // 右对齐
      },
      nameGap: countFontsize(16),
      axisLine: {
        color: fontColor(0.2),
      },
      axisLabel: {
        color: fontColor(0.6),
        fontSize: countFontsize(24),
        fontWeight: 200,
        showMaxLabel: true,
        showMinLabel: true,
        margin: countFontsize(15),
        align: "right",
      },
      axisTick: {
        show: false,
        alignWithLabel: true,
        lineStyle: {
          color: "#fff",
        },
      },
    };
  } else {
    (grid = {
      left: "3%",
      right: "0%",
      bottom: "0%",
      top: unit ? "17%" : "5%",
      containLabel: true,
    }),
      (xAxis = {
        //垂直
        type: "category",
        data: data.map((item) => item.name),
        show: true,
        axisLine: {
          color: fontColor(0.2),
          width: countFontsize(2),
        },
        axisLabel: {
          color: fontColor(0.8),
          fontSize: countFontsize(22),
          fontWeight: 200,
          interval: 0,
          rotate: 0,
          showMaxLabel: true,
          showMinLabel: true,
          margin: countFontsize(25),
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
          lineStyle: {
            color: fontColor(0.2),
            width: countFontsize(2),
          },
        },
      });
    yAxis = {
      type: "value",
      show: true,
      name: unit,
      nameGap: Math.floor(countFontsize(22)),
      nameLocation: "end",
      nameTextStyle: {
        color: fontColor(0.8),
        fontSize: countFontsize(22),
        fontWeight: 200,
        align: "center",
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: fontColor(0.2),
          width: countFontsize(2),
        },
      },
      axisLabel: {
        color: fontColor(0.8),
        fontSize: countFontsize(24),
        fontWeight: 200,
        formatter: function (value) {
          return String(value);
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
        let tooltip =name + "<br/>";
        params.forEach((item) => {
          if (item.seriesName) {
            tooltip += `<span style="display:inline-block;margin-right:6px;border-radius:50%;width:10px;height:10px;background:${item.color};"></span>${item.axisValueLabel}：${item.data}<br/>`;
          }
        });
        return tooltip;
      },
      backgroundColor: "rgba(0,0,0,0.7)",
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    grid: grid,
    xAxis: xAxis,
    yAxis: yAxis,
    series: [
      // 背景条居中版本
      // {
      //   type: "bar",
      //   barWidth: countFontsize(60),
      //   // 背景条
      //   barGap: -0.6,
      //   data: data.map(() => maxValue),
      //   itemStyle: {
      //     color: new echarts.graphic.LinearGradient(...gradientDirection, [
      //       { offset: 0, color: "rgba(255,255,255,0.1)" }, // 顶部颜色
      //       { offset: 0.5, color: "rgba(255,255,255,0.05)" },
      //       { offset: 1, color: "transparent" }, // 底部颜色
      //     ]),
      //   },
      //   silent: true,
      //   z: 1,
      // },
      // // 短横线
      // {
      //   name: "",
      //   type: "pictorialBar",
      //   symbol: "rect",
      //   symbolSize:
      //     orientation === "horizontal"
      //       ? [2, countFontsize(20)]
      //       : [countFontsize(20), 2],
      //   symbolOffset:
      //     orientation === "horizontal"
      //       ? [0, countFontsize(12)]
      //       : [countFontsize(12), 0],
      //   symbolPosition: "end",
      //   barWidth: countFontsize(16),
      //   z: 3,
      //   itemStyle: {
      //     normal: {
      //       color: "rgba(255,255,255,1)",
      //     },
      //   },
      //   data: data.map((item) => item.value),
      // },

      // 无背景条居中版本
      // 短横线
      {
        name: "",
        type: "pictorialBar",
        symbol: "rect",
        symbolSize:
          orientation === "horizontal"
            ? [1.5, countFontsize(16)]
            : [countFontsize(16), 1.5],
        symbolOffset:
          orientation === "horizontal"
            ? [0, countFontsize(0)]
            : [countFontsize(0), 0],
        symbolPosition: "end",
        barWidth: countFontsize(16),
        z: 3,
        itemStyle: {
          normal: {
            color: "rgba(255,255,255,1)",
          },
        },
        data: data.map((item) => item.value),
      },
      {
        name: name,
        type: "bar",
        barWidth: countFontsize(12),
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        data: data.map((item) => item.value),
        itemStyle: {
          color: color,
        },
        z: 2,
        label: {
          show: false,
        },
      },
    ],
  };

  return option;
};

export const MultiBarOption = (
  data,
  colors,
  name,
  orientation = "vertical",
  yAxisConfig = {},
  isNeedLegend = true,
  isDefault = false,
  legendIconSize = 5,
  gridConfig = {} // 新增grid配置参数
) => {
  // 默认数据设置
  if (isDefault) {
    const defaultData = taskStatusColumnData();
    const defaultColors = taskStatusColorList();
    return MultiBarOption(
      defaultData.data,
      defaultColors,
      defaultData.text,
      defaultData.orientation,
      defaultData.yAxis,
      false,
      legendIconSize,
      gridConfig
    );
  }

  console.log(data, "1111111111111111111111");

  // 提取分类名称和日期数据
  const categoryNames = [
    ...new Set(data.flatMap((item) => item.values.map((v) => v.name))),
  ];
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
      lineStyle: {
        color: "rgba(255, 255, 255, 0.2)",
        type: "dashed",
      },
    },
  };

  // 构造主要柱状图系列
  const mainSeries = categoryNames.map((category, index) => ({
    name: category,
    type: "bar",
    barWidth: countFontsize(10),
    barGap: "120%",
    showBackground: true,
    backgroundStyle: {
      color: "rgba(180, 180, 180, 0.2)",
    },
    data: createSeriesData(category),
    itemStyle: {
      color: colors[index % colors.length],
    },
  }));

  // 构造装饰系列
  const decorativeSeries = categoryNames.map((category, index) => ({
    name: "",
    type: "pictorialBar",
    barGap: "120%",
    symbol: "rect",
    symbolSize:
      orientation === "horizontal"
        ? [countFontsize(3), countFontsize(14)]
        : [countFontsize(14), countFontsize(3)],
    symbolOffset: orientation === "horizontal" ? [countFontsize(2), 0] : [0, 0],
    symbolPosition: "end",
    tooltip: { show: false },
    z: 3,
    itemStyle: {
      color: "rgba(255, 255, 255, 1)",
    },
    data: createSeriesData(category),
    barCategoryGap: "80%",
    barWidth: countFontsize(10),
  }));

  // 坐标轴配置
  const isHorizontal = orientation === "horizontal";
  const valueAxisConfig = {
    type: "value",
    show: true,
    ...commonStyles,
    axisLine: { show: !isHorizontal, ...commonStyles.axisLine },
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
      color: "rgba(255, 255, 255, 0.2)",
      width: countFontsize(2),
    },
    axisLabel: {
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
    top: isNeedLegend ? countFontsize(60) : countFontsize(20),
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
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    grid: {
      ...defaultGridConfig,
      ...gridConfig, // 合并用户自定义的grid配置
    },
    legend: {
      show: isNeedLegend,
      data: categoryNames.map((name, index) => ({
        name: name,
        itemStyle: {
          color: colors[index % colors.length],
          borderColor: `${colors[index % colors.length]}60`,
          borderWidth: countFontsize(8),
          borderType: "solid",
        },
      })),
      selectedMode: false,
      icon: "circle",
      right: countFontsize(20),
      itemWidth: countFontsize(legendIconSize),
      itemHeight: countFontsize(legendIconSize),
      itemGap: countFontsize(30),
      symbolKeepAspect: true,
      formatter: function (name) {
        const item = data.find((d) => d.name === name);
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

export const stackBarOption = (data = [], colorList) => {
  // 默认颜色列表
  colorList = colorList || [
    "#2195e0",
    "#86e0ed",
    "#dbf5ff",
    "#fec551",
    "#ff5c57",
  ];

  // 提取x轴分类数据
  const categories = data.map((item) => item.date);

  // 提取系列名称
  const seriesNames =
    data.length > 0
      ? [...new Set(data[0].values.map((v) => v.name))]
      : ["系列1", "系列2", "系列3", "系列4", "系列5"];

  // 构建每个系列的数据
  const mainSeries = seriesNames.map((name, index) => {
    const seriesData = data.map((item) => {
      const match = item.values.find((v) => v.name === name);
      return match ? match.value : 0;
    });

    return {
      name: name,
      type: "bar",
      stack: "Ad",
      barWidth: countFontsize(14),
      data: seriesData,
      showBackground: true,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.05)",
      },
      itemStyle: {
        color: colorList[index % colorList.length],
        opacity: 0.7, // 使颜色变浅
      },
      emphasis: {
        focus: "series",
      },
    };
  });

  // 计算每个类别（x轴）的总和，用于绘制装饰线
  const totalData = categories.map((_, dateIndex) => {
    return seriesNames.reduce((sum, name) => {
      const item = data[dateIndex];
      if (!item) return sum;
      const match = item.values.find((v) => v.name === name);
      return sum + (match ? match.value : 0);
    }, 0);
  });

  // 只创建一个装饰线系列，显示在堆叠柱的顶部
  const decorativeSeries = [
    {
      name: "",
      type: "pictorialBar",
      barGap: "120%",
      symbol: "rect",
      symbolSize: [countFontsize(20), countFontsize(3)],
      symbolOffset: [0, 0],
      symbolPosition: "end",
      tooltip: { show: false },
      z: 3,
      itemStyle: {
        color: "rgba(255, 255, 255, 1)",
      },
      data: totalData,
      barCategoryGap: "80%",
      barWidth: countFontsize(10),
    },
  ];

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: seriesNames.map((item, index) => {
        return {
          name: item,
          itemStyle: {
            color: colorList[index % colorList.length],
            borderColor: `${colorList[index % colorList.length]}60`,
            borderWidth: countFontsize(10),
            borderType: "solid",
          },
        };
      }),
      selectedMode: false,
      icon: "circle",
      right: countFontsize(15),
      itemWidth: countFontsize(10),
      itemHeight: countFontsize(10),
      textStyle: {
        fontSize: countFontsize(22),
        color: fontColor(0.8),
      },
    },
    grid: {
      left: "2%",
      right: "4%",
      top: "19%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: categories,
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: "#505a60",
            width: 2,
          },
        },
        axisLabel: {
          fontSize: countFontsize(20),
          color: fontColor(0.8),
          interval: 0, // 添加这一行，强制显示所有标签
          rotate: 0, // 可以根据需要调整旋转角度，如果标签重叠
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          fontSize: countFontsize(20),
          color: fontColor(0.8),
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "solid",
            color: "#505a60",
            width: 2,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#505a60",
          },
        },
      },
    ],
    series: [...mainSeries, ...decorativeSeries],
  };
};
