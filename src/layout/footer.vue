<!--
  底部导航：NAV-04 底部居中弧形转盘（直接落地版）
  ─────────────────────────────────────────────────
  对应 knowledge/nav-types.md §5 NAV-04 规范：
    - N 项沿弧形铺开，激活位永远在弧线中央
    - 双向滚动：点左侧整体右移，点右侧整体左移
    - 越界项瞬移到对称侧后再滑入（无穿越动画）
    - 激活项 scale 放大 + 切换 active 图标 + 显示激活背景图
    - 可挂二级（弧形圆点 + 文字），二级延迟出现以避免视觉突兀

  说明：本项目直接把 NAV-04 转盘逻辑写在 footer.vue 内部，
        路由跳转/激活同步仍由本组件统一处理。
-->
<template>
  <div class="footer">
    <!-- 导航背景图 -->
    <img class="nav-bg" src="@images/layout/nav-bg.png" alt="" />

    <!-- 二级导航：弧形圆点 + 文字 -->
    <div class="secondary-nav" v-if="currentSecNavList.length > 0">
      <div
        v-for="(item, index) in currentSecNavList"
        :key="item.id"
        class="secondary-nav-item"
        :class="{ active: item.isActive }"
        :style="getSecNavStyle(index)"
        @click="handleSecondaryNavClick(item)"
      >
        <div
          class="secondary-nav-up"
          :style="item.isActive ? { backgroundImage: 'url(' + secondaryBgActive + ')' } : {}"
        >
          <span>{{ item.name }}</span>
        </div>
        <i class="dot"></i>
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
          'no-transition': noTransitionSlots.has(slot.id),
        }"
        :style="getNavItemStyle(slot.offset)"
        @click="selectNav(slot.offset)"
      >
        <img
          v-if="slot.offset === 0"
          class="nav-item-bg"
          src="@images/layout/navItem-bg-active.png"
          alt=""
        />
        <img
          class="nav-icon"
          :src="slot.offset === 0 ? slot.item.activeIcon : slot.item.icon"
          alt=""
        />
        <span class="nav-name">{{ slot.item.name }}</span>
      </div>
    </div>

    <!-- AI 按钮 -->
    <div class="ai-btn">
      <img src="@images/layout/AI.png" alt="" class="ai-icon" />
    </div>
  </div>
</template>

