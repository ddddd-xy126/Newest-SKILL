<style lang="scss" scoped>
.progress-bar-group {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 0 var(--font-size-20);
  background-image: url(~@images/底部遮罩.png);
  background-size: 100% 100%;
  .icon {
    width: 20%;
    // background-color: aqua;
    aspect-ratio: 1 / 1.1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    img {
      width: 100%;
      aspect-ratio: 1 / 1;
    }

    .name {
      position: absolute;
      bottom: 0;
      background: var(--gradient-text);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
    }
  }

  .progress-item {
    // background-color: #CDD6F1;
    flex: 1;
    height: 100%;
    align-items: center;
    display: flex;
    // background-color: antiquewhite;
    justify-content: space-between;
    background-image: url(~@images/zhts/bg.png);
    background-size: 100% 100%;
    gap: 10%;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 35%; // 控制边框起始位置
      bottom: 35%; // 控制边框结束位置
      width: 2px;
      background-color: #CDD6F1;
    }

    .progress {
      flex: 1;
    }

    // .progress:last-of-type{
    //   border-left: 1px solid #e0e6ee;
    // }
  }
}
</style>
<template>
  <div class="progress-bar-group">
    <div v-if="isShowIcon" class="icon">
      <img :src="iconImage" alt="" />
      <h2 class="name">{{ title }}</h2>
    </div>
    <div
      class="progress-item"
      :style="{ backgroundImage: progressBackgroundImage }"
    >
      <Progress
        v-for="(item, index) in dataList"
        :key="index"
        class="progress"
        :status="item.status"
        :value="item.value"
        :percent="item.percent"
        :color="statusColors[item.status] || defaultColor"
        :image="statusImages[item.status] || defaultImage"
      />
    </div>
  </div>
</template>
<script>
import Progress from "@/components/progress/index.vue";

export default {
  name: "ProgressBar",
  components: {
    Progress,
  },
  props: {
    // 标题
    title: {
      type: String,
      default: "会议室",
    },
    // 图标图片路径
    iconImage: {
      type: String,
      default: require("@/assets/images/img/conference_room.png"),
    },
    isShowIcon: {
      type: Boolean,
      default: true,
    },
    // 进度条背景图片
    progressBackgroundImage: {
      type: String,
      default: "url(~@images/zhts/bg.png)",
    },
    // 数据列表
    dataList: {
      type: Array,
      default: () => [],
    },
    // 状态对应的颜色配置
    statusColors: {
      type: Object,
      default: () => ({
        占用中: "rgb(205, 214, 241)",
        空闲中: "rgb(134, 224, 237)",
        紧急: "rgb(254, 197, 81)",
        一般: "rgb(254, 197, 81)",
      }),
    },
    // 状态对应的图片配置
    statusImages: {
      type: Object,
      default: () => ({
        占用中: require("@/assets/images/progress/1.png"),
        空闲中: require("@/assets/images/progress/2.png"),
        紧急: require("@/assets/images/progress/3.png"),
        一般: require("@/assets/images/progress/2.png"),
      }),
    },
    // 默认颜色（当状态不匹配时使用）
    defaultColor: {
      type: String,
      default: "rgb(134, 224, 237)",
    },
    // 默认图片（当状态不匹配时使用）
    defaultImage: {
      type: String,
      default: require("@/assets/images/progress/2.png"),
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
