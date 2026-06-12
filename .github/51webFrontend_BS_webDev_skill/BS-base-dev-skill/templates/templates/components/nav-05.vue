<!--
  NAV-05 左下地球弧形轨道
  ────────────────────────────────────────────
  视觉行为：
    - N 项沿屏幕左下四分之一圆排布，激活位永远在弧线顶端
    - 单向滚动：点击 offset=k 的项，所有项 offset -= k，激活项归位到顶端
    - 越界项（offset<0 或 >total-1）瞬移到对侧屏幕外，按 staggerDelay 错峰滑入
    - 独立 nav-bg-highlight 图层 transform:rotate() 跟随激活位旋转
    - 切换时先瞬切到被点项角度再平滑回归，制造"高光跟随转过去"的视觉

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, pathPrefix }>
      initialActiveId [String, Number]   可选
      options        Object              可选，curvePositions/动画时长等
    Events:
      @nav-change   { item, index, level: 'primary' }

  业务隔离铁律：
    - 本组件不读 $route、不调 $router、不引 vuex。
    - 父组件通过监听 $route 推算 initialActiveId 并响应 @nav-change 做跳转。

  来源：嘉兴生态灌区 src/layout/footer.vue 抽取通用化。
-->
<template>
  <div class="orbit-nav">
    <div class="nav-bg-clip">
      <img class="nav-bg-img" src="@/assets/images/layout/nav-bg(1).png" alt="" />
      <img class="nav-bg-light" src="@/assets/images/layout/nav-bg-light.png" alt="" />
      <img
        class="nav-bg-highlight"
        :class="{ 'no-highlight-transition': highlightNoTransition }"
        :style="{ transform: `rotate(${highlightAngle}deg)` }"
        src="@/assets/images/layout/nav-bg-highlight.png"
        alt=""
      />
    </div>

    <div class="orbit-container">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="orbit-item"
        :class="{ 'no-transition': noTransitionItems[item.id] }"
        :style="getItemStyle(index)"
        @click="handleNavClick(item, index)"
      >
        <div class="orbit-item-inner">
          <div :class="['nav-text', { active: index === activeNavIndex }]">
            <span>{{ item.name }}</span>
          </div>
          <img
            class="nav-item-bg"
            :src="index === activeNavIndex ? navActiveImg : navNormalImg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav05",
  props: {
    list: { type: Array, required: true },
    initialActiveId: { type: [String, Number], default: null },
    options: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      navActiveImg: require("@/assets/images/layout/navItem-bg-active.png"),
      navNormalImg: require("@/assets/images/layout/navItem-bg.png"),
      activeNavIndex: 0,
      slotOffsets: [],
      noTransitionItems: {},
      isAnimating: false,
      highlightAngle: 0,
      highlightNoTransition: false,
    };
  },
  computed: {
    cfg() {
      return {
        // offset -1 → idx 0（屏幕上方退出）
        // offset  0 → idx 1（激活位/顶端）
        // offset  1 → idx 2
        // offset  2 → idx 3
        // offset  3 → idx 4（最下方可见）
        // offset  4 → idx 5（屏幕下方入场）
        curvePositions: [
          { left: 25, top: 15 },
          { left: 41.5, top: 21 },
          { left: 60, top: 36 },
          { left: 70, top: 56 },
          { left: 75, top: 80 },
          { left: 78, top: 92 },
        ],
        transitionDuration: 450,
        staggerDelay: 120,
        aspectRatio: 308.62 / 211,
        highlightBaseOffset: -8,        // 高光默认指向 12 点的微调
        highlightActiveCorrection: -15, // 激活位（offset 0）额外偏移
        ...this.options,
      };
    },
  },
  watch: {
    initialActiveId: {
      immediate: false,
      handler() { this._syncActive(); },
    },
    list: {
      immediate: false,
      handler() { this._syncActive(); },
    },
  },
  mounted() {
    this._syncActive();
    this.highlightAngle = this._getHighlightAngle(0);
  },
  methods: {
    _syncActive() {
      if (this.isAnimating) return;
      const total = this.list.length;
      if (total === 0) {
        this.slotOffsets = [];
        return;
      }
      let idx = 0;
      if (this.initialActiveId != null) {
        const found = this.list.findIndex((it) => it.id === this.initialActiveId);
        if (found >= 0) idx = found;
      }
      this.activeNavIndex = idx;
      this._initSlots();
    },

    _initSlots() {
      const total = this.list.length;
      this.slotOffsets = this.list.map(
        (_, i) => (i - this.activeNavIndex + total) % total,
      );
    },

    /**
     * 根据 offset 计算高光指向的角度
     * 高光图围绕自身中心旋转，需以该中心为原点计算指向导航项的方向角
     */
    _getHighlightAngle(offset) {
      const { curvePositions, aspectRatio, highlightBaseOffset, highlightActiveCorrection } = this.cfg;
      const posIdx = Math.max(0, Math.min(curvePositions.length - 1, offset + 1));
      const pos = curvePositions[posIdx];

      // 高光旋转中心在 footer 百分比坐标系中的位置
      const cx = 10.5 / aspectRatio;
      const cy = 89.5;
      const dx = (pos.left - cx) * aspectRatio;
      const dy = cy - pos.top;
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      const extra = offset === 0 ? highlightActiveCorrection : 0;
      return 90 - angleDeg + highlightBaseOffset + extra;
    },

    getItemStyle(index) {
      const offset = this.slotOffsets[index];
      const { curvePositions } = this.cfg;
      const posIdx = Math.max(0, Math.min(curvePositions.length - 1, offset + 1));
      const pos = curvePositions[posIdx];
      const opacity = offset >= 0 && offset <= 3 ? 1 : 0;

      let top = pos.top;
      // 入场位置需确保在视口外，适配不同分辨率
      if (offset >= 4 && this.$el) {
        const rect = this.$el.getBoundingClientRect();
        if (rect.height > 0) {
          const vh = window.innerHeight;
          const pxY = rect.top + (pos.top / 100) * rect.height;
          if (pxY < vh) {
            top = ((vh - rect.top + 50) / rect.height) * 100;
          }
        }
      }

      return {
        left: pos.left + "%",
        top: top + "%",
        transform: "translate(-50%, -50%)",
        opacity,
        zIndex: offset === 0 ? 20 : 10,
      };
    },

    /**
     * 点击导航项 —— 两阶段动画
     * Phase 1：所有项滑动 delta，越界项淡出
     * Phase 2：越界项瞬移到对侧屏幕外，按 staggerDelay 错峰滑入
     */
    handleNavClick(item, index) {
      const delta = this.slotOffsets[index];
      if (delta === 0 || this.isAnimating) return;

      const total = this.list.length;
      const duration = this.cfg.transitionDuration;
      const staggerDelay = this.cfg.staggerDelay;
      this.isAnimating = true;

      // 高光：先瞬切到被点项角度，再平滑回归激活位
      this.highlightNoTransition = true;
      this.highlightAngle = this._getHighlightAngle(delta);
      this.$nextTick(() => {
        void this.$el.offsetHeight;
        this.highlightNoTransition = false;
        this.$nextTick(() => {
          void this.$el.offsetHeight;
          this.highlightAngle = this._getHighlightAngle(0);
        });
      });

      // Phase 1
      const newOffsets = this.slotOffsets.map((o) => o - delta);
      const wrapping = [];
      const finalOffsets = newOffsets.map((offset, i) => {
        if (offset < 0) {
          wrapping.push({ idx: i, entryOffset: 4 });
          return offset + total;
        } else if (offset > total - 1) {
          wrapping.push({ idx: i, entryOffset: -1 });
          return offset - total;
        }
        return offset;
      });
      this.slotOffsets = [...newOffsets];
      this.activeNavIndex = index;

      // Phase 2
      if (wrapping.length > 0) {
        setTimeout(() => {
          const ids = {};
          wrapping.forEach(({ idx, entryOffset }) => {
            ids[this.list[idx].id] = true;
            this.$set(this.slotOffsets, idx, entryOffset);
          });
          this.noTransitionItems = ids;

          this.$nextTick(() => {
            void this.$el.offsetHeight;
            this.noTransitionItems = {};
            this.$nextTick(() => {
              void this.$el.offsetHeight;
              const sorted = [...wrapping].sort(
                (a, b) => finalOffsets[a.idx] - finalOffsets[b.idx],
              );
              sorted.forEach(({ idx }, i) => {
                setTimeout(() => {
                  this.$set(this.slotOffsets, idx, finalOffsets[idx]);
                }, i * staggerDelay);
              });
              setTimeout(() => {
                this.isAnimating = false;
              }, (sorted.length - 1) * staggerDelay + duration);
            });
          });
        }, duration);
      } else {
        setTimeout(() => { this.isAnimating = false; }, duration);
      }

      this.$emit("nav-change", { item, index, level: "primary" });
    },
  },
};
</script>

