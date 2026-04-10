<template>
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
        <div v-if="config.isPath" @click="showThePath" :class="['handout', { selected: isVideoSelected }]">
          查看轨迹
        </div>
        <div v-else-if="config.isDevice" :class="['handout']" @click="showTheDevice">
          查看设备
        </div>
        <div v-else @click="showTheVedio" :class="['handout']">查看视频</div>
        <div @click="dispatchWorkOrder" class="handout disable">工单派发</div>
      </div>
      <div class="detail-section">
        <div class="detail-label">事件详情:</div>
        <div class="detail-content">{{ config.eventDetail }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import webRTSP from "@/components/rtsp/index.vue";
import deviceImg from "@/assets/images/deviceImg.webp";

export default {
  name: "VideoType2",
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
    windowType: {
      type: String,
      default: "type2",
    },
  },
  data() {
    return {
      isVideoSelected: false,
      isPlaying: true,
      connectionStatus: "connecting", // connecting, connected, disconnected
      statusText: "连接中...",
      trackPathData: {
        人员警示列表告警: {
          pathPoi: [
            [113.7130141510202, 34.77232886191992, 6.76304528296875],
            [113.71275851323104, 34.77230454803874, 6.76304528296875],
            [113.71276579772805, 34.77235113348423, 6.76304528296875],
            [121.50254063855417, 31.237506209406646, 83],
            [121.50305058864268, 31.23730902265228, 43],
            [121.5034918508501, 31.23717612864938, 58],
          ],
          otherConfig: {
            width: 1,
            coordZOffset: 5,
            coordZRef: "ground",
            isCheckCamera: true
          },
        },
        车辆警示列表告警: {
          pathPoi: [
            [113.71352347133192, 34.77443774252799, 5.008415172207687],
            [113.71319112171935, 34.7743051528404, 4.614237403593187],
            [113.71285317522872, 34.774180464816695, 4.2212083099492235],
            [113.71270131550077, 34.77409113879502, 5.249999985448085],
          ],
        },
        资产非法外出告警: {
          pathPoi: [
            [113.71282626246665, 34.772341694479046, 18],
            [113.71300716052649, 34.772364600938246, 18],
            [113.71301262015413, 34.77244063991848, 18],
          ],
          otherConfig: {
            width: 2,
            color: "rgba(255, 117, 116, 1)",
            type: "brimless_arrow",
            coordZOffset: 18
          },
        },
      },
    };
  },
  computed: {
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
    showTheVedio() {
      this.isVideoSelected = true;
      // console.log(this.isVideoSelected, '查看视频')
      const jsondata = {
        name: "showTheVedio",
        title: this.config.title,
        url: this.config.url,
      };

      w51_event("EventKey", jsondata);
    },
    async showThePath() {
      this.isVideoSelected = !this.isVideoSelected;
      // console.log(this.isVideoSelected, '查看轨迹')
      const jsondata = {
        name: "showThePath",
        title: this.config.title,
        data: this.trackPathData[this.config.title],
        status: this.isVideoSelected,   //是否开启轨迹字段
      };

      w51_event("EventKey", jsondata);
    },
    showTheDevice() {
      console.log("查看设备的特效");
      this.isVideoSelected = !this.isVideoSelected;
      // console.log(this.isVideoSelected, '查看设备')
      const jsondata = {
        name: "showTheDevice",
        location: this.config.location,
        data: {
          img: deviceImg,
          indoorCO2: "611.7PPM",
          supplyAirTemp: "22.5°C",
          supplyAirPressure: "45%",
          actualDemandAirVolume: "500m³/h",
          actualSupplyAirTemp: "22.5°C",
          indoorTemp: "22.5°C",
          maxAirVolume: "500m³/h",
          minAirVolume: "100m³/h",
          status: this.isVideoSelected,   //是否开启轨设备详情字段
        }
      };


      w51_event("EventKey", jsondata);
    },
    dispatchWorkOrder() {
      console.log("派发工单的特效", this.config);
    },
  },
};
</script>

<style lang="scss" scoped>
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

    .left-section {
      // flex: 1;
      width: 47%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 1rem solid rgba(33, 149, 224, 1);
      padding: 0 0.5rem 0.5rem 0.5rem;
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
        margin-bottom: 0.5rem;

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
    width: 100%;

    .button-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 47%;

      .handout {
        width: 70%;
        height: 3rem;
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

      // .check {
      //   background: url(~@/assets/images/footerTool/check.png);
      //   background-size: 100% 100%;
      //   color: #fff;
      //   cursor: pointer;
      // }

      // .check:hover {
      //   // 没有图片，自己写
      //   background-color: rgba(33, 149, 224, 0.5);
      // }

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
        margin-top: 1rem;
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
        margin-bottom: 0.5em;
        font-size: var(--font-size-28);
        padding-left: 1.5rem;
      }

      .detail-content {
        padding-left: 1.5rem;
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
</style>
