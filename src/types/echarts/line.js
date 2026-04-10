// import * as echarts from "echarts";
import { color } from "echarts";
import { defaultSimpleLine, defaultStackLine, defaultStackLineColorList } from "../defaultData.js";
import { countFontsize, fontColor } from "@utils/countFontsize.js";

//基础折线图
export const baseLineOption = (xData, yData, colors = null, unit = '', isDefault = false) => {
  if (isDefault) {
    // const defaultData = defaultSimpleLine();
    const defaultData = defaultStackLine();
    xData = defaultData.xData;
    yData = defaultData.yData;
  }
  const ySettings = {
    type: 'value',
  }

  yData = yData.map((e, i) => {
    return {
      ...e,
      color: !!colors ? colors[i] : e.color || defaultStackLineColorList()[i],
    }
  })

  const legendName = yData.map((group, index) => {
    return {
      name: group.name,
      icon: "circle",
      itemStyle: {
        color: group.color,
        borderColor: 'rgb(223, 223, 223, 0.3)',
        borderWidth: 5
      }
    };
  });

  const series = yData.map(group => ({
    name: group.name,
    type: "line",
    symbol: "circle",
    symbolSize: countFontsize(8),
    stack: "total",
    data: group.data,
    itemStyle: {
      borderWidth: countFontsize(9),
      color: "#fff",
      borderColor: 'rgb(223, 223, 223, 0.3)',
    },
    lineStyle: {
      color: group.color,
      width: countFontsize(4),
      type: "solid"
    },
  }));



  return {
    backgroundColor: "",
    tooltip: { trigger: "axis" },
    grid: { top: unit ? "19%" : "15%", left: "3%", right: "5.2%", bottom: "0%", containLabel: true },
    ...(legendName.length > 1
      ? {
        legend: {
          data: legendName.map((item, index) => {
            return {
              name: item.name,
              itemStyle: {
                color: item.itemStyle.color,
                borderColor: `${item.itemStyle.color}60`,
                borderWidth: countFontsize(10),
                borderType: 'solid',
              }
            }
          }
          ),
          icon: 'circle',
          right: countFontsize(20),
          itemWidth: countFontsize(10),
          itemHeight: countFontsize(10),
          formatter: function (name) {
            const item = legendName.find((d) => d.name === name);
            return `{name|${name}}`;
          },
          textStyle: {
            color: "#fff",
            fontSize: countFontsize(22), // 控制legend字体大小
            rich: {
              name: {
                fontSize: countFontsize(22),
                color: fontColor(0.8),
                padding: [0, 0, 0, countFontsize(1)],
              }
            },
            padding: [countFontsize(3), 0, 0, countFontsize(4)],
          },
        }
      }
      : {}),
    xAxis: {
      type: "category",
      data: xData,
      axisLine: {
        lineStyle: {
          color: "#505a60",
          width: 2
        }
      },
      axisLabel: {
        fontSize: countFontsize(24),
        overflow: "none",
        margin: countFontsize(16) // 增加与x轴线的距离
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#505a60"
        }
      },
      boundaryGap: false,
      axisTick: { show: false },
    },
    yAxis: {
      ...ySettings,
      name: unit,
      nameGap: Math.floor(countFontsize(20)),
      nameLocation: "end",
      nameTextStyle: {
        color: fontColor(0.8),
        fontSize: countFontsize(22),
        fontWeight: 200,
        align: "center",
      },
      axisLabel: {
        fontSize: countFontsize(24),
        overflow: "none"
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#505a60"
        }
      }
    },
    series
  }
}

// 平滑折线图
/*
ps：当数据只有一条数据，不显示legend，和普通的单折线图一样
*/
export const smoothLineOption = (xData, yData, ySet = null, colors = null, unit = '', isDefault = false, isStack = false) => {
  if (isDefault) {
    const defaultData = defaultStackLine();
    defaultData.yData = defaultData.yData.map((e, i) => {
      return {
        ...e,
        color: defaultStackLineColorList()[i]
      }
    })
    xData = defaultData.xData;
    yData = defaultData.yData;
  }


  let ySettings = []
  if (!!ySet) {
    ySettings = {
      type: 'value',
      min: ySet.min,
      max: ySet.max,
      interval: ySet.interval
    }
  }

  const legendName = yData.map((group, i) => {
    return {
      name: group.name,
      color: !!colors ? colors[i] : group.color || defaultStackLineColorList()[i],
    }
  });
  yData = yData.map((e, i) => {
    return {
      ...e,
      color: !!colors ? colors[i] : e.color || defaultStackLineColorList()[i],
    }
  })
  const series = yData.map(group => {
    let obj = {
      name: group.name,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 0,
      data: group.data,
      itemStyle: {
        borderWidth: 3,
        borderColor: group.color,
        color: group.color
      },
      lineStyle: {
        color: group.color,
        width: 2,
        type: "solid"
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: group.color + "90" },
            { offset: 1, color: group.color + "00" }
          ]
        }
      },
    }
    if (isStack) {
      obj['stack'] = 'total'
    }
    return obj
  });
  // unit
  return {
    backgroundColor: "",
    tooltip: { trigger: "axis" },
    grid: { top: '18%', left: "2%", right: "5.1%", bottom: "0%", containLabel: true },
    ...(legendName.length > 1
      ? {
        legend: {
          data: yData.map((item) => ({
            name: item.name,
            itemStyle: {
              color: item.color,
              borderColor: `${item.color}60`,
              borderWidth: countFontsize(10),
              borderType: 'solid'
            }
          })),
          textStyle: {
            color: "#fff",
            fontSize: countFontsize(20)
          },
          itemWidth: countFontsize(6),
          itemHeight: countFontsize(6),
          right: countFontsize(24),
        }
      }
      : {}),
    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#505a60",
          width: 2
        }
      },
      axisLabel: {
        fontSize: countFontsize(24),
        overflow: "none",
        margin: countFontsize(16) // 增加与x轴线的距离
      },
      axisTick: { show: false },
    },
    yAxis: {
      ...ySettings,
      name: unit,
      nameGap: countFontsize(20),
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
          type: "solid",
          color: "#505a60",
          width: 2
        }
      },
      axisLabel: {
        fontSize: countFontsize(24),
        overflow: "none",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#505a60"
        }
      }
    },
    series
  }
}

