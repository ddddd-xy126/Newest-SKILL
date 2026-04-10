<template>
  <div class="content">
    <div
      class="side"
      v-for="(item, key) in sideBarList"
      :key="key"
      :class="{ active: item.isActive }"
      @click="selectItem(item)"
    >
      <div class="side-left">
        <img :src="item.icon" alt="" />
      </div>
      <div class="side-right">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  props: {
    sideBarListData: {
      type: Array,
      required: true,
    },
  },
  watch: {
    sideBarListData: {
      handler(newVal) {
        this.sideBarList = JSON.parse(JSON.stringify(newVal));
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // this.sideBarList = JSON.parse(JSON.stringify(this.sideBarListData));
  },

  data() {
    return {
      sideBarList: [],
    };
  },
  methods: {
    selectItem: debounce(function (item) {
      // console.log('item!!!!!!!!!!!!!!!!!!!!!!', item);

      // 如果点击的是当前激活的按钮，则取消激活
      if (item.isActive) {
        item.isActive = false;
        const newItem = {
          ...item,
          isResetCamera: true,
        };
        this.$emit("selectItem", newItem);
        return;
      }

      // 互斥逻辑：先取消所有按钮的激活状态
      this.sideBarList.forEach((sideItem) => {
        if (sideItem.isActive) {
          sideItem.isActive = false;
          // 发送取消激活事件
          // this.$emit("selectItem", sideItem);
        }
      });

      // 激活当前点击的按钮
      item.isActive = true;
      this.$emit("selectItem", item);
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;

  .side {
    display: flex;
    cursor: pointer;
    gap: var(--font-size-8);
    margin-top: 10%;

    &:hover {
      .side-left {
        background-image: url("~@/assets/images/sideBarLeft/active-head.png");
      }
      .side-right {
        background: linear-gradient(
          90deg,
          rgba(70, 135, 178, 0.8) 0%,
          rgba(70, 135, 178, 0.5) 20%,
          rgba(70, 135, 178, 0.1) 60%
        );
      }
    }


    // 从左滑出版本
    &.active {
      .side-left {
        background-image: url("~@/assets/images/sideBarLeft/active-head.png");
        animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .side-right {
        animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(
          90deg,
          rgba(70, 135, 178, 0.8) 0%,
          rgba(70, 135, 178, 0.5) 20%,
          rgba(70, 135, 178, 0.1) 60%
        );
        filter: brightness(1.2);
      }
    }

    @keyframes slideInLeft {
      0% {
        transform: translateX(-16px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .side-left {
      flex: 0 0 var(--font-size-64);
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url("~@/assets/images/sideBarLeft/head.png");
      background-size: 100% 100%;

      img {
        max-width: 100%;
        height: var(--font-size-64);
        padding: var(--font-size-16);
      }
    }

    .side-right {
      flex: 0 0 12rem;
      background: rgba(0, 22, 35, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      border: var(--box-content-border);
      font-size: var(--font-size-34);
      font-family: var(--font-family-primary-Regular);
      color: var(--color-primary);
    }
  }
}
</style>
