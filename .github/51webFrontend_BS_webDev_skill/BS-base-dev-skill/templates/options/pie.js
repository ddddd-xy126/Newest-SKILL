import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";


//基本饼图
export const baseBarOption = (data, name, image = false, isDefault = false) => {
  //默认数据
  if (isDefault) {
    const defaultData = {
        name: "默认数据",
        data: [
          { value: 10, name: "默认1" },
          { value: 10, name: "默认2" },
        ],
      };
    data = defaultData.data;
    name = defaultData.name;
  }


  //配置渐变颜色
  // data.forEach((e) => {
  //   e["itemStyle"] = {
  //     color: {
  //       type: "linear",
  //       x: 0,
  //       y: 0,
  //       x2: 0,
  //       y2: 1,
  //       colorStops: [
  //         {
  //           offset: 0,
  //           color: "rgba(52,67,60,0.2)", // 0% 处的颜色
  //         },
  //         {
  //           offset: 1,
  //           color: "rgba(255,112,85,1)", // 100% 处的颜色
  //         },
  //       ],
  //       global: false, // 缺省为 false
  //     },
  //   };
  // });

  return {
    backgroundColor: "",
    color: ["#EA644B", "#1D91E4", "#1474EF", "#C5D4DB", "#66DBEC"],
    tooltip: {
      trigger: "item",
    },
    legend: {
      // top: "5%",
      // left: "center",
      type: "scroll",
      orient: "vertical",
      right: "10",
      y: "center",
      icon: "circle",
      textStyle: {
        //图例文字的样式
        color: "#fff",
        fontSize: 16,
      },
      // padding:[0,0,30,0],
    },
    //插入饼图中间的图片，非必须
    graphic: {
      elements: [
        {
          type: "image",
          style: {
            image: image, //你的图片地址
            width: 60,
            height: 60,
          },
          left: "26%",
          top: "34%",
        },
      ],
    },

    series: [
      {
        name: name,
        type: "pie",
        //内外层占比
        radius: ["86%", "96%"],
        // 调整饼图位置
        center: ["35%", "50%"],
        //模块间隙
        padAngle: 4,

        //项线文字
        label: {
          show: false,
          position: "center",
        },
        //项线条样式
        labelLine: {
          show: false, //可以为false
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)",
          },
          smooth: 0.2,
          length: 10,
          length2: 20,
        },

        data: data,
        // roseType: "radius",
        itemStyle: {
          borderRadius: 5,

          //饼图中心高亮
          shadowBlur: 200,
          shadowColor: "rgba(255, 255, 0, 0.2)",
        },
      },
    ],
  };
};

//两个宽度不一的饼图组合(仅使用于两个数据)
export const diffBarOption = (data, subtext, text, isDefault = false) => {
  if (isDefault) {
    const defaultData = {
        name: "默认数据",
        text: "默认数据",
        subtext: "默认数据sub",
        data: [
          { value: 10, name: "默认1" },
          { value: 10, name: "默认2" },
        ],
      };
    data = defaultData.data;
    subtext = defaultData.subtext;
    text = defaultData.text;
  }


  const option = {
    backgroundColor: "",
    title: {
      text: text,
      subtext: subtext,
      x: "center",
      y: "center",
      textStyle: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "normal",
      },
      subtextStyle: {
        color: "rgba(255,255,255,.45)",
        fontSize: 14,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {d}%",
    },
    // legend: {
    //   x: "center",
    //   y: "bottom",
    // },
    calculable: true,
    series: [
      {
        name: data[0].name,
        type: "pie",
        radius: [100, 130],
        center: ["50%", "50%"],
        data: [
          {
            value: data[0].value,
            name: data[0].name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#f6e3a1",
                },
                {
                  offset: 1,
                  color: "#ff4236",
                },
              ]),
            },
            label: {
              color: "rgba(255,255,255,.45)",
              fontSize: 14,
              // formatter: "完成梳理部门\n{a|34}个",
              rich: {
                a: {
                  color: "#fff",
                  fontSize: 20,
                  lineHeight: 30,
                },
              },
            },
          },
          {
            value: data[1].value,
            name: "",
            itemStyle: {
              color: "transparent",
            },
          },
        ],
      },
      {
        name: data[1].name,
        type: "pie",
        radius: [110, 120],
        center: ["50%", "50%"],
        data: [
          {
            value: data[0].value,
            name: "",
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: data[1].value,
            name: data[1].name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#348fe6",
                },
                {
                  offset: 1,
                  color: "#625bef",
                },
              ]),
            },
            label: {
              color: "rgba(255,255,255,.45)",
              fontSize: 14,
              // formatter: "{b}",
              rich: {
                a: {
                  color: "#fff",
                  fontSize: 20,
                  lineHeight: 30,
                },
              },
            },
          },
        ],
      },
    ],
  };

  return option;
};

