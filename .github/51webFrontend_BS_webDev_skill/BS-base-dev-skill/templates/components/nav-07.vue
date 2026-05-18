<!--
  NAV-07 底部水平容器（带容器底图 + 独立项底图 + 图标）
  ────────────────────────────────────────────
  视觉行为：
    - 底部居中，一张 nav-bg.png 作为整体容器底图
    - N 项水平平铺，每项独立 navItem-bg.png / navItem-bg-active.png 切换
    - 每项可选 icon（普通态一张图），文字 + 图标横排
    - 无滚动/弧形动画，仅 active 态切底图与字色

  调用契约（详见 knowledge/nav-types.md）：
    Props:
      list           Array<{ id, name, path, pathPrefix, icon? }>
      initialActiveId [String, Number]
    Events:
      @nav-change   { item, index, level: 'primary' }

  业务隔离铁律：
    - 本组件不读 $route、不调 $router、不引 vuex / API。
    - 父组件监听 $route 推算 initialActiveId，并在 @nav-change 里做 $router.push。

  来源：真实项目 footer.vue + navItem-footer.vue 抽取通用化。
-->
<template>
  <div class="nav-07">
    <div class="nav-container">
      <img class="nav-bg" src="@/assets/images/layout/nav-bg.png" alt="" />
      <div class="nav-list">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          class="nav-item-container"
          @click="onClick(item, index)"
        >
          <div class="item" :class="{ active: index === activeIndex }">
            <img v-if="item.icon" :src="item.icon" alt="" class="nav-icon" />
            <h3>{{ item.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav07",
  props: {
    list: { type: Array, required: true },
    initialActiveId: { type: [String, Number], default: null },
  },
  data() {
    return { activeIndex: 0 };
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
.nav-07 {
  width: 100%;
  height: 100%;
  position: relative;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1%;
}

.nav-container {
  position: relative;
  // TODO: 容器宽度按设计稿调整
  width: 37%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.nav-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.nav-list {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  // TODO: 项间距按设计稿调整
  gap: 2.5rem;
  padding: 0.5rem 1.5rem;
}

.nav-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;

  .item {
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/images/layout/navItem-bg.png");
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: pxToRem(5) pxToRem(24);
    gap: pxToRem(6);

    .nav-icon {
      width: 1rem;
      height: 1rem;
      pointer-events: none;
    }

    h3 {
      color: rgba(192, 220, 231, 0.85);
      font-size: pxToRem(18);
      font-family: var(--font-family-primary-Bold);
      white-space: nowrap;
    }

    &.active {
      background-image: url("~@/assets/images/layout/navItem-bg-active.png");

      h3 {
        color: #ffffff;
      }
    }
  }
}
</style>
