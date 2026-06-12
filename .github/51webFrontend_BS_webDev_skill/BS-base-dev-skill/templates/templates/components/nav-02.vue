<!--
  NAV-02 顶部双层（一+二级）（占位骨架）
  ────────────────────────────────────────────
  视觉行为：
    - 第一行：一级 Tab 平铺（同 NAV-01）
    - 第二行：当前激活一级项的 children 平铺为二级 Tab
    - 一级切换时联动二级；默认选中二级首项

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, children: [{id, name, path}] }>
      initialActiveId [String, Number]   一级激活 id
    Events:
      @nav-change   { item, index, level: 'primary' | 'secondary' }

  状态：占位骨架，等待首个真实样本回填。
-->
<template>
  <div class="nav-02">
    <!-- 一级 -->
    <div class="primary-row">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="primary-item"
        :class="{ active: index === activeIndex }"
        @click="onPrimaryClick(item, index)"
      >
        {{ item.name }}
      </div>
    </div>

    <!-- 二级 -->
    <div class="secondary-row" v-if="currentChildren.length > 0">
      <div
        v-for="(child, idx) in currentChildren"
        :key="child.id"
        class="secondary-item"
        :class="{ active: idx === activeChildIndex }"
        @click="onSecondaryClick(child, idx)"
      >
        {{ child.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav02",
  props: {
    list: { type: Array, required: true },
    initialActiveId: { type: [String, Number], default: null },
  },
  data() {
    return { activeIndex: 0, activeChildIndex: 0 };
  },
  computed: {
    currentChildren() {
      const active = this.list[this.activeIndex];
      return active && active.children ? active.children : [];
    },
  },
  watch: {
    initialActiveId: { immediate: true, handler() { this._sync(); } },
    list: { handler() { this._sync(); } },
  },
  methods: {
    _sync() {
      if (this.initialActiveId == null) return;
      const idx = this.list.findIndex((it) => it.id === this.initialActiveId);
      if (idx >= 0) {
        this.activeIndex = idx;
        this.activeChildIndex = 0;
      }
    },
    onPrimaryClick(item, index) {
      this.activeIndex = index;
      this.activeChildIndex = 0;
      this.$emit("nav-change", { item, index, level: "primary" });
    },
    onSecondaryClick(child, idx) {
      this.activeChildIndex = idx;
      this.$emit("nav-change", { item: child, index: idx, level: "secondary" });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-02 {
  display: flex;
  flex-direction: column;
  // TODO: 实际行间距/字号/底图按设计稿调整

  .primary-row,
  .secondary-row {
    display: flex;
    align-items: center;
    gap: pxToRem(16);
  }

  .primary-item,
  .secondary-item {
    cursor: pointer;
    padding: 0 pxToRem(20);
    color: var(--color-desc);
    font-size: pxToRem(18);
    white-space: nowrap;

    &.active {
      color: #ffffff;
      font-family: var(--font-family-primary-Bold);
    }
  }

  .secondary-item {
    font-size: pxToRem(14);
  }
}
</style>
