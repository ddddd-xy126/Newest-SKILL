<!--
  页面使用图表示例模板
  
  说明：
  展示如何在页面中引用和使用私有化图表组件。
  
  流程：
  1. 导入私有化图表组件
  2. 在 components 中注册
  3. 在 data 中定义图表配置数据
  4. 在 template 中使用组件
-->

<template>
  <div class="page-container">
    <!-- 使用图表组件 -->
    <div class="chart-box">
      <h3>通用柱状图示例</h3>
      <GeneralBar 
        :data="generalBarData" 
        id="generalBarChart1" 
        ratio="630/309"
      />
    </div>
    
    <div class="chart-box">
      <h3>多柱状图示例</h3>
      <MultiBar 
        :data="multiBarData" 
        id="multiBarChart1" 
      />
    </div>
  </div>
</template>

<script>
// ========== 导入私有化图表组件 ==========
import GeneralBar from './components/generalBar.vue';
import MultiBar from './components/multiBar.vue';

export default {
  name: 'ChartPage',
  
  components: {
    GeneralBar,
    MultiBar,
  },
  
  data() {
    return {
      // ========== 通用柱状图数据配置 ==========
      generalBarData: {
        name: "人口数量",              // 图表名称
        orientation: "vertical",       // 方向：vertical/horizontal
        unit: "单位：人",              // 单位
        data: [                        // 数据数组
          { name: "2021", value: 550 },
          { name: "2022", value: 700 },
          { name: "2023", value: 420 },
          { name: "2024", value: 220 },
          { name: "2025", value: 240 },
        ],
        color: ["rgba(58, 96, 224, 1)", "rgba(96, 185, 255, 1)"],  // 渐变色
        yAxisConfig: {                 // 数值轴配置
          min: 0,
          max: 1000,
          interval: 200,
        },
        otherConfig: {                 // 其他配置
          isWhiteLine: true,           // 柱顶白线
          barWidth: 12,                // 柱子宽度
          isShowYLine: false,          // 隐藏Y轴线
          unitPosition: "center",      // 单位居中
        },
      },
      
      // ========== 多柱状图数据配置 ==========
      multiBarData: {
        name: "任务状态",
        orientation: "vertical",
        data: [
          {
            date: "06:00",
            values: [
              { name: "已完成", value: 100 },
              { name: "处理中", value: 150 },
            ],
          },
          {
            date: "09:00",
            values: [
              { name: "已完成", value: 350 },
              { name: "处理中", value: 80 },
            ],
          },
          {
            date: "12:00",
            values: [
              { name: "已完成", value: 380 },
              { name: "处理中", value: 140 },
            ],
          },
        ],
        colors: [
          ["rgba(58, 96, 224, 1)", "rgba(96, 185, 255, 1)"],
          ["rgba(255, 180, 96, 1)", "rgba(255, 220, 150, 1)"],
        ],
        yAxisConfig: {
          max: 400,
          interval: 100,
        },
        otherConfig: {
          isShowWhiteLine: true,
          isShowYLine: false,
        },
      },
    };
  },
  
  mounted() {},
  
  methods: {},
};
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-box {
  width: 48%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 16px;
  
  h3 {
    color: #fff;
    margin-bottom: 12px;
    font-size: 16px;
  }
}
</style>
