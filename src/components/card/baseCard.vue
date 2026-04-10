<style lang="scss" scoped>
.data-card {
  width: 100%;
  background: linear-gradient(270deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.15) 100%);
  .content {
      padding: var(--font-size-22) var(--font-size-28);
      color: var(--color-primary);
      background-image: url(~@images/card/card_base_icon.png);
      background-repeat: no-repeat;
      background-position: center top;
      background-size: 5%;
      background-position: right top;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--font-size-12);
  margin-bottom: var(--font-size-16);

  .title {
    font-size: var(--font-size-24)
  }

  .unit {
    color: var(--color-secondary);
  }
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .number {
    font-size: var(--font-size-34);
    font-weight: 700;
    line-height: 1;
  }

  .trend {
    display: flex;
    align-items: center;

    &-icon {
      margin-right: 0.3rem;
      width: var(--font-size-20);
      aspect-ratio: 16/20;
    }

    .percentage {
      font-size: var(--font-size-24);
      color: var(--color-secondary);
    }
  }
}
</style>
<template>
  <div class="data-card">
    <div class="content">
      <div class="card-header">
        <span class="title">{{ data.title }}</span>
        <span class="unit" v-if="data.unit">({{ data.unit }})</span>
      </div>
      <div class="card-content">
        <div class="number">{{ displayNumber }}</div>
        <div class="trend" :class="trendClass">
          <img :src="trendIcon" alt="trend" class="trend-icon">
          <span class="percentage">{{ displayPercentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    data: {
      type: Object,
      default: () => ({
        title: '未知',
        number: 1234,
        unit: 'xxx',
        trend: 'up', // 'up' or 'down'
        percentage: 10
      })
    }
  },
  data() {
    return {
      displayNumber: '0', // 初始值显示为0
      displayPercentage: '0.0' // 初始值显示为0.0
    };
  },
  computed: {
    formattedNumber() {
      return Number(this.data.number).toLocaleString();
    },
    trendClass() {
      return `trend-${this.data.trend}`;
    },
    trendIcon() {
      return require('@/assets/images/card/' + (this.data.trend === 'up' ? 'card_base_up.png' : 'card_base_down.png'));
    }
  },
  mounted() {
    setTimeout(() => {
      this.animateNumber();
      this.animatePercentage();
    }, 500); // 延迟100毫秒后开始动画
  },
  methods: {
    animateNumber() {
      const duration = 1000; // 动画持续时间(毫秒)
      const finalValue = this.data.number;
      const startTime = performance.now();
      
      const updateNumber = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          // 计算当前进度(0-1)
          const progress = elapsedTime / duration;
          // 使用缓动函数
          const easedProgress = this.easeOutQuart(progress);
          // 计算当前值
          const currentValue = Math.round(easedProgress * finalValue);
          
          this.displayNumber = currentValue.toLocaleString();
          requestAnimationFrame(updateNumber);
        } else {
          // 动画结束，设为最终值
          this.displayNumber = this.formattedNumber;
        }
      };
      
      requestAnimationFrame(updateNumber);
    },
    
    animatePercentage() {
      const duration = 800; // 动画持续时间(毫秒)
      const finalValue = this.data.percentage;
      const startTime = performance.now();
      
      const updatePercentage = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          // 计算当前进度(0-1)
          const progress = elapsedTime / duration;
          // 使用缓动函数
          const easedProgress = this.easeOutQuart(progress);
          // 计算当前值 - 始终保留一位小数
          const currentValue = (easedProgress * finalValue).toFixed(1);
          
          this.displayPercentage = currentValue;
          requestAnimationFrame(updatePercentage);
        } else {
          // 动画结束，设为最终值（保留一位小数）
          this.displayPercentage = parseFloat(finalValue).toFixed(1);
        }
      };
      
      requestAnimationFrame(updatePercentage);
    },
    
    // 缓动函数：先快后慢
    easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }
  }
}
</script>