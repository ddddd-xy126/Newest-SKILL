<template>
  <div class="container">
    <div class="card-grid" :style="gridStyle">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="stat-card"
        :style="{ background: item.background || cardBackground }"
      >
        <div class="card-icon" v-if="item.icon">
          <img :src="item.icon" alt="" />
        </div>
        <div class="card-content">
          <div class="card-value" :style="{ color: item.color || valueColor }">
            {{ formatValue(item.value) }}
            <span class="unit" v-if="item.unit">{{ item.unit }}</span>
          </div>
          <div class="card-label">{{ item.label }}</div>
        </div>
        <div class="card-trend" v-if="item.trend !== undefined">
          <span :class="['trend-icon', item.trend > 0 ? 'up' : 'down']">
            {{ item.trend > 0 ? '↑' : '↓' }}
          </span>
          <span class="trend-value">{{ Math.abs(item.trend) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardPanel", // TODO: 替换为实际组件名
  props: {
    data: {
      type: Array,
      required: true,
      // 格式: [{ label: '总数', value: 1234, unit: '个', icon: '', color: '', trend: 5.2 }, ...]
    },
    columns: {
      type: Number,
      default: 2, // 每行显示几个卡片
    },
    gap: {
      type: String,
      default: "12px",
    },
    valueColor: {
      type: String,
      default: "#00d4ff",
    },
    cardBackground: {
      type: String,
      default: "rgba(255, 255, 255, 0.05)",
    },
  },
  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
        gap: this.gap,
      };
    },
  },
  methods: {
    formatValue(value) {
      if (typeof value !== "number") return value;
      if (value >= 10000) {
        return (value / 10000).toFixed(1) + "万";
      }
      return value.toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

.card-grid {
  display: grid;
  width: 100%;
  height: 100%;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 212, 255, 0.3);
    transform: translateY(-2px);
  }
}

.card-icon {
  width: 48px;
  height: 48px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.card-content {
  flex: 1;

  .card-value {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;

    .unit {
      font-size: 14px;
      font-weight: 400;
      margin-left: 4px;
      opacity: 0.7;
    }
  }

  .card-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    margin-top: 4px;
  }
}

.card-trend {
  display: flex;
  align-items: center;
  font-size: 14px;

  .trend-icon {
    margin-right: 4px;

    &.up {
      color: #52c41a;
    }

    &.down {
      color: #ff4d4f;
    }
  }

  .trend-value {
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
