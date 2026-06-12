<template>
  <div :class="className" :style="{ height: height, width: width }" style="position: relative; overflow: hidden">
    <div ref="chart3D" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></div>
    <!-- SVG DOM 覆盖层：标签折线 + 小圆点（DOM 元素始终在 WebGL canvas 之上） -->
    <svg v-if="labelItems.length" class="label-svg">
      <defs>
        <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g v-for="(item, idx) in labelItems" :key="idx" style="cursor: pointer; pointer-events: auto"
        @click="onLabelClick(item)">
        <polyline :points="item.linePoints" fill="none" stroke="rgba(255,255,255,1)" stroke-width="1" />
        <circle :cx="item.dotX" :cy="item.dotY" :r="dotR" fill="rgba(255,255,255,0.85)"
          filter="url(#dotGlow)" />
        <text :x="item.textX" :y="item.valueY" :text-anchor="item.anchor" dominant-baseline="auto" fill="#FFFFFF90"
          :font-size="labelFontSize" font-family="OPPOSans-Medium ">
          {{ item.value }}
        </text>
        <text :x="item.textX" :y="item.nameY" :text-anchor="item.anchor" dominant-baseline="hanging"
          fill="rgba(255,255,255,0.8)" :font-size="labelFontSize" font-family="OPPOSans-Medium">
          {{ item.name }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";
import { countFontsize } from "@utils/countFontsize.js";

// 颜色对 [渐变起色, 渐变终色] —— 用于图例三角形渐变
const COLOR_PAIRS = [
  ["#FFD080", "#E8A23D"],
  ["#A78BF0", "#7B61E0"],
  ["#80DEF8", "#4DC9F6"],
  ["#4A7EC8", "#2456A8"],
  ["#80F08A", "#57E068"],
  ["#5EEAD4", "#14B8A6"],
];
const COLORS = COLOR_PAIRS.map((p) => p[1]);

// 生成渐变三角形 SVG data URI 作为图例 icon
function createTriangleIcon(color1, color2, idx) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 30 10">' +
    "<defs>" +
    '<linearGradient id="tg' +
    idx +
    '" x1="0%" y1="0%" x2="100%" y2="0%">' +
    '<stop offset="0%" stop-color="' +
    color1 +
    '"/>' +
    '<stop offset="100%" stop-color="' +
    color2 +
    '"/>' +
    "</linearGradient>" +
    "</defs>" +
    '<polygon points="0,0 30,5 0,10" fill="url(#tg' +
    idx +
    ')"/>' +
    "</svg>";
  return "image://data:image/svg+xml;base64," + btoa(svg);
}