// 预测平滑折线图
// wxy-line-20250721
export const predictSmoothLineOption = (xData, yData, ySet, colors = null, unit = '') => {
  const ySettings = {
    type: 'value',
    min: ySet.min,
    max: ySet.max,
    interval: ySet.interval
  }

  yData = yData.map((e, i) => {
    return {
      ...e,
      color: !!colors ? colors[i] : e.color || defaultStackLineColorList()[i],
    }
  })
  // 实际需求量的数据，用于预测需量的数据连接
  let realDemandData = null;

  // 样式配置映射 - 改为按索引顺序配置
  const styleConfigs = [
    // 第一个：实际数据
    {
      lineStyle: {
        color: null, // 将在处理时设置
        width: 2,
        type: "solid"
      },
      hasAreaStyle: true
    },
    // 第二个：预测数据
    {
      lineStyle: {
        color: null,
        width: 1,
        type: "dashed"
      },
      hasAreaStyle: false
    },
    // 第三个：目标数据
    {
      lineStyle: {
        color: null,
        width: 1,
        type: "dashed"
      },
      hasAreaStyle: false
    }
  ];

  // 数据处理函数 - 改为按索引处理
  const processSeriesData = (group, xData, index) => {
    switch (index) {
      case 0: // 实际数据
        realDemandData = group.data;
        return group.data;

      case 1: // 预测数据
        if (!realDemandData) {
          console.warn('实际需量数据未找到，预测需量将独立显示');
          return group.data;
        }
        return realDemandData.concat(group.data);

      case 2: // 目标数据
        return Array(xData.length).fill(group.data);

      default:
        return group.data;
    }
  };

  // 创建渐变区域样式
  const createAreaStyle = (color) => ({
    color: {
      type: "linear",
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: color + "90" },
        { offset: 1, color: color + "00" }
      ]
    }
  });

  const series = yData.map((group, index) => {
    // 获取样式配置 - 根据索引获取
    const config = styleConfigs[index] || styleConfigs[0];

    // 处理数据 - 传入索引
    const data = processSeriesData(group, xData, index);

    // 设置线条样式颜色
    const lineStyle = {
      ...config.lineStyle,
      color: group.color
    };

    const itemStyle = {
      borderWidth: 3,
      color: group.color
    }
    // 构建series对象
    const seriesItem = {
      name: group.name,
      type: "line",
      smooth: true,
      symbol: "none",
      data: data,
      lineStyle: lineStyle,
      itemStyle: itemStyle,
    };

    // 添加区域样式（仅实际需量）
    if (config.hasAreaStyle) {
      seriesItem.areaStyle = createAreaStyle(group.color);
    }

    return seriesItem;
  });

  return {
    backgroundColor: "",
    tooltip: { trigger: "axis" },
    grid: { top: '20%', left: "3%", right: "5%", bottom: "0%", containLabel: true },

    legend: {
      data: yData.map((item) => (
        {
          name: item.name,
          icon: 'rect',
          itemStyle: {
            color: item.color,
          },
        }
      )),
      textStyle: {
        color: "#fff",
        fontSize: countFontsize(20)
      },
      itemWidth: countFontsize(25),
      itemHeight: countFontsize(2),
      right: countFontsize(24),
    },

    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#505a60",
          width: 2
        }
      },
      axisLabel: {
        fontSize: countFontsize(24),
        overflow: "none",
        margin: 16 // 增加与x轴线的距离
      },
      axisTick: { show: false },
    },
    yAxis: {
      ...ySettings,
      name: unit,
      nameGap: Math.floor(countFontsize(20)),
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
          type: "solid",
          color: "#505a60",
          width: 2
        }
      },
      axisLabel: {
        fontSize: countFontsize(24),
        overflow: "none",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#505a60"
        }
      }
    },
    series
  }
}
