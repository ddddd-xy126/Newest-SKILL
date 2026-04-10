<template>
  <div class="video-type5">
    <div class="item" v-if="config.img">
      <img :src="config.img" alt="图片" style="background-color: aliceblue; height: 15rem;width: 100%;" />
    </div>
    <template v-for="item in displayFields">
      <div v-if="config[item.key]" :key="item.key" :class="['item', item.smallFont ? 'small-font' : '']">
        <div class="item-title">{{ item.label }}</div>
        <div class="item-content">
          <div>
            {{ config[item.key] }}
          </div>
        </div>

      </div>
    </template>

  </div>
</template>

<script>
export default {
  name: "Type5",
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    windowType: {
      type: String,
      default: "type5",
    },
  },
  data() {
    return {
      displayFields: [
        { key: "temperature", label: "温度" },
        { key: "humidity", label: "湿度" },
        { key: "CO2", label: "CO2" },
        { key: "PM", label: "PM2.5" },
        { key: "noise", label: "噪音" },
        { key: "people", label: "具体人数" },
        { key: "light", label: "灯光" },
        { key: "deviceName", label: "设备名称" },
        { key: "deviceId", label: "设备编号" },
        { key: "maintenanceCycle", label: "维修周期" },
        { key: "timeToNextMaintenance", label: "距下次维保时长" },
        { key: "overdueUnrepaired", label: "逾期未修复" },
        { key: "workTime", label: "工作时间" },
        { key: "indoorCO2", label: "室内二氧化碳含量", smallFont: true },
        { key: "supplyAirTemp", label: "送风温度", smallFont: true },
        { key: "supplyAirPressure", label: "送风压差", smallFont: true },
        
        {
          key: "actualDemandAirVolume",
          label: "实际需求风量",
          smallFont: true,
        },
        { key: "actualSupplyAirTemp", label: "实际送风温度", smallFont: true },
        { key: "indoorTemp", label: "室内温度", smallFont: true },
        { key: "maxAirVolume", label: "最大风量设定", smallFont: true },
        { key: "minAirVolume", label: "制热模式最小风量设定", smallFont: true },
        { key: "parkNumber", label: "车位总数" },
        { key: "availablePark", label: "空余车位" },
        { key: "power", label: "功率" },
        { key: "loadFactor", label: "负载率" },
        {key: "elevator",label: "设备名称",},
        { key: "deviceID_ele", label: "设备ID" },
        { key: "weightPeople", label: "载客人数" },
      ],
    };
  },
  mounted() {
    console.log(this.config, '@@@@@@@@@@@@@@');
  }
};
</script>
<style lang="scss" scoped>
.video-type5 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 1%;

  .item {
    display: flex;
    color: #fff;
    font-size: var(--font-size-40);
    flex: 1 1 0;
    // background-color: antiquewhite;
    margin-top: 1.2rem;

    .item-title {
      width: 38.8%;
      background: url(~@images/window/title_bg.png) no-repeat center center;
      background-size: 100% 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-content {
      flex: 1;
      display: flex;
      align-items: center;
      background: url(~@images/window/content_bg.png) no-repeat center center;
      background-size: 100% 100%;
      padding: 0 2rem;
    }
  }

  .item.small-font {
    .item-title {
      width: 60% !important;
      padding: 0.5rem 0.5rem;
    }
  }
}
</style>