export default {
  name: "SurfacePie3D",
  props: {
    // 标签整体顺/逆时针转	labelAngleOffset
    // 标签整体上下/左右平移	centerYRatio / centerXRatio
    // 标签离饼图更远/更近	radiusXRatio、radiusYRatio 或 pieScale
    // 折线变长/变短	lineLen1Min/Base、lineLen2Min/Base
    // 数值相近时不重叠	labelCollisionAvoid: true
    className: {
      type: String,
      default: "container",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    datalist: {
      type: Array,
      default: () => [],
    },
    // 饼图整体缩放系数。
    // 支持 Number 或 [窄屏, 宽屏] 数组（aspectRatio >= 3.148 取宽屏值）。
    // 值越大，3D 饼体占 grid3D 越大，同时 SVG 标签椭圆半径也按比例放大。
    pieScale: {
      type: [Number, Array],
      default: () => [1, 1.2],
    },
    // 3D 饼图在画布中的水平区域（grid3D.left / grid3D.width）
    pieLeft: {
      type: String,
      default: "0%",
    },
    pieWidth: {
      type: String,
      default: "80%",
    },
    // 3D 饼图在画布中的垂直位置（grid3D.top ）
    // 传负值可令饼图上移，如 "-2%" / "-10"
    pieTop: {
      type: [String, Number],
      default: "auto",
    },
    // 每段扇形之间的间隔比例（占总周长的占比）
    // 支持 Number 或 [窄屏, 宽屏] 数组（aspectRatio >= 3.148 取宽屏值）
    pieGap: {
      type: [Number, Array],
      default: () => [0.02, 0.03],
    },
    // SVG 标签覆盖层中心点（相对容器宽高的比例）
    centerXRatio: {
      type: Number,
      default: 0.4,
    },
    centerYRatio: {
      type: Number,
      default: 0.48,
    },
    // SVG 标签椭圆半径系数：rx = min(cw * radiusXRatio, ch * radiusYRatio) * pieScale
    radiusXRatio: {
      type: Number,
      default: 0.28,
    },
    radiusYRatio: {
      type: Number,
      default: 0.32,
    },
    // 标签角度偏移（单位：度）
    // 正值 = 顺时针偏移，负值 = 逆时针偏移；默认 40°为与 3D 投影对齐的初始校正值
    labelAngleOffset: {
      type: Number,
      default: 40,
    },
    // 中心背景图片位置与尺寸（按宽高比 aspectRatio >= 3.148 适配）
    // 数组格式：[窄屏值, 宽屏值]
    // 窄屏（aspectRatio < 3.148）取 [0]，宽屏（aspectRatio >= 3.148）取 [1]
    bgLeft: {
      type: Array,
      default: () => ["19.8%", "21.5%"],
    },
    // 背景图片大小（设计稿 2296 基准 px，实际尺寸 = countFontsize(bgBase)）[窄屏, 宽屏]
    bgBase: {
      type: Array,
      default: () => [117, 117],
    },
    // 背景图垂直位置（按 aspectRatio >= 3.148 适配）[窄屏, 宽屏]
    bgTop: {
      type: Array,
      default: () => ["15.5%", "14%"],
    },
    // SVG 标签折线长度（设计稿 2296 基准 px，实际长度 = countFontsize(*Base)）
    // 第一段（从圆点沿径向外）
    lineLen1Base: {
      type: Number,
      default: 16,
    },
    // 第二段（水平折线）
    lineLen2Base: {
      type: Number,
      default: 45,
    },
    // 图例距右侧的距离
    legendRight: {
      type: String,
      default: "0%",
    },
    // 图例 icon 与文字的间距（设计稿 2296 基准 px）——实际间距 = countFontsize(legendTextGapBase)
    // 按 aspectRatio >= 3.148 适配：[窄屏, 宽屏]
    legendTextGapBase: {
      type: Array,
      default: () => [5, 5],
    },
    // 图例项之间的垂直间距（设计稿 2296 基准 px）——实际间距 = countFontsize(legendItemGapBase)
    // 按 aspectRatio >= 3.148 适配：[窄屏, 宽屏]
    legendItemGapBase: {
      type: Array,
      default: () => [11, 11],
    },
    // 是否开启同侧标签碰撞避让（开启后相邻标签会被纵向推开，避免重叠）
    labelCollisionAvoid: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {
      chart3D: null,
      scale: 1,
      labelItems: [],
    };
  },
  watch: {
    datalist: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
  },
  computed: {
    labelFontSize() {
      // 引用 scale 触发 resize 时重新计算
      void this.scale;
      return countFontsize(18);
    },
    dotR() {
      void this.scale;
      return countFontsize(2);
    },
  },
  mounted() {
    this.initChart();
    this._resizeHandler = () => this.initChart();
    window.addEventListener("resize", this._resizeHandler);
  },
  beforeDestroy() {
    if (this._resizeHandler)
      window.removeEventListener("resize", this._resizeHandler);
    if (this.chart3D) {
      this.chart3D.dispose();
      this.chart3D = null;
    }
  },
  methods: {
    normalizeData: function (data) {
      return (data || []).map(function (item) {
        var num = Number(item && item.value);
        return {
          name: (item && item.name) || "",
          value: Number.isFinite(num) ? num : 0,
        };
      });
    },
    initChart() {
      var that = this;
      if (!this.$refs.chart3D) return;

      that.scale = document.documentElement.clientWidth / 1280;

      if (this.chart3D) this.chart3D.dispose();
      this.chart3D = echarts.init(this.$refs.chart3D);
      var data = this.normalizeData(this.datalist);
      if (!data || data.length === 0) {
        this.labelItems = [];
        return;
      }

      // ========== 核心参数 ==========
      // 根据 aspectRatio 选择 GAP（低于 initChart 中 aspectRatio 计算之前，这里提前计算一次）
      var _ar = document.documentElement.clientWidth / document.documentElement.clientHeight;
      var _gapIdx = _ar >= 3.148 ? 1 : 0;
      var GAP = Array.isArray(this.pieGap)
        ? Number(this.pieGap[_gapIdx])
        : Number(this.pieGap);
      if (!Number.isFinite(GAP) || GAP < 0) GAP = 0.02;
      var PIE_HEIGHT = 8; // 所有扇形统一高度
      var HOVER_LIFT = 20; // hover 时 Z 轴抬升量
      var sumValue = data.reduce(function (s, d) {
        return s + d.value;
      }, 0);

      // 空数据或全为 0 时不继续计算比例和 SVG 标签，避免出现 NaN 坐标
      if (!Number.isFinite(sumValue) || sumValue <= 0) {
        this.labelItems = [];
        this.chart3D.clear();
        return;
      }

      // ========== 3D 参数方程 ==========
      function getParametricEquation(
        startRatio,
        endRatio,
        isSelected,
        isHovered,
        k,
        h,
      ) {
        var startRadian = startRatio * Math.PI * 2;
        var endRadian = endRatio * Math.PI * 2;
        var midRadian = ((startRatio + endRatio) / 2) * Math.PI * 2;
        if (startRatio === 0 && endRatio === 1) isSelected = false;
        k = k !== undefined ? k : 1 / 3;
        var offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        var offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
        var zOffset = isHovered ? HOVER_LIFT * 0.1 : 0;

        return {
          u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
          v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
          x: function (u, v) {
            if (u < startRadian)
              return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k);
            if (u > endRadian)
              return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k);
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k);
          },
          y: function (u, v) {
            if (u < startRadian)
              return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k);
            if (u > endRadian)
              return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k);
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k);
          },
          z: function (u, v) {
            if (u < -Math.PI * 0.5) return Math.sin(u) + zOffset;
            if (u > Math.PI * 2.5) return Math.sin(u) * h * 0.1 + zOffset;
            return (Math.sin(v) > 0 ? h * 0.1 : -1) + zOffset;
          },
        };
      }

      // ========== 构建 3D surface 系列 ==========
      var series = [];
      var internalDiameterRatio = 0.59;
      var k = (1 - internalDiameterRatio) / (1 + internalDiameterRatio);
      var startValue = 0;

      for (var i = 0; i < data.length; i++) {
        var endValue = startValue + data[i].value;
        var startRatio = startValue / sumValue + GAP / 2;
        var endRatio = endValue / sumValue - GAP / 2;

        series.push({
          name: data[i].name || "series" + i,
          type: "surface",
          parametric: true,
          wireframe: { show: false },
          itemStyle: { color: COLORS[i % COLORS.length] },
          pieData: {
            value: data[i].value,
            name: data[i].name,
            startRatio: startRatio,
            endRatio: endRatio,
          },
          pieStatus: { selected: false, hovered: false, k: k },
          parametricEquation: getParametricEquation(
            startRatio,
            endRatio,
            false,
            false,
            k,
            PIE_HEIGHT,
          ),
        });
        startValue = endValue;
      }

      // ========== 图例（渐变三角形 icon） ==========
      var legendData = data.map(function (d, idx) {
        return {
          name: d.name,
          icon: createTriangleIcon(
            COLOR_PAIRS[idx % COLOR_PAIRS.length][0],
            COLOR_PAIRS[idx % COLOR_PAIRS.length][1],
            idx,
          ),
        };
      });

      // ========== 组装 3D option ==========
      var aspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
      var idx = aspectRatio >= 3.148 ? 1 : 0;
      // 解析后的 pieScale 标量，供 xAxis3D / yAxis3D 与 computeLabels 共用，避免数组直接参与运算
      this._resolvedPieScale = Array.isArray(this.pieScale)
        ? Number(this.pieScale[idx])
        : Number(this.pieScale);
      if (!Number.isFinite(this._resolvedPieScale) || this._resolvedPieScale <= 0) {
        this._resolvedPieScale = 1;
      }
      var pieScaleVal = this._resolvedPieScale;
      var bgLeft = this.bgLeft[idx];
      var bgBase = this.bgBase[idx];
      var bgTop = this.bgTop[idx];
      var bgSize = Math.round(countFontsize(bgBase));
      var legendTextGapBase = this.legendTextGapBase[idx];
      var legendItemGapBase = this.legendItemGapBase[idx];

      var option3D = {
        // 背景图片
        graphic: [
          {
            type: "image",
            left: bgLeft,
            top: bgTop,
            z: -1,
            style: {
              // image: require("@images/charts/pie-bg5.png"),
              width: bgSize,
              height: Math.round(bgSize * 91 / 100),
              opacity: 1,
            },
          },
        ],
        // 图例
        legend: {
          show: true,
          orient: "vertical",
          right: this.legendRight,
          top: "middle",
          // 图例icon大小
          itemWidth: countFontsize(32),
          itemHeight: countFontsize(8),
          itemGap: countFontsize(legendItemGapBase),
          selectedMode: false,
          textStyle: {
            color: "#FFFFFF",
            fontSize: countFontsize(18),
            fontFamily: "OPPOSans-Regular",
            padding: [0, 0, 0, countFontsize(legendTextGapBase)],
          },
          data: legendData,
        },
        tooltip: {
          formatter: function (params) {
            if (params.seriesIndex < data.length) {
              var s = series[params.seriesIndex];
              if (s && s.pieData) {
                return (
                  s.pieData.name +
                  " " +
                  ((s.pieData.value / sumValue) * 100).toFixed(1) +
                  "%"
                );
              }
            }
          },
        },
        xAxis3D: { min: -1 / pieScaleVal, max: 1 / pieScaleVal },
        yAxis3D: { min: -1 / pieScaleVal, max: 1 / pieScaleVal },
        zAxis3D: { min: -1, max: 1 },
        grid3D: {
          show: false,
          boxHeight: 10,
          left: this.pieLeft,
          // 3D 图形位置
          width: this.pieWidth,
          top: this.pieTop,
          viewControl: {
            alpha: 30,
            rotateSensitivity: 0,
            zoomSensitivity: 0,
            panSensitivity: 0,
            autoRotate: false,
          },
          postEffect: {
            enable: true,
            bloom: { enable: true, bloomIntensity: 0.1 },
            SSAO: { enable: true, quality: "medium", radius: 2 },
          },
        },
        series: series,
      };

      this.chart3D.setOption(option3D);

      // ========== SVG 标签位置计算（DOM 覆盖层） ==========
      this.computeLabels(data, sumValue);

      // ========== Hover：仅抬升当前扇形 ==========
      var hoveredIndex = "";
      var chart3D = this.chart3D;

      chart3D.on("mouseover", function (params) {
        if (hoveredIndex === params.seriesIndex) return;

        if (
          hoveredIndex !== "" &&
          series[hoveredIndex] &&
          series[hoveredIndex].pieData
        ) {
          var prev = series[hoveredIndex];
          prev.parametricEquation = getParametricEquation(
            prev.pieData.startRatio,
            prev.pieData.endRatio,
            prev.pieStatus.selected,
            false,
            prev.pieStatus.k,
            PIE_HEIGHT,
          );
          prev.pieStatus.hovered = false;
          hoveredIndex = "";
        }

        if (series[params.seriesIndex] && series[params.seriesIndex].pieData) {
          var curr = series[params.seriesIndex];
          curr.parametricEquation = getParametricEquation(
            curr.pieData.startRatio,
            curr.pieData.endRatio,
            curr.pieStatus.selected,
            true,
            curr.pieStatus.k,
            PIE_HEIGHT,
          );
          curr.pieStatus.hovered = true;
          hoveredIndex = params.seriesIndex;
        }

        chart3D.setOption(option3D);
      });

      chart3D.on("globalout", function () {
        if (
          hoveredIndex !== "" &&
          series[hoveredIndex] &&
          series[hoveredIndex].pieData
        ) {
          var prev = series[hoveredIndex];
          prev.parametricEquation = getParametricEquation(
            prev.pieData.startRatio,
            prev.pieData.endRatio,
            prev.pieStatus.selected,
            false,
            prev.pieStatus.k,
            PIE_HEIGHT,
          );
          prev.pieStatus.hovered = false;
          hoveredIndex = "";
          chart3D.setOption(option3D);
        }
      });

      // ========== 点击扇区：触发与标签点击相同的事件 ==========
      var that2 = this;
      chart3D.on("click", function (params) {
        if (series[params.seriesIndex] && series[params.seriesIndex].pieData) {
          var pd = series[params.seriesIndex].pieData;
          that2.onLabelClick({ name: pd.name, value: pd.value });
        }
      });
    },

    // 点击标签事件（可根据需要扩展为 emit 事件供父组件监听）
    onLabelClick: function (item) {
      console.log("点击标签:", item.name, item.value);
      // 找到对应数据索引，回传颜色（与 COLORS 顺序一致）
      var idx = -1;
      for (var i = 0; i < this.datalist.length; i++) {
        if (this.datalist[i].name === item.name) {
          idx = i;
          break;
        }
      }
      var color = idx >= 0 ? COLORS[idx % COLORS.length] : "";
      this.$emit("label-click", {
        name: item.name,
        value: item.value,
        index: idx,
        color: color,
      });
    },

    computeLabels: function (data, sumValue) {
      if (!Number.isFinite(sumValue) || sumValue <= 0) {
        this.labelItems = [];
        return;
      }
      var el = this.$refs.chart3D;
      if (!el) return;
      var cw = el.clientWidth;
      var ch = el.clientHeight;

      // 3D ring 投影中心（与 grid3D 的 left/width 对应）
      // 折线和小圆点位置基于此进行计算，确保与3D图形对齐
      var cx = cw * this.centerXRatio;
      var cy = ch * this.centerYRatio;

      // 3D 透视下环的椭圆半径（alpha:30° → 垂直方向压缩）
      // 使用 initChart 中按 aspectRatio 解析后的 pieScale 标量，避免 Array 类型参与运算
      var ps = Number.isFinite(this._resolvedPieScale) && this._resolvedPieScale > 0
        ? this._resolvedPieScale
        : (Array.isArray(this.pieScale) ? Number(this.pieScale[0]) || 1 : Number(this.pieScale) || 1);
      var rx = Math.min(cw * this.radiusXRatio, ch * this.radiusYRatio) * ps;
      var ry = rx * 0.82;

      var lineLen1 = countFontsize(this.lineLen1Base);
      var lineLen2 = countFontsize(this.lineLen2Base);

      var valueFontSize = this.labelFontSize;
      var nameFontSize = this.labelFontSize;
      var textGap = countFontsize(4); // 文字与折线的间距（设计稿 2296 基准 px）
      // 同侧相邻标签 endY 之间的最小垂直间距（容纳两行文字 + 上下 gap）
      var minVGap = valueFontSize + nameFontSize + textGap * 2 + 2;

      // 第一遍：算出 dot / mid / end 等原始坐标（不输出 linePoints）
      var raw = [];
      var acc = 0;
      for (var i = 0; i < data.length; i++) {
        var pct = data[i].value / sumValue;
        var midPct = acc + pct / 2;
        // 角度：与3D参数方程一致，从右侧(3点钟)开始逆时针；顺时针偏移 labelAngleOffset ° 校正投影误差
        var theta = midPct * 2 * Math.PI - (this.labelAngleOffset * Math.PI) / 180;

        var dotX = cx + Math.cos(theta) * rx;
        var dotY = cy - Math.sin(theta) * ry;

        var dx = dotX - cx;
        var dy = dotY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var ndx = dx / dist;
        var ndy = dy / dist;

        var midX = dotX + ndx * lineLen1;
        var midY = dotY + ndy * lineLen1;

        var isRight = dotX >= cx;
        var valueStr = String(data[i].value);
        var nameStr = String(data[i].name);
        // 文字宽度估算：区分 CJK（宽度 ≈ 字号 1.0 倍）与 ASCII（≈ 0.6 倍），
        // 避免中文标签被低估导致水平折线段长度不足、文字溢出与折线重叠。
        var measureWidth = function (str, fontSize) {
          var w = 0;
          for (var c = 0; c < str.length; c++) {
            var code = str.charCodeAt(c);
            // CJK 统一表意 / 全角符号 / 假名 等按全角处理
            if (code > 0x2e80) w += fontSize * 1.0;
            else w += fontSize * 0.6;
          }
          return w;
        };
        var valueWidth = measureWidth(valueStr, valueFontSize);
        var nameWidth = measureWidth(nameStr, nameFontSize);
        // 末尾再加一点安全余量，避免字体度量误差导致刚好顶到折线端点
        var textWidth = Math.max(valueWidth, nameWidth) + 4;
        var lineHLen = Math.max(lineLen2, textWidth);
        var endX = midX + (isRight ? lineHLen : -lineHLen);

        // 水平钳制：折线长度按视口 scale 缩放，但 dotX/midX 按容器 cw 缩放，
        // 当视口宽 / 容器宽 比例变化时（如 1920 容器变窄）左端可能被 overflow:hidden 截掉。
        // 这里限制 endX 在容器内并保留文字宽度的安全间距，必要时回拉 midX 防止折线反弯。
        var hPad = 2;
        if (isRight) {
          var rightLimit = cw - hPad;
          if (endX > rightLimit) {
            endX = rightLimit;
            if (midX > endX) midX = endX;
          }
        } else {
          var leftLimit = hPad;
          if (endX < leftLimit) {
            endX = leftLimit;
            if (midX < endX) midX = endX;
          }
        }

        raw.push({
          idx: i,
          value: data[i].value,
          name: data[i].name,
          dotX: dotX,
          dotY: dotY,
          midX: midX,
          endX: endX,
          endY: midY, // 初始 endY = midY，下一步可能被推开
          isRight: isRight,
        });

        acc += pct;
      }

      // 第二遍：同侧标签按 endY 升序，强制最小垂直间距
      function resolveSide(list) {
        if (list.length <= 1) return;
        list.sort(function (a, b) {
          return a.endY - b.endY;
        });
        // 自上而下推开
        for (var j = 1; j < list.length; j++) {
          var need = list[j - 1].endY + minVGap;
          if (list[j].endY < need) list[j].endY = need;
        }
        // 自下而上回收（防止集体被推到容器外）
        // 注意：endY 是折线拐点 Y，value 文本向上绘制（顶部 ≈ endY - textGap - valueFontSize），
        // name 文本向下绘制（底部 ≈ endY + textGap + nameFontSize）。
        // 因此底部留白必须扣掉 name 行高度，否则容器 overflow:hidden 会把 name 标签裁掉（如 2898×860）。
        var maxY = ch - textGap - nameFontSize - 2;
        if (list[list.length - 1].endY > maxY) {
          list[list.length - 1].endY = maxY;
          for (var k = list.length - 2; k >= 0; k--) {
            var limit = list[k + 1].endY - minVGap;
            if (list[k].endY > limit) list[k].endY = limit;
          }
        }
        // 自上而下回收（防止顶部 value 行被裁）
        var minY = textGap + valueFontSize + 2;
        if (list[0].endY < minY) {
          list[0].endY = minY;
          for (var t = 1; t < list.length; t++) {
            var lower = list[t - 1].endY + minVGap;
            if (list[t].endY < lower) list[t].endY = lower;
          }
        }
      }
      var rightSide = raw.filter(function (r) { return r.isRight; });
      var leftSide = raw.filter(function (r) { return !r.isRight; });
      if (this.labelCollisionAvoid) {
        resolveSide(rightSide);
        resolveSide(leftSide);
      }

      // 第三遍：构建最终 labelItems（拐点 Y 同步到 endY，保证水平段水平）
      var items = new Array(raw.length);
      for (var m = 0; m < raw.length; m++) {
        var r = raw[m];
        var bendY = r.endY; // 拐点 Y
        items[r.idx] = {
          value: r.value,
          name: r.name,
          dotX: r.dotX,
          dotY: r.dotY,
          linePoints:
            r.dotX + "," + r.dotY + " " +
            r.midX + "," + bendY + " " +
            r.endX + "," + bendY,
          textX: r.endX,
          valueY: r.endY - textGap,
          nameY: r.endY + textGap,
          anchor: r.isRight ? "end" : "start",
        };
      }

      this.labelItems = items;
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.label-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: visible;
}
</style>