<script>
// NAV-04 默认几何 / 动画参数，按 nav-types.md §5 给的默认值
const NAV_CFG = {
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
};

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export default {
  name: "Footer",
  data() {
    return {
      secondaryBgActive: require("@/assets/images/layout/secondary-navItem-bg-active.png"),
      // 转盘内部状态
      activeIndex: 0,
      carouselSlots: [],          // [{ id, offset, item }]
      noTransitionSlots: new Set(),
      isAnimating: false,
      delayedSecNavList: [],
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1920,

      navList: [
        {
          id: 1, name: "景区态势", pathPrefix: "/page_1",
          icon: require("@/assets/images/layout/navItem-icon1-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon1.png"),
          children: [
            { id: 11, name: "总览", path: "/page_1/1" },
            { id: 12, name: "接驳运力", path: "/page_1/2" },
            { id: 13, name: "路网态势", path: "/page_1/3" },
            { id: 14, name: "智慧停车", path: "/page_1/4" },
            { id: 15, name: "智慧公厕", path: "/page_1/5" },
          ],
        },
        {
          id: 2, name: "客流管控", pathPrefix: "/page_2",
          icon: require("@/assets/images/layout/navItem-icon2-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon2.png"),
          children: [
            { id: 21, name: "客流感知", path: "/page_2/1" },
            { id: 22, name: "孪生仿真", path: "/page_2/2" },
          ],
        },
        {
          id: 3, name: "生态保育", pathPrefix: "/page_3",
          icon: require("@/assets/images/layout/navItem-icon3-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon3.png"),
          children: [
            { id: 31, name: "珍惜物种", path: "/page_3/1" },
            { id: 32, name: "气象预警", path: "/page_3/2" },
          ],
        },
        {
          id: 4, name: "森林防火", pathPrefix: "/page_4",
          icon: require("@/assets/images/layout/navItem-icon4-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon4.png"),
          children: [
            { id: 41, name: "物联感知", path: "/page_4/1" },
            { id: 42, name: "火险评估", path: "/page_4/2" },
          ],
        },
        {
          id: 5, name: "周界安防", pathPrefix: "/page_5",
          icon: require("@/assets/images/layout/navItem-icon5-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon5.png"),
          children: [
            { id: 51, name: "防区总览", path: "/page_5/1" },
            { id: 52, name: "区里调度", path: "/page_5/2" },
          ],
        },
        {
          id: 6, name: "协同调度", pathPrefix: "/page_6",
          icon: require("@/assets/images/layout/navItem-icon6-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon6.png"),
          children: [
            { id: 61, name: "待办事件池", path: "/page_6/1" },
            { id: 62, name: "网络巡更", path: "/page_6/2" },
          ],
        },
        {
          id: 7, name: "应急救援", pathPrefix: "/page_7",
          icon: require("@/assets/images/layout/navItem-icon7-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon7.png"),
          children: [
            { id: 71, name: "报警态势", path: "/page_7/1" },
            { id: 72, name: "基建分布", path: "/page_7/2" },
          ],
        },
      ],
    };
  },
  computed: {
    currentSecNavList() {
      return this.delayedSecNavList;
    },
  },
  watch: {
    "$route.path": {
      handler(newPath) {
        // 一级：路径前缀匹配
        const idx = this.navList.findIndex((n) => newPath.startsWith(n.pathPrefix));
        const targetIdx = idx >= 0 ? idx : 0;
        if (targetIdx !== this.activeIndex) {
          // 路由先发生，再驱动轮盘动画到对应位置
          const delta = this._calcDelta(targetIdx, this.activeIndex, this.navList.length);
          this._animateTo(delta);
        }
        // 二级：路径完全匹配
        this.$nextTick(() => {
          if (this.delayedSecNavList.length) {
            this.delayedSecNavList = this.delayedSecNavList.map((c) => ({
              ...c,
              isActive: c.path === newPath,
            }));
          }
        });
      },
      immediate: false,
    },
  },
  mounted() {
    // 根据当前路由初始化激活项
    const path = this.$route.path || "";
    const idx = this.navList.findIndex((n) => path.startsWith(n.pathPrefix));
    this.activeIndex = idx >= 0 ? idx : 0;
    this._initCarouselSlots();
    this._refreshSecondary(path);

    window.addEventListener("resize", this._handleResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this._handleResize);
  },
  methods: {
    _handleResize() {
      this.viewportWidth = window.innerWidth;
    },

    /** 初始化转盘槽位：每个槽位绑定 list[i]，offset 限制在 [-sideCount, sideCount] */
    _initCarouselSlots() {
      const total = this.navList.length;
      const sideCount = Math.floor(total / 2);
      const slots = [];
      for (let i = 0; i < total; i++) {
        let offset = i - this.activeIndex;
        if (offset > sideCount) offset -= total;
        else if (offset < -sideCount) offset += total;
        slots.push({ id: i, offset, item: this.navList[i] });
      }
      this.carouselSlots = slots;
    },

    /** 计算 from→to 的最短有向距离（带循环） */
    _calcDelta(toIdx, fromIdx, total) {
      const sideCount = Math.floor(total / 2);
      let delta = toIdx - fromIdx;
      if (delta > sideCount) delta -= total;
      else if (delta < -sideCount) delta += total;
      return delta;
    },

    _refreshSecondary(path) {
      const active = this.navList[this.activeIndex];
      if (active && active.children && active.children.length) {
        this.delayedSecNavList = active.children.map((c, i) => ({
          ...c,
          isActive: path ? c.path === path : i === 0,
        }));
      } else {
        this.delayedSecNavList = [];
      }
    },

    /** 一级槽位样式：按角度+半径算出弧形位置 + 激活项 scale 1.1 */
    getNavItemStyle(offset) {
      const total = this.navList.length;
      const sideCount = Math.floor(total / 2);
      const { startAngle, endAngle, arcRadiusRatio, arcRadiusMin, arcRadiusMax } = NAV_CFG;
      const angleStep = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
      const angle = offset * angleStep;

      const arcRadius = clamp(this.viewportWidth * arcRadiusRatio, arcRadiusMin, arcRadiusMax);
      const angleRad = (angle * Math.PI) / 180;
      const x = arcRadius * Math.sin(angleRad);
      const y = -arcRadius * Math.cos(angleRad) + arcRadius;

      const distance = Math.abs(offset);
      let opacity;
      if (distance === 0) opacity = 1;
      else if (distance <= sideCount) opacity = 0.9 - (distance - 1) * 0.15;
      else opacity = 0;

      const scale = distance === 0 ? 1.1 : 1;
      return {
        opacity,
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        zIndex: distance === 0 ? 10 : Math.max(0, sideCount + 1 - distance),
      };
    },

    /** 二级弧形圆点位置 */
    getSecNavStyle(index) {
      const total = this.currentSecNavList.length;
      const { secStartAngle, secEndAngle, secRadiusRatio, secRadiusMin, secRadiusMax } = NAV_CFG;
      const angleStep = total > 1 ? (secEndAngle - secStartAngle) / (total - 1) : 0;
      const angle = secStartAngle + index * angleStep;
      const radius = clamp(this.viewportWidth * secRadiusRatio, secRadiusMin, secRadiusMax);
      const angleRad = (angle * Math.PI) / 180;
      const x = radius * Math.sin(angleRad);
      const y = -radius * Math.cos(angleRad) + radius;
      return { transform: `translate(${x}px, ${y}px)` };
    },

    /** 点击一级：先 push 路由（route watcher 会触发动画） */
    selectNav(clickedOffset) {
      if (clickedOffset === 0 || this.isAnimating) return;
      const total = this.navList.length;
      const targetIdx = (((this.activeIndex + clickedOffset) % total) + total) % total;
      const target = this.navList[targetIdx];
      const firstChild = target.children && target.children[0];
      const targetPath = firstChild ? firstChild.path : target.pathPrefix;
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath);
      }
    },

    /** 转盘动画核心：越界先瞬移到对称侧，再统一滑动 */
    _animateTo(delta) {
      if (delta === 0) return;
      this.isAnimating = true;

      const total = this.navList.length;
      const sideCount = Math.floor(total / 2);

      // Step 1: 即将越界的槽位先打 no-transition 瞬移到对侧等候区
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

      // Step 4: 动画结束后刷新二级 + 解锁
      setTimeout(() => {
        this.isAnimating = false;
        this.delayedSecNavList = [];
        this.$nextTick(() => {
          this._refreshSecondary(this.$route.path);
        });
      }, NAV_CFG.transitionDuration);
    },

    handleSecondaryNavClick(item) {
      if (this.$route.path !== item.path) {
        this.$router.push(item.path);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
}

/* 导航背景图 */
.nav-bg {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 62.6%;
  pointer-events: none;
  z-index: 1;
}

/* ——— 二级导航：弧形圆点 ——— */
.secondary-nav {
  position: absolute;
  bottom: 67%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: pxToRem(900);
  height: pxToRem(60);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  pointer-events: none;
}

.secondary-nav-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  .secondary-nav-up {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: pxToRem(112);
    aspect-ratio: 112/44;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }

  span {
    position: relative;
    z-index: 1;
    font-family: var(--font-family-Alimama-ShuHeiTi-Bold);
    font-size: pxToRem(14);
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    letter-spacing: 0.05em;
  }

  /* 小圆点指示器 */
  .dot {
    display: block;
    width: pxToRem(10);
    height: pxToRem(10);
    border-radius: 50%;
    background: #3b9cff;
    margin-top: pxToRem(4);
    transition: background 0.3s;
  }

  &.active {
    span {
      color: #ffffff;
    }
    .dot {
      background: #ffffff;
    }
  }
}