//两个宽度不一的饼图组合(仅使用于两个数据)
export const roseBarOption = (data, subtext, text) => {
  const option = {
    backgroundColor: "",
    title: {
      text: text,
      subtext: subtext,
      x: "center",
      y: "center",
      textStyle: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "normal",
      },
      subtextStyle: {
        color: "rgba(255,255,255,.45)",
        fontSize: 14,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {d}%",
    },
    calculable: true,
    series: [
      {
        name: data[0].name,
        type: "pie",
        radius: [100, 130],
        roseType: "area",
        center: ["50%", "50%"],
        data: [
          {
            value: data[0].value,
            name: data[0].name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#f6e3a1",
                },
                {
                  offset: 1,
                  color: "#ff4236",
                },
              ]),
            },
            label: {
              color: "rgba(255,255,255,.45)",
              fontSize: 14,
              // formatter: "完成梳理部门\n{a|34}个",
              rich: {
                a: {
                  color: "#fff",
                  fontSize: 20,
                  lineHeight: 30,
                },
              },
            },
          },
          {
            value: data[1].value,
            name: data[1].name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#302F44",
                },
                {
                  offset: 1,
                  color: "#0782D8",
                },
              ]),
            },
            label: {
              color: "rgba(255,255,255,.45)",
              fontSize: 14,
              // formatter: "完成梳理部门\n{a|34}个",
              rich: {
                a: {
                  color: "#fff",
                  fontSize: 20,
                  lineHeight: 30,
                },
              },
            },
          },
        ],
      },
    ],
  };

  return option;
};

//两个直径不同的饼图嵌套,需两组数据，可同可不同
export const doubleBarOption = (
  data,
  name,
  image = false,
  isDefault = false
) => {
  if (isDefault) {
    const defaultData = {
        name: "默认数据",
        data: [
          { value: 10, name: "默认1" },
          { value: 10, name: "默认2" },
        ],
      };
    data = defaultData.data;
    name = defaultData.name;
  }


  const outColorList = ["#68DBED", "#485DD4", "#C9D6DB", "#2496DF", "#6EBD78"];
  const innerColorList = [
    "#68DBED70",
    "#485DD470",
    "#C9D6DB70",
    "#2496DF70",
    "#6EBD7870",
  ];

  const option = {
    backgroundColor: "",
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      // top: "5%",
      // left: "center",
      type: "scroll",
      orient: "vertical",
      right: "10",
      y: "center",
      icon: "circle",
      textStyle: {
        //图例文字的样式
        color: "#fff",
        fontSize: 16,
      },
      padding: [0, 100, 0, 0],
      //图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
      itemGap: 20,
    },
    //插入饼图中间的图片，非必须
    graphic: {
      elements: [
        {
          type: "image",
          style: {
            image: image, //你的图片地址
            width: 60,
            height: 60,
          },
          left: "30.5%",
          top: "39%",
        },
      ],
    },
    series: [
      // 外圈
      {
        name: name,
        type: "pie",
        // selectedMode: 'single',
        radius: ["52%", "60%"],
        center: ["35%", "50%"],
        labelLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.3)",
          },
          smooth: 0,
          length: 20,
          length2: 60,
        },

        data: data.map((e, i) => {
          return {
            ...e,
            itemStyle: {
              color: outColorList[i],
            },
            label: {
              fontSize: 16,
              lineHeight: 28,
              formatter: "{c|{c}} 次 \n {b|{b}}",
              padding: [0, -50, 0, -50],
              //取消文字描边
              textBorderColor: "inherit",
              color: "#ffffff88",
              //文本水平对齐
              align: "center",
              //富文本样式
              rich: {
                c: {
                  color: "#73DBEE",
                  fontSize: 18,
                  fontWeight: 600,
                },
                b: {
                  color: "#ffffff88",
                },
              },
            },
          };
        }),
      },
      // 内圈
      {
        name: name,
        type: "pie",
        // selectedMode: 'single',
        center: ["35%", "50%"],
        radius: ["42%", "52%"],

        label: {
          show: false,
          // position: 'inner',
          // fontSize: 14
        },
        labelLine: {
          show: false,
        },
        data: data.map((e, i) => {
          return {
            ...e,
            itemStyle: {
              color: innerColorList[i],
            },
          };
        }),
      },
    ],
  };

  return option;
};

