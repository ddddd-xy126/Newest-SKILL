<style lang="scss" scoped>
.content-left {
  .box-duty {
    height: 31.5%;
  }
  .box-alarm-stat {
    height: 36.3%;
  }
  .box-alarm-progress {
    height: 23.2%;
  }
}

.content-right {
  .box-situation {
    height: 30%;
  }
  .box-resource {
    height: 30%;
  }
  .box-emergency {
    height: 30%;
  }
}

</style>

<template>
  <Layout :aside="true" :main="true">
    <!-- 左侧面板区域 -->
    <template v-slot:aside-left>
      <div class="content-left">
        <Box
          class="box-duty"
          type="simple"
          title="今日值班人员"
          :delayTime="100"
          position="left"
        >
          <div class="box-main-content"></div>
        </Box>

        <Box
          class="box-alarm-stat"
          type="simple"
          title="实时告警统计"
          :delayTime="200"
          position="left"
        >
          <div class="box-main-content"></div>
        </Box>

        <Box
          class="box-alarm-progress"
          type="simple"
          title="告警处理进度"
          :delayTime="300"
          position="left"
        >
          <div class="box-main-content"></div>
        </Box>

      </div>
    </template>

    <!-- 右侧面板区域 -->
    <template v-slot:aside-right>
      <div class="content-right">
        <Box
          class="box-situation"
          type="simple"
          title="警情监测"
          :delayTime="100"
          position="right"
        >
          <div class="box-main-content"></div>
        </Box>

        <Box
          class="box-resource"
          type="simple"
          title="资源保障"
          :delayTime="200"
          position="right"
        >
          <div class="box-main-content"></div>
        </Box>

        <Box
          class="box-emergency"
          type="simple"
          title="应急预案"
          :delayTime="300"
          position="right"
        >
          <div class="box-main-content"></div>
        </Box>

      </div>
    </template>

  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";

export default {
  name: "Page1_1",
  components: {
    Layout,
    Box,
  },

};
</script>
