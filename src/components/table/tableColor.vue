<style lang="scss" scoped>
.air-quality-table {
  color: var(--color-primary);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  // 状态指示器样式
  .status-indicator {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.5%;
    gap: 5%;
    .status-item {
      display: flex;
      align-items: center;
      gap: var(--font-size-16);
      font-size: var(--font-size-14);
      span {
        color: var(--color-secondary);
      }
      .status-dot {
        width: var(--font-size-24);
        height: var(--font-size-24);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.status-excellent-out {
          background-color: rgba(78, 151, 245, 0.5);
          .status-excellent-inner {
            width: var(--font-size-12);
            height: var(--font-size-12);
            border-radius: 50%;
            background-color: rgba(78, 151, 245, 1);
          }
        }

        &.status-good-out {
          background-color: rgba(109, 158, 216, 0.5);
          .status-good-inner {
            width: var(--font-size-12);
            height: var(--font-size-12);
            border-radius: 50%;
            background-color: rgba(109, 158, 216, 1);
          }
        }

        &.status-poor-out {
          background-color: rgba(254, 197, 81, 0.5);
          .status-poor-inner {
            width: var(--font-size-12);
            height: var(--font-size-12);
            border-radius: 50%;
            background-color: rgba(254, 197, 81, 1);
          }
        }
      }
    }
  }

  // 整体表格样式
  .table-container {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    font-family: var(--font-family-primary-Regular);

    // 固定表头样式
    .table-header {
      width: 100%;
      background-color: transparent;
      z-index: 2;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: var(--font-size-12);
        width: 100%;
        height: 1px;
        background: url(~@images/table/table_line.png) no-repeat center/100% 100%;
        background-size: 100% 100%;
        z-index: 1;
      }

      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: var(--font-size-12);
        width: 100%;
        height: 1px;
        background: url(~@images/table/table_line.png) no-repeat center/100% 100%;
        background-size: 100% 100%;
        z-index: 1;
      }

      table {
        width: 100%;
        table-layout: fixed;

        th {
          text-align: center;
          font-weight: 500;
          font-size: var(--font-size-24);
          padding: 4% 0;
        }
      }
    }

    // 可滚动的表体容器（另外写了个table）
    .table-body-container {
      flex: 1;
      overflow-y: auto; // 可滚动

      .data-table {
        width: 100%;
        // 只写body部分
        tbody {
          td {
            border: 0.4rem solid rgba(224, 230, 237, 0);
            text-align: center;

            // 第一列监测点样式
            .monitor-point {
              font-weight: 700;
              font-family: var(--font-family-primary-Medium);
              font-size: var(--font-size-24);
              background: var(--gradient-text);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
            }

            // 其他列的单元格样式
            .cell {
              position: relative;
              display: flex;
              padding: 15.7% 0;
              align-items: center;
              justify-content: center;
              .value-highlight{
                font-size: var(--font-size-24);
              }
              img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="air-quality-table">
    <!-- 状态指示器 -->
    <div class="status-indicator">
      <div class="status-item">
        <div class="status-dot status-excellent-out">
          <div class="status-excellent-inner"></div>
        </div>
        <span>优</span>
      </div>
      <div class="status-item">
        <div class="status-dot status-good-out">
          <div class="status-good-inner"></div>
        </div>
        <span>良</span>
      </div>
      <div class="status-item">
        <div class="status-dot status-poor-out">
          <div class="status-poor-inner"></div>
        </div>
        <span>差</span>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <!-- 固定表头 -->
      <div class="table-header">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in processedHeaders" :style="{ width: columnsPercentage }" :key="index">
                {{ header.label }}
                <br />
                <span v-if="header.unit" class="unit">({{ header.unit }})</span>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- 可滚动的表体 -->
      <div class="table-body-container">
        <table class="data-table">
          <tbody>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
              <td
                v-for="(header, colIndex) in processedHeaders"
                :key="`${rowIndex}-${colIndex}`"
                :style="{ width: columnsPercentage }"
              >
                <!-- 第一列通常是监测点 -->
                <div v-if="colIndex === 0" class="monitor-point">
                  {{ row[header.key] }}
                </div>

                <!-- 有状态指示的列 -->
                <div v-else class="cell">
                  <img
                    :src="getStatusImage(header.key, row[header.key])"
                    alt="status"
                    class="status-icon"
                  />
                  <span class="value-highlight">{{ row[header.key] }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AirQualityTable",
  props: {
    data: {
      type: Array,
      default: () => [
        {
          point: "J01",
          temperature: 26.3,
          humidity: 55.5,
          co2: 0.08,
          pm25: 26.6,
          pm10: 23.2,
          tvoc: 0.52,
        },
        {
          point: "J02",
          temperature: 25.5,
          humidity: 47.2,
          co2: 0.09,
          pm25: 28.8,
          pm10: 22.8,
          tvoc: 0.49,
        },
        {
          point: "J03",
          temperature: 24.5,
          humidity: 55.4,
          co2: 0.05,
          pm25: 26.8,
          pm10: 29.6,
          tvoc: 0.52,
        },
        {
          point: "J04",
          temperature: 27.8,
          humidity: 56.2,
          co2: 0.06,
          pm25: 36.2,
          pm10: 30.8,
          tvoc: 0.42,
        },
        {
          point: "J05",
          temperature: 25.9,
          humidity: 52.6,
          co2: 0.07,
          pm25: 29.6,
          pm10: 45.9,
          tvoc: 0.48,
        },
      ],
    },
    headers: {
      type: Array,
      default: () => [
        { key: "point", label: "监测点" },
        { key: "temperature", label: "温度", unit: "℃" },
        { key: "humidity", label: "湿度", unit: "%" },
        { key: "co2", label: "CO2", unit: "%" },
        { key: "pm25", label: "PM2.5", unit: "μg/m³" },
        { key: "pm10", label: "PM10", unit: "μg/m³" },
        { key: "tvoc", label: "TVOC", unit: "mg/m³" },
      ],
    },
    // 状态阈值配置
    thresholds: {
      type: Object,
      default: () => ({
        temperature: { excellent: 28, good: 32 },
        humidity: { excellent: 56, good: 60 },
        co2: { excellent: 0.08, good: 0.1 },
        pm25: { excellent: 35, good: 75 },
        pm10: { excellent: 30, good: 44 },
        tvoc: { excellent: 0.5, good: 0.6 },
      }),
    },
  },
  data() {
    return {
      // 状态对应的图片
      statusImages: {
        excellent: require("@/assets/images/table/table_bgImg_best.png"),
        good: require("@/assets/images/table/table_bgImg_good.png"),
        poor: require("@/assets/images/table/table_bgImg_bad.png"),
      },
      // 默认表头
      defaultHeaders: [],
      // 默认数据
      defaultData: [],
    };
  },
  computed: {
    // 处理后的表头
    processedHeaders() {
      return this.headers.length > 0 ? this.headers : this.defaultHeaders;
    },
    // 处理后的表格数据
    tableData() {
      return this.data.length > 0 ? this.data : this.defaultData;
    },
    columnsPercentage() {
      return (100 / this.processedHeaders.length).toFixed(2) + '%';
    },
  },
  methods: {
    // 获取状态等级
    getStatus(type, value) {
      const threshold = this.thresholds[type];
      if (!threshold) return "excellent";
      if (value <= threshold.excellent) return "excellent";
      if (value <= threshold.good) return "good";
      return "poor";
    },

    // 获取状态对应的图片
    getStatusImage(type, value) {
      const status = this.getStatus(type, value);
      return this.statusImages[status];
    },
  },
};
</script>