//三个直径不同的饼图嵌套
export const tripleRingOption = (data, name, colors, isDefault = false) => {
  if (isDefault) {
    const defaultData = {
        text: "三层环形嵌套",
        data: [
          {
            label: "外层",
            percent: "65.8%",
          },
          {
            label: "中层",
            percent: "30.0%",
          },
          {
            label: "内层",
            percent: "15.0%",
          },
        ],
      };
    data = defaultData.data;
    name = defaultData.text;
  }


  const radiusList = [
    //内半径 外半径
    ["50%", "60%"],
    ["40%", "50%"],
    ["30%", "40%"],
  ];

  //每个series对应一个环形
  const series = data.map((item, index) => {
    //分离数值和百分号
    const percent = Number(item.percent.replace("%", ""));
    return {
      name: item.label,
      type: "pie",
      radius: radiusList[index],
      center: ["40%", "50%"],
      label: { show: false },
      labelLine: { show: false },
      startAngle: 30, // 开始角度
      clockwise: false, //倒时针
      data: [
        {
          value: percent,
          name: item.label,
          itemStyle: { color: colors[item.label] },
        },
        {
          show: false,
          value: 100 - percent,
          name: "剩余",
          itemStyle: {
            color:
              index === 1
                ? "rgba(243, 243, 245, 0.2)"
                : "rgba(243, 243, 245, 0.15)",
          },
        },
      ],
    };
  });

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c}%",
    },
    legend: {
      orient: "vertical",
      right: 100,
      top: "center",
      itemGap: 20,
      icon: "circle",
      data: data.map((e) => ({
        name: e.label,
        icon: "circle",
        itemStyle: { color: colors[e.label] },
      })),
      formatter: function (name) {
        const item = data.find((e) => e.label === name);
        const num = item.percent.split("%")[0];
        return `{label|${name}}{value|${num}}{percent|%}`;
      },
      textStyle: {
        color: "#fff",
        fontSize: 16,
        rich: {
          // 标签
          label: {
            fontSize: 16,
            color: "#fff",
            width: 60,
            align: "left",
          },
          // 数值
          value: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#fff",
            width: 45,
            align: "right",
          },
          // % 百分比
          percent: {
            fontSize: 16,
            fontWeight: "normal",
            color: "#fff",
            width: 15,
            align: "left",
          },
        },
      },
    },
    series,
  };
};

