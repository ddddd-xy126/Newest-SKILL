<style lang="scss" scoped>
.wdp-window {
  background: url(~@images/window/bg1.png) no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5% 1% 1% 1.2%;
  z-index: 1;
  position: absolute;
  top: 55%;
  left: 58%;
  transform: translate(0%, -50%);

  .wdp-window-header {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 2.5%;

    .header {
      display: flex;
      align-items: center;

      .header-title {
        font-size: var(--font-size-32);
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

      .header-Tag {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(45, 154, 222, 0.4);
        margin-left: 0.7rem;

        .font-color-gradient-blue {
          padding: 0 1rem;
          font-size: var(--font-size-32);
        }
      }

      .header-right {
        margin-left: 10rem;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: var(--font-size-28);

        .circle {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          border: 0.2rem solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          background: transparent;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        }

        .circle-inner {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background: #fff;
        }

        .header-text {
          margin-left: 0.3rem;
          font-size: var(--font-size-28);
          color: #ffffff;
          white-space: nowrap;
        }
      }
    }

    .header-close {
      font-size: var(--font-size-40);
      color: #fff;
      cursor: pointer;
    }

    .line {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 6%;
      background-color: rgb(62, 74, 82);
      display: flex;
      justify-content: center;
      align-items: center;

      .line-inner {
        height: 160%;
        width: 0.8%;
        background-color: rgba(192, 220, 231, 1);
      }
    }
  }

  .wdp-window-container {
    margin-top: 2.7%;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
}
</style>

<template>
  <div class="wdp-window" :style="{ width: settings.width, aspectRatio: settings.aspectRatio }">
    <div class="wdp-window-header">
      <div class="header">
        <div class="header-title">{{ config.title }}</div>

        <div v-if="config.headerStatus" class="header-status">
          <div class="font-color-gradient-red">
            {{ config.headerStatus }}
          </div>
        </div>
        <div v-if="config.headerTag" class="header-Tag">
          <div class="font-color-gradient-blue">
            {{ config.headerTag }}
          </div>
        </div>

        <div v-if="config.headerRight" class="header-right">
          <div class="circle">
            <div class="circle-inner"></div>
          </div>
          <div class="header-text">{{ config.headerRight }}</div>
        </div>
      </div>

      <!-- <div @click="closeWindow" class="header-close">
        <i class="el-icon-close"></i>
      </div> -->

      <div class="line">
        <div class="line-inner"></div>
      </div>
    </div>
    <div class="wdp-window-container">
      <webRTSP :baseOptions="rtspOptions" class="rtsp-player" />
    </div>
  </div>
</template>

<script>
import webRTSP from "@/components/rtsp/index.vue";
export default {
  name: "webType1",
  data() {
    return {
    };
  },
  components: {
    webRTSP,
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        title: '默认标题',
        headerStatus: '',
        headerTag: '',
        headerRight: '',
        url: "ws://localhost:9999",
        width: '35rem',
        aspectRatio: '25/19',
      })
    }
  },
  mounted() {
    console.log("webType1 mounted", this.config);
  },
  beforeDestroy() {
  },
  methods: {
    closeWindow() {
      this.isVisible = false;
    },

  },
  computed: {
    rtspOptions() {
      return {
        url: this.config.url,
        title: this.config.title,
        width: '100%',
        height: '100%',
      };
    },

    settings() {
      return {
        width: this.config.width || '36rem',
        aspectRatio: this.config.aspectRatio || '25/15',
      };
    }

  },
};
</script>
