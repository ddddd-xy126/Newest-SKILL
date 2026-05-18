<template>
  <div class="container" :class="layoutClass">
    <!-- 区域 A：通常放置图表 -->
    <div class="area-a" :style="areaAStyle">
      <slot name="area-a">
        <!-- 默认内容或子组件 -->
      </slot>
    </div>

    <!-- 区域 B：通常放置列表/表格/卡片 -->
    <div class="area-b" :style="areaBStyle">
      <slot name="area-b">
        <!-- 默认内容或子组件 -->
      </slot>
    </div>

    <!-- 可选区域 C -->
    <div class="area-c" v-if="showAreaC" :style="areaCStyle">
      <slot name="area-c">
        <!-- 默认内容或子组件 -->
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompositePanel", // TODO: 替换为实际组件名
  props: {
    // 布局方向：vertical（上下）、horizontal（左右）、grid（网格）
    layout: {
      type: String,
      default: "vertical",
      validator: (v) => ["vertical", "horizontal", "grid"].includes(v),
    },
    // 区域 A 的尺寸（flex 或百分比）
    areaASize: {
      type: String,
      default: "60%",
    },
    // 区域 B 的尺寸
    areaBSize: {
      type: String,
      default: "40%",
    },
    // 是否显示区域 C
    showAreaC: {
      type: Boolean,
      default: false,
    },
    // 区域 C 的尺寸
    areaCSize: {
      type: String,
      default: "auto",
    },
    // 区域间距
    gap: {
      type: String,
      default: "12px",
    },
  },
  computed: {
    layoutClass() {
      return `layout-${this.layout}`;
    },
    areaAStyle() {
      if (this.layout === "vertical") {
        return { height: this.areaASize };
      } else if (this.layout === "horizontal") {
        return { width: this.areaASize };
      }
      return {};
    },
    areaBStyle() {
      if (this.layout === "vertical") {
        return { height: this.areaBSize };
      } else if (this.layout === "horizontal") {
        return { width: this.areaBSize };
      }
      return {};
    },
    areaCStyle() {
      if (this.layout === "grid") {
        return { gridColumn: "span 2" };
      }
      return {};
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: v-bind(gap);

  &.layout-vertical {
    flex-direction: column;
  }

  &.layout-horizontal {
    flex-direction: row;
  }

  &.layout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.area-a,
.area-b,
.area-c {
  overflow: hidden;
}
</style>
