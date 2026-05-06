<style lang="scss" scoped>
// 左侧面板高度分配（总和建议 87%）
.left-1 {
  height: 25%;
}
.left-2 {
  height: 30%;
}
.left-3 {
  height: 32%;
}

// 右侧面板高度分配
.right-1 {
  height: 25%;
}
.right-2 {
  height: 30%;
}
.right-3 {
  height: 32%;
}
</style>

<template>
  <Layout :aside="true">
    <!-- 左侧面板区域 -->
    <template v-slot:aside-left>
      <div class="content-left">
        <!-- 面板 1 -->
        <Box class="left-1" :delayTime="100" position="left">
          <template v-slot:header>
            <h1>面板标题1</h1>
          </template>
          <div class="box-main-content">
            <!-- TODO: 引入组件 -->
          </div>
        </Box>

        <!-- 面板 2 -->
        <Box class="left-2" :delayTime="200" position="left">
          <template v-slot:header>
            <h1>面板标题2</h1>
          </template>
          <div class="box-main-content">
            <!-- TODO: 引入组件 -->
          </div>
        </Box>

        <!-- 面板 3 -->
        <Box class="left-3" :delayTime="300" position="left">
          <template v-slot:header>
            <h1>面板标题3</h1>
          </template>
          <div class="box-main-content">
            <!-- TODO: 引入组件 -->
          </div>
        </Box>
      </div>
    </template>

    <!-- 右侧面板区域 -->
    <template v-slot:aside-right>
      <div class="content-right">
        <!-- 面板 4 -->
        <Box class="right-1" :delayTime="100" position="right">
          <template v-slot:header>
            <h1>面板标题4</h1>
          </template>
          <div class="box-main-content">
            <!-- TODO: 引入组件 -->
          </div>
        </Box>

        <!-- 面板 5 -->
        <Box class="right-2" :delayTime="200" position="right">
          <template v-slot:header>
            <h1>面板标题5</h1>
          </template>
          <div class="box-main-content">
            <!-- TODO: 引入组件 -->
          </div>
        </Box>

        <!-- 面板 6 -->
        <Box class="right-3" :delayTime="300" position="right">
          <template v-slot:header>
            <h1>面板标题6</h1>
          </template>
          <div class="box-main-content">
            <!-- TODO: 引入组件 -->
          </div>
        </Box>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";

// TODO: 引入私有化组件
// import ComponentA from "./components/componentA.vue";
// import ComponentB from "./components/componentB.vue";

export default {
  name: "PageName", // TODO: 替换为实际页面名
  components: {
    Layout,
    Box,
    // TODO: 注册组件
  },
  data() {
    return {
      // TODO: 定义组件数据
      // componentAData: { ... },
      // componentBData: { ... },
    };
  },
  mounted() {
    // TODO: 初始化逻辑
  },
  methods: {
    // TODO: 方法定义
  },
};
</script>
