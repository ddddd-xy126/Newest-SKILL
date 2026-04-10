import * as echarts from "echarts";
import {
  defaultBaseBarOptionData,
  defaultDiffBarOptionData,
  defaultRingPieColors,
  defaultRingPieData,
  defaultNestedRingData,
} from "../defaultData.js";

import { countFontsize, fontColor } from "@utils/countFontsize.js";

//基本饼图
export const baseBarOption = (data, name, image = false, isDefault = false) => {
  //默认数据
  if (isDefault) {
    data = defaultBaseBarOptionData().data;
    name = defaultBaseBarOptionData().name;
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
            width: countFontsize(60),
            height: countFontsize(60),
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
    data = defaultBaseBarOptionData().data;
    subtext = defaultBaseBarOptionData().subtext;
    text = defaultBaseBarOptionData().text;
  }

  const option = {
    backgroundColor: "",
    title: {
      text: text,
      subtext: subtext,
      x: "center",
      y: "center",
      textStyle: {
        color: fontColor(),
        fontSize: countFontsize(30),
        fontWeight: "normal",
      },
      subtextStyle: {
        color: fontColor(),
        fontSize: countFontsize(14),
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
    data = defaultBaseBarOptionData().data;
    name = defaultBaseBarOptionData().name;
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
    data = defaultNestedRingData().data;
    name = defaultNestedRingData().name;
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

//中心图片+环形饼图
export function ringPieTotalOption(totalData, colorsMap, imgs) {
  const { text, total, data } = totalData;
  const seriesData = data.map((item) => ({
    name: item.name,
    value: item.value,
    itemStyle: {
      color: colorsMap[item.name],
    },
  }));

  return {
    backgroundColor: "transparent",
    title: {
      text: `{a|${total}}\n\n{b|${text}}`,
      x: "center",
      y: "32%",
      textStyle: {
        lineHeight: countFontsize(22),
        rich: {
          a: {
            fontSize: countFontsize(32),
            fontWeight: "bold",
            color: fontColor(1),
          },
          b: {
            fontSize: countFontsize(22),
            color: fontColor(),
          },
        },
      },
    },
    graphic: [
      {
        type: "image",
        style: {
          image: require("@/assets/images/center-left/1-centerImg.png"),
          width: countFontsize(176),
          height: countFontsize(176),
        },
        left: "center",
        top: "10%",
        z: -1,
      },
      {
        type: "image",
        style: {
          image: imgs[text],
          width: countFontsize(72),
          height: countFontsize(72),
        },
        left: "center",
        top: "13%",
      },
    ],

    legend: {
      orient: "vertical",
      right: "center",
      top: "65%",
      height: "30%",
      data: data.map((item) => ({
        name: item.name,
        itemStyle: {
          color: colorsMap[item.name],
          borderColor: `${colorsMap[item.name]}60`,
          borderWidth: countFontsize(8),
          borderType: "solid",
        },
      })),
      itemWidth: countFontsize(8),
      itemHeight: countFontsize(8),
      itemGap: countFontsize(20),
      textStyle: {
        color: "#fff",
      },
      formatter: function (name) {
        const item = data.find((d) => d.name === name);
        return `{name|${name}} {value|${item.value}}`;
      },
      icon: "circle",
      align: "left",
      textStyle: {
        fontSize: countFontsize(22),
        rich: {
          name: {
            fontSize: countFontsize(22),
            color: fontColor(0.8),
            padding: [0, 0, 0, 0],
          },
          value: {
            fontWeight: "bold",
            fontSize: countFontsize(22),
            color: "#fff",
            padding: [0, 0, 0, countFontsize(1)],
          },
        },
        padding: [countFontsize(3), 0, 0, countFontsize(4)],
      },
    },
    series: [
      {
        name: text,
        type: "pie",
        radius: ["56%", "64%"],
        center: ["50%", "33%"],
        avoidLabelOverlap: false,
        padAngle: 4, // 添加间隔，数值越大间隔越大
        label: {
          show: false,
        },
        clockwise: false,
        startAngle: 140,
        itemStyle: {
          borderRadius: 8,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        labelLine: {
          show: false,
        },
        data: seriesData,
      },
    ],
  };
}

// 带折线的饼图
export function pieLeadOption(totalData, colorsMap, imgs, isShowLegend = true) {
  const { text, total, data, unit } = totalData;
  const title = total ? `{a|${total}}\n\n{b|${text}}` : `{b|${text}}`;
  const top = total ? "54%" : "54%";
  const seriesData = data.map((item) => ({
    name: item.name,
    value: item.percent,
    itemStyle: {
      color: colorsMap[item.name],
    },
  }));
  // console.log(seriesData, "aaaahhhhhhh");
  return {
    backgroundColor: "transparent",
    // 中心文字
    title: {
      text: title,
      left: isShowLegend ? "35%" : "49%", // 与饼图中心一致
      top: top,
      textAlign: "center", // 确保居中
      textStyle: {
        lineHeight: countFontsize(16),
        rich: {
          a: {
            fontSize: countFontsize(32),
            fontWeight: "bold",
            color: fontColor(1),
            align: "center",
          },
          b: {
            fontSize: countFontsize(22),
            color: fontColor(1),
            align: "center",
          },
        },
      },
    },
    // 中心背景图片
    graphic: [
      {
        type: "image",
        style: {
          image: require("@/assets/images/center-left/1-centerImg.png"),
          width: countFontsize(162),
          height: countFontsize(162),
        },
        left: isShowLegend ? "24.2%" : "center",
        top: "center",
        z: -1,
      },
      // 中心logo
      {
        type: "image",
        style: {
          image: imgs[text],
          width: countFontsize(63),
          height: countFontsize(63),
        },
        left: isShowLegend ? "31.5%" : "center",
        top: "31%",
      },
    ],
    // 图例
    legend: {
      show: isShowLegend,
      orient: "vertical",
      right: "center",
      left: "72%",
      top: "center",
      data: data.map((item) => ({
        name: item.name,
        itemStyle: {
          color: colorsMap[item.name],
          borderColor: `${colorsMap[item.name]}30`,
          borderWidth: countFontsize(8),
          borderType: "solid",
        },
      })),
      itemWidth: countFontsize(8),
      itemHeight: countFontsize(8),
      // itemGap: countFontsize(15),
      textStyle: {
        color: fontColor(0.5),
      },
      formatter: function (name) {
        const item = data.find((d) => d.name === name);
        // 数字每三位加逗号
        function formatNumber(num) {
          if (typeof num === "number") num = num.toString();
          return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return `{name|${name}}  ${unit ? "\n" : ""}{value|${formatNumber(
          item.value
        )}}{unit|${unit ? unit : ""}}`;
      },
      icon: "circle",
      align: "left",
      textStyle: {
        fontSize: countFontsize(20),
        rich: {
          name: {
            fontSize: countFontsize(22),
            color: fontColor(0.8),
            padding: unit
              ? [countFontsize(25), 0, countFontsize(10), 0]
              : [0, 0, 0, 0],
          },
          value: {
            fontWeight: "bold",
            fontSize: countFontsize(22),
            color: "#fff",
          },
        },
        // 图例圆圈的位置
        padding: unit
          ? [countFontsize(10), 0, 0, countFontsize(4)]
          : [countFontsize(5), 0, 0, countFontsize(4)],
      },
    },
    series: [
      {
        name: text,
        type: "pie",
        radius: ["62%", "70%"],
        center: isShowLegend ? ["36%", "50%"] : ["50%", "50%"],
        avoidLabelOverlap: true,
        padAngle: 4,
        clockwise: true,
        startAngle: 90,
        itemStyle: {
          borderRadius: countFontsize(8),
        },
        label: {
          alignTo: "edge",
          ...(isShowLegend
            ? {
                edgeDistance: countFontsize(20),
                minMargin: 30,
              }
            : {
                edgeDistance: countFontsize(80), // 仅当 isShowLegend 为 false 时添加
                minMargin: countFontsize(30), // 仅当 isShowLegend 为 false 时添加
              }),
          formatter: function (params) {
            return `{b|${params.name}}\n{c|${params.percent}}{percent|%}`;
          },
          fontSize: countFontsize(20),
          lineHeight: countFontsize(30),
          rich: {
            b: {
              fontSize: countFontsize(22),
              color: fontColor(0.5),
              padding: [0, 0, countFontsize(5), 0],
            },
            c: {
              fontSize: countFontsize(26),
              color: fontColor(1),
              fontWeight: "bold",
              padding: [countFontsize(10), 0, 0, 0],
            },
            percent: {
              fontSize: countFontsize(20),
              color: fontColor(0.5),
              padding: [countFontsize(10), 0, 0, countFontsize(10)],
            },
          },
        },
        labelLine: {
          show: true,
          length: countFontsize(30),
          length2: countFontsize(0),
          maxSurfaceAngle: 80,
          lineStyle: {
            color: fontColor(0.5),
          },
        },
        labelLayout: function (params) {
          const labelRect = params.labelRect;
          const centerY = labelRect.y + labelRect.height / 2;

          // 当有图例时，限制右侧标签的最大X位置
          const maxRightX = isShowLegend
            ? countFontsize(450)
            : countFontsize(682);
          const isLeft = labelRect.x + labelRect.width / 2 < maxRightX / 2;

          let endX;
          let labelX = labelRect.x; // 标签文本的X位置

          if (isLeft) {
            endX = labelRect.x; // 左边：对齐最左
            labelX = labelRect.x; // 标签位置保持不变
          } else {
            // 右边：限制最大位置，避免覆盖图例
            const maxLabelX = maxRightX - labelRect.width; // 标签右边缘不超过maxRightX
            labelX = Math.min(labelRect.x, maxLabelX); // 调整标签位置
            endX = Math.min(labelX + labelRect.width, maxRightX); // 标签线终点也不能超过maxRightX
          }

          const points = params.labelLinePoints;
          points[2][0] = endX;

          points[2][1] = centerY;

          return {
            labelLinePoints: points,
            x: points[2][0],
            y: points[2][1],
          };
        },

        data: seriesData,
      },
    ],
  };
}

// 环形进度饼图
export function progressOption(totalData, colors) {
  const { text, data, total } = totalData;
  const nameData = data.map((item) => item.name);
  const used = data.find((item) => item.name === "已使用").value;
  const percent = total > 0 ? ((used / total) * 100).toFixed(0) : 0;

  return {
    backgroundColor: "transparent",
    title: {
      text: `{percent|${percent}}{unit|%}\n{line|}\n{text|${text}}`,
      left: "26%",
      top: "center",
      textAlign: "center",
      textStyle: {
        rich: {
          percent: {
            color: fontColor(1),
            fontSize: countFontsize(42),
            padding: [0, 0, countFontsize(5), 0],
          },
          unit: {
            color: fontColor(),
            fontSize: countFontsize(30),
            padding: [0, 0, countFontsize(5), 0],
          },
          line: {
            width: countFontsize(115),
            height: countFontsize(1),
            backgroundColor: fontColor(1),
          },
          text: {
            fontSize: countFontsize(30),
            color: colors[text],
            padding: [countFontsize(20), 0, 0, 0],
          },
        },
      },
    },
    graphic: [
      {
        type: "image",
        style: {
          image: require("@/assets/images/bghy/roomCurrent.png"),
          width: countFontsize(230),
          height: countFontsize(230),
        },
        left: "10.1%",
        top: "center",
      },
    ],
    legend: {
      orient: "vertical",
      right: "4%",
      top: "center",
      data: [
        {
          name: "已使用",
          itemStyle: {
            color: colors["已使用"],
            borderColor: `${colors["已使用"]}60`,
            borderWidth: countFontsize(8),
          },
        },
        {
          name: "总数",
          itemStyle: {
            color: colors["总数"],
            borderColor: `${colors["总数"]}60`,
            borderWidth: countFontsize(8),
          },
        },
      ],
      itemWidth: countFontsize(8),
      itemHeight: countFontsize(8),
      icon: "circle",
      textStyle: {
        fontSize: countFontsize(22),
        rich: {
          name: {
            fontSize: countFontsize(30),
            color: fontColor(0.8),
            padding: [0, countFontsize(10), 0, 0],
            width: countFontsize(100),
          },
          value: {
            fontWeight: "bold",
            fontSize: countFontsize(30),
            color: fontColor(1),
          },
        },
        padding: [countFontsize(3), 0, 0, countFontsize(4)],
      },
      formatter: function (name) {
        const values = {
          已使用: used,
          总数: total,
        };
        return `{name|${name}} {value|${values[name]}}`;
      },
    },
    series: [
      {
        name: "背景环",
        type: "pie",
        radius: ["76%", "88%"],
        center: ["27%", "50%"],
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: fontColor(0.1),
        },
        data: [
          {
            value: 100,
            name: "背景",
          },
        ],
      },
      {
        name: "总数",
        type: "pie",
        radius: ["81%", "83%"],
        center: ["27%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: colors["总数"],
        },
        data: [
          {
            value: total,
            name: "总数",
          },
        ],
      },
      {
        name: "已使用",
        type: "pie",
        radius: ["78%", "86%"],
        center: ["27%", "50%"],
        label: { show: false },
        labelLine: { show: false },
        data: [
          {
            name: "已使用",
            value: percent,
            itemStyle: {
              color: colors["已使用"],
              borderRadius: 8,
            },
          },
          {
            value: 100 - percent,
            itemStyle: {
              color: "transparent",
            },
          },
        ],
      },
    ],
  };
}

export function pieDownOption(datalist, itemColor, image) {
  return {
    backgroundColor: "transparent",
    color: itemColor,
    title: {
      text: datalist.total,
      subtext: datalist.text,
      left: "48%",
      top: "24.5%",
      textAlign: "center",
      textStyle: {
        fontSize: countFontsize(24),
        color: "#C0DCE7",
        fontWeight: "normal",
        margin: [5, 0, 0, 0],
      },
      subtextStyle: {
        fontSize: countFontsize(24),
        color: "#C0DCE7",
      },
    },
    graphic: {
      elements: [
        {
          type: "image",
          style: {
            image: image[0], //你的图片地址
            width: countFontsize(75),
            height: countFontsize(75),
          },
          left: "41.7%",
          top: "8.5%",
        },
        {
          type: "image",
          style: {
            image: image[1], //你的图片地址
            width: countFontsize(195),
            height: countFontsize(195),
          },
          left: "29.8%",
          top: "5%",
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
            fontSize: countFontsize(16),
            color: "#C0DCE7 ", // 名称颜色
          },
          name: {
            color: "#C0DCE7 ", // 名称颜色
            fontSize: countFontsize(24), // 名称字体大小
            width: countFontsize(340), // 名称宽度
            padding: [5, 0, 0, 3],
          },
          percent: {
            color: "#ffffffff", // 百分比颜色（金色）
            fontSize: countFontsize(24), // 百分比字体大小
            align: "right", // 右对齐
            fontWeight: "bold",
            padding: [5, 0, 0, 0],
          },
        },
      },
      itemGap: countFontsize(24), // 图例项之间的间隔
    },
    series: [
      {
        name: datalist.text,
        type: "pie",
        center: ["50%", "25%"],
        radius: ["44%", "49%"],
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


