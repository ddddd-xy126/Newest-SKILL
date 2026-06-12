import * as echarts from "echarts";
import { countFontsize, fontColor } from "@utils/countFontsize.js";

const defaultBaseBarOptionData = () => {
  return {
    name: "默认数据",
    data: [
      { value: 10, name: "默认1" },
      { value: 10, name: "默认2" },
    ],
  };
};

const defaultNestedRingData = () => {
  return {
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
};

// 动态渐变饼图
export const gradientPieOption = (
  data,
  colors = ["#80BCF3", "#8DFF75", "#6EFBE8"],
  config = {}
) => {
  const defaultConfig = {
    title: "接入数量",
    subtitle: "",
    center: ["50%", "50%"],
    radius: [114, 132],
    showLegend: false,
    showCenterLabel: true,
    imgs: null,
    subImgs: null,
  };

  const finalConfig = { ...defaultConfig, ...config };

  function getCoordinates(startArc, endArc) {
    const posi = [
      Math.sin(startArc),
      -Math.cos(startArc),
      Math.sin(endArc),
      -Math.cos(endArc),
    ];
    const dx = posi[2] - posi[0];
    const dy = posi[3] - posi[1];
    return getLocation(dx, dy);
  }

  function getLocation(dx, dy) {
    const tanV = dx / dy;
    const directSign = Math.abs(tanV) < 1;
    const t = directSign ? tanV : 1 / tanV;

    const sign1 = t > 0 ? 1 : -1;
    const sign2 = dx > 0 ? 1 : -1;
    const sign = directSign ? sign1 * sign2 : sign2;

    const group1 = [0.5 - (sign * t) / 2, 0.5 + (sign * t) / 2];
    const group2 = sign > 0 ? [0, 1] : [1, 0];
    const group = [...group1, ...group2];
    const keys = directSign ? ["x", "x2", "y", "y2"] : ["y", "y2", "x", "x2"];

    const res = {};
    keys.forEach((k, idx) => {
      res[k] = group[idx];
    });
    return res;
  }

  function addAlpha(color, alpha) {
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].value;
  }

  const gradientData = [];
  let startArc = 0;
  let endArc = 0;

  for (let i = 0; i < data.length; i++) {
    const percent = data[i].value / sum;
    startArc = endArc;
    endArc = startArc + 2 * Math.PI * percent;

    const coordinates = getCoordinates(startArc, endArc);

    gradientData.push({
      value: data[i].value,
      name: data[i].name,
      itemStyle: {
        color: {
          ...coordinates,
          type: "linear",
          global: false,
          colorStops: [
            {
              offset: 0,
              color: addAlpha(colors[i % colors.length], 1),
            },
            {
              offset: 1,
              color: addAlpha(colors[i % colors.length], 0),
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
        radius: finalConfig.radius.map((r) => (countFontsize ? countFontsize(r) : r)),
        label: finalConfig.showCenterLabel
          ? {
              show: true,
              position: "center",
              formatter: `{val|${sum}}\n{name|${finalConfig.title}}`,
              color: "#ffffff",
              offset: [0, countFontsize(30)],
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
  totalData,
  colorsMap,
  imgs,
  legendPosition = "right",
  {
    centerBgOffset = { left: null, top: null },
    centerBgSize = null,
    pieCenterOffset = null,
    centerIcon = null,
    centerTitleOffset = { left: null, top: null, titleSize: 28, subtitleSize: 22 },
  } = {},
  isShowpercent = true,
  isShowLabelLine = false,
  centerImg = null
) {
  const { text, total, data, unit } = totalData;

  const title = total ? `{a|${total}}\n{b|${text}}` : `{b|${text}}`;

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
            padding: [countFontsize(60), 0, countFontsize(20), countFontsize(10)],
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

  const seriesData = data.map((item) => ({
    name: item.name,
    value: item.percent,
    itemStyle: { color: colorsMap[item.name] },
  }));

  return {
    backgroundColor: "transparent",
    title: {
      text: title,
      left: centerTitleOffset.left,
      top: centerTitleOffset.top,
      textAlign: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: countFontsize(centerTitleOffset.titleSize),
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
    graphic: [
      {
        type: "image",
        style: {
          image: centerImg ? centerImg : require("@images/ZN_GC/pie-bg1.png"),
          width: centerBgSize ? countFontsize(centerBgSize.width) : countFontsize(152),
          height: centerBgSize ? countFontsize(centerBgSize.height) : countFontsize(152),
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
        top: centerBgOffset.top,
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
            }
          : { show: false },
        data: seriesData,
      },
    ],
  };
}

// 两个直径不同的饼图嵌套,需两组数据，可同可不同
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
      type: "scroll",
      orient: "vertical",
      right: "5%",
      y: "center",
      icon: "circle",
      itemWidth: countFontsize(10),
      itemHeight: countFontsize(10),
      textStyle: {
        color: fontColor(0.8),
        fontSize: countFontsize(20),
      },
      itemGap: countFontsize(16),
    },
    graphic: {
      elements: [
        {
          type: "image",
          style: {
            image: image,
            width: 60,
            height: 60,
          },
          left: "30.5%",
          top: "39%",
        },
      ],
    },
    series: [
      {
        name: name,
        type: "pie",
        radius: ["52%", "60%"],
        center: ["35%", "50%"],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: data.map((e, i) => {
          return {
            ...e,
            itemStyle: {
              color: outColorList[i],
            },
          };
        }),
      },
      {
        name: name,
        type: "pie",
        center: ["35%", "50%"],
        radius: ["42%", "52%"],
        label: {
          show: false,
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

// 三个直径不同的饼图嵌套
export const tripleRingOption = (data, name, colors, isDefault = false) => {
  if (isDefault) {
    data = defaultNestedRingData().data;
    name = defaultNestedRingData().name;
  }

  const radiusList = [
    ["50%", "60%"],
    ["40%", "50%"],
    ["30%", "40%"],
  ];

  const series = data.map((item, index) => {
    const percent = Number(item.percent.replace("%", ""));
    return {
      name: item.label,
      type: "pie",
      radius: radiusList[index],
      center: ["40%", "50%"],
      label: { show: false },
      labelLine: { show: false },
      startAngle: 30,
      clockwise: false,
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
      right: "5%",
      top: "center",
      itemGap: countFontsize(24),
      icon: "circle",
      itemWidth: countFontsize(10),
      itemHeight: countFontsize(10),
      data: data.map((e) => ({
        name: e.label,
        icon: "circle",
        itemStyle: { color: colors[e.label] },
      })),
      formatter: function (name) {
        const item = data.find((e) => e.label === name);
        const num = item.percent.split("%")[0];
        return `{label|${name}} {value|${num}}  {percent|%}`;
      },
      textStyle: {
        color: "#fff",
        fontSize: countFontsize(22),
        rich: {
          label: {
            fontSize: countFontsize(22),
            color: fontColor(0.8),
            width: countFontsize(50),
            align: "left",
          },
          value: {
            fontSize: countFontsize(26),
            fontWeight: "bold",
            color: "#fff",
            width: countFontsize(40),
            align: "right",
          },
          percent: {
            fontSize: countFontsize(20),
            fontWeight: "normal",
            color: fontColor(0.6),
            width: countFontsize(15),
            align: "left",
          },
        },
      },
    },
    series,
  };
};

// 渐变标签饼图：环形饼图 + 扇区角度渐变(透明→实色) + 彩色方块标签引导线
export function gradientLabelPieOption(data, colors, bgImage, centerIcon, options = {}) {
  const { showLabel = true, bgRatio = 64 / 87, labelLineYOffset = -1 } = options;

  function getCoordinates(startArc, endArc) {
    const posi = [Math.sin(startArc), -Math.cos(startArc), Math.sin(endArc), -Math.cos(endArc)];
    const dx = posi[2] - posi[0];
    const dy = posi[3] - posi[1];
    return getLocation(dx, dy);
  }
  function getLocation(dx, dy) {
    const tanV = dx / dy;
    const directSign = Math.abs(tanV) < 1;
    const t = directSign ? tanV : 1 / tanV;
    const sign1 = t > 0 ? 1 : -1;
    const sign2 = dx > 0 ? 1 : -1;
    const sign = directSign ? sign1 * sign2 : sign2;
    const group1 = [0.5 - (sign * t) / 2, 0.5 + (sign * t) / 2];
    const group2 = sign > 0 ? [0, 1] : [1, 0];
    const group = [...group1, ...group2];
    const keys = directSign ? ["x", "x2", "y", "y2"] : ["y", "y2", "x", "x2"];
    const res = {};
    keys.forEach((k, idx) => { res[k] = group[idx]; });
    return res;
  }
  function addAlpha(color, alpha) {
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  const bgH = countFontsize(190);
  const bgW = bgH * bgRatio;

  const total = data.reduce((s, d) => s + d.value, 0);
  const startAngle = 180;

  const labelSideMap = {};
  {
    let d = startAngle;
    data.forEach((item) => {
      const span = (item.value / total) * 360;
      d -= span;
      const mid = d + span / 2;
      const normalized = ((mid % 360) + 360) % 360;
      labelSideMap[item.name] = (normalized >= 90 && normalized < 270) ? "left" : "right";
    });
  }

  let startArc = (3 * Math.PI) / 2;
  let endArc = (3 * Math.PI) / 2;
  const seriesData = data.map((item, index) => {
    const percent = item.value / total;
    startArc = endArc;
    endArc = startArc + 2 * Math.PI * percent;
    const coordinates = getCoordinates(startArc, endArc);
    const baseColor = colors[index % colors.length] || "#4FC3F7";
    return {
      name: item.name,
      value: item.value,
      itemStyle: {
        color: {
          ...coordinates,
          type: "linear",
          global: false,
          colorStops: [
            { offset: 0, color: addAlpha(baseColor, 0.1) },
            { offset: 1, color: addAlpha(baseColor, 1) },
          ],
        },
      },
    };
  });

  const graphicElements = [];
  if (bgImage) {
    graphicElements.push({
      type: "image",
      style: { image: bgImage, width: bgW, height: bgH },
      left: "center", top: "center", z: -1,
    });
  }
  if (centerIcon) {
    graphicElements.push({
      type: "image",
      style: { image: centerIcon, width: countFontsize(64), height: countFontsize(64) },
      left: "center", top: "center", z: 1,
    });
  }

  const nameLineHeight = countFontsize(34);
  const squareSize = countFontsize(8);
  const commonRich = {
    name: {
      fontSize: countFontsize(28),
      color: "rgba(168, 183, 193, 1)",
      lineHeight: nameLineHeight,
      fontFamily: "OPPOSans-M",
    },
    pct: {
      fontSize: countFontsize(32),
      color: "#ffffff",
      lineHeight: countFontsize(54),
      fontFamily: "OPPOSans-M",
    },
    unit: {
      fontSize: countFontsize(22),
      color: "rgba(255,255,255,0.75)",
      lineHeight: countFontsize(54),
      fontFamily: "OPPOSans-M",
    },
  };
  data.forEach((item, i) => {
    commonRich[`sq${i}`] = {
      backgroundColor: addAlpha(colors[i % colors.length], 1),
      width: squareSize,
      height: squareSize,
      lineHeight: countFontsize(4),
    };
  });

  return {
    backgroundColor: "transparent",
    graphic: graphicElements,
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    series: [
      {
        name: "能源来源",
        type: "pie",
        radius: ["58%", "68%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        startAngle: startAngle,
        padAngle: countFontsize(10),
        label: {
          show: showLabel,
          alignTo: "edge",
          edgeDistance: "0.5%",
          position: "outside",
          formatter: function (params) {
            const idx = params.dataIndex;
            const side = labelSideMap[params.name];
            if (side === "left") {
              return `{name|${params.name}} {sq${idx}|}\n{pct|${params.percent}}{unit| %}`;
            } else {
              return `{sq${idx}|  } {name|${params.name}}\n{pct|${params.percent}}{unit| %}`;
            }
          },
          rich: commonRich,
        },
        labelLine: {
          show: showLabel,
          length: countFontsize(20),
          length2: countFontsize(50),
          maxSurfaceAngle: 80,
          lineStyle: { color: "rgba(255,255,255,0.4)", width: 1 },
        },
        labelLayout: function (params) {
          const points = params.labelLinePoints;
          if (!points) return {};
          const labelRect = params.labelRect;
          const targetY = labelRect.y + nameLineHeight / 2 + labelLineYOffset;
          points[1][1] = targetY;
          points[2][1] = targetY;
          return { labelLinePoints: points };
        },
        data: seriesData,
      },
    ],
  };
}
