<!--
  ECharts 基础渲染组件
  
  功能：
  - 通用的 ECharts 图表渲染容器
  - 支持自定义宽度和宽高比
  - 自动监听 option 变化并更新图表
  - 组件销毁时自动释放 ECharts 实例
  
  使用方法：
  <echarts-base 
    :id="'myChart'" 
    :option="chartOption" 
    width="100%" 
    :ratio="630/309" 
  />
-->

<template>
  <div 
    :id="`main_${id}`" 
    :style="`width: ${width}; aspect-ratio: ${ratio};`"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "EchartsBase",
  
  props: {
    // 图表唯一标识，用于生成 DOM id
    id: {
      type: [Number, String],
      default: () => null,
    },
    // ECharts option 配置对象
    option: {
      type: Object,
      default: () => ({}),
    },
    // 容器宽度，支持百分比或固定值
    width: {
      type: String,
      default: () => "200px",
    },
    // 宽高比，如 "16/9" 或数字 1.77
    ratio: {
      type: [String, Number],
      default: () => "",
    },
  },
  
  data() {
    return {
      myChart: null,  // ECharts 实例
    };
  },
  
  mounted() {
    // 确保 DOM 渲染完成后初始化图表
    this.$nextTick(() => {
      this.myChart = echarts.init(document.getElementById(`main_${this.id}`));
      this.myChart.setOption(this.option);
    });
  },
  
  watch: {
    // 监听 option 变化，自动更新图表
    option: {
      handler(val) {
        if (this.myChart) {
          this.myChart.setOption(val);
        }
      },
      deep: true,
    },
  },
  
  methods: {
    // 手动刷新图表（窗口 resize 等场景可调用）
    refresh() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    
    // 获取 ECharts 实例（用于高级操作）
    getInstance() {
      return this.myChart;
    },
  },
  
  beforeDestroy() {
    // 组件销毁时释放 ECharts 实例，防止内存泄漏
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
