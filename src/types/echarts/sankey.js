import { countFontsize, fontColor } from "@utils/countFontsize.js";

export function biscSankey(datalist) {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      formatter: "{b}",
    },
    graphic: [
      // 第一层标题
      {
        type: "text",
        left: "4%",
        top: "0%",
        style: {
          text: "供电",
          fill: "#ffffffff",
          fontSize: countFontsize(24),
        },
      },
      // 第二层标题
      {
        type: "text",
        left: "40.5%",
        top: "0%",
        style: {
          text: "配电",
          fill: "#fffbfbff",
          fontSize: countFontsize(24),
        },
      },
      // 第三层标题
      {
        type: "text",
        left: "76.5%",
        top: "0%",
        style: {
          text: "用电",
          fill: "#ffffffff",
          fontSize: countFontsize(24),
        },
      },
    ],
    series: [
      {
        type: "sankey",
        layoutIterations: 0,
        layout: "none",
        focusNodeAdjacency: "allEdges",
        draggable: false,
        levels: [
          {
            depth: 0,
          },
          {
            depth: 1,
            itemStyle: { color: "#86DFEC" },
            // 关键设置：限制第二层高度扩展
            // nodeGap: 0, // 节点间无间隙
            // nodeHeight: 20, // 固定节点高度
            // nodeWidth: 20, // 固定节点宽度
          },
          {
            depth: 2,
          },
        ],
        data: datalist.data,
        links: datalist.links,
        lineStyle: {
          color: "source",
          curveness: 0.3,
          opacity: 0.3,
        },
        label: {
          color: "#ffffff",
          fontSize: countFontsize(21),
          position: "right",
          opacity: 1,
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "#aaa",
          opacity: 1,
        },
      },
    ],
  };
}
