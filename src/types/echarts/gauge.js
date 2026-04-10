import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js"

import {
  defaultCircleProgressData
} from "../defaultData.js"
import { bottom } from "@antv/g2/lib/shape/label/position/bottom";
import { show } from "@antv/g2/lib/utils/style";


// wxy-gauge-20250716
// 基础环形进度图
export const baseGaugeOption = (optionData, isDefault = false, isShowLegend = true) => {

  //默认数据
  if (isDefault) {
    const defaultData = defaultCircleProgressData();
    value = defaultData.value;
    max = defaultData.max;
    title = defaultData.title;
    unit = defaultData.unit;
  }

  const {
    text,
    data: {
      value,
      total
    },
    color
  } = optionData;
  // 计算百分比
  const percentage = Math.round((value / total) * 100);

  const gaugeData = [
    {
      value: percentage,
    }
  ];

  return {
    backgroundColor: 'transparent',
    legend: {
      show: isShowLegend,
      bottom: '0%',  // 将图例放在底部
      left: 'center',  // 水平居中
      orient: 'horizontal',  // 水平排列
      itemWidth: countFontsize(5),
      itemHeight: countFontsize(5),
      itemGap: countFontsize(20),
      itemStyle: {
        color: color,
        borderColor: `${color}60`,
        borderWidth: countFontsize(10),
        borderType: 'solid'
      },
      formatter: `{text|${text}} {value|${value}}`,
      icon: 'circle',
      align: "left",
      textStyle: {
        color: '#fff',
        fontSize: countFontsize(24),
        rich: {
          text: {
            fontSize: countFontsize(22),
            padding: [0, 0, 0, countFontsize(4)],
          },
          value: {
            fontWeight: "bold",
            fontSize: countFontsize(24),
            color: "#fff",
            padding: [0, 0, 0, countFontsize(6)],
          },
        },
      },
      data: [text]  // 使用传入的text作为图例名称
    },
    series: [
      {
        name: text,
        type: 'gauge',
        radius: '65%',
        center: ['50%', '40%'],
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: false,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: color,
            color: color  // 添加进度条填充颜色
          }
        },
        axisLine: {
          lineStyle: {
            width: countFontsize(12),
          }
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          distance: 50
        },
        data: gaugeData,
        title: {
          fontSize: countFontsize(16)
        },
        detail: {
          width: 25,
          height: 14,
          fontSize: countFontsize(26),
          color: color,
          formatter: '{value}%',
          offsetCenter: ['0%', '0%']  // 将文字居中显示
        }
      }
    ],
    graphic: isShowLegend ? [] : [
      {
        type: 'text',
        left: 'center',
        bottom: '5%',
        style: {
          text: text,
          fontSize: countFontsize(20),
          fontWeight: 'normal',
          fill: '#fff',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        },
      }
    ]
  };
};

// wxy-gauge-20250717
// 带背景图片的环形进度图
export const ImgbgGaugeOption = (optionData, colorsMap, imgs, isDefault = false) => {
  const { text, data, subtext } = optionData;

  // 从data数组中找到对应的值
  const totalItem = data.find(item => item.name === "总次数");
  const executedItem = data.find(item => item.name === "已执行");
  // 计算百分比
  const percentage = ((executedItem.value / totalItem.value) * 100).toFixed(1);


  const gaugeData = [
    {
      value: percentage,
      detail: {
        show: true,
        valueAnimation: true,
        offsetCenter: ['0%', '18%'],
        fontSize: countFontsize(30),
        color: fontColor(1),
        fontWeight: "bold",
        formatter: function (value) {
          return value + '%';
        },
      }
    }
  ];

  return {
    backgroundColor: "transparent",
    title: {
      text: `{a|${text}}`,
      x: "center",
      y: "65%",
      textStyle: {
        lineHeight: countFontsize(22),
        rich: {
          a: {
            fontSize: countFontsize(20),
            fontWeight: "normal",
            color: fontColor(1),
          },
        },
      },
    },
    graphic: [
      {
        type: "image",
        style: {
          image: require("@/assets/images/center-left/1-centerImg.png"),
          width: countFontsize(160),
          height: countFontsize(160),
        },
        left: "center",
        top: "center",
        z: -1,
      },
      {
        type: "image",
        style: {
          image: imgs[subtext],
          width: countFontsize(72),
          height: countFontsize(72),
        },
        left: "center",
        top: "20%",
      },
    ],
    series: [
      {
        name: text,
        type: "gauge",
        min: 0,
        max: 100,
        radius: "80%",
        center: ["50%", "50%"],
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: colorsMap[subtext]
          }
        },
        startAngle: 90,
        endAngle: -270,
        clockwise: true,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 7
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        },
        data: gaugeData,
      },
    ],
  };
};

