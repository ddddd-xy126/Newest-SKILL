<!-- src/components/Layout.vue -->
<template>
  <div class="container">
    <img :src="headerToolsItemData.icon" alt="" />
    <div class="text-container" :style="{ backgroundImage: `url(${bgUrl})` }">
      <span class="title">{{ headerToolsItemData.title }}</span>
      <span class="content">{{ headerToolsItemData.content }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "headerTool",

  props: {
    headerToolsItemData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },

  mounted() {},

  computed: {
    bgUrl() {
      const title = this.headerToolsItemData.title || "";
      if (title.includes("告警") || title.includes("异常")) {
        return require("@/assets/images/headerTool/text-warning-bg.png");
      }
      return require("@/assets/images/headerTool/text-bg.png");
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  // height: 92px;
  display: flex;
  flex: 1;
  img {
    height: var(--font-size-100);
    aspect-ratio: 1;
    margin-right: 1rem;
  }
  .text-container {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 100%;
    aspect-ratio: 260/96;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-size: var(--font-size-24);
      color: #c0dce7;
      font-family: var(--font-family-primary-Medium);
    }
    .content {
      font-size: var(--font-size-38);
      font-family: var(--font-family-primary-Bold);
      color: #fff;
    }
  }
}
</style>
