import * as echarts from "echarts";
import { countFontsize } from "@utils/countFontsize.js";

/**
 * 通用 柱状图 + 折线图 配置项（自动 legend，外部控制颜色）
 * @param {Array} xData - X轴数据
 * @param {Array} seriesData - 系列数组，如 [{ name, type, data }, ...]
 * @param {Object} config - 可选项
 * @param {Array} config.barColors - 每个柱状系列的渐变色数组
 * @param {Array} config.lineColors - 每个折线系列的颜色数组
 * @param {String} config.unit - 左轴单位
 * @param {Number} config.barWidth - 柱子宽度
 * @param {Boolean} config.isShowLegend - 是否显示图例
 */
export const baseLineOption = (xData = [], seriesData = [], config = {}) => {
  const {
    unit = "",
    barColors = [
      [
        { offset: 0, color: "rgba(96,185,255,1)" },
        { offset: 1, color: "rgba(58,96,224,1)" },
      ],
    ],
    lineColors = ["rgba(0,208,149,1)"],
  } = config;

  // 自动生成 legend
  const legendNames = seriesData.map((s) => s.name);

  const series = seriesData.map((item, index) => {
    if (item.type === "bar") {
      const colorCfg = barColors[index % barColors.length];
      return {
        name: item.name,
        type: "bar",
        barWidth: countFontsize(config.barWidth || 20),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, colorCfg),
        },
        data: item.data,
      };
    } 
    else if (item.type === "line") {
      const color = lineColors[index % lineColors.length];
      return {
        name: item.name,
        type: "line",
        yAxisIndex: 1,
        smooth: false,
        symbol: "circle",

        symbolSize: countFontsize(9),
        itemStyle: {
          color,
          borderColor: color,
          borderWidth: 1,
        },

        // 选中/hover 时效果（亮圈 + 变大）
        emphasis: {
          scale: true,
          itemStyle: {
            color,
            borderColor: "#ffffff88",
            borderWidth: 10, // 亮圈宽度
          },
        },

        lineStyle: { color },

        // 半透明面积
        areaStyle: { color: `${color}13` },

        data: item.data,
      };
    }

    return item;
  });

  return {
    grid: { top: "20%", bottom: "12%", left: "15%", right: "10%" },

    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(0,0,0,0.6)",
      textStyle: { color: "#fff" },
    },

    legend: config.isShowLegend
      ? {
          data: legendNames,
          top: "1%",
          left: "right",
          itemWidth: countFontsize(14),
          itemHeight: countFontsize(14),
          textStyle: { color: "#fff" },
          icon: "circle",
        }
      : { show: false },

    xAxis: {
      data: xData,
      axisLine: { lineStyle: { color: "#01FCE3" } },
      axisTick: { show: false },
      axisLabel: { color: "rgba(173, 187, 231, 1)", fontSize: countFontsize(14) },
    },

    yAxis: [
      {
        type: "value",
        name: unit,
        nameTextStyle: { color: "#fff" },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#fff" } },
        axisLabel: { color: "#fff" },
      },
      {
        type: "value",
        position: "right",
        splitLine: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { formatter: "{value} %", color: "#fff" },
      },
    ],

    series,
  };
};
