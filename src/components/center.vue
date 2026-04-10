<template>
  <div class="main">
    <div class="header">
      <span class="header-title">{{ config.title }}</span>
      <span @click="closeWindow" class="header-close">
        <i class="el-icon-close"></i>
      </span>
    </div>
    <div class="line"></div>
    <div class="content">
      <webRTSP :baseOptions="rtspOptions" class="rtsp-player" />
    </div>
  </div>
</template>
<script>
import webRTSP from "@/components/rtsp/index.vue";
export default {
  name: "windowType1",
  components: {
    webRTSP,
  },
  props: {
    config: {
      type: Object,
      default: () => ({
      }),
    },
  },
  data() {
    return {};
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
  },
  mounted() { },
  methods: {
    closeWindow() {
      this.$store.commit('isShowWindow', { isShow: false });
    }
  },
};
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.521);
  z-index: 3;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 2rem 0 2rem;
    font-size: var(--font-size-24);


    .header-title {
      font-weight: bold;
      font-size: var(--font-size-32);
    }

    .header-close {
      cursor: pointer;
      font-size: var(--font-size-32);
      color: #ffffff;
    }
  }

  .line {
    height: 0.2rem;
    background: rgba(192, 220, 231, 0.3);
    margin: 1rem 1.5rem 1rem 1.5rem;
  }

  .content {
    // flex: 1;
    height: 87%;
    margin: 2rem 2rem;


    .rtsp-player {
      width: 100%;
      height: 100%;
      position: relative;
      margin-top: 5rem;
    }
  }
}
</style>