<template>
  <div class="container">
    <ul class="list">
      <li v-for="(item, index) in data" :key="index" class="list-item">
        <div class="item-index">{{ index + 1 }}</div>
        <div class="item-content">
          <span class="label">{{ item.label }}</span>
          <span class="value" :style="{ color: item.color || valueColor }">
            {{ item.value }}{{ item.unit || '' }}
          </span>
        </div>
        <div v-if="showProgress" class="item-progress">
          <div
            class="progress-bar"
            :style="{
              width: `${(item.value / maxValue) * 100}%`,
              background: item.color || progressColor,
            }"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ListPanel", // TODO: 替换为实际组件名
  props: {
    data: {
      type: Array,
      required: true,
      // 格式: [{ label: '项目1', value: 100, unit: '%', color: '#fff' }, ...]
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    maxValue: {
      type: Number,
      default: 100,
    },
    valueColor: {
      type: String,
      default: "#00d4ff",
    },
    progressColor: {
      type: String,
      default: "linear-gradient(90deg, #00d4ff, #0099ff)",
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.item-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
  color: #00d4ff;
  margin-right: 12px;
}

.item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
  }

  .value {
    font-size: 16px;
    font-weight: 500;
  }
}

.item-progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;

  .progress-bar {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
}
</style>
