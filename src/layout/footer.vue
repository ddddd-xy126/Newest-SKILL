<template>
  <div class="footer">
    <!-- 导航背景图 -->
    <img class="nav-bg" src="@images/layout/nav-bg.png" alt="" />

    <!-- 二级导航区域 — 弧形 + 小圆点 -->
    <div class="secondary-nav" v-if="secondaryNavList.length">
      <div v-for="(item, idx) in secondaryNavList" :key="item.id" class="secondary-nav-item"
        :class="{ active: item.isActive }" :style="getSecondaryStyle(idx)" @click="handleSecondaryNavClick(item)">
        <div class="secondary-nav-up"
          :style="item.isActive ? { backgroundImage: 'url(' + secondaryBgActive + ')' } : {}">
          <span >{{ item.name }}</span>
        </div>
        <i class="dot"></i>
      </div>
    </div>

    <!-- 一级导航 — 弧形旋转轮盘 -->
    <div class="primary-nav">
      <div v-for="(item, idx) in navList" :key="item.id" class="nav-item" :class="{ active: item.isActive }"
        :style="getNavItemStyle(idx)" @click="handleNavClick(item)">
        <img v-if="item.isActive" class="nav-item-bg" src="@images/layout/navItem-bg-active.png" alt="" />
        <img class="nav-icon" :src="item.isActive ? item.activeIcon : item.icon" alt="" />
        <span class="nav-name">{{ item.name }}</span>
      </div>
    </div>

    <!-- AI 按钮 -->
    <div class="ai-btn">
      <img src="@images/layout/AI.png" alt="" class="ai-icon" />
    </div>
  </div>
</template>

<script>
/**
 * 一级导航弧形槽位 (offset -3 ~ +3)
 */
const ARC_SLOTS = [
  { x: -17, y: 3.8, scale: 1, opacity: 0.45 },  // -3
  { x: -11.5, y: 2, scale: 1, opacity: 0.6 },   // -2
  { x: -6, y: 0.6, scale: 1, opacity: 0.85 },  // -1
  { x: 0, y: 0, scale: 1, opacity: 1 },      //  0 (中心)
  { x: 6, y: 0.6, scale: 1, opacity: 0.85 },  // +1
  { x: 11.5, y: 2, scale: 1, opacity: 0.6 },   // +2
  { x: 17, y: 3.8, scale: 1, opacity: 0.45 },  // +3
];
/** 转盘换位：屏幕外进出位置 */
const OFF_SCREEN = {
  left: { x: -28, y: 10.0, scale: 1, opacity: 0 },
  right: { x: 28, y: 10.0, scale: 1, opacity: 0 },
};
/** 二级导航弧形槽位 */
const SUB_ARC_SLOTS_5 = [
  { x: -12, y: 1.9, scale: 0.85, opacity: 0.6 },
  { x: -6, y: 0.48, scale: 0.92, opacity: 0.8 },
  { x: 0, y: -0.1, scale: 1, opacity: 1 },
  { x: 6, y: 0.48, scale: 0.92, opacity: 0.8 },
  { x: 12, y: 1.9, scale: 0.85, opacity: 0.6 },
];

const SUB_ARC_SLOTS_2 = [
  { x: -4, y: 0.15, scale: 0.95, opacity: 0.85 },
  { x: 4, y: 0.15, scale: 0.95, opacity: 0.85 },
];

function buildSlotStyle(slot) {
  return "translateX(calc(-50% + " + slot.x + "vw)) translateY(" + slot.y + "rem) scale(" + slot.scale + ")";
}

function calcOffset(idx, activeIdx, total) {
  var diff = idx - activeIdx;
  if (diff > Math.floor(total / 2)) diff -= total;
  if (diff < -Math.floor(total / 2)) diff += total;
  return diff;
}

