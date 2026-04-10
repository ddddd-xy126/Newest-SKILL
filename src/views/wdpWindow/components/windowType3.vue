<template>
  <div class="video-type3">
    <div class="item">
      <div class="item-title"><p>姓</p><p>名</p></div>
      <div class="item-content">{{ config.name }}</div>
    </div>
    <div class="item">
      <div class="item-title"><p>工</p><p>号</p></div>
      <div class="item-content">{{ config.workNumber }}</div>
    </div>
    <div class="item">
      <div class="item-title"><p>联</p><p>系</p><p>方</p><p>式</p></div>
      <div class="item-content">{{ config.phone }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Type3",
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
      default: "type3",
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.video-type3 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 1%;
  .item {
    display: flex;
    color: #fff;
    font-size: var(--font-size-38);
    margin-top: 1.2rem;
    height: 6.5rem;
    .item-title {
      width: 38.8%;
      background: url(~@images/window/title_bg.png) no-repeat center center;
      background-size: 100% 100%;
      text-align: center;
      padding: 0 1.2em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item-content {
      flex: 1;
      display: flex;
      align-items: center;
      background: url(~@images/window/content_bg.png) no-repeat center center;
      background-size: 100% 100%;
      padding: 0 2rem;
    }
  }
}
</style>
