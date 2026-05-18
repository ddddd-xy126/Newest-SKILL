<!--
  图表私有化组件模板
  
  说明：
  这是一个私有化图表组件的标准模板，用于封装特定类型的图表。
  放置于 views/页面/components/ 目录下。
  
  使用步骤：
  1. 复制本文件到目标目录并重命名（如 generalBar.vue）
  2. 修改导入的配置项函数（如 generalBarOption）
  3. 根据需要调整 props 和 computed 中的参数映射
  
  命名规范：
  - 文件名使用驼峰命名，如 generalBar.vue、multiBar.vue
  - 组件内部 name 与文件名保持一致
-->

<template>
  <div class="chart-container">
    <echarts-base 
      :option="chartOption" 
      width="100%" 
      :ratio="ratio" 
      :id="id" 
    />
  </div>
</template>

<script>
// ========== 导入配置项函数 ==========
// 根据需要修改为实际使用的配置项函数
import { generalBarOption } from "@/types/echarts/bar.js";

// ========== 导入基础渲染组件 ==========
import EchartsBase from "@components/echarts/index.vue";

export default {
  name: "GeneralBar",
  
  components: {
    EchartsBase,
  },
  
  props: {
    // 图表数据配置对象
    // 包含 data, name, unit, orientation, color, yAxisConfig, otherConfig 等
    data: {
      type: Object,
      required: true,
    },
    // 宽高比 - 重要：必须设置合理的宽高比，否则图表不显示
    // 常用值: "16/9", "4/3", "630/309", "800/400"
    // 不要使用 "100%" 这样的百分比值
    ratio: {
      type: [String, Number],
      default: "630/309",  // 根据实际布局调整，参考项目中其他图表组件
    },
    // 图表唯一ID
    id: {
      type: String,
      default: "chartId",
    },
  },
  
  data() {
    return {};
  },
  
  computed: {
    // 计算 ECharts option
    // 从 props.data 中解构参数，传入配置项函数
    chartOption() {
      const { 
        data, 
        name, 
        unit, 
        orientation, 
        yAxisConfig, 
        color, 
        otherConfig 
      } = this.data;
      
      // 调用配置项函数生成 option
      return generalBarOption(
        data, 
        name, 
        unit, 
        orientation, 
        color, 
        yAxisConfig, 
        otherConfig
      );
    },
  },
  
  mounted() {},
};
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
