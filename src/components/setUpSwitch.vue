<!-- wdpapi-time-weather-measure-0250828 -->
<template>
  <div class="setup-panel">
    <!-- 时间与现实同步 -->
    <div class="section">
      <div class="section-header">
        <span>时间与现实同步</span>
        <el-switch
          v-model="timeSync"
          class="large-switch"
          @change="changeTime"
        />
      </div>
      <div class="options-row">
        <el-button
          v-for="(t, index) in timeOptions"
          :key="index"
          :class="{ 'selected-gradient': selectedTime === t.id }"
          :disabled="timeSync"
          @click="selectTime(t)"
        >
          <img :src="t.icon" class="time-icon" />
          <div class="time-label">{{ t.label }}</div>
        </el-button>
      </div>
    </div>

    <!-- 天气与现实同步 -->
    <!-- <div class="section">
      <div class="section-header">
        <span>天气与现实同步</span>
        <el-switch
          v-model="weatherSync"
          class="large-switch"
          @change="syncWeather"
        />
      </div>
      <div class="options-row">
        <el-button
          v-for="(w, index) in weatherOptions"
          :key="index"
          :class="{ 'selected-gradient': selectedWeather === w.id }"
          @click="selectWeather(w)"
          :disabled="weatherSync"
        >
          <img :src="w.icon" class="weather-icon" />
          <div class="weather-label">{{ w.label }}</div>
        </el-button>
      </div>
    </div> -->

    <!-- 测量模式 -->
    <div class="section">
      <div class="section-header">
        <span>测量模式</span>
        <el-switch
          v-model="measureMode"
          class="large-switch"
          @change="toggleMeasureMode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { setSceneWeather, setSceneTime } from "@utilsWdpApi/tool.js";
import { pickPoint, getPoints } from "@utils/wdpapi/tool";

export default {
  name: "setUpSwitch",
  props: {
    timeOptions: {
      type: Array,
      default: () => [],
    },
    weatherOptions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      timeSync: false,
      weatherSync: false,
      measureMode: false,
      selectedTime: null,
      selectedWeather: null,


      weatherList: {
        晴朗: "Sunny",
        多云: "Cloudy",
        下雨: "ModerateRain",
        下雪: "ModerateSnow",
      },
    };
  },
  mounted() {
    // 默认选中第一个时间选项并触发效果
    // if (this.timeOptions && this.timeOptions.length > 0) {
    //   this.selectTime(this.timeOptions[0]);
    // }
  },
  methods: {
    async changeTime(isRealTime) {
      if (isRealTime) {
        setSceneTime("", isRealTime);
        // 选中的时间置为null
        this.selectedTime = null;
      }
    },
    async selectTime(t) {
      this.selectedTime = t.id;
      await setSceneTime(t.label, this.timeSync);
    },

    async syncWeather(val) {
      if (val) {
        const realWeather = await setSceneWeather("auto");
        this.selectedWeather = null;
        console.log(realWeather, "真实天气");
      }
    },
    async selectWeather(w) {
      this.selectedWeather = w.id;
      // console.log(this.selectedWeather, "点击事件按钮");
      const weather = await setSceneWeather(this.weatherList[w.label]);
      console.log(weather, "天气");
    },

    async toggleMeasureMode() {
      if (this.measureMode) {
        await pickPoint(true);
      } else {
        const points = await getPoints('ground');
        console.log("测量模式已关闭，当前点:", points);
              // 自动复制到剪贴板
      if (points) {
        let text = "";
        if (Array.isArray(points)) {
          text = JSON.stringify(points);
        } else if (typeof points === "object") {
          text = JSON.stringify(points);
        } else {
          text = String(points);
        }
        try {
          await navigator.clipboard.writeText(text);
          this.$message && this.$message.success("已复制到剪贴板！");
        } catch (e) {
          this.$message && this.$message.error("复制失败，请手动复制！");
        }
      }
        await pickPoint(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.setup-panel {
  background: rgba(24, 23, 23, 0.7);
  font-size: var(--font-size-32);
  width: 100%;
  height: 100%;

  .section {
    border-bottom: 2px solid rgb(139, 137, 137, 0.4);
    padding: 1rem;

    &:last-child {
      border-bottom: none;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 1rem 1rem 1rem;

      span {
        font-size: var(--font-size-32);
      }
    }

    .options-row {
      display: flex;
      justify-content: space-around;
      flex-wrap: nowrap;
      padding: 0.5rem 0.5rem;

      .el-button {
        width: 6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: transparent;
        border: none;
        font-size: var(--font-size-32);

        &.is-disabled {
          cursor: not-allowed !important;
          background: none !important;
        }
        &:hover {
          background: linear-gradient(
            to bottom,
            rgb(81, 133, 149),
            rgb(81, 133, 149, 0.1)
          );
        }

        &.selected-gradient {
          background: linear-gradient(
            to bottom,
            rgb(81, 133, 149),
            rgb(81, 133, 149, 0.1)
          );
        }
      }

      .time-icon,
      .weather-icon {
        font-size: var(--font-size-64);
        width: 2.5rem;
      }

      .weather-icon {
        width: 3rem;
      }
      .time-label,
      .weather-label {
        font-size: var(--font-size-32);
        margin-top: 1rem;
        color: #fff;
      }
    }
  }
}
</style>

<style lang="scss">
.el-switch.is-checked .el-switch__core::after {
  left: 100%;
  margin-left: -2rem;
}
// 全局样式，美化开关
.large-switch {
  .el-switch__core {
    width: 5.5rem !important;
    height: 2rem !important;
    border-radius: 10rem !important;
  }

  .el-switch__core::after {
    width: 2rem !important;
    height: 1.3em !important;

    content: "";
    position: absolute;
    top: 0px !important;
    left: 1px;
    transition: all 0.3s;
    background-color: #fff;
  }

  &.is-checked {
    .el-switch__core {
      background: rgb(134, 224, 237) !important;
      border: 1px solid rgb(134, 224, 237) !important;
    }
  }
}
</style>
