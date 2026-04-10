<template>
  <div class="footer-tool-content">
    <Box
      class="footer-tool-box"
      :footerBoxStyle="{
        'margin-bottom': '0',
        width: '25rem',
      }"
    >
      <template v-slot:header>
        <h1>{{ footerToolHeaderName }}</h1>
      </template>

      <template v-slot:header-en>
        <span class="header-en">{{ footerToolHeaderEn }}</span>
      </template>

      <div class="box-main-content">
        <transition-group name="footer-item" tag="div" class="footer-items-wrapper">
          <FooterItem
            v-for="item in footerToolsDataList"
            :key="item.id"
            :cardData="item"
            @Cardclick="footerSelectItem"
          />
        </transition-group>
        
        <!-- 空数据状态 -->
        <transition name="fade">
          <div v-if="footerToolsDataList.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <div class="empty-text">暂无事件数据</div>
          </div>
        </transition>
      </div>
    </Box>
  </div>
</template>

<script>
import { debounce } from "lodash";
import Box from "@/layout/box.vue";
import FooterItem from "@components/toolBar/footerTool.vue";
export default {
  components: {
    Box,
    FooterItem,
  },
  props: {
    footerToolsData: {
      type: Array,
      required: true,
    },
    footerToolHeaderName: {
      type: String,
      required: true,
    },
    footerToolHeaderEn: {
      type: String,
      required: true,
    },
  },
  watch: {
    footerToolsData: {
      handler(newVal) {
        this.footerToolsDataList = JSON.parse(JSON.stringify(newVal));
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},

  data() {
    return {
      footerToolsDataList: [],
    };
  },
  methods: {
    footerSelectItem: debounce(function (item) {
  
    // console.log('!!!!点击')
      if (item.isActive) {
        item.isActive = false;
        const newItem = {
          ...item,
          isResetCamera: true,
        };
        this.$emit("footerSelectItem", newItem);

        return;
      }

      this.footerToolsDataList.forEach((footerItem) => {
         if (footerItem.isActive) {
          footerItem.isActive = false;
          // 发送取消激活事件
          // this.$emit("selectItem", sideItem);
        }
      });
      item.isActive = true;
      this.$emit("footerSelectItem", item);
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
.footer-tool-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.footer-tool-content {
  // background-color:antiquewhite;
  .footer-tool-box {
    height: 100%;

    .header-en {
      font-family: var(--font-family-primary-Regular);
      color: rgba(255, 255, 255, 0.75);
      font-size: var(--font-size-24);
    }

    .box-main-content {
      height: 18rem;
      display: flex;
      align-content: center;
      justify-content: center;
      gap: 1.5rem;
      margin: 2rem 0;
      position: relative;

      .footer-items-wrapper {
        display: flex;
        align-content: center;
        justify-content: center;
        gap: 1.5rem;
        width: 100%;
      }

      // 空数据状态样式
      .empty-state {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        .empty-icon {
          font-size: 4rem;
          opacity: 0.3;
        }

        .empty-text {
          font-size: var(--font-size-16);
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-family-primary-Regular);
        }
      }

      // 列表项进入/离开动画
      .footer-item-enter-active,
      .footer-item-leave-active {
        transition: all 0.5s ease;
      }

      .footer-item-enter {
        opacity: 0;
        transform: translateY(30px);
      }

      .footer-item-leave-to {
        opacity: 0;
        transform: translateY(-30px);
      }

      .footer-item-move {
        transition: transform 0.5s ease;
      }

      // 空数据淡入淡出动画
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.3s ease;
      }

      .fade-enter {
        opacity: 0;
      }

      .fade-leave-to {
        opacity: 0;
      }
    }
  }
}

.footer-tool-box ::v-deep .box-main {
  padding: 0 2% !important;
}

.footer-tool-box ::v-deep .box-header {
  width: 22rem !important;
  padding: 0.4% 0 !important;
}

.footer-tool-box ::v-deep .line {
  margin: 1% 0 !important;
}
</style>
