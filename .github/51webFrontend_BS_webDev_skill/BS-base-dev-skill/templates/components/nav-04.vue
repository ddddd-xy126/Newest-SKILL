<!--
  NAV-04 底部居中弧形转盘
  ────────────────────────────────────────────
  视觉行为：
    - N 项沿弧形铺开，激活位永远在弧线中央
    - 双向滚动：点左侧整体右移，点右侧整体左移
    - 越界项瞬移到对称侧再滑入（无穿越动画）
    - 激活项 scale 放大 + 切换 active 图标 + 显示激活背景图
    - 可挂二级（弧形圆点 + 文字），二级延迟出现以避免视觉突兀

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, iconNor, iconActive, childList?: [{id,name,path}] }>
      initialActiveId [String, Number]   可选
      options        Object              可选，弧度/半径/动画时长等
    Events:
      @nav-change   { item, index, level: 'primary' | 'secondary' }

  业务隔离铁律：
    - 本组件不读 $route、不调 $router、不引 vuex / API。
    - 路由跳转、激活同步、业务钩子全部在父组件处理。

  来源：稻城 DEMO src/layout/footer.vue，已剥离 vuex / addPOI 等业务耦合。
-->
<template>
  <div class="carousel-nav">
    <!-- 单张背景图（资源由 layout-rules.md 管理） -->
    <img src="@/assets/images/layout/nav-bg.png" class="nav-bg" alt="" />

    <!-- 二级导航 -->
    <div class="secondary-nav" v-if="currentSecNavList.length > 0">
      <div
        v-for="(item, index) in currentSecNavList"
        :key="item.id"
        class="sec-nav-item"
        :class="{ active: item.isActive }"
        :style="getSecNavStyle(index)"
        @click="onSecondaryClick(item)"
      >
        <span :class="{ 'sec-nav-active-span': item.isActive }">{{ item.name }}</span>
        <div class="sec-nav-dot"></div>
      </div>
    </div>

    <!-- 一级循环转盘导航 -->
    <div class="primary-nav">
      <div
        v-for="slot in carouselSlots"
        :key="slot.id"
        class="nav-item"
        :class="{
          active: slot.offset === 0,
          'side-item': slot.offset !== 0,
          'right-item': slot.offset > 0,
          'left-item': slot.offset < 0,
          'no-transition': noTransitionSlots.has(slot.id),
        }"
        :style="getNavItemStyle(slot.offset)"
        @click="selectNav(slot.offset)"
      >
        <img
          v-if="slot.offset === 0"
          src="@/assets/images/layout/navItem-bg-active.png"
          class="nav-item-active-bg"
          alt=""
        />
        <div class="nav-item-content">
          <img
            :src="slot.offset === 0 ? slot.item.iconActive : slot.item.iconNor"
            class="nav-icon-img"
            alt=""
          />
          <span class="nav-name">{{ slot.item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav04",
  props: {
    list: { type: Array, required: true },
    initialActiveId: { type: [String, Number], default: null },
    options: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      activeIndex: 0,
      delayedSecNavList: [],
      isAnimating: false,
      carouselSlots: [],
      noTransitionSlots: new Set(),
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
    };
  },
  computed: {
    cfg() {
      return {
        startAngle: -20,
        endAngle: 20,
        arcRadiusRatio: 0.42,
        arcRadiusMin: 560,
        arcRadiusMax: 1300,
        secStartAngle: -10,
        secEndAngle: 10,
        secRadiusRatio: 0.52,
        secRadiusMin: 760,
        secRadiusMax: 1650,
        transitionDuration: 680,
        ...this.options,
      };
    },
    currentSecNavList() {
      return this.delayedSecNavList;
    },
  },
  watch: {
    list: {
      immediate: false,
      handler() {
        this._syncFromInitial();
      },
    },
  },
  mounted() {
    this._syncFromInitial();
    window.addEventListener("resize", this._handleResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this._handleResize);
  },
  methods: {
    _handleResize() {
      this.viewportWidth = window.innerWidth;
    },
    _clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
    },

    /**
     * 根据 initialActiveId 或默认首项，初始化激活索引与槽位
     */
    _syncFromInitial() {
      const total = this.list.length;
      if (total === 0) {
        this.carouselSlots = [];
        return;
      }
      let idx = 0;
      if (this.initialActiveId != null) {
        const found = this.list.findIndex((it) => it.id === this.initialActiveId);
        if (found >= 0) idx = found;
      }
      this.activeIndex = idx;
      this._initCarouselSlots();

      const active = this.list[idx];
      this.delayedSecNavList =
        active && active.childList
          ? active.childList.map((c, i) => ({ ...c, isActive: i === 0 }))
          : [];
    },

    /**
     * 初始化转盘槽位：每个槽位绑定 list[i]，offset 限制在 [-sideCount, sideCount]
     */
    _initCarouselSlots() {
      const total = this.list.length;
      const sideCount = Math.floor(total / 2);
      this.carouselSlots = [];
      for (let i = 0; i < total; i++) {
        let offset = i - this.activeIndex;
        if (offset > sideCount) offset -= total;
        else if (offset < -sideCount) offset += total;
        this.carouselSlots.push({ id: i, offset, item: this.list[i] });
      }
    },

    getNavItemStyle(offset) {
      const total = this.list.length;
      const sideCount = Math.floor(total / 2);
      const { startAngle, endAngle, arcRadiusRatio, arcRadiusMin, arcRadiusMax } = this.cfg;
      const angleStep = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
      const angle = offset * angleStep;

      const arcRadius = this._clamp(this.viewportWidth * arcRadiusRatio, arcRadiusMin, arcRadiusMax);
      const angleRad = (angle * Math.PI) / 180;
      const x = arcRadius * Math.sin(angleRad);
      const y = -arcRadius * Math.cos(angleRad) + arcRadius;

      const distance = Math.abs(offset);
      let opacity;
      if (distance === 0) opacity = 1;
      else if (distance <= sideCount) opacity = 0.9;
      else if (distance <= sideCount + 1) opacity = 0.9 * (1 - (distance - sideCount));
      else opacity = 0;

      const scale = distance === 0 ? 1.1 : 1;
      return {
        opacity,
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        zIndex: distance === 0 ? 10 : Math.max(0, sideCount + 1 - Math.round(distance)),
      };
    },

    getSecNavStyle(index) {
      const total = this.currentSecNavList.length;
      const { secStartAngle, secEndAngle, secRadiusRatio, secRadiusMin, secRadiusMax } = this.cfg;
      const angleStep = total > 1 ? (secEndAngle - secStartAngle) / (total - 1) : 0;
      const angle = secStartAngle + index * angleStep;
      const radius = this._clamp(this.viewportWidth * secRadiusRatio, secRadiusMin, secRadiusMax);
      const angleRad = (angle * Math.PI) / 180;
      const x = radius * Math.sin(angleRad);
      const y = -radius * Math.cos(angleRad) + radius;
      return { transform: `translate(${x}px, ${y}px)` };
    },

    /**
     * 点击主导航项，触发转盘动画
     */
    selectNav(clickedOffset) {
      if (clickedOffset === 0 || this.isAnimating) return;
      this.isAnimating = true;

      const total = this.list.length;
      const sideCount = Math.floor(total / 2);
      const delta = clickedOffset;

      // Step 1: 边界处理 —— 即将越界的槽位瞬移到对侧等候区
      const willReposition = [];
      this.carouselSlots.forEach((slot) => {
        const after = slot.offset - delta;
        if (after > sideCount) willReposition.push({ slot, newOffset: slot.offset - total });
        else if (after < -sideCount) willReposition.push({ slot, newOffset: slot.offset + total });
      });

      if (willReposition.length > 0) {
        willReposition.forEach(({ slot, newOffset }) => {
          this.noTransitionSlots.add(slot.id);
          slot.offset = newOffset;
        });
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.noTransitionSlots.clear();
              requestAnimationFrame(() => this._doMove(delta, total));
            });
          });
        });
      } else {
        this._doMove(delta, total);
      }
    },

    _doMove(delta, total) {
      // Step 2: 所有槽位平滑滑动
      this.carouselSlots.forEach((slot) => {
        slot.offset = slot.offset - delta;
      });

      // Step 3: 更新激活索引
      this.activeIndex = (((this.activeIndex + delta) % total) + total) % total;
      const activeItem = this.list[this.activeIndex];

      // Step 4: 动画结束后处理二级 + 解锁
      setTimeout(() => {
        this.isAnimating = false;
        this.delayedSecNavList = [];
        this.$nextTick(() => {
          if (activeItem.childList && activeItem.childList.length > 0) {
            this.delayedSecNavList = activeItem.childList.map((c, i) => ({
              ...c,
              isActive: i === 0,
            }));
          }
        });
      }, this.cfg.transitionDuration);

      // Step 5: 抛出事件（路由跳转由父组件处理）
      this.$emit("nav-change", {
        item: activeItem,
        index: this.activeIndex,
        level: "primary",
      });
    },

    onSecondaryClick(child) {
      const activeNav = this.list[this.activeIndex];
      if (!activeNav || !activeNav.childList) return;
      this.delayedSecNavList = activeNav.childList.map((c) => ({
        ...c,
        isActive: c.id === child.id,
      }));
      this.$emit("nav-change", {
        item: child,
        index: this.activeIndex,
        level: "secondary",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-nav {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: visible;
}

.nav-bg {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: auto;
  pointer-events: none;
  z-index: 1;
}

.secondary-nav {
  position: absolute;
  bottom: px2rem(135);
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: px2rem(900);
  height: px2rem(60);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;

  .sec-nav-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    .sec-nav-dot {
      width: px2rem(10);
      height: px2rem(10);
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      border: px2rem(2) solid rgba(74, 144, 226, 0.5);
      margin-bottom: px2rem(8);
      transition: all 0.3s ease;
    }

    span {
      min-width: px2rem(96);
      display: inline-block;
      text-align: center;
      font-size: px2rem(14);
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
      transition: all 0.3s ease;
      padding: px2rem(10) px2rem(20);
      border-radius: px2rem(4);
      margin-bottom: px2rem(10);
    }

    .sec-nav-active-span {
      background-image: url("~@/assets/images/layout/sec-navItem-bg-active.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
    }

    &.active {
      .sec-nav-dot {
        background: #4a90e2;
        border-color: #4a90e2;
        box-shadow: 0 0 px2rem(10) rgba(74, 144, 226, 0.8);
      }
      span {
        color: #ffffff;
        font-weight: bold;
      }
    }

    &:hover {
      .sec-nav-dot { transform: scale(1.2); }
      span { color: rgba(255, 255, 255, 0.9); }
    }
  }
}

.primary-nav {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: px2rem(800);
  height: px2rem(160);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  overflow: hidden;
}

.nav-item {
  overflow: hidden;
  position: absolute;
  width: px2rem(110);
  height: px2rem(120);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s;
  left: 50%;
  top: 50%;
  margin-left: px2rem(-55);
  margin-top: px2rem(-60);

  &.no-transition { transition: none !important; }

  .nav-item-active-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 110%;
    height: auto;
    pointer-events: none;
    z-index: 1;
  }

  .nav-item-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: px2rem(6);
    z-index: 2;
  }

  .nav-icon-img {
    width: 1.3rem;
    height: 1.3rem;
    object-fit: contain;
    filter: drop-shadow(0 0 px2rem(6) rgba(74, 144, 226, 0.5));
    transition: width 0.65s cubic-bezier(0.4, 0, 0.2, 1),
      height 0.65s cubic-bezier(0.4, 0, 0.2, 1), filter 0.65s ease;
  }

  .nav-name {
    font-size: var(--font-size-14);
    color: #dedede;
    font-family: var(--font-family-primary-Regular);
    white-space: nowrap;
    transition: color 0.65s cubic-bezier(0.4, 0, 0.2, 1),
      font-size 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.active {
    .nav-icon-img {
      filter: drop-shadow(0 0 px2rem(12) rgba(74, 144, 226, 0.9));
    }
    .nav-name {
      color: #ffffff;
      font-weight: bold;
    }
  }

  &.side-item .nav-icon-img { opacity: 0.5; }
  &.side-item .nav-name { color: rgba(255, 255, 255, 0.5); }
  &.right-item .nav-icon-img { opacity: 0.9; }
  &.right-item .nav-name { color: rgba(255, 255, 255, 0.9); }

  &:hover:not(.active) {
    .nav-icon-img { opacity: 0.9; }
    .nav-name { color: rgba(255, 255, 255, 0.9); }
  }
}
</style>