/* ——— 一级导航：弧形循环转盘 ——— */
.primary-nav {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: pxToRem(900);
  height: pxToRem(160);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

.nav-item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: pxToRem(110);
  height: pxToRem(120);
  margin-left: pxToRem(-55);
  margin-top: pxToRem(-60);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s;

  &.no-transition {
    transition: none !important;
  }

  .nav-item-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: pxToRem(147);
    height: pxToRem(94);
    object-fit: contain;
    pointer-events: none;
    z-index: 1;
  }

  .nav-icon {
    position: relative;
    z-index: 2;
    width: pxToRem(24);
    height: pxToRem(24);
    margin-bottom: pxToRem(4);
  }

  .nav-name {
    position: relative;
    z-index: 2;
    font-family: var(--font-family-Alimama-ShuHeiTi-Bold);
    font-size: pxToRem(15);
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    letter-spacing: 0.05em;
    transition: color 0.3s;
  }

  &.active .nav-name {
    color: #ffffff;
  }
}

/* AI 按钮 */
.ai-btn {
  position: absolute;
  right: 10%;
  bottom: 20%;
  pointer-events: auto;
  cursor: pointer;
  z-index: 3;

  .ai-icon {
    width: pxToRem(60);
    height: pxToRem(60);
  }
}
</style>
