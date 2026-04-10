<style lang="scss" scoped>
.main {
  border: 2px solid rgba(192, 220, 231, 0.4);
  position: relative;
  overflow: hidden;

  .title {
    width: 100%;
    height: 17%;
    // background-color: rgba(192, 220, 231, 0.4);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 4%;
    padding-right: 4%;

    img {
      width: var(--font-size-24);
      height: var(--font-size-24);
      cursor: pointer;
    }

  }

  .video-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #000;

    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: pointer;
    }
  }
}

// 原生全屏时的样式
.main:fullscreen,
.main:-webkit-full-screen,
.main:-moz-full-screen,
.main:-ms-fullscreen {
  .video-container {
    video {
      width: 100vw;
      height: 100vh;
    }
  }

  .title {
    display: flex;
  }
}
</style>
<template>
  <div ref="mainContainer" :style="`width:${baseOptions.width};height:${baseOptions.height}`" class="main">
    <!-- 测试模式：使用MP4 -->
    <!-- <div v-if="baseOptions.testMode" class="video-container"> -->

    <div v-if="true" class="video-container">
      <video ref="videoPlayer" :src="testVideoSrc" autoplay muted playsinline preload="auto" @click="togglePlayPause" loop></video>
    </div>

    <!-- RTSP模式 -->
    <JSMpegPlayer v-else :url="baseOptions.url" :with-toolbar="false" loading-text="loading"
      no-signal-text="disconnected" :title="baseOptions.title" :customParams="customParams" />

    <div class="title">
      <h3></h3> 
    </div>
  </div>
</template>
<script>
import JSMpegPlayer from "../../plugins/jsmpegPlayer/jsmpeg-player.vue";

export default {
  components: {
    JSMpegPlayer,
  },
  props: {
    baseOptions: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      customParams: {
        status: ""
      },
      testVideoSrc: require('@/assets/videos/test.mp4')
    };
  },
  mounted() {
    // 监听全屏变化事件
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);
    this.tryAutoPlay()
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
    this.removeGestureUnlock()
  },
  methods: {
    //各项自定义api，需要新增可自行在源码中封装
    handlerPause() {
      this.customParams.status = 'pause'
    },

    handlerPlay() {
      this.customParams.status = 'play'
    },

    handlerStop() {
      this.customParams.status = 'stop'
    },

    // 切换播放/暂停
    togglePlayPause() {
      const video = this.$refs.videoPlayer;
      if (video) {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    },

    // 进入/退出全屏
    handlerFullScreen() {
      // 非测试模式，使用原有逻辑
      const jsondata = {
        name: "showTheVedio",
        title: this.baseOptions.title,
        url: this.baseOptions.url,
      };

      if (typeof window !== 'undefined' && typeof window.w51_event === 'function') {
        window.w51_event("EventKey", jsondata);
        return;
      } else {
        if (!this.baseOptions.testMode) {
          // 测试模式，使用原生全屏 API
          const container = this.$refs.mainContainer;
          if (!container) return;

          if (!document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {
            // 进入全屏
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
              container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
              container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
              container.msRequestFullscreen();
            }
          } else {
            // 退出全屏
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          }
        } else {
          this.customParams.status = 'fullscreen'
          setTimeout(() => {
            this.customParams.status = 'notFullScreen'
          }, 100);
        }

      }

    },
    tryAutoPlay() {
      const video = this.$refs.videoPlayer
      if (!video) return
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          this.setupGestureUnlock()
        })
      }
    },
    setupGestureUnlock() {
      if (this._unlockHandler) return
      this._unlockHandler = () => {
        this.tryAutoPlay()
        this.removeGestureUnlock()
      }
      const opts = { once: true, passive: true }
      document.addEventListener('pointerdown', this._unlockHandler, opts)
      document.addEventListener('touchstart', this._unlockHandler, opts)
      document.addEventListener('keydown', this._unlockHandler, opts)
    },
    removeGestureUnlock() {
      if (!this._unlockHandler) return
      document.removeEventListener('pointerdown', this._unlockHandler)
      document.removeEventListener('touchstart', this._unlockHandler)
      document.removeEventListener('keydown', this._unlockHandler)
      this._unlockHandler = null
    },

    // 监听全屏变化
    handleFullscreenChange() {
      const isFullscreen = !!(document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement);
      // 可以在这里添加全屏状态变化的处理逻辑
    }
  },
};
</script>
