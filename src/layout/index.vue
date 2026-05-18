<template>
  <div class="layout">
    <!-- 遮罩装饰图 -->
    <img class="masktem" src="@images/layout/mask.png" alt="" />
    <header class="layout-header" v-if="header">
      <slot name="header"></slot>
    </header>
    <div class="header-tool" v-if="headerTool">
      <slot name="header-tool"></slot>
    </div>
    <aside class="layout-aside-left" :class="{ collapsed: isPanelCollapsed }" v-if="aside">
      <slot name="aside-left"></slot>
    </aside>
    <aside class="layout-aside-left-tools" :class="{ collapsed: isPanelCollapsed }" v-if="aside">
      <div class="left-tool-list">
        <div class="tool-icon-btn" v-for="tool in leftToolList" :key="tool.id" @click="handleToolClick(tool)">
          <img :src="tool.icon" :alt="tool.name" />
        </div>
      </div>
    </aside>
    <!-- 左侧收起按钮 -->
    <div class="collapse-btn collapse-left" :class="{ collapsed: isPanelCollapsed }" v-if="aside" @click="togglePanel">
      <img src="@images/layout/left-panel-collapse.png" alt="" />
    </div>
    <!-- 右侧收起按钮 -->
    <div class="collapse-btn collapse-right" :class="{ collapsed: isPanelCollapsed }" v-if="aside" @click="togglePanel">
      <img src="@images/layout/right-panel-collapse.png" alt="" />
    </div>
    <aside class="layout-aside-right-tools" v-if="rightTools">
      <slot name="aside-right-tools"></slot>
    </aside>
    <aside class="layout-aside-right" :class="{ collapsed: isPanelCollapsed }" v-if="aside">
      <slot name="aside-right"></slot>
    </aside>
    <main class="layout-main" v-if="main">
      <slot></slot>
    </main>
    <main class="layout-scene" v-if="scene">
      <slot name="scene"></slot>
    </main>
    <div class="footer-tool" v-if="footerTool">
      <slot name="footer-tool"></slot>
    </div>
    <footer class="layout-footer" v-if="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: false,
    },
    main: {
      type: Boolean,
      default: false,
    },
    aside: {
      type: Boolean,
      default: false,
    },
    scene: {
      type: Boolean,
      default: false,
    },
    rightTools: {
      type: Boolean,
      default: false,
    },
    headerTool: {
      type: Boolean,
      default: false,
    },
    footerTool: {
      type: Boolean,
      default: false,
    },
  },
  name: "Layout",
  data() {
    return {
      isPanelCollapsed: false,
      leftToolList: [
        { id: 1, name: "工具1", icon: require("@/assets/images/layout/leftTool-icon1.png") },
        { id: 2, name: "工具2", icon: require("@/assets/images/layout/leftTool-icon2.png") },
        { id: 3, name: "工具3", icon: require("@/assets/images/layout/leftTool-icon3.png") },
        { id: 4, name: "工具4", icon: require("@/assets/images/layout/leftTool-icon4.png") },
      ],
    };
  },
  methods: {
    togglePanel() {
      this.isPanelCollapsed = !this.isPanelCollapsed;
    },
    handleToolClick(tool) {
      // 工具栏点击逻辑，后续实现
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  img {
    position: absolute;
    left: 0;
    pointer-events: none;

    &.masktem {
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }
  }
}

.layout-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1920 / 119;
  z-index: 2;
}

.header-tool {
  position: absolute;
  top: 9%;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  z-index: 2;
}

.footer-tool {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  z-index: 2;
}

.layout-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 2;
}

.layout-aside-left,
.layout-aside-right {
  position: absolute;
  top: 8.6%;
  height: 81.4%;
  z-index: 1;
}

.layout-aside-left-tools {
  position: absolute;
  left: 17.395%;
  top: 9%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: pxToRem(12);
  padding-left: pxToRem(8);
  transition: left 0.4s ease, opacity 0.4s ease;

  &.collapsed {
    left: 0;
    opacity: 0;
    pointer-events: none;
  }

  .left-tool-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .tool-icon-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: pxToRem(32);
      height: pxToRem(32);
      background: rgba(16, 22, 38, 0.8);
      box-sizing: border-box;
      border: 1px solid #202C4D;

      img {
        width: pxToRem(46);
        height: pxToRem(46);
      }
    }
  }
}

.layout-aside-right-tools {
  position: absolute;
  right: 22%;
  bottom: 8%;
  z-index: 1;
  display: flex;
  flex-direction: column;

  .btn {
    margin-bottom: 15%;
  }
}

/* 收起按钮 — 全局 */
.collapse-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 3;
  pointer-events: auto;
  transition: left 0.4s ease, right 0.4s ease;

  img {
    width: pxToRem(35);
    height: pxToRem(122);
    pointer-events: auto;
  }

  &.collapse-left {
    left: 17.395%;
    margin-left: pxToRem(4);

    &.collapsed {
      left: 0;
    }
  }

  &.collapse-right {
    right:17.395%;
    margin-right: pxToRem(60);

    &.collapsed {
      right: -1%;
    }
  }
}

.layout-aside-left {
  left: 0;
  width: 17.395%;
  transition: transform 0.4s ease, opacity 0.4s ease;

  &.collapsed {
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
  }
}

.layout-aside-right {
  right: 0;
  width: 17.395%;
  transition: transform 0.4s ease, opacity 0.4s ease;

  &.collapsed {
    transform: translateX(100%);
    opacity: 0;
    pointer-events: none;
  }
}

.layout-main,
.layout-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2c2c2c;
}

.content-header,
.content-footer,
.content-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content-left,
.content-right {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.content-left {
  left: 7%;
}

.content-right {
  right: 7%;
}

.content-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-scene {
  height: 100%;
}
</style>
