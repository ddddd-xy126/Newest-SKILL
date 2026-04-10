<template>
  <div class="content">
    <div
      class="work-order-item"
      v-for="(item, index) in realtimeWorkData"
      :key="index"
      :class="statusClass(item.status)"
    >
      <div class="status" :style="statusStyle(item.status)">
        {{ item.status }}
      </div>

      <div class="info">
        <div class="position">{{ item.position }}</div>
        <div class="meta">
          <div class="name">处理人员：{{ maskName(item.name) }}</div>
          <div class="time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listMixin } from "@/mixins/listMixin.js";

export default {
  props: {
    realtimeWorkData: {
      type: Array,
      default: () => [],
    },

    statusMap: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [listMixin],
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-right: var(--font-size-14);
  padding-left: var(--font-size-16);

  .work-order-item {
    display: flex;
    margin-bottom: var(--font-size-16);
    color: var(--color-primary);

    .status {
      width: 17%;
      text-align: center;
      font-size: var(--font-size-28);
      font-family: var(--font-family-primary-Regular);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info {
      flex: 1;
      margin-left: 2%;
      padding: var(--font-size-12);
      background-color: rgba(32, 31, 31, 0.2);

      .position {
        font-size: var(--font-size-24);
        font-family: var(--font-family-primary-Medium);
        color: var(--color-primary);
        margin-bottom: 1%;
      }

      .meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name {
          font-size: var(--font-size-24);
          font-family: var(--font-family-primary-Regular);
          color: #fff;
        }

        .time {
          font-size: var(--font-size-22);
          font-family: var(--font-family-primary-Regular);
          color: #BFCFD8;
        }
      }
    }
  }
}
</style>
