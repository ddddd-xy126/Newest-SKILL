<style lang="scss" scoped>
.content-left {
  .box-people-vehicle {
    height: 22%;
  }
  .box-security-alarm {
    height: 22%;
  }
  .box-asset-classify {
    height: 22%;
  }
  .box-energy-consume {
    height: 22%;
  }
}

.content-right {
  .box-workorder {
    height: 22%;

    .workorder-toggle {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .toggle-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.25rem;
        border: 1px solid rgba(49, 174, 255, 0.4);
        color: rgba(192, 220, 231, 0.6);
        cursor: pointer;
        font-size: var(--font-size-12);
        transition: all 0.3s;

        &.active {
          background: rgba(49, 174, 255, 0.3);
          border-color: rgba(49, 174, 255, 0.8);
          color: #fff;
        }
      }
    }
  }
  .box-meeting-room {
    height: 22%;
  }
  .box-indoor-env {
    height: 22%;
  }
  .box-smart-warning {
    height: 22%;
  }
}
</style>

<template>
  <Layout :aside="true" :main="true">
    <!-- 左侧面板区域 -->
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="box-people-vehicle" type="simple" title="人车数量统计" :delayTime="100" position="left">
          <div class="box-main-content"></div>
        </Box>

        <Box class="box-security-alarm" type="simple" title="安防告警统计" :delayTime="200" position="left">
          <div class="box-main-content"></div>
        </Box>

        <Box class="box-asset-classify" type="simple" title="资产分类统计统计" :delayTime="300" position="left">
          <div class="box-main-content"></div>
        </Box>

        <Box class="box-energy-consume" type="simple" title="能耗统计" :delayTime="400" position="left">
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>

    <!-- 右侧面板区域 -->
    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="box-workorder" type="compact" title="工单处理统计" :delayTime="100" position="right">
          <template v-slot:header-right>
            <div class="workorder-toggle">
              <span
                class="toggle-btn"
                :class="{ active: workorderMode === 'day' }"
                @click="workorderMode = 'day'"
              >日</span>
              <span
                class="toggle-btn"
                :class="{ active: workorderMode === 'month' }"
                @click="workorderMode = 'month'"
              >月</span>
            </div>
          </template>
          <div class="box-main-content"></div>
        </Box>

        <Box class="box-meeting-room" type="simple" title="会议室使用率" :delayTime="200" position="right">
          <div class="box-main-content"></div>
        </Box>

        <Box class="box-indoor-env" type="simple" title="室内环境质量统计" :delayTime="300" position="right">
          <div class="box-main-content"></div>
        </Box>

        <Box class="box-smart-warning" type="simple" title="智能预警统计" :delayTime="400" position="right">
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
  data() {
    return {
      workorderMode: "day",
    };
  },
  mounted() {},
  methods: {},
};
</script>
