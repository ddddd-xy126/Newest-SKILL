<template>
  <div class="segment-ring-gauge">
    <div v-for="(item, index) in statusData" :key="index" class="status-item">
      <div class="canvas-wrap">
        <!-- 背景图片 -->
        <img :src="item.bg" class="bg-img" />
        <!-- Canvas 刻度环 -->
        <canvas :ref="'canvas_' + index" class="gauge-canvas"></canvas>
        <!-- 中心百分比文字 -->
        <div class="center-text">
          <span class="percent-value">{{ getPercent(item) }}</span>
          <span class="percent-sign">%</span>
        </div>
      </div>
      <!-- 底部图例 -->
      <div class="legend-label">
        <span class="legend-icon" :style="{ backgroundColor: item.color }">
          <span class="legend-icon-inner"></span>
        </span>
        <span class="legend-text">{{ item.label }}</span>
        <span class="legend-value">{{ item.value }}</span>
        <span class="legend-unit">台</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SegmentRingGauge",
  props: {
    statusData: {
      type: Array,
      default: () => [
        {
          label: "运行",
          value: 87,
          total: 120,
          color: "#00E5C8",
          bg: require("@images/charts/pie-bg3.png"),
        },
        {
          label: "检修",
          value: 26,
          total: 120,
          color: "#F5C518",
          bg: require("@images/charts/pie-bg3.png"),
        },
        {
          label: "停机",
          value: 7,
          total: 120,
          color: "#FF4D4D",
          bg: require("@images/charts/pie-bg3.png"),
        },
      ],
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawAll();
    });
    this._resizeHandler = () => this.drawAll();
    window.addEventListener("resize", this._resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this._resizeHandler);
  },
  watch: {
    statusData: {
      deep: true,
      handler() {
        this.$nextTick(() => this.drawAll());
      },
    },
  },
  methods: {
    getPercent(item) {
      return Math.round((item.value / item.total) * 100);
    },

    drawAll() {
      this.statusData.forEach((item, index) => {
        const refKey = "canvas_" + index;
        const canvasArr = this.$refs[refKey];
        const canvas = Array.isArray(canvasArr) ? canvasArr[0] : canvasArr;
        if (canvas) {
          this.drawGauge(canvas, item);
        }
      });
    },

    drawGauge(canvas, item) {
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.parentElement.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const percent = this.getPercent(item);

      // ── 核心参数 ──────────────────────────────────────
      const totalSegments = 25; // 总块数
      const radius = size * 0.25; // 矩形块中心所在圆的半径
      const rectW = size * 0.026; // 矩形宽度（切线方向）
      const rectH = size * 0.06; // 矩形高度（径向方向）
      const angleStep = (2 * Math.PI) / totalSegments; // 每块间隔角度

      const activeColor = item.color;
      const inactiveColor = "rgba(255,255,255,0.15)";
      const activeCount = Math.round((percent / 100) * totalSegments);

      // 从顶部（-90°）开始，顺时针排列
      const startAngle = -Math.PI / 1;

      for (let i = 0; i < totalSegments; i++) {
        const angle = startAngle + i * angleStep;

        // 矩形中心坐标
        const rx = cx + radius * Math.cos(angle);
        const ry = cy + radius * Math.sin(angle);

        ctx.save();
        // 平移到矩形中心，旋转使矩形朝向圆心
        ctx.translate(rx, ry);
        ctx.rotate(angle + Math.PI / 2);

        // 绘制四边平行的矩形（圆角）
        const x = -rectW / 2;
        const y = -rectH / 2;
        const r = size * 0.008; // 圆角半径

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + rectW - r, y);
        ctx.arcTo(x + rectW, y, x + rectW, y + r, r);
        ctx.lineTo(x + rectW, y + rectH - r);
        ctx.arcTo(x + rectW, y + rectH, x + rectW - r, y + rectH, r);
        ctx.lineTo(x + r, y + rectH);
        ctx.arcTo(x, y + rectH, x, y + rectH - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();

        ctx.shadowBlur = 0;
        if (i < activeCount) {
          ctx.fillStyle = activeColor;
          ctx.shadowColor = activeColor;
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = inactiveColor;
        }
        ctx.fill();

        ctx.restore();
      }

      // 重置阴影
      ctx.shadowBlur = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.segment-ring-gauge {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.3rem 0 0.2rem;
  box-sizing: border-box;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .canvas-wrap {
    position: relative;
    width: 80%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;

    // 背景图：铺满整个 canvas-wrap
    .bg-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      object-fit: contain;
      z-index: 0;
    }

    .gauge-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .center-text {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: baseline;
      gap: 0.05rem;
      pointer-events: none;

      .percent-value {
        font-size: var(--font-size-16);
        color: #ffffff;
        line-height: 1;
      }

      .percent-sign {
        font-size: var(--font-size-12);
        color: #eef8fd;
      }
    }
  }

  .legend-label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.5rem;

    // 外框正方形 icon，内有白色小矩形
    .legend-icon {
      width: 0.6rem;
      height: 0.6rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .legend-icon-inner {
        width: 60%;
        height: 60%;
        background: #ffffff;
        border-radius: 1px;
      }
    }

    .legend-text {
      font-size: 1.3rem;
      color: #cad5e4;
      font-family: var(--font-family-primary-Regular);
    }

    .legend-value {
      font-size: 1.3rem;
      color: #ffffff;
      font-family: var(--font-family-primary-Bold);
    }

    .legend-unit {
      padding-top: 0.25rem;
      font-size: 1.3rem;
      font-family: var(--font-family-primary-Regular);
      color: #dbf5ff;
    }
  }
}
</style>