<style lang="scss" scoped>
.orbit-nav {
  width: 79%;
  aspect-ratio: 340 / 225;
  position: absolute;
  bottom: 0;
  left: 0;
}

.nav-bg-clip {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  pointer-events: none;
}

.nav-bg-img {
  position: absolute;
  left: -59%;
  bottom: -59%;
  height: 140%;
  width: 140%;
  object-fit: contain;
  pointer-events: none;
  z-index: 2;
}

.nav-bg-light {
  position: absolute;
  left: -59%;
  bottom: -59%;
  height: 140%;
  width: 140%;
  object-fit: contain;
  pointer-events: none;
  z-index: 3;
}

.nav-bg-highlight {
  position: absolute;
  left: -59%;
  bottom: -59%;
  height: 136%;
  width: 136%;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
  transform-origin: 50% 50%;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);

  &.no-highlight-transition { transition: none !important; }
}

.orbit-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orbit-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);

  &.no-transition { transition: none !important; }
}

.orbit-item-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1.2rem 1.5rem;
  min-width: 12rem;

  .nav-text {
    position: relative;
    z-index: 2;
    span {
      color: var(--color-desc);
      -webkit-text-fill-color: var(--color-desc);
      font-size: pxToRem(18);
      line-height: pxToRem(18);
      font-family: var(--font-family-OPPOSans-Medium);
      white-space: nowrap;
      transition: all 0.3s;
    }
    &.active span {
      background: #ffffff;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-family: var(--font-family-OPPOSans-Bold);
    }
  }

  .nav-item-bg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    transition: opacity 0.4s;
  }
}
</style>
