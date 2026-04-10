<template>
  <div class="panel-progress-card">
    <div class="row-title">
      <span class="title">{{ item.title }}</span>
      <span class="status" v-if="item.statusText" :style="{ color: item.statusColor || '#8fe7ff' }">
        <i class="dot" :style="{ background: item.statusColor || '#8fe7ff' }"></i>
        {{ item.statusText }}
      </span>
    </div>
    <div class="row-main">
      <span class="label">{{ item.label }}</span>
      <div class="progress-track">
        <div class="progress-fill" :style="fillStyle">
          <span class="progress-glow"></span>
        </div>
      </div>
      <span class="value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PanelProgressCard",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    fillStyle() {
      const percent = Number(this.item.percent || 0);
      const safePercent = Number.isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent));
      const startColor = this.item.startColor || "#57dbff";
      const endColor = this.item.endColor || "#2f86ff";
      return {
        width: `${safePercent}%`,
        background: `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-progress-card {
  width: 100%;
  margin-bottom: 0.22rem;
  border: 1px solid rgba(122, 197, 246, 0.2);
  background: linear-gradient(90deg, rgba(26, 73, 111, 0.34) 0%, rgba(11, 34, 61, 0.28) 100%);
  padding: 0.26rem 0.3rem 0.22rem;
}

.row-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: var(--font-size-8);
  color: #dff3ff;
  font-family: var(--font-family-primary-Medium);
  letter-spacing: 0.02rem;
}

.status {
  display: inline-flex;
  align-items: center;
  font-size: var(--font-size-8);
  letter-spacing: 0.02rem;
}

.status .dot {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  margin-right: 0.1rem;
}

.row-main {
  margin-top: 0.16rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 3.2fr 0.8fr;
  gap: 0.2rem;
  align-items: center;
}

.label {
  font-size: var(--font-size-8);
  color: #eef8ff;
}

.progress-track {
  width: 100%;
  height: 0.32rem;
  background: rgba(65, 130, 177, 0.18);
  border: 1px solid rgba(106, 196, 248, 0.24);
  padding: 0.02rem 0.03rem;
}

.progress-fill {
  position: relative;
  height: 100%;
  min-width: 0.04rem;
  box-shadow: 0 0 0.18rem rgba(78, 214, 255, 0.65);
  border-radius: 0.08rem;
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.24rem;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.72) 100%);
}

.value {
  font-size: var(--font-size-12);
  color: #ffffff;
  font-family: var(--font-family-primary-Bold);
  text-shadow: 0 0 0.1rem rgba(105, 218, 255, 0.34);
  text-align: right;
}
</style>