/*
环形图配置
title: 标题
centerData: 中心显示的数据 { value: 总数值, label: 总数标签 }
seriesData: 环形图数据 [{ name: '名称', value: 数值, color: '颜色' }]
isDefault: 是否使用默认数据
*/
export const ringPieOption = (data, isDefault = false) => {
  if (isDefault) {
    const defaultData = {
        totalValue: 2103,
        totalLabel: '学生总数',
        categoryData: [
          { name: '专科生', value: 566 },
          { name: '本科生', value: 1387 },
          { name: '研究生', value: 100 },
          { name: '留学生', value: 50 }
        ]
      };
    data = defaultData;
  }

  // 定义默认颜色
  const defaultRingPieColors = ['117, 224, 253', '88, 178, 251', '250, 225, 72', '254, 191, 109', '38, 235, 169', '15, 29, 230', '252, 82, 167', '154, 96, 180'];

  // 为数据添加颜色
  const processedSeriesData = data.categoryData.map((item, index) => ({
    ...item,
    itemStyle: {
      color: `rgba(${
        defaultRingPieColors[index % defaultRingPieColors.length]
      })`,
    },
  }));
  return {
    backgroundColor: "",
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "42%",
        style: {
          text: data.totalLabel,
          textAlign: "center",
          fill: "#ffffff",
          fontSize: 25,
        },
      },
      {
        type: "text",
        left: "center",
        top: "54%",
        style: {
          text: data.totalValue,
          textAlign: "center",
          fill: "#59b2fb",
          fontSize: 27,
          fontWeight: "bold",
        },
      },
    ],
    series: [
      {
        name: "学生分布",
        type: "pie",
        radius: ["60%", "68%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 6,
          shadowBlur: 200,
          shadowColor: "rgba(255, 255, 0, 0.2)",
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },

        data: processedSeriesData,
      },
    ],
  };
};

