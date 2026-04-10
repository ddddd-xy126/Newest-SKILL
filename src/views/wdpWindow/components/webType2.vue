<template>
  <div class="web-window">
    <div class="web-window-header">
      <div class="header">
        <div class="header-title">{{ config.title }}</div>
        <div v-if="config.headerStatus" class="header-status">
          <div class="font-color-gradient-red">
            {{ config.headerStatus }}
          </div>
        </div>
      </div>
      <!-- <div @click="closeWindow" class="header-close">
        <i class="el-icon-close"></i>
      </div> -->
    </div>
    <div class="line">
      <div class="line-inner"></div>
    </div>
    <div class="video-container">
      <div class="up">
        <div class="left-section">
          <webRTSP :baseOptions="rtspOptions" class="rtsp-player" />
        </div>
        <div class="right-section">
          <div class="info-row">
            <div class="label">告警编号</div>
            <div class="value">{{ config.warningNumber }}</div>
          </div>
          <div class="info-row">
            <div class="label">告警类型</div>
            <div class="value">{{ config.warningType }}</div>
          </div>
          <div class="info-row">
            <div class="label">告警位置</div>
            <div class="value">{{ config.warningLocations }}</div>
          </div>
          <div class="info-row">
            <div class="label">上报人员</div>
            <div class="value">{{ config.reporter }}</div>
          </div>
        </div>
      </div>
      <div class="down">
        <div class="button-row">
          <div @click="showTheVedio" :class="['handout', { selected: false }]">查看视频</div>
          <div @click="dispatchWorkOrder" class="handout disable">工单派发</div>
        </div>
        <div class="detail-section">
          <div class="detail-label">事件详情:</div>
          <div class="detail-content">{{ config.eventDetail }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import webRTSP from "@/components/rtsp/index.vue";
import { mapState } from "vuex";

export default {
  components: {
    webRTSP,
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        url: "ws://localhost:9999",
        title: "视频播放",
        width: "100%",
        height: "100%",
      }),
    },
  },
  data() {
    return {
      isVideoSelected: false
    };
  },
  computed: {
    ...mapState(["isShowWindow"]),
    rtspOptions() {
      return {
        url: this.config.url,
        title: this.config.title,
        width: "100%",
        height: "100%",
      };
    },
  },

  methods: {
    closeWindow() {
      this.$store.commit("isShowWebTwo", {
        isShow: false,
        config: this.config,
      });
    },
    showTheVedio() {
      this.isVideoSelected = true;
      this.$store.commit("isShowWindow", {
        isShow: this.isVideoSelected,
        config: this.config,
      });
    },
    dispatchWorkOrder() {
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.web-window {
  position: absolute;
  top: 20%;
  left: 40.5%;
  background: url(~@images/window/bg2.png) no-repeat center center;
  background-size: 100% 100%;
  width: 18.5%;
  height: 20.5%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem 1rem 5rem;

  .web-window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-24);

    .header {
      display: flex;
      align-items: center;

      .header-title {
        font-size: var(--font-size-38);
        color: #fff;
      }

      .header-status {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 92, 87, 0.4);
        margin-left: 0.7rem;

        .font-color-gradient-red {
          padding: 0 1rem;
          font-size: var(--font-size-32);
        }
      }
    }

    .header-close {
      cursor: pointer;
      font-size: var(--font-size-32);
      color: #ffffff;
    }
  }

  .line {
    height: 0.3rem;
    background: rgba(245, 240, 240, 0.219);
    margin: 1rem 0;

    .line-inner {
      height: 160%;
      width: 0.8%;
      margin-left: 50%;
      background-color: rgba(192, 220, 231, 1);
    }
  }

  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .up {
      display: flex;
      flex: 2;
      width: 100%;
      gap: 0.5rem;

      .left-section {
        width: 47%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1rem solid rgba(33, 149, 224, 1);
      }

      .right-section {
        width: 53%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;

        .info-row {
          display: flex;
          justify-content: flex-start;

          .label {
            width: 40%;
            text-align: center;
            background-color: rgba(32, 137, 205, 0.5);
            color: rgba(191, 207, 216, 1);
            font-size: var(--font-size-28);
            padding: 0.4rem 0;
          }

          .value {
            width: 60%;
            color: #fff;
            background-color: rgba(255, 255, 255, 0.06);
            text-align: start;
            padding: 0.4rem 1rem;
            font-size: var(--font-size-28);
          }
        }
      }
    }

    .down {
      display: flex;
      flex: 1;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      width: 100%;

      .button-row {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 47%;
        gap: 1rem;


        .handout {
          width: 70%;
          height: 3.5rem;
          font-size: var(--font-size-28);
          text-align: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url(~@/assets/images/footerTool/handout.png);
          background-size: 100% 100%;
          color: rgba(181, 202, 212, 1);
        }

        .handout:hover {
          color: #fff;
          background: url(~@/assets/images/footerTool/check.png);
            background-size: 100% 100%;
        }
        .handout.selected {
          color: #fff;
          background: url(~@/assets/images/footerTool/check.png);
          background-size: 100% 100%;
        }
        .handout.disable {
          opacity: 0.8;
          cursor: not-allowed !important;
          filter: grayscale(50%);
          background: url(~@/assets/images/footerTool/handout.png);
          background-size: 100% 100%;
          color: rgba(181, 202, 212, 0.6);
        }
        .handout.disable:hover {
          cursor: not-allowed !important;
          color: rgba(181, 202, 212, 0.6);
          background: url(~@/assets/images/footerTool/handout.png);
          background-size: 100% 100%;
        }

      }

      .detail-section {
        flex: 1;
        display: flex;
        background-color: rgba(255, 255, 255, 0.06);
        flex-direction: column;
        justify-content: center;

        .detail-label {
          color: rgba(191, 207, 216, 1);
          font-size: var(--font-size-28);
          padding: 0.5rem 1.5rem;
        }

        .detail-content {
          padding: 0 1.5rem;
          color: #fff;
          font-size: var(--font-size-28);
          display: -webkit-box;
          -webkit-line-clamp: 2; // 限制最多显示2行
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
