import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";


//基础折线图
//描述：一个最基础的可自定义节点颜色和折线颜色的折线图
//编号：wxy-line-250708
export const baseLineOption = (title) => {
  const option = {
    backgroundColor: "",
    title: {
      left: "center", //标题位置
      //   bottom:'bottom',  //left.bottom等控制标题位置
      text: title,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      left: 0, //标签位置
      // bottom:'bottom',  //left.bottom等控制标签位置
      data: ["Email", "Union Ads"],
    },
    //位置
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Email",
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
        // symbol: "triangle",  //节点样式类型
        // symbolSize: 20,

        itemStyle: {
          //节点样式
          borderWidth: 3,
          borderColor: "#EE6666",
          color: "rgb(255, 158, 68)",
        },

        lineStyle: {
          color: "#CC6B55", //线条颜色
          width: 2,
          type: "line", //线条样式   dashed / line
        },
      },
    ],
  };

  return option;
};

// 平滑折线图
/*
ps：当数据只有一条数据，不显示legend，和普通的单折线图一样
*/
export const smoothLineOption = (xData, yData, isDefault = false) => {
  if (isDefault) {
    // const defaultData = defaultSimpleLine();
    const defaultData = {
        xData: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'],
        yData: [
            {
                name: '系列1',
                data: [230, 332, 201, 134, 90, 230, 210, 180]
            },
            {
                name: '系列2',
                data: [320, 232, 201, 234, 190, 330, 310, 280]
            },
            {
                name: '系列3',
                data: [320, 332, 301, 334, 290, 430, 410, 380]
            }
        ]
    };

    const defaultStackLineColorList = [
        '#d3bc77', '#6d9ed8', '#4e97f5'
    ]

    defaultData.yData = defaultData.yData.map((e, i) => {
      return {
        ...e,
        color: defaultStackLineColorList[i],
      };
    });

    xData = defaultData.xData;
    yData = defaultData.yData;
  }


  // y轴设定
  // const ySettings = {
  //   type: 'value',
  //   min: 0,
  //   max: 100,
  //   interval: 25
  // }
  const ySettings = {
    type: "value",
    min: 0,
    max: 1600,
    interval: 400,
  };

  const legendName = yData.map((group) => group.name);
  const series = yData.map((group) => ({
    name: group.name,
    type: "line",
    smooth: true,
    symbol: "circle",
    stack: "total",
    symbolSize: 0,
    data: group.data,
    itemStyle: {
      borderWidth: 3,
      borderColor: group.color,
      color: group.color,
    },
    lineStyle: {
      color: group.color,
      width: 3,
      type: "solid",
    },
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: group.color + "90" },
          { offset: 1, color: "rgba(65, 63, 63, 0)" },
        ],
      },
    },
  }));

  return {
    backgroundColor: "",
    tooltip: { trigger: "axis" },
    grid: { left: "0%", right: "4%", bottom: "0%", containLabel: true },
    ...(legendName.length > 1
      ? {
          legend: {
            data: legendName,
            itemWidth: 5,
            itemHeight: 5,
            right: 0,
            textStyle: {
              fontSize: 18, // 控制legend字体大小
            },
          },
        }
      : {}),
    xAxis: {
      type: "category",
      data: xData,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#505a60",
          width: 2,
        },
      },
      axisLabel: {
        fontSize: 18,
        overflow: "none",
        margin: 16, // 增加与x轴线的距离
      },
      axisTick: { show: false },
    },
    yAxis: {
      ...ySettings,
      axisLine: {
        show: true,
        lineStyle: {
          type: "solid",
          color: "#505a60",
          width: 2,
        },
      },
      axisLabel: {
        fontSize: 18,
        overflow: "none",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#505a60",
        },
      },
    },
    series,
  };
};

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