export default {
  name: "Footer",
  data() {
    return {
      // 转盘动画状态: { [itemId]: 'exit' | 'jump' }
      wrapState: {},
      // 转盘旋转方向: >0 左旋(点击右侧项), <0 右旋(点击左侧项)
      wrapDirection: 0,
      // 二级导航激活背景图
      secondaryBgActive: require("@/assets/images/layout/secondary-navItem-bg-active.png"),
      navList: [
        {
          id: 1, name: "景区态势", pathPrefix: "/page_1", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon1-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon1.png"),
          children: [
            { id: 11, name: "总览", path: "/page_1/1", isActive: false },
            { id: 12, name: "接驳运力", path: "/page_1/2", isActive: false },
            { id: 13, name: "路网态势", path: "/page_1/3", isActive: false },
            { id: 14, name: "智慧停车", path: "/page_1/4", isActive: false },
            { id: 15, name: "智慧公厕", path: "/page_1/5", isActive: false },
          ],
        },
        {
          id: 2, name: "客流管控", pathPrefix: "/page_2", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon2-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon2.png"),
          children: [
            { id: 21, name: "客流感知", path: "/page_2/1", isActive: false },
            { id: 22, name: "孪生仿真", path: "/page_2/2", isActive: false },
          ],
        },
        {
          id: 3, name: "生态保育", pathPrefix: "/page_3", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon3-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon3.png"),
          children: [
            { id: 31, name: "珍惜物种", path: "/page_3/1", isActive: false },
            { id: 32, name: "气象预警", path: "/page_3/2", isActive: false },
          ],
        },
        {
          id: 4, name: "森林防火", pathPrefix: "/page_4", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon4-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon4.png"),
          children: [
            { id: 41, name: "物联感知", path: "/page_4/1", isActive: false },
            { id: 42, name: "火险评估", path: "/page_4/2", isActive: false },
          ],
        },
        {
          id: 5, name: "周界安防", pathPrefix: "/page_5", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon5-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon5.png"),
          children: [
            { id: 51, name: "防区总览", path: "/page_5/1", isActive: false },
            { id: 52, name: "区里调度", path: "/page_5/2", isActive: false },
          ],
        },
        {
          id: 6, name: "协同调度", pathPrefix: "/page_6", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon6-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon6.png"),
          children: [
            { id: 61, name: "待办事件池", path: "/page_6/1", isActive: false },
            { id: 62, name: "网络巡更", path: "/page_6/2", isActive: false },
          ],
        },
        {
          id: 7, name: "应急救援", pathPrefix: "/page_7", isActive: false,
          icon: require("@/assets/images/layout/navItem-icon7-active.png"),
          activeIcon: require("@/assets/images/layout/navItem-icon7.png"),
          children: [
            { id: 71, name: "报警态势", path: "/page_7/1", isActive: false },
            { id: 72, name: "基建分布", path: "/page_7/2", isActive: false },
          ],
        },
      ],
    };
  },
  computed: {
    activeNavIndex() {
      var idx = this.navList.findIndex(function (i) { return i.isActive; });
      return idx >= 0 ? idx : 0;
    },
    secondaryNavList() {
      return this.navList[this.activeNavIndex]
        ? this.navList[this.activeNavIndex].children
        : [];
    },
    activeSecondaryIndex() {
      var idx = this.secondaryNavList.findIndex(function (i) { return i.isActive; });
      return idx >= 0 ? idx : 0;
    },
  },
  watch: {
    "$route.path": {
      handler(newPath) {
        this.navList.forEach(function (item) {
          item.isActive = newPath.startsWith(item.pathPrefix);
          if (item.children) {
            item.children.forEach(function (child) {
              child.isActive = newPath === child.path;
            });
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    /* ── 一级导航样式（转盘式） ── */
    getNavItemStyle(idx) {
      var item = this.navList[idx];
      var ws = this.wrapState[item.id];
      var total = this.navList.length;

      // 阶段1: 沿旋转方向滑出屏幕
      if (ws === "exit") {
        var exitSide = this.wrapDirection > 0 ? OFF_SCREEN.left : OFF_SCREEN.right;
        return {
          transform: buildSlotStyle(exitSide),
          opacity: 0,
          transition: "transform 0.35s ease-in, opacity 0.35s ease-in",
          zIndex: 0,
        };
      }

      // 阶段2: 瞬移到对面屏幕外（关闭 transition）
      if (ws === "jump") {
        var entrySide = this.wrapDirection > 0 ? OFF_SCREEN.right : OFF_SCREEN.left;
        return {
          transform: buildSlotStyle(entrySide),
          opacity: 0,
          transition: "none",
          zIndex: 0,
        };
      }

      // 正常状态（含阶段3：从对面滑入）
      var offset = calcOffset(idx, this.activeNavIndex, total);
      var slotIdx = offset + 3;
      var slot = ARC_SLOTS[slotIdx];
      if (!slot) return { opacity: 0, pointerEvents: "none", transform: "translateX(-50%) scale(0.5)" };
      return {
        transform: buildSlotStyle(slot),
        opacity: slot.opacity,
        zIndex: 10 - Math.abs(offset),
      };
    },

    /* ── 二级导航弧形 ── */
    getSecondaryStyle(idx) {
      var list = this.secondaryNavList;
      var count = list.length;
      var slots;
      if (count <= 2) {
        slots = SUB_ARC_SLOTS_2;
      } else {
        slots = SUB_ARC_SLOTS_5;
      }
      var center = Math.floor(slots.length / 2);
      var half = Math.floor(count / 2);
      var startIdx = center - half;
      var slot = slots[startIdx + idx];
      if (!slot) return { opacity: 0 };
      return {
        transform: buildSlotStyle(slot),
        opacity: slot.opacity,
        zIndex: 5 - Math.abs(idx - half),
      };
    },

    handleNavClick(item) {
      if (this.$route.path.startsWith(item.pathPrefix)) return;

      var oldIdx = this.activeNavIndex;
      var newIdx = this.navList.findIndex(function (n) { return n.id === item.id; });
      var total = this.navList.length;
      var self = this;

      // 计算旋转方向（点击右侧 >0 → 左旋，点击左侧 <0 → 右旋）
      var clickedOffset = calcOffset(newIdx, oldIdx, total);

      // 检测哪些项需要转盘换位（偏移量跳跃 > 3）
      var wraps = {};
      this.navList.forEach(function (nav, i) {
        var oldOff = calcOffset(i, oldIdx, total);
        var newOff = calcOffset(i, newIdx, total);
        if (Math.abs(newOff - oldOff) > 3) {
          wraps[nav.id] = "exit";
        }
      });

      if (Object.keys(wraps).length > 0) {
        // 记录旋转方向，启动阶段1：沿旋转方向滑出
        this.wrapDirection = clickedOffset;
        this.wrapState = wraps;

        // 阶段1结束后 → 阶段2：瞬移到对面屏幕外
        setTimeout(function () {
          var jumped = {};
          Object.keys(self.wrapState).forEach(function (id) {
            jumped[id] = "jump";
          });
          self.wrapState = jumped;

          // 下一帧清除 → 恢复 transition → 阶段3：从对面滑入最终位置
          self.$nextTick(function () {
            requestAnimationFrame(function () {
              self.wrapState = {};
            });
          });
        }, 380);
      }

      this.$router.push(item.children[0].path);
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
}

/* ——— 二级导航弧形 ——— */
.secondary-nav {
  position: absolute;
  bottom: 67%;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 2;
  pointer-events: none;
}

.secondary-nav-item {
  position: absolute;
  left: 50%;
  bottom: 0;
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

/* ——— 一级导航弧形轮盘 ——— */
.primary-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.nav-item {
  position: absolute;
  left: 50%;
  bottom: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  padding: pxToRem(8) pxToRem(12);
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  .nav-item-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: pxToRem(147);
    height: pxToRem(94);
    object-fit: contain;
    pointer-events: none;
  }

  .nav-icon {
    position: relative;
    z-index: 1;
    width: pxToRem(24);
    height: pxToRem(24);
    margin-bottom: pxToRem(4);
  }

  .nav-name {
    position: relative;
    z-index: 1;
    font-family: var(--font-family-Alimama-ShuHeiTi-Bold);
    font-size: pxToRem(15);
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    letter-spacing: 0.05em;
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
