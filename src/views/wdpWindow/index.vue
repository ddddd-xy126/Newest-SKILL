<style lang="scss" scoped>
.wdp-window {
  width: 100%;
  height: 100%;
  /* 背景图通过动态绑定设置 */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4% 8% 6% 9.5%;

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
        font-size: var(--font-size-40);
        color: #fff;
      }
      .header-status {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 92, 87, 0.4);
        margin-left: 0.9rem;
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
  <div class="wdp-window" :style="{ backgroundImage: backgroundImage }">
    <div class="wdp-window-header">
      <div class="header">
        <div class="header-title">{{ cusConfig.title }}</div>

        <div v-if="cusConfig.headerStatus" class="header-status">
          <div class="font-color-gradient-red">
            {{ cusConfig.headerStatus }}
          </div>
        </div>
        <div v-if="cusConfig.headerTag" class="header-Tag">
          <div class="font-color-gradient-blue">
            {{ cusConfig.headerTag }}
          </div>
        </div>

        <div v-if="cusConfig.headerRight" class="header-right">
          <div class="circle">
            <div class="circle-inner"></div>
          </div>
          <div class="header-text">{{ cusConfig.headerRight }}</div>
        </div>
      </div>

      <div @click="closeWindow" v-if="isShowCloseBtn" class="header-close">
        <i class="el-icon-close"></i>
      </div>

      <div class="line"><div class="line-inner"></div></div>
    </div>
    <div class="wdp-window-container">
      <!-- 根据类型渲染不同的视频播放组件 -->
      <component
        style="width: 100%; height: 100%"
        :is="currentComponent"
        :config="cusConfig"
      />
    </div>
  </div>
</template>

<script>
import windowType1 from "./components/windowType1.vue";
import windowType2 from "./components/windowType2.vue";
import windowType3 from "./components/windowType3.vue";
import windowType4 from "./components/windowType4.vue";
import windowType5 from "./components/windowType5.vue";
import windowType6 from "./components/windowType6.vue";

export default {
  name: "WdpWindow",
  components: {
    windowType1,
    windowType2,
    windowType3,
    windowType4,
    windowType5,
    windowType6
  },
  data() {
    return {
      windowType: "type1", // 默认类型
      cusConfig: {
        title: "",
        width: "100%",
        height: "100%",
      }, // 将在initializeWindow中动态填充
      bgType: "bg1", // 背景类型，默认 bg1
      isShowCloseBtn: true, // 是否显示关闭按钮，默认显示
      originalStyles: null, // 保存原始根元素样式
    };
  },
  computed: {
    // 根据类型动态选择组件
    currentComponent() {
      const typeMap = {
        type1: "windowType1",
        type2: "windowType2",
        type3: "windowType3",
        type4: "windowType4",
        type5: "windowType5",
        type6: "windowType6",
      };
      return typeMap[this.windowType] || "windowType1";
    },
    // 传递给子组件的属性
    componentProps() {
      return {
        ...this.$route.query, // 将 URL 查询参数传递给子组件
      };
    },
    // 根据 bgType 动态映射背景图
    backgroundImage() {
      const bgMap = {
        bg1: require('@/assets/images/window/bg1.png'),
        bg2: require('@/assets/images/window/bg2.png'),
        bg3: require('@/assets/images/window/bg3.png'),
        bg4: require('@/assets/images/window/bg4.png'),
        bg5_1: require('@/assets/images/window/bg5_1.png'),
        bg5_2: require('@/assets/images/window/bg5_2.png'),
      };
      const bgImage = bgMap[this.bgType] || bgMap['bg1'];
      return `url(${bgImage})`;
    },
  },
  mounted() {
    this.initializeWindow();
    this.setRootElementStyles();
  },
  beforeDestroy() {
    this.resetRootElementStyles();
  },
  methods: {
    closeWindow() {
      const jsondata = {
        name: "closeThePage",
        data: 10000,
        msg: "你好！",
        p_eid: this.cusConfig.p_eid || null,
      };

      w51_event("EventKey", jsondata);
    },

    /**
     * 设置根元素 html 的样式
     */
    setRootElementStyles() {
      const htmlElement = document.documentElement;

      // 保存原始样式
      this.originalStyles = {
        htmlWidth: htmlElement.style.width,
        htmlHeight: htmlElement.style.height,
        htmlOverflow: htmlElement.style.overflow,
        htmlBackgroundColor: htmlElement.style.backgroundColor,
        htmlFontSize: htmlElement.style.fontSize,
        bodyWidth: document.body.style.width,
        bodyHeight: document.body.style.height,
        bodyPadding: document.body.style.padding,
        bodyBackgroundColor: document.body.style.backgroundColor,
      };
      // 设置新样式
      htmlElement.style.width = this.cusConfig.width;
      htmlElement.style.height = this.cusConfig.height;
      htmlElement.style.fontSize = "1.8vw"; // 禁止滚动
      htmlElement.style.overflow = "hidden";
      htmlElement.style.backgroundColor = "transparent";

      // 设置body样式
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.padding = "0";
      document.body.style.backgroundColor = "transparent";
    },

    /**
     * 重置根元素 html 的样式
     */
    resetRootElementStyles() {
      if (this.originalStyles) {
        const htmlElement = document.documentElement;

        // 恢复原始样式
        htmlElement.style.width = this.originalStyles.width;
        htmlElement.style.height = this.originalStyles.height;
        htmlElement.style.overflow = this.originalStyles.overflow;
        htmlElement.style.backgroundColor = this.originalStyles.backgroundColor;
        htmlElement.style.fontSize = this.originalStyles.fontSize;

        document.body.style.width = this.originalStyles.bodyWidth;
        document.body.style.height = this.originalStyles.bodyHeight;
        document.body.style.padding = this.originalStyles.bodyPadding;
        document.body.style.backgroundColor =
          this.originalStyles.bodyBackgroundColor;

        console.log("已重置根元素样式");
      }
    },

    /**
     * 初始化窗口配置
     */
    initializeWindow() {
      // 从 URL 查询参数获取配置
      const query = this.$route.query;

      // 设置窗口类型
      if (
        query.type &&
        ["type1", "type2", "type3", "type4", "type5", "type6"].includes(query.type)
      ) {
        this.windowType = query.type;
      }

      if(query.bgType && ["bg1", "bg2", "bg3", "bg4","bg5_1","bg5_2"].includes(query.bgType)){
        this.bgType = query.bgType;
      }

      if (query.isShowCloseBtn !== undefined) {
        this.isShowCloseBtn = query.isShowCloseBtn === "true";
      }

      // 动态遍历所有query参数到cusConfig中
      this.cusConfig = {
        ...query,
      };

      console.log("初始化配置:", this.cusConfig);
      console.log("背景类型:", this.bgType);
    },
  },
};
</script>
