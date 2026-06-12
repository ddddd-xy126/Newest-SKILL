import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";

const DEFAULT_LINE_COLORS = ['#00E5FF', '#FFCA28', '#69F0AE', '#FF6E40', '#AB47BC', '#26C6DA'];

//基础折线图
export const baseLineOption = (xData, yData, colors = null, unit = '') => {
  const ySettings = {
    type: 'value',
  }

  yData = yData.map((e, i) => {
    return {
      ...e,
      color: !!colors ? colors[i] : e.color || DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length],
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
        color: fontColor(0.8),
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
        color: fontColor(0.8),
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
export const smoothLineOption = (xData, yData, ySet = null, colors = null, unit = '', isStack = false) => {
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
      color: !!colors ? colors[i] : group.color || DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length],
    }
  });
  yData = yData.map((e, i) => {
    return {
      ...e,
      color: !!colors ? colors[i] : e.color || DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length],
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
        color: fontColor(0.8),
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
        color: fontColor(0.8),
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

// 峰值折线图
export const largeAreaLineOption = (
  xData = [],
  yData = [],
  ySet = null,
  showLabel = false,// 是否显示数据点标签
  peakConfig = { enable: false ,amplitude:1.5,density:15} // 峰值配置
) => {
  if (!xData?.length || !yData?.length) return {};

  // 取第一个系列
  const group = yData[0];
  const color = group.color || "#00E5FF";

  let finalYData = group.data;
  let finalXData = xData;

  if (peakConfig?.enable) {
    const origin = group.data;
    const originX = xData;
    const peakYData = [];
    const peakXData = [];

    const amplitude = peakConfig.amplitude ?? 1.5; // 随机波动幅度
    const maxY = ySet?.max ?? Infinity;
    const minY = ySet?.min ?? 0;
    const density = peakConfig.density ?? 15; // 每两个原始点之间插入的点数

    for (let i = 0; i < origin.length; i++) {
      const currentValue = origin[i];
      const nextValue = origin[i + 1] ?? currentValue;
      
      // 添加当前原始数据点（带随机波动）
      const noise = (Math.random() - 0.5) * amplitude * 2;
      let value = currentValue + noise;
      value = Math.max(minY, Math.min(maxY, value));
      peakYData.push(Number(value.toFixed(2)));
      peakXData.push(originX[i]); // 保留原始时间标签

      // 如果不是最后一个点，在当前点和下一个点之间插入密集数据
      if (i < origin.length - 1) {
        for (let j = 1; j <= density; j++) {
          // 线性插值比例
          const ratio = j / (density + 1);
          
          // 基础插值值（线性过渡）
          const baseValue = currentValue + (nextValue - currentValue) * ratio;
          
          // 添加随机波动模拟峰值效果
          const randomNoise = (Math.random() - 0.5) * amplitude * 1.5;
          let interpolatedValue = baseValue + randomNoise;
          
          // 限制在 y 轴范围内
          interpolatedValue = Math.max(minY, Math.min(maxY, interpolatedValue));
          
          peakYData.push(Number(interpolatedValue.toFixed(2)));
          
          // 插值点重复使用当前原始标签（后续通过 interval 控制显示）
          peakXData.push(originX[i]);
        }
      }
    }

    finalYData = peakYData;
    finalXData = peakXData;
  }

  // y轴设置
  let ySettings = {};
  if (ySet) {
    ySettings = {
      type: "value",
      min: ySet.min ?? null,
      max: ySet.max ?? null,
      interval: ySet.interval ?? null,
    };
  }

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color,
          width: countFontsize(1),
          opacity: 0.5,
        },
      },
    },
    grid: {
      top: "10%",
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: finalXData,
      axisLine: {
        lineStyle: { color: "#6C7A89", width: 1 },
      },
      axisTick: { show: false },
      axisLabel: {
        color: "#EAF6FF",
        fontSize: countFontsize(20),
        margin: 10,
        // 启用峰值模式时，通过 interval 控制只在原始数据点位置显示标签
        interval: peakConfig?.enable ? (peakConfig.density ?? 15) : 0,
        showMaxLabel: true,
        showMinLabel: true,
      },
    },
    yAxis: {
      ...ySettings,
      boundaryGap: [0, "100%"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#EAF6FF",
        fontSize: countFontsize(20),
      },
      splitLine: { show: false },
    },
    series: [
      {
        name: peakConfig?.enable
          ? `${group.name || "数据"}-区间峰值`
          : group.name || "峰值趋势",
        type: "line",
        symbol: showLabel ? "circle" : "none",
        symbolSize: showLabel ? countFontsize(5) : 0,
        smooth: peakConfig?.enable ? true : false, // 峰值模式下使用平滑曲线
        sampling: "lttb",
        itemStyle: { color },
        lineStyle: {
          width: countFontsize(1.5),
          color,
          shadowColor: color + "60",
          shadowBlur: 6,
        },
        label: showLabel
          ? {
              show: true,
              position: "top",
              color: "#fff",
              fontSize: countFontsize(12),
            }
          : { show: false },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color + "AA" },
            { offset: 1, color: color + "00" },
          ]),
        },
        data: finalYData,
      },
    ],
  };
};
