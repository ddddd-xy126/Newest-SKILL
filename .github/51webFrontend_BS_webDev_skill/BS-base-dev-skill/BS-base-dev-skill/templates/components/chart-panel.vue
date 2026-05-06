<template>
  <div class="container">
    <BaseChart :option="chartOption" width="100%" :ratio="ratio" :id="id" />
  </div>
</template>

<script>
// TODO: 替换为实际的配置项函数
import { chartOptionFn } from "@/types/echarts/xxx.js";
import BaseChart from "@components/echarts/index.vue";

export default {
  name: "ChartPanel", // TODO: 替换为实际组件名
  components: { BaseChart },
  props: {
    data: {
      type: Object,
      required: true,
    },
    ratio: {
      type: String,
      default: "16/9", // 重要：必须设置合理的宽高比
    },
    id: {
      type: String,
      default: "chartPanel",
    },
  },
  computed: {
    chartOption() {
      // TODO: 根据实际需求调用配置项函数
      const { /* 解构需要的数据 */ } = this.data;
      return chartOptionFn(/* 传入参数 */);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
