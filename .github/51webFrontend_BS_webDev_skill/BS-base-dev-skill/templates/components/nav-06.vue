<!--
  NAV-06 左侧竖排 Tab（占位骨架）
  ────────────────────────────────────────────
  视觉行为：
    - Aside-Left 区域纵向铺 N 项
    - 激活项切换 active 底图 + icon，无滚动动画

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, pathPrefix, icon?, iconActive? }>
      initialActiveId [String, Number]
    Events:
      @nav-change   { item, index, level: 'primary' }

  状态：占位骨架，等待首个真实样本回填。
-->
<template>
  <div class="nav-06">
    <div
      v-for="(item, index) in list"
      :key="item.id"
      class="nav-06-item"
      :class="{ active: index === activeIndex }"
      @click="onClick(item, index)"
    >
      <img
        v-if="item.icon || item.iconActive"
        class="icon"
        :src="index === activeIndex && item.iconActive ? item.iconActive : item.icon"
        alt=""
      />
      <span class="text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav06",
  props: {
    list: { type: Array, required: true },
    initialActiveId: { type: [String, Number], default: null },
  },
  data() { return { activeIndex: 0 }; },
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
.nav-06 {
  display: flex;
  flex-direction: column;
  gap: pxToRem(8);
  // TODO: 实际宽度/间距/底图按设计稿调整

  .nav-06-item {
    display: flex;
    align-items: center;
    gap: pxToRem(10);
    padding: pxToRem(12) pxToRem(16);
    cursor: pointer;
    color: var(--color-desc);
    font-size: pxToRem(16);
    transition: all 0.3s ease;

    .icon {
      width: pxToRem(20);
      height: pxToRem(20);
      object-fit: contain;
    }

    &.active {
      color: #ffffff;
      font-family: var(--font-family-primary-Bold);
      // TODO: 激活底图替换
      background: rgba(74, 144, 226, 0.3);
    }
  }
}
</style>
