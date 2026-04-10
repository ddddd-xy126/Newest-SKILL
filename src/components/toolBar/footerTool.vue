<template>
  <div
    class="Card"
    :style="{
      width: width,
      'aspect-ratio': ration,
      border: `1.6px solid ${statusBorderColor[localCardData.status]}`,
      'box-shadow': localCardData.isActive
        ? `0 0 6rem ${statusBorderColor[localCardData.status]}CC`
        : 'none',
      '--status-color': statusBorderColor[localCardData.status],
    }"
    :class="{ active: localCardData.isActive }"
    @click="handleClick"
  >
    <!-- 标题 -->
    <div class="title">
      <!-- 左边部分 -->
      <div class="msg1">
        <img
          :style="{
            'box-shadow': `0 0 3rem ${
              statusBorderColor[localCardData.status]
            }AA`,
            'background-color': `${statusBorderColor[localCardData.status]}33`,
          }"
          :src="cardData.icon"
          class="msgImg"
          alt=""
        />

        <div class="msgText">
          <div class="msgText1">{{ localCardData.title }}</div>
          <div
            class="msgText2"
            :style="{ color: statusColor[localCardData.status] }"
          >
            ( {{ statusList[localCardData.status] }} )
          </div>
        </div>
      </div>
    </div>
    <!-- 主题内容 -->
    <div class="content">
      <div class="timeMsg">
        <span class="label">时间:</span><span>{{ localCardData.time }}</span>
      </div>
      <div class="locaMsg">
        <span class="label">位置:</span
        ><span>{{ localCardData.position }}</span>
      </div>
      <div class="descMsg">
        <span class="label">描述:</span><span>{{ localCardData.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
export default {
  name: "statusCard",
  props: {
    cardData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    width: {
      type: String,
      default: "30%",
    },
    ration: {
      type: String,
      default: "616/312",
    },
    statusList: {
      type: Object,
      default: () => ({
        1: "一般告警",
        2: "紧急告警",
      }),
    },
    statusColor: {
      type: Object,
      default: () => ({
        1: "#D3F1FF",
        2: "#FFE7D3",
      }),
    },
    statusBorderColor: {
      type: Object,
      default: () => ({
        1: "#2195E0",
        2: "#FF5C57",
      }),
    },
  },
  data() {
    return {
      // isActive: false,
      localCardData: {},
    };
  },
  watch: {
    cardData: {
      handler(newVal) {
        // console.log("!!!!!我变了");
        this.localCardData = { ...newVal };
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  methods: {
    handleClick() {
      this.$emit("Cardclick", this.cardData);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.Card:last-of-type {
  background-image: url("~@/assets/images/footerTool/bg_img.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.Card:first-of-type {
  background-image: url("~@/assets/images/footerTool/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.Card {
  cursor: pointer;
  padding: 0 1rem;
  display: flex;
  justify-content: center; // 主轴（水平）居中
  flex-direction: column; // 设置主轴为垂直方向（这样横轴就是水平方向）
  gap: 3.5rem;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 6rem var(--status-color, #2195e0) !important;
  }

  .title {
    width: 100%;
    // background: rgb(96, 221, 221);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .msg1 {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: var(--font-size-22);
      .msgImg {
        // background: #adddff;
        width: 4rem;
        aspect-ratio: 1/1;
        margin-right: 0.7rem;
        display: inline-block;
        box-sizing: border-box;
      }
      .msgText1 {
        color: #fff;
        font-family: var(--font-family-primary-Regular);
        font-size: var(--font-size-28);
        text-shadow: 0px 1px 2px rgba(38, 64, 91, 0.8);
      }
      .msgText2 {
        color: #ffe7d3;
        font-family: var(--font-family-primary-Regular);
        font-size: var(--font-size-16);
        text-shadow: 0px 1px 2px rgba(38, 64, 91, 0.8);
      }
    }
  }

  // 下半部分
  .content {
    width: 100%;
    height: 40%;
    // background-color: beige;
    font-size: var(--font-size-22);
    // 557 128
    div {
      width: 100%;
      height: 35%;
      // background-color: darkslategray;
      // padding: 0.5rem;
    }

    .label {
      color: #adddff;
      margin-right: 1rem;
    }
    span {
      font-size: var(--font-size-18);
      font-family: var(--font-family-primary-Regular);
    }
    .descMsg {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