export function setOption(datalist, itemColor, image) {
  return {
    color: itemColor,
    title: {
      text: datalist.total,
      subtext: datalist.text,
      left: "44%",
      top: "26%",
      textAlign: "center",
      textStyle: {
        fontSize: "1.2rem",
        color: "#C0DCE7",
        fontWeight: "normal",
        margin: [5, 0, 0, 0],
      },
      subtextStyle: {
        fontSize: "1.2rem",
        color: "#C0DCE7",
      },
    },
    graphic: {
      elements: [
        {
          type: "image",
          style: {
            image: image[0], //你的图片地址
            width: 60,
            height: 60,
          },
          left: "37%",
          top: "10%",
        },
        {
          type: "image",
          style: {
            image: image[1], //你的图片地址
            width: 135,
            height: 135,
          },
          left: "26.5%",
          top: "7%",
        },
      ],
    },
    tooltip: {
      show: false,
    },
    legend: {
      orient: "vertical",
      top: "55%",
      left: "center",
      icon: "circle",
      itemWidth: 5,
      data: datalist.data.map((item, index) => ({
        name: item.name,
        itemStyle: {
          color: itemColor[index],
          borderColor: `${itemColor[index]}60`,
          borderWidth: 5,
          borderType: "solid",
        },
      })),
      formatter: function (name) {
        const item = datalist.data.find((i) => i.name === name);
        if (item) {
          // 使用 rich 分别设置名称和百分比的样式
          return `{name|${name}} {percent|${item.percent}} {symbol|%}`;
        }
        return name;
      },
      textStyle: {
        rich: {
          symbol: {
            fontSize: "1.2rem",
            color: "#C0DCE7 ", // 名称颜色
          },
          name: {
            color: "#C0DCE7 ", // 名称颜色
            fontSize: "1.2rem", // 名称字体大小
            width: 250,
            padding: [5, 0, 0, 3],
          },
          percent: {
            color: "#ffffffff", // 百分比颜色（金色）
            fontSize: "1.2rem", // 百分比字体大小
            align: "right", // 右对齐
            fontWeight: "bold",
            padding: [5, 0, 0, 0],
          },
        },
      },
      itemGap: 20,
    },
    series: [
      {
        name: datalist.text,
        type: "pie",
        center: ["45%", "25%"],
        radius: ["40%", "45%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        startAngle: 90,
        itemStyle: {
          borderRadius: 10,
          borderWidth: 0,
        },
        label: {
          position: "center",
          show: false,
          // formatter: "{b}: {d}%", // 标签显示为"名称: 百分比"
          fontSize: 0,
          color: "#FFFFFF",
        },
        labelLine: {
          show: false,
        },
        data: datalist.data.map((item) => ({
          value: item.percent,
          name: item.name,
        })),
      },
    ],
  };
}

// 动态渐变饼图
export const gradientPieOption = (
  data, // 数据数组，格式：[{name: '名称', value: 数值}]
  colors = ["#80BCF3", "#8DFF75", "#6EFBE8"], // 颜色数组
  config = {}
) => {
  // 默认配置项
  const defaultConfig = {
    title: "接入数量",
    subtitle: "",
    center: countFontsize(["50%", "50%"]),
    radius: [114, 132],
    showLegend: false,
    showCenterLabel: true,
    imgs: null, // 图片映射对象
    subImgs: null, // 子图片映射对象
  };

  // 合并配置
  const finalConfig = { ...defaultConfig, ...config };

  // 线性渐变坐标计算函数：将饼图扇区的起始和结束角度转换为坐标差值，用于确定渐变方向
  function getCoordinates(startArc, endArc) {
    const posi = [
      Math.sin(startArc), // 起始角度的 x 坐标
      -Math.cos(startArc), // 起始角度的 y 坐标 (负号是因为坐标系转换)
      Math.sin(endArc), // 结束角度的 x 坐标
      -Math.cos(endArc), // 结束角度的 y 坐标
    ];
    const dx = posi[2] - posi[0]; // x 方向的差值
    const dy = posi[3] - posi[1]; // y 方向的差值

    return getLocation(dx, dy);
  }

  function getLocation(dx, dy) {
    const tanV = dx / dy; // 计算斜率
    const directSign = Math.abs(tanV) < 1; // 判断主方向是水平还是垂直
    const t = directSign ? tanV : 1 / tanV; // 根据主方向选择参数

    const sign1 = t > 0 ? 1 : -1; // 判断方向符号
    const sign2 = dx > 0 ? 1 : -1; // 判断 x 方向符号
    const sign = directSign ? sign1 * sign2 : sign2;

    const group1 = [0.5 - (sign * t) / 2, 0.5 + (sign * t) / 2]; // 计算坐标组1
    const group2 = sign > 0 ? [0, 1] : [1, 0]; // 计算坐标组2
    const group = [...group1, ...group2];
    const keys = directSign ? ["x", "x2", "y", "y2"] : ["y", "y2", "x", "x2"];

    const res = {};
    keys.forEach((k, idx) => {
      res[k] = group[idx]; // 组装最终的渐变坐标对象
    });
    return res;
  }

  // 创建透明度处理函数
  function addAlpha(color, alpha) {
    // 处理十六进制颜色
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // 如果已经是rgba格式，直接返回
    return color;
  }

  // 计算总和
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].value;
  }

  // 生成带渐变的数据
  const gradientData = [];
  let startArc = 0;
  let endArc = 0;

  // 生成带渐变的数据
  for (let i = 0; i < data.length; i++) {
    const percent = data[i].value / sum; // 计算当前扇区占比
    startArc = endArc; // 当前扇区起始角度
    endArc = startArc + 2 * Math.PI * percent; // 当前扇区结束角度

    const coordinates = getCoordinates(startArc, endArc); // 计算渐变坐标

    gradientData.push({
      value: data[i].value,
      name: data[i].name,
      itemStyle: {
        color: {
          ...coordinates, // 渐变坐标 {x, y, x2, y2}
          type: "linear", // 线性渐变
          global: false, // 相对于当前图形元素
          colorStops: [
            {
              offset: 0,
              color: addAlpha(colors[i % colors.length], 1), // 起始颜色，不透明
            },
            {
              offset: 1,
              color: addAlpha(colors[i % colors.length], 0), // 结束颜色，完全透明
            },
          ],
        },
      },
    });
  }

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      show: true,
      formatter: "{b}：{d}%",
      backgroundColor: "rgba(118, 162, 204, 0.09)",
      borderColor: "rgba(255,255,255,0.5)",
      textStyle: {
        color: "#fff",
        fontSize: countFontsize(14),
      },
    },
    // 中心图片
    graphic:
      finalConfig.imgs && finalConfig.subImgs
        ? [
            {
              type: "image",
              style: {
                image: require("@/assets/images/zhaf/1-centerImg.png"),
                width: countFontsize(210),
                height: countFontsize(210),
              },
              left: finalConfig.showLegend ? "15%" : "center",
              top: "23%",
              z: -1,
            },
            {
              type: "image",
              style: {
                image:
                  finalConfig.imgs[finalConfig.title] ||
                  finalConfig.subImgs[finalConfig.title],
                width: countFontsize(72),
                height: countFontsize(72),
              },
              left: finalConfig.showLegend ? "26%" : "center",
              top: "28%",
            },
          ]
        : [],
    // 图例
    legend: finalConfig.showLegend
      ? {
          show: true,
          type: "scroll",
          orient: "vertical",
          right: finalConfig.showLegend ? "20%" : "10",
          y: "center",
          icon: "circle",
          itemWidth: countFontsize(10),
          itemHeight: countFontsize(10),
          textStyle: {
            color: "#fff",
            fontSize: countFontsize(25),
            padding: [0, 0, 0, countFontsize(15)],
          },
          data: data.map((item, index) => ({
            name: item.name,
            itemStyle: {
              color: colors[index % colors.length],
              borderColor: `${colors[index]}60`,
              borderWidth: 6,
              borderType: "solid",
            },
          })),
        }
      : { show: false },
    series: [
      {
        name: finalConfig.title,
        type: "pie",
        center: finalConfig.center,
        radius: finalConfig.radius.map((r) =>
          countFontsize ? countFontsize(r) : r
        ),
        label: finalConfig.showCenterLabel
          ? {
              show: true,
              position: "center", // 必须保留，否则会在每个扇区显示标签
              formatter: `{val|${sum}}\n{name|${finalConfig.title}}`,
              color: "#ffffff",
              offset: [0, countFontsize(30)], // 控制垂直偏移
              textStyle: {
                rich: {
                  name: {
                    fontSize: countFontsize(32),
                    fontWeight: 400,
                    color: "rgba(255,255,255,1)",
                  },
                  val: {
                    fontSize: countFontsize(40),
                    color: "rgba(255,255,255,1)",
                    padding: [0, 0, countFontsize(10), 0],
                  },
                },
              },
            }
          : { show: false },
        labelLine: {
          show: false,
        },
        data: gradientData,
      },
    ],
  };

  return option;
};

