<template>
  <div class="progress">
    <div class="progress-row">
      <div class="progress-icon-wrapper">
        <img :src="image" alt="" class="progress-icon" />
      </div>
      <div class="progress-content">
        <div class="progress-top">
          <span class="progress-status">
            {{ status }}
          </span>
          <span class="progress-value" :style="{ color: color }">{{ value }}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ '--progress-width': percent + '%', background: color }"></div>
        </div>
        <span class="progress-percent" :style="{ color: color }">{{ animatePercent }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: () => null,
    },
    value: {
      type: Number,
      default: 0,
    },
    percent: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: () => null,
    },
    image: {
      type: String,
      default: () => null,
    },
  },
  data() {
    return {
      animatePercent: 0,
    };
  },
  mounted() {
    this.AnimatePercent();
  },
  methods: {
    //动画帧执行函数（通过requestAnimationFrame递归调用）
    AnimatePercent() {
      const duration = 2000; //持续时间
      const startTime = Date.now();
      const startValue = 0;
      const endValue = this.percent;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        // 计算动画进度（0到1之间）
        const progress = Math.min(elapsed / duration, 1);

        // 使用ease-out缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);

        /*
         * 计算当前动画百分比值：
         * 1. startValue + (endValue - startValue) → 计算区间差值
         * 2. 乘以缓动系数easeOut → 应用动画曲线
         * 3. Math.round → 四舍五入取整
         */
        this.animatePercent = Math.round(
          startValue + (endValue - startValue) * easeOut
        );

        // 如果动画未完成（进度<100%），继续请求下一帧
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      // 启动动画（执行第一帧）
      requestAnimationFrame(animate);
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30%;
  font-family: var(--font-family-primary-Light);


  .progress-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;

    .progress-icon-wrapper {

      width: 15%;
      height: 100%;
      margin-right: 3%;
      display: block;

      .progress-icon {
        width: 100%;
        aspect-ratio: 1 / 1;
        margin-top: 16%;
      }
    }

    .progress-content {

      display: flex;
      flex-direction: column;
      align-items: flex-start;

      gap: 4px;
      flex: 1;

      .progress-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .progress-status {
        font-size: var(--font-size-28);
        margin-bottom: 2px;
      }

      .progress-value {
        margin-left: 10%;
        font-size: var(--font-size-38);
        font-family: var(--font-family-primary-Bold);
        margin-bottom: 2%;
      }

      .progress-track {
        width: 100%;
        aspect-ratio: 23/1;
        background: rgba(255, 255, 255, 0.15);
        overflow: hidden;
        margin: 2px 0 2px 0;

        .progress-fill {
          height: 100%;
          transition: width 0.3s;
          animation: progressAnimation 2s ease-out forwards;
        }
      }

      .progress-percent {
        font-size: var(--font-size-32);
      }
    }
  }
}

// 进度条动画
@keyframes progressAnimation {
  from {
    width: 0%;
  }

  to {
    width: var(--progress-width);
  }
}
</style>
