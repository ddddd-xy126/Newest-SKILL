<template>
  <div class="layout">
    <header class="layout-header" v-if="header">
      <slot name="header"></slot>
    </header>
    <div class="header-tool" v-if="headerTool">
      <slot name="header-tool"></slot>
    </div>
    <aside class="layout-aside-left" v-if="aside">
      <slot name="aside-left"></slot>
    </aside>
    <aside class="layout-aside-left-tools">
      <slot name="aside-left-tools"></slot>
    </aside>
    <aside class="layout-aside-right-tools" v-if="rightTools">
      <slot name="aside-right-tools"></slot>
    </aside>
    <aside class="layout-aside-right" v-if="aside">
      <slot name="aside-right"></slot>
    </aside>
    <main class="layout-main" v-if="main">
      <slot></slot>
    </main>
    <main class="layout-scene" v-if="scene">
      <slot name="scene"></slot>
    </main>
    <img class="masktem" src="@images/layout/mask.png" alt="" />
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
    }
  }
}

.layout-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 960 / 47;
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
  height: 30%;
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
  left: 22%;
  bottom: 8%;
  z-index: 1;
  display: flex;
  flex-direction: column;

  .btn {
    margin-bottom: 15%;
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

.layout-aside-left {
  left: 0;
  width: 17.395%;
}

.layout-aside-right {
  right: 0;
  width: 17.395%;
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
