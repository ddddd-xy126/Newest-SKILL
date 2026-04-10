<template>
  <div class="container">
    <div class="line">
      <div
        class="dot"
        v-for="(item, index) in siteList"
        :key="index"
        :style="{
          left:
            siteList.length > 1
              ? (index / (siteList.length - 1)) * 100 + '%'
              : '0%',
        }"
      >
        <div class="circle"></div>
        <div class="label" :class="{ vertical: isVertical(item) }">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "windowType4",
  components: {},
  props: {
    config: {
      type: Object,
      default: () => ({
        title: "",
        width: "",
        height: "",
      }),
    },
    windowType: {
      type: String,
      default: "type4",
    },
  },
  data() {
    return {};
  },
  methods: {
    isVertical(str) {
      // 判断是否包含汉字
      const isChinese = /[\u4e00-\u9fa5]/.test(str);
      return isChinese && str.length > 2;
    },
  },
  computed: {
    siteList() {
      if (Array.isArray(this.config.site)) {
        return this.config.site;
      }
      if (typeof this.config.site === "string") {
        return this.config.site.split(",");
      }
      return [];
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.line {
  position: relative;
  width: 100%;
  height: 4rem;
  margin: 2rem 0 1rem 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.3rem;
    background-color: #bfcfd8;
    z-index: 0;
  }
}

.dot {
  position: absolute;
  top: -0.5rem;
  left: 1rem;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;

  .circle {
    top: 4rem;
    width: 1.2rem;
    height: 1.2rem;
    background-color: rgb(192, 220, 231);
    border-radius: 50%;
    margin-bottom: 1rem;
  }

  .label {
    font-size: var(--font-size-28);
    color: #bfcfd8;
    white-space: nowrap;
    text-align: center;
    margin-top: 0.2rem;
    &.vertical {
      writing-mode: vertical-rl;
    }
  }
}
</style>
