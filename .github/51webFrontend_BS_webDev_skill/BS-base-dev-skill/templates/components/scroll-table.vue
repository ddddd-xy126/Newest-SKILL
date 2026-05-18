<template>
  <div class="container" @mouseenter="pause" @mouseleave="resume">
    <div class="table-header">
      <div
        v-for="col in columns"
        :key="col.key"
        class="header-cell"
        :style="{ width: col.width, flex: col.flex || 1 }"
      >
        {{ col.title }}
      </div>
    </div>
    <div class="table-body" ref="scrollBody">
      <div class="scroll-content" :style="{ transform: `translateY(${offset}px)` }">
        <div
          v-for="(row, index) in displayData"
          :key="index"
          class="table-row"
          :class="{ 'row-even': index % 2 === 0 }"
        >
          <div
            v-for="col in columns"
            :key="col.key"
            class="body-cell"
            :style="{ width: col.width, flex: col.flex || 1 }"
          >
            {{ row[col.key] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrollTable", // TODO: 替换为实际组件名
  props: {
    columns: {
      type: Array,
      required: true,
      // 格式: [{ key: 'name', title: '名称', width: '100px', flex: 1 }, ...]
    },
    data: {
      type: Array,
      required: true,
    },
    rowHeight: {
      type: Number,
      default: 36,
    },
    speed: {
      type: Number,
      default: 50, // 滚动间隔 ms
    },
    step: {
      type: Number,
      default: 1, // 每次滚动像素
    },
  },
  data() {
    return {
      offset: 0,
      timer: null,
    };
  },
  computed: {
    // 复制一份数据实现无缝滚动
    displayData() {
      return [...this.data, ...this.data];
    },
    totalHeight() {
      return this.data.length * this.rowHeight;
    },
  },
  mounted() {
    this.startScroll();
  },
  beforeDestroy() {
    this.pause();
  },
  methods: {
    startScroll() {
      if (this.data.length <= 5) return; // 数据少时不滚动

      this.timer = setInterval(() => {
        this.offset -= this.step;
        // 滚动完一轮后重置
        if (Math.abs(this.offset) >= this.totalHeight) {
          this.offset = 0;
        }
      }, this.speed);
    },
    pause() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    resume() {
      this.startScroll();
    },
  },
  watch: {
    data() {
      this.offset = 0;
      this.pause();
      this.startScroll();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .header-cell {
    padding: 10px 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    font-weight: 500;
  }
}

.table-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.scroll-content {
  transition: transform 0.1s linear;
}

.table-row {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &.row-even {
    background: rgba(255, 255, 255, 0.02);
  }

  .body-cell {
    padding: 8px 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
