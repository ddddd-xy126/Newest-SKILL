<!--
  NAV-03 底部胶囊水平（占位骨架）
  ────────────────────────────────────────────
  视觉行为：
    - 底部居中胶囊容器，N 项平铺
    - 激活项 scale 放大 + 切换底图，无滚动动画

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, pathPrefix }>
      initialActiveId [String, Number]
    Events:
      @nav-change   { item, index, level: 'primary' }

  状态：占位骨架，等待首个真实样本回填。
-->
<template>
  <div class="nav-03">
    <div class="capsule">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="capsule-item"
        :class="{ active: index === activeIndex }"
        @click="onClick(item, index)"
      >
        <span class="text">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav03",
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
.nav-03 {
  position: absolute;
  bottom: pxToRem(40);
  left: 50%;
  transform: translateX(-50%);

  .capsule {
    display: flex;
    align-items: center;
    gap: pxToRem(8);
    padding: pxToRem(8) pxToRem(16);
    // TODO: 胶囊底图 / 圆角 / 边框按设计稿调整
    background: rgba(0, 0, 0, 0.4);
    border-radius: pxToRem(40);
  }

  .capsule-item {
    cursor: pointer;
    padding: pxToRem(10) pxToRem(20);
    color: var(--color-desc);
    font-size: pxToRem(16);
    border-radius: pxToRem(30);
    transition: all 0.3s ease;

    &.active {
      color: #ffffff;
      font-family: var(--font-family-primary-Bold);
      transform: scale(1.08);
      // TODO: 激活底图替换
      background: rgba(74, 144, 226, 0.4);
    }
  }
}
</style>
