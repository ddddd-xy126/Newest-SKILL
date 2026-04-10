<template>
  <div class="video-type1">
    <!-- 类型1: 基础视频播放器 -->
    <webRTSP :baseOptions="rtspOptions" class="rtsp-player" />
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
    videoConfig: {
      type: Object,
      default: () => ({
        url: "ws://localhost:9999",
        title: "视频播放",
      }),
    },
  },
  data() {
    return {};
  },
  computed: {
    rtspOptions() {
      return {
        url: this.videoConfig.url,
        title: this.videoConfig.title,
        width: '100%',
        height: '100%',
      };
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
