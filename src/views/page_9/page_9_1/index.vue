<style lang="scss" scoped>
.content-left {
  .net-health {
    height: 26.3%;
  }

  .device-type {
    height: 19.8%;
  }

  .overall-traffic {
    height: 20.8%;
  }

  .terminal-type {
    height: 18.1%;
  }
}

.content-right {
  .net-user {
    height: 21.6%;
  }

  .net-abnormality {
    height: 19%;
  }

  .warning-type {
    height: 21.6%;
  }

  .real-time {
    height: 22.8%;
  }
}

.header-tool-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <Layout :aside="true" :headerTool="true" :footerTool="true" :main="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="net-health" :delayTime="100" position="left">
          <template v-slot:header>
            <h1>网络健康度</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="device-type" :delayTime="200" position="left">
          <template v-slot:header>
            <h1>设备类型统计</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="overall-traffic" :delayTime="300" position="left">
          <template v-slot:header>
            <h1>总体流量趋势</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="terminal-type" :delayTime="400" position="left">
          <template v-slot:header>
            <h1>终端类型统计</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>
    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="net-user" :delayTime="100" position="right">
          <template v-slot:header>
            <h1>网络用户统计</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="net-abnormality" :delayTime="200" position="right">
          <template v-slot:header>
            <h1>网络访问异常趋势</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="warning-type" :delayTime="300" position="right">
          <template v-slot:header>
            <h1>告警分类统计</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="real-time" :delayTime="400" position="right">
          <template v-slot:header>
            <h1>实时工单信息</h1>
          </template>
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>

    <template v-slot:header-tool> </template>

    <template v-slot:footer-tool> </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";

export default {
  name: "FrontEndIndex",
  components: {
    Layout,
    Box,
  },
  data() {
    return {};
  },
  mounted() {},

  methods: {},

  async beforeDestroy() {},
};
</script>
