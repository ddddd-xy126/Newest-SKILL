<style lang="scss" scoped>
.building-selector {
  position: relative;
  width: 7.8rem;
  color: white;
  font-size: pxToRem(32);

  .park-icon {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: url(~@images/right_side_tool_six.png) no-repeat center center / 89%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;
    z-index: 2;

    .triangle {
      cursor: pointer;
      position: absolute;
      bottom: 15%;
      width: 0;
      height: 0;
      border-left: pxToRem(10) solid transparent;
      border-right: pxToRem(10) solid transparent;
      transition: transform 0.3s ease;

      &.up {
        border-bottom: pxToRem(12) solid #ffaa00;
        transform: rotate(0deg);
      }

      &.down {
        border-bottom: pxToRem(12) solid #ffaa00;
        transform: rotate(180deg);
      }
    }
  }

  .menu {
    position: absolute;
    padding: 10% 0 50%;
    display: flex;
    flex-direction: column-reverse;
    width: 89%;
    background-color: rgba(0, 16, 30, 0.2545);
    bottom: 70%;
    left: 50%;
    transform: translateX(-50%);
    gap: pxToRem(28);
    z-index: -1;

    .menu-item {
      cursor: pointer;
      padding: 8%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: pxToRem(32);

      &.active {
        background: linear-gradient(90deg,
            rgba(23, 118, 238, 0) -11%,
            rgba(23, 118, 238, 0) 1%,
            rgba(23, 163, 238, 0.69) 52%,
            rgba(23, 118, 238, 0) 101%);
      }

      &:hover:not(.active) {
        background: linear-gradient(90deg,
            rgba(23, 118, 238, 0) -11%,
            rgba(23, 118, 238, 0) 1%,
            rgba(23, 163, 238, 0.3) 52%,
            rgba(23, 118, 238, 0) 101%);
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-to,
.slide-leave {
  opacity: 1;
}

.camera {
  width: 100%;
  height: 3rem;
}
</style>

<template>
  <div class="building-selector">
    <transition name="slide">
      <div class="menu" v-show="isOpen">
        <div v-for="item in data" :key="item.id" class="menu-item" :class="{ active: item.isActive }"
          @click="selectFloor(item)">
          {{ item.name }}
        </div>
      </div>
    </transition>

    <div class="park-icon" @click="toggleMenu">
      园区
      <div class="triangle" :class="isOpen ? 'up' : 'down'"></div>
    </div>
    <!-- <button class="camera" @click="getCaerma">相机位置</button> -->
  </div>
</template>

<script>
import { getCameraInfo } from "@/utils/wdpapi/camera";
export default {
  name: "SplitBuilding",
  props: {
    floorData: {
      type: Array,
      default: () => [
        { id: 1, name: "B1", isActive: false, floor: -1 },
        { id: 2, name: "F1", isActive: false, floor: 1 },
        { id: 3, name: "F2", isActive: false, floor: 2 },
        { id: 4, name: "F3", isActive: false, floor: 3 },
      ],
    },
  },
  data() {
    return {
      data: [],
      currentItem: null,
      isOpen: false,
    };
  },

  mounted() {
    // 初始化楼层数�?
    this.data = [...this.floorData];
    // 默认选中第一个选项
    // this.selectFloor(this.data[0]);
    console.log("9999999999999999999");
  },

  methods: {
    async getCaerma() {
      const res = await getCameraInfo();
      const location = res.result.location;
      // 自动复制到剪贴板
      if (location) {
        let text = "";
        if (Array.isArray(location)) {
          text = JSON.stringify(location);
        } else if (typeof location === "object") {
          text = JSON.stringify(location);
        } else {
          text = String(location);
        }
        try {
          await navigator.clipboard.writeText(text);
          this.$message && this.$message.success("已复制到剪贴板！");
          // 或者用 alert("已复制到剪贴板！");
        } catch (e) {
          this.$message && this.$message.error("复制失败，请手动复制�?);
        }
      }
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },

    selectFloor(selectedItem) {
      // this.$emit("selectItem", item);
      this.currentItem = selectedItem;
      this.data.forEach((item) => {
        if (this.currentItem.id == item.id) {
          item.isActive = !item.isActive;
          this.$emit("floor-selected", selectedItem);
        } else {
          item.isActive = false;
        }
      });
    },
  },

  watch: {
    floorData: {
      handler(newVal) {
        this.data = [...newVal];
      },
      deep: true,
      immediate: true,
    },
  },

  computed: {},
};
</script>
