import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";



export const gaugeOption = (
  valueOrConfig = {},
  maxValue = 100,
  minvalue = 0,
  unit = "",
  color = ["rgba(147, 255, 214, 0)", "#4DDBA5"],
  isDefault = false
) => {
  // 支持两种调用方式：
  // 1. gaugeOption({ value, maxValue, minvalue, unit, color })
  // 2. gaugeOption(value, maxValue, minvalue, unit)
  let value = 0;
  if (!color) {
    console.log("使用默认颜色", color);
    color = ["rgba(147, 255, 214, 0)", "#4DDBA5"]; // 默认绿色渐变
  }

  if (typeof valueOrConfig === "object") {
    // 传入对象或请求默认数据
    if (isDefault) {
      const defaultData = {
        value: 75,
        max: 100,
        title: "默认进度",
        unit: "%",
      };
      value = defaultData.value;
      maxValue = defaultData.max;
      minvalue = 0;
      unit = defaultData.unit;
    } else {

      const cfg = valueOrConfig || {};
      value = cfg.value ?? 0;
      maxValue = cfg.maxValue ?? maxValue;
      minvalue = cfg.minvalue ?? minvalue;
      unit = cfg.unit ?? unit;
      color = cfg.color ?? ["rgba(147, 255, 214, 0)", "#4DDBA5"];
    }
  } else {
    // 直接传入数值形式
    value = valueOrConfig ?? 0;
  }

  return {
    tooltip: {
      show: false,
    },
    title: {
      show: true,
      textStyle: {
        fontFamily: "Montserrat",
        color: "#C0DBBA",
        fontSize: countFontsize(22),
      },
      text: unit,
      bottom: "18%",
      left: "center",
    },
    graphic: [
      {
        type: "image",
        id: "centerImage",
        style: {
          // 使用 require() 让构建工具（webpack）解析并输出正确的资源路径
          image: require("@/assets/images/nav/icon_2.png"),
          width: countFontsize(32),
          height: countFontsize(32),
        },
        left: "center",
        top: countFontsize(82),
        z: 20,
      },
      {
        type: "circle",
        id: "centerCircle",
        shape: { cx: 0, cy: 0, r: countFontsize(20) },
        style: {
          fill: "rgba(77, 219, 165, 0.1)",
        },
        left: "center",
        top: countFontsize(75),
        z: 1,
      },
    ],
    series: [
      {
        type: "gauge",
        center: ["50%", "50%"],
        radius: "94%",
        startAngle: 200,
        endAngle: -20,
        splitNumber: 36,
        pointer: {
          show: false,
        },
        detail: {
          show: false,
        },
        title: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          length: countFontsize(2),
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)",
            width: countFontsize(2),
            cap: "round",
            type: "dashed",
            dashOffset: countFontsize(4),
            join: "round",
          },
        },
        axisLabel: {
          show: false,
        },
        animationDuration: 400,
      },
      {
        name: "Gauge",
        type: "gauge",
        center: ["50%", "50%"],
        z: 2,
        radius: "85%",
        startAngle: 200,
        endAngle: -20,
        axisLine: {
          roundCap: false,
          lineStyle: {
            color: [
              [
                value / maxValue,
                new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: color[0],
                  },
                  {
                    offset: countFontsize(1),
                    color: color[1],
                  },
                ]),
              ],
              [1, "rgba(255, 255, 255, 0.1)"],
            ],
            fontSize: countFontsize(22),
            width: countFontsize(14),
            opacity: 1,
          },
        },
        min: 0,
        max: maxValue,
        detail: {
          show: true,
          color: "#fff",
          fontFamily: "sans-serif",
          offsetCenter: [0, countFontsize(20)],
          fontSize: countFontsize(50),
        },
        title: {
          show: false,
        },
        data: [value],
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: "rgba(255, 255, 255, 0.6)",
          fontFamily: "Montserrat",
          fontSize: countFontsize(22),
          formatter: function (val) {
            const realValue = minvalue + val * (maxValue - minvalue);

            if (Math.abs(realValue - minvalue) < 1e-6 || val == minvalue) {
              return `${minvalue}\n{a|Inefficient}`;
            } else if (val == maxValue) {
              return `${maxValue}\n{b|Efficient}`;
            } else {
              return null;
            }
          },
          rich: {
            a: {
              align: "right",
              color: "rgba(255, 255, 255, 0.6)",
              padding: [countFontsize(5), 0, 0, 0],
              width: countFontsize(10),
              fontSize: countFontsize(14),
            },
            b: {
              align: "left",
              color: "rgba(255, 255, 255, 0.6)",
              padding: [countFontsize(5), 0, 0, 0],
              width: countFontsize(10),
              fontSize: countFontsize(14),
            },
          },
          distance: -countFontsize(70),
          padding: [countFontsize(32), countFontsize(20), countFontsize(20), countFontsize(24)],
        },
        pointer: {
          show: true,
          length: countFontsize(36),
          icon: "roundRect",
          width: countFontsize(2),
          offsetCenter: [-countFontsize(1), -countFontsize(60)],
          itemStyle: {
            color: color[1], // 指针颜色使用渐变色的结束色
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
  };
}

//圆形进度图表
export const circleProgressOption = (value, max = 100, title = "", unit = "", color = ["#00D4FF", "#0099CC"], isDefault = false) => {

  //默认数据
  if (isDefault) {
    const defaultData = {
        value: 75,
        max: 100,
        title: "默认进度",
        unit: "%",
      };
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
    const defaultData = {
        value: 75,
        max: 100,
        title: "默认进度",
        unit: "%",
      };
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