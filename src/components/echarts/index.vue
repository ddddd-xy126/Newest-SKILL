<style lang="scss" scoped></style>
<template>
  <div
    :id="`main_${id}`"
    :style="`width: ${width};${ratio ? `aspect-ratio: ${ratio};` : ''};${
      height ? `height: ${height};` : ''
    }`"
  ></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  props: {
    // id: {
    //   type: [Number, String], // 使用数组形式定义多个类型
    //   default: () => ,
    // },
    option: {
      type: Object,
      default: () => {},
    },
    width: {
      type: String,
      default: () => "100%",
    },

    ratio: {
      type: String,
      default: () => null,
    },

    height: {
      type: String,
      default: () => null,
    },
  },
  data() {
    return {
      myChart: null,
      // 字符串+随机数作为唯一Id
      id: `${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
    };
  },
  mounted() {
    this.myChart = echarts.init(
      document.getElementById(`main_${this.id}`),
      "dark"
    );
    this.myChart.setOption(this.option);

    // 添加窗口大小变化监听器
    this.resizeHandler = () => {
      if (this.myChart) {
        this.myChart.resize();
      }
    };
    window.addEventListener("resize", this.resizeHandler);
  },

  watch: {
    option: {
      handler(val) {
        this.myChart.setOption(val);
        console.log(val, "最终渲染的数据结构");
      },
      deep: true,
    },
  },

  methods: {},

  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }

    // 移除窗口大小变化监听器
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  },
};
</script>