//圆形进度图表
export const circleProgressOption = (value, max = 100, title = "", unit = "", color = ["#00D4FF", "#0099CC"], isDefault = true) => {

  //默认数据
  if (isDefault) {
    const defaultData = defaultCircleProgressData();
    value = defaultData.value;
    max = defaultData.max;
    title = defaultData.title;
    unit = defaultData.unit;
  }

  // 计算百分比
  const percentage = Math.round((value / max) * 100);

  return {
    backgroundColor: "",
    series: [
      {
        type: "gauge",
        center: ["50%", "50%"],
        radius: "90%",
        min: 0,
        max: max,
        splitNumber: 10,
        startAngle: 90,
        endAngle: -269.9999,

        // 仪表盘轴线
        axisLine: {
          show: true,
          lineStyle: {
            width: 8,
            color: [
              [1, "rgba(255,255,255,0.1)"] // 背景轨道颜色
            ]
          }
        },

        // 分隔线
        splitLine: {
          show: false
        },

        // 刻度标签
        axisLabel: {
          show: false
        },

        // 刻度线
        axisTick: {
          show: false
        },

        // 指针
        pointer: {
          show: false
        },

        // 仪表盘标题
        title: {
          show: false
        },

        // 仪表盘详情
        detail: {
          show: true,
          offsetCenter: [0, 0],
          fontSize: 36,
          fontWeight: "bold",
          color: "#fff",
          formatter: function (value) {
            return value + (unit ? unit : "");
          }
        },

        data: [
          {
            value: value,
            name: title,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: color[0]
                },
                {
                  offset: 1,
                  color: color[1]
                }
              ])
            }
          }
        ]
      },

      // 外圈装饰环
      {
        type: "gauge",
        center: ["50%", "50%"],
        radius: "95%",
        min: 0,
        max: max,
        startAngle: 90,
        endAngle: -269.9999,

        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            color: [
              [value / max, color[0]],
              [1, "rgba(255,255,255,0.05)"]
            ]
          }
        },

        splitLine: {
          show: false
        },

        axisLabel: {
          show: false
        },

        axisTick: {
          show: false
        },

        pointer: {
          show: false
        },

        title: {
          show: false
        },

        detail: {
          show: false
        },

        data: [{
          value: value,
          name: title
        }]
      }
    ]
  };
};

//简化版圆形进度图表
export const simpleCircleProgressOption = (value, max = 100, title = "", unit = "", color = "#00D4FF", isDefault = false) => {

  //默认数据
  if (isDefault) {
    const defaultData = defaultCircleProgressData();
    value = defaultData.value;
    max = defaultData.max;
    title = defaultData.title;
    unit = defaultData.unit;
  }

  return {
    backgroundColor: "",
    series: [
      {
        type: "gauge",
        center: ["50%", "50%"],
        radius: "85%",
        min: 0,
        max: max,
        startAngle: 90,
        endAngle: -269.9999,

        axisLine: {
          show: true,
          lineStyle: {
            width: 6,
            color: [
              [value / max, color],
              [1, "rgba(255,255,255,0.1)"]
            ]
          }
        },

        splitLine: {
          show: false
        },

        axisLabel: {
          show: false
        },

        axisTick: {
          show: false
        },

        pointer: {
          show: false
        },

        title: {
          show: false
        },

        detail: {
          show: true,
          offsetCenter: [0, 0],
          fontSize: 32,
          fontWeight: "bold",
          color: "#fff",
          formatter: function (value) {
            return value + (unit ? unit : "");
          }
        },

        data: [{
          value: value,
          name: title
        }]
      }
    ]
  };
};

