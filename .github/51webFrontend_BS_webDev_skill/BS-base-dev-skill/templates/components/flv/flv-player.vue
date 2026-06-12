<template>
    <div class="flv-player-container">
        <video ref="videoElement" class="video-player" controls :width="width" :height="height"></video>
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
        <div v-if="loading" class="loading-message">
            加载中...
        </div>
    </div>
</template>

<script>
import flvjs from 'flv.js';

export default {
    name: 'FlvPlayer',
    props: {
        // 视频流地址
        url: {
            type: String,
            // 直接使用后端地址
            default: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv'
        },
        // 视频宽度
        width: {
            type: [String, Number],
            default: '100%'
        },
        // 视频高度
        height: {
            type: [String, Number],
            default: '100%'
        },
        // 是否自动播放
        autoplay: {
            type: Boolean,
            default: true
        },
        // 是否静音
        muted: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            flvPlayer: null,
            error: null,
            loading: true,
            isMuted: false
        };
    },
    mounted() {
        this.initPlayer();
    },
    beforeDestroy() {
        this.destroyPlayer();
    },
    methods: {
        initPlayer() {
            if (!flvjs.isSupported()) {
                this.error = '当前浏览器不支持FLV播放';
                this.loading = false;
                return;
            }

            try {
                const videoElement = this.$refs.videoElement;
                // 输出将要请求的流 URL，便于调试网络问题
                console.debug('[FlvPlayer] stream url:', this.url);
                // 为了允许跨域请求（flv.js 会用 XHR/fetch 获取流），在 attach 之前设置 crossOrigin
                // 如果需要携带凭证，可改为 'use-credentials'
                try {
                    videoElement.crossOrigin = 'anonymous';
                } catch (e) {
                    // 某些浏览器或元素状态下设置可能失败，忽略但记录
                    console.warn('[FlvPlayer] failed to set crossOrigin', e);
                }

                this.flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: this.url,
                    isLive: true, // 直播流
                    hasAudio: true,
                    hasVideo: true,
                    cors: true
                }, {
                    enableWorker: false,
                    enableStashBuffer: false,
                    stashInitialSize: 128,
                    autoCleanupSourceBuffer: true
                });

                this.flvPlayer.attachMediaElement(videoElement);
                this.flvPlayer.load();

                // 监听事件
                // 额外监听 Loader/IO 层面错误以便定位是网络问题还是流服务器问题
                if (flvjs.Events) {
                    if (flvjs.Events.LOADER_ERROR) {
                        this.flvPlayer.on(flvjs.Events.LOADER_ERROR, (detail) => {
                            console.error('[FlvPlayer] LOADER_ERROR', detail);
                            this.error = `加载失败: LOADER_ERROR`;
                            this.loading = false;
                            this.$emit('error', { type: 'LOADER_ERROR', detail });
                        });
                    }
                    if (flvjs.Events.IO_ERROR) {
                        this.flvPlayer.on(flvjs.Events.IO_ERROR, (detail) => {
                            console.error('[FlvPlayer] IO_ERROR', detail);
                            this.error = `加载失败: IO_ERROR`;
                            this.loading = false;
                            this.$emit('error', { type: 'IO_ERROR', detail });
                        });
                    }
                }

                this.flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
                    this.loading = false;
                });

                this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                    console.error('[FlvPlayer] flvjs ERROR', errType, errDetail);
                    // 将更多信息展示给用户（也可隐藏真实 URL），并把错误类型发出去
                    this.error = `播放错误: ${errType} - ${errDetail}`;
                    this.loading = false;
                    this.$emit('error', { errType, errDetail });
                });

                // 设置静音（使用内部状态以避免直接修改 prop）
                this.isMuted = this.muted;
                videoElement.muted = this.isMuted;

                // 自动播放：尝试直接调用 video.play()，如果被浏览器策略阻止则仅记录日志
                if (this.autoplay) {
                    const playPromise = videoElement.play && videoElement.play();
                    if (playPromise && playPromise.catch) {
                        playPromise.catch(err => {
                            console.warn('自动播放被阻止或失败:', err);
                            // 不显示自定义播放按钮，保留原生 controls 供用户交互
                            this.loading = false;
                        });
                    }
                }

                this.$emit('ready');
            } catch (err) {
                this.error = `初始化失败: ${err.message}`;
                this.loading = false;
                console.error('FLV Player init error:', err);
            }
        },

        destroyPlayer() {
            if (this.flvPlayer) {
                this.flvPlayer.pause();
                this.flvPlayer.unload();
                this.flvPlayer.detachMediaElement();
                this.flvPlayer.destroy();
                this.flvPlayer = null;
            }
        },
    }
};
</script>
