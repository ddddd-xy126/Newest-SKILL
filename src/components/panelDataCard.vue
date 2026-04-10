<template>
  <div class="panel-data-card" :style="cardStyle">
    <div class="card-overlay"></div>
    <div class="card-head">
      <span class="card-title">{{ item.title }}</span>
    </div>
    <div class="card-value">
      <span class="value">{{ item.value }}</span>
      <span class="unit" v-if="item.unit">{{ item.unit }}</span>
    </div>
    <div class="card-desc" v-if="item.desc">{{ item.desc }}</div>
  </div>
</template>

<script>
export default {
  name: "PanelDataCard",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      defaultBackground: require("@/assets/images/panelCard/panelCardBg.png"),
    };
  },
  computed: {
    cardStyle() {
      const backgroundImage = this.item.backgroundImage || this.defaultBackground;
      return {
        backgroundImage: `url(${backgroundImage})`,
      };
    },
    cardHeadStyle() {
      const color = this.item.accent || "rgba(102, 224, 255, 0.72)";
      return {
        color,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-data-card {
  position: relative;
  overflow: hidden;
  width: calc((100% - 0.64rem) / 3);
  min-height: 4.82rem;
  border: 1px solid rgba(121, 206, 255, 0.28);
  border-radius: 0.06rem;
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.52rem 0.54rem 0.42rem;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(40, 132, 199, 0.24) 0%, rgba(13, 45, 76, 0.2) 100%);
  pointer-events: none;
}

.card-head {
  position: relative;
  z-index: 2;
  display: block;
}

.card-title {
  font-size: var(--font-size-12);
  color: rgba(205, 232, 248, 0.9);
  letter-spacing: 0.03rem;
}

.card-value {
  position: relative;
  z-index: 2;
  margin-top: 0.26rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.value {
  font-size: var(--font-size-32);
  font-family: var(--font-family-primary-Bold);
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 0 0.18rem rgba(84, 205, 255, 0.44);
}

.unit {
  margin-left: 0.2rem;
  font-size: var(--font-size-12);
  color: rgba(200, 229, 244, 0.84);
}

.card-desc {
  position: relative;
  z-index: 2;
  margin-top: 0.16rem;
  text-align: center;
  font-size: var(--font-size-10);
  color: rgba(190, 220, 240, 0.84);
}
</style>
