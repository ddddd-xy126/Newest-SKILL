<!--
  NAV-01 顶部水平 Tab（占位骨架）
  ────────────────────────────────────────────
  视觉行为：
    - 顶部 Header 内一行 N 项平铺
    - 激活项切换 active 底图，无滚动动画
    - 仅靠 isActive 切换底图/字色/字重

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, pathPrefix }>
      initialActiveId [String, Number]
    Events:
      @nav-change   { item, index, level: 'primary' }

  状态：占位骨架，等待首个真实样本回填。
-->
<template>
  <div class="nav-01">
    <div
      v-for="(item, index) in list"
      :key="item.id"
      class="nav-01-item"
      :class="{ active: index === activeIndex }"
      @click="onClick(item, index)"
    >
      <img
        class="bg"
        :src="index === activeIndex ? activeImg : normalImg"
        alt=""
      />
      <span class="text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav01",
  props: {
    list: { type: Array, required: true },
    initialActiveId: { type: [String, Number], default: null },
  },
  data() {
    return {
      // TODO: 资源路径以 layout-rules.md 为准
      activeImg: require("@/assets/images/layout/navItem-bg-active.png"),
      normalImg: require("@/assets/images/layout/navItem-bg.png"),
      activeIndex: 0,
    };
  },
  watch: {
    initialActiveId: { immediate: true, handler() { this._sync(); } },
    list: { handler() { this._sync(); } },
  },
  methods: {
    _sync() {
      if (this.initialActiveId == null) return;
      const idx = this.list.findIndex((it) => it.id === this.initialActiveId);
      if (idx >= 0) this.activeIndex = idx;
    },
    onClick(item, index) {
      this.activeIndex = index;
      this.$emit("nav-change", { item, index, level: "primary" });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-01 {
  display: flex;
  align-items: center;
  height: 100%;
  // TODO: 实际间距/高度按设计稿调整

  .nav-01-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 pxToRem(20);
    height: 100%;
    cursor: pointer;

    .bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .text {
      position: relative;
      z-index: 2;
      color: var(--color-desc);
      font-size: pxToRem(18);
      font-family: var(--font-family-primary-Regular);
      white-space: nowrap;
    }

    &.active .text {
      color: #ffffff;
      font-family: var(--font-family-primary-Bold);
    }
  }
}
</style>