// 带折线的饼图
export function pieLeadOption(
  totalData, // 中心总数据对象 { text: '总标签', total: '总数值', data: [...], unit: '单位' }
  colorsMap, // 颜色映射对象
  imgs, // 中心图片
  legendPosition = "right", // top | right | bottom
  {
    centerBgOffset = { left: null, top: null }, // 中心背景图位置（参数可选）
    centerBgSize = null, // 中心背景图大小（参数可选）
    pieCenterOffset = null, // 饼图中心位置（参数可选）
    centerIcon = null, // 如果要加中心小图标，这里可加
    centerTitleOffset = { left: null, top: null }, // 中心标题位置（参数可选）
  } = {},
  isShowpercent = true, // 是否显示百分比
  isShowLabelLine = false, // 是否显示引导线
  centerImg = null // 中心背景图
) {
  const { text, total, data, unit } = totalData;

  // 中心文字内容
  const title = total ? `{a|${total}}\n{b|${text}}` : `{b|${text}}`;

  // -------- 图例位置 --------
  let legend = {};

  if (legendPosition === "top") {
    legend = {
      show: true,
      orient: "horizontal",
      top: 0,
      left: "center",
      icon: "circle",
      itemWidth: countFontsize(16),
      itemHeight: countFontsize(16),
      formatter: (name) => name,
      data: data.map((item) => ({
        name: item.name,
        itemStyle: { color: colorsMap[item.name] },
      })),
      textStyle: { fontSize: countFontsize(24), color: fontColor(0.8) },
    };
  } else if (legendPosition === "right") {
    legend = {
      show: true,
      orient: "vertical",
      right: "2%",
      top: "center",
      icon: "circle",
      itemWidth: countFontsize(24),
      itemHeight: countFontsize(24),
      itemGap: countFontsize(20),
      formatter(name) {
        const item = data.find((d) => d.name === name);
        return `{name|${name}} \n {value|${item.value}${unit || ""}}`;
      },
      data: data.map((item) => ({
        name: item.name,
        itemStyle: { color: colorsMap[item.name] },
      })),
      textStyle: {
        rich: {
          name: {
            fontSize: countFontsize(32),
            color: fontColor(0.6),
            padding: [
              countFontsize(60),
              0,
              countFontsize(20),
              countFontsize(10),
            ],
          },
          value: {
            fontSize: countFontsize(35),
            color: "#fff",
            fontWeight: "bold",
          },
        },
      },
    };
  } else if (legendPosition === "bottom") {
    legend = {
      show: true,
      orient: "horizontal",
      bottom: "5%",
      left: "20%",
      icon: "circle",
      itemWidth: countFontsize(14),
      itemHeight: countFontsize(14),
      itemGap: countFontsize(25),
      formatter(name) {
        const item = data.find((d) => d.name === name);
        return `{a|${name}}：{b|${item.value}${unit || ""}}`;
      },
      data: data.map((item) => ({
        name: item.name,
        itemStyle: { color: colorsMap[item.name] },
      })),
      textStyle: {
        rich: {
          a: {
            fontSize: countFontsize(24),
            color: fontColor(0.6),
            width: countFontsize(50),
            align: "left",
          },
          b: {
            fontSize: countFontsize(28),
            color: "#fff",
            fontWeight: "bold",
            width: countFontsize(50),
            align: "right",
            padding: [0, 0, 0, countFontsize(8)],
          },
        },
      },
    };
  }

  // -------- 系列数据 --------
  const seriesData = data.map((item) => ({
    name: item.name,
    value: item.percent,
    itemStyle: { color: colorsMap[item.name] },
  }));

  return {
    backgroundColor: "transparent",

    // 中心文字
    title: {
      text: title,
      left: centerTitleOffset.left,
      top: centerTitleOffset.top,
      textAlign: "center",
      textStyle: {
        rich: {
          a: {
            fontSize:countFontsize(centerTitleOffset.titleSize),
            fontWeight: "bold",
            color: fontColor(1),
          },
          b: {
            fontSize: countFontsize(centerTitleOffset.subtitleSize),
            color: fontColor(0.6),
          },
        },
      },
    },

    // 中心背景图 + 中心小图标（位置可传参）
    graphic: [
      {
        type: "image",
        style: {
          image: centerImg ? centerImg : require("@images/ZN_GC/pie-bg1.png"),
          width: centerBgSize
            ? countFontsize(centerBgSize.width)
            : countFontsize(152),
          height: centerBgSize
            ? countFontsize(centerBgSize.height)
            : countFontsize(152),
        },
        left: centerBgOffset.left,
        top: centerBgOffset.top,
        z: -1,
      },
      centerIcon && {
        type: "image",
        style: {
          image: centerIcon,
          width: countFontsize(64),
          height: countFontsize(64),
        },
        left: centerBgOffset.left,
        top: countFontsize(centerBgOffset.top ? centerBgOffset.top : titleTop),
      },
    ].filter(Boolean),

    legend,

    series: [
      {
        name: text,
        type: "pie",
        radius: ["53%", "45%"],
        center: pieCenterOffset,
        clockwise: true,
        startAngle: 90,
        label: isShowpercent
          ? {
              show: true,
              formatter: (p) => `{p|${p.percent}%}`,
              rich: {
                p: {
                  fontSize: countFontsize(25),
                  fontWeight: "bold",
                  color: "inherit",
                },
              },
            }
          : { show: false },
        labelLine: isShowLabelLine
          ? {
              show: true,
              length: countFontsize(56),
              length2: countFontsize(50),
              maxSurfaceAngle: 80,
              // lineStyle: {
              //   // color: fontColor(0.5),
              //   color: "inherit",
              // },
            }
          : { show: false },
        data: seriesData,
      },
    ],
  };
}
