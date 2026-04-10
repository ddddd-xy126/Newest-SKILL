<!-- src/components/Layout.vue -->
<template>
  <div class="selections">
    <el-popover
      v-model="isOpenSetting"
      placement="bottom-end"
      trigger="click"
      :visible-arrow="false"
      popper-class="setting-popover"
    >
      <!-- <setUpSwitch
        :timeOptions="timeOptions"
        :weatherOptions="weatherOptions"
      /> -->
      <setUpSwitch
        :timeOptions="timeOptions"
      />
      <img slot="reference" src="@images/setting.png" alt="" />
    </el-popover>
    <!-- <span>设置</span> -->

    <el-dialog
      title="搜索"
      :visible.sync="isOpenSearch"
      append-to-body
      :modal="false"
    >
      <searchInput />
    </el-dialog>
  </div>
</template>

<script>
import searchInput from "@components/searchInput.vue";
import setUpSwitch from "@components/setUpSwitch.vue";

export default {
  name: "selections",
  components: {
    searchInput,
    setUpSwitch,
  },
  data() {
    return {
      isOpenSearch: false,
      isOpenTools: false,
      isOpenSetting: false,

      timeOptions: [
        { id: 1, label: "8:30", icon: require("@images/toolIcon/8点.png") },
        { id: 2, label: "10:00", icon: require("@images/toolIcon/10点.png") },
        { id: 3, label: "18:00", icon: require("@images/toolIcon/18点.png") },
        { id: 4, label: "20:00", icon: require("@images/toolIcon/20点.png") },
      ],

      weatherOptions: [
        { id: 1, label: "晴朗", value: "sunny", icon: require("@images/toolIcon/sunny.png") },
        { id: 2, label: "多云", value: "cloudy", icon: require("@images/toolIcon/cloudy.png") },
        { id: 3, label: "下雨", value: "rainy", icon: require("@images/toolIcon/rainy.png") },
        { id: 4, label: "下雪", value: "snowy", icon: require("@images/toolIcon/snowy.png") },
      ],
    };
  },

  mounted() {},

  methods: {
    toggleSetting() {
      this.isOpenSetting = !this.isOpenSetting;
    },
  },
};
</script>

<style lang="scss" scoped>
.selections {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  // background-color: aliceblue;
  img {
    cursor: pointer;
    width: 3rem;
    height: 3rem;
    margin-right: 4%;
  }
  span {
    font-size: var(--font-size-34);
    cursor: pointer;
    font-family: var(--font-family-primary-Regular);
  }
}
</style>

<style lang="scss">
.setting-popover {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  padding: 0 !important;
  border-radius: 2rem !important;
  width: 40rem !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  top: 3.2% !important;

  .el-popover__title {
    display: none !important;
  }
}
</style>
