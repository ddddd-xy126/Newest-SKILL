<template>
  <div class="header">
    <!-- 右侧功能区：日期/时间/天气/PM2.5/设置 -->
    <div class="header-right">
      <div class="header-right-info">
        <span class="date-text">{{ formattedDate[0] }}</span>
        <span class="separator">|</span>
        <span class="time-text">{{ formattedDate[1] && formattedDate[1].substring(0, 5) }}</span>
      </div>
      <div class="header-right-weather">
        <img src="@images/layout/header-weather.png" alt="" class="weather-icon" />
        <span class="temperature">13 ℃</span>
      </div>
      <span class="divider">|</span>
      <div class="header-right-pm">
        <span class="pm-label">PM2.5</span>
        <span class="pm-value">26</span>
      </div>
      <div class="header-right-setting" @click="handleSettingClick">
        <img src="@images/layout/header-setting.png" alt="" class="setting-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentFormattedDateRobust } from "@utils/custom.js";

export default {
  name: "Header",
  data() {
    return {
      formattedDate: ["", "", ""],
      timer: null,
    };
  },
  mounted() {
    this.updateDate();
    this.timer = setInterval(this.updateDate, 1000);
  },
  methods: {
    updateDate() {
      this.formattedDate = getCurrentFormattedDateRobust();
    },
    handleSettingClick() {
      // 设置按钮点击事件，R4 细化
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("~@images/layout/top.png");
  background-size: 100% 100%;
}

/* 右侧功能区 */
.header-right {
  position: absolute;
  right: 1.5%;
  top: 0;
  height: 55%;
  display: flex;
  align-items: center;
  gap: pxToRem(16);
  min-width: 300px;
}

.divider {
  font-family: var(--font-family-OPPOSans-Medium);
  font-size: pxToRem(14);
  color: rgba(255, 255, 255, 0.4);
}

.header-right-info {
  display: flex;
  align-items: center;
  gap: pxToRem(8);

  .date-text {
    font-family: var(--font-family-OPPOSans-Medium);
    font-size: pxToRem(14);
    color: #ffffff;
    white-space: nowrap;
  }

  .separator {
    font-family: var(--font-family-OPPOSans-Medium);
    font-size: pxToRem(14);
    color: rgba(255, 255, 255, 0.4);
  }

  .time-text {
    font-family: var(--font-family-OPPOSans-Medium);
    font-size: pxToRem(14);
    color: #ffffff;
    white-space: nowrap;
  }
}

.header-right-weather {
  display: flex;
  align-items: center;
  gap: pxToRem(4);

  .weather-icon {
    width: pxToRem(17);
    height: pxToRem(16);
  }

  .temperature {
    font-family: var(--font-family-OPPOSans-Medium);
    font-size: pxToRem(14);
    color: #ffffff;
    white-space: nowrap;
  }
}

.header-right-pm {
  display: flex;
  align-items: center;
  gap: pxToRem(4);

  .pm-label {
    font-family: var(--font-family-OPPOSans-Medium);
    font-size: pxToRem(14);
    color: #ffffff;
    white-space: nowrap;
  }

  .pm-value {
    font-family: var(--font-family-OPPOSans-Medium);
    font-size: pxToRem(14);
    color: #ffffff;
    white-space: nowrap;
  }
}

.header-right-setting {
  display: flex;
  align-items: center;
  cursor: pointer;

  .setting-icon {
    width: pxToRem(20);
    height: pxToRem(20);
  }
}
</style>
