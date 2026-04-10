<template>
  <div class="content">
    <div class="search-bar" v-if="isSearch">
      <input type="text" v-model="searchText" placeholder="请输入资产名称" />
      <span class="search-icon"></span>
    </div>
    <div
      class="person-event"
      v-for="item in data"
      :key="item.id"
      :class="{ highlight: shouldHighlight(item) }"
    >
      <img :src="item.img" class="head" />
      <span class="name">
        {{ item.name }}
      </span>
      <span class="model">{{ item.model }}</span>
      <div class="label">
        <span v-if="isNumber" class="abnormal-bg"><p class="font-color-gradient-red">{{ item.useTime }}</p></span>
        <span v-else :class="item.state ? 'abnormal-bg' : 'normal-bg'"><p :class="item.state ? 'font-color-gradient-red' : 'font-color-gradient-blue'">{{ textMap[item.state] }}</p></span>
      </div>
    </div>
  </div>
</template>

<script>
import { listMixin } from "@/mixins/listMixin.js";

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    textMap: {
      type: Object,
      default: () => ({}),
    },
    isNumber: {
      type: Boolean,
      default: false,
    },
  },

  mixins: [listMixin],
  created() {},
  data() {
    return {
      searchText: "",
    };
  },

  computed: {
    highlightId() {
      if (!this.searchText) return null;
      const match = this.data.find((item) =>
        (item.name || "").includes(this.searchText)
      );
      return match ? match.id : null;
    },
  },

  methods: {
    shouldHighlight(item) {
      if (!this.searchText) return false;
      return (item.name || "").includes(this.searchText);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-right: var(--font-size-14);
  padding-left: var(--font-size-16);

  //滚动条样式
  &::-webkit-scrollbar-thumb {
    background-color: #2195e0;
    border-radius: 0;
  }
  //滚动条样式
  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  .search-bar {
    position: relative;
    width: 100%;
    margin-bottom: var(--font-size-10);
    input {
      width: 100%;
      height: 3.6rem;
      border-radius: var(--font-size-8);
      border: 1px solid var(--color-desc);
      padding-left: var(--font-size-64);
      font-size: var(--font-size-28);
      font-family: var(--font-family-primary-Regular);
      background: transparent;
      color: var(--color-primary);
      outline: none;

      &:focus {
        border-color: var(--color-desc);
        box-shadow: none;
        background: transparent;
      }
    }

    .search-icon {
      position: absolute;
      left: var(--font-size-8);
      top: 50%;
      transform: translateY(-50%);
      width: 10%;
      height: var(--font-size-40);
      background: url("~@/assets/images/cartList/search.png") no-repeat center
        center;
      background-size: contain;
    }
  }

  .person-event {
    display: flex;
    align-items: center;
    background: url(~@assets/images/cartList/background.png) no-repeat;
    background-size: 100% 100%;
    padding: var(--font-size-10) var(--font-size-16);
    margin-bottom: 1.3%;
    width: 100%;
    height: 20%;

    // justify-content: space-between;

    img {
      width: 9%;
      aspect-ratio: 1/1;
      // margin-bottom: 1%;
    }
    span {
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--font-family-primary-Regular);
    }
    .name {
      font-size: var(--font-size-24) ;
      width: 25%;
    }
    .model {
      font-size: var(--font-size-24) ;
      // justify-content: flex-start;
      width: 33%;
    }
    .label {
      width: 32%;


      height: 80%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      span {
        display: block;
        font-size: var(--font-size-22);
        font-family: var(--font-family-primary-Medium);
      }
      .normal-bg {
        padding: 0.6rem 1.5rem;
        background-image: url("~@/assets/images/cartList/asset-list/nomal.png");
        background-size: 100% 100%;
        background-position: contain;
      }
      .abnormal-bg {
        padding: 0.6rem 1.5rem;
        background-image: url("~@/assets/images/cartList/asset-list/abnomal.png");
        background-position: center;
        background-size: 100% 100%;
      }
    }
  }

  .highlight {
    background: rgba(255, 255, 255, 0.445);
  }
}

.state-bg {
  font-size: var(--font-size-22);
  background-repeat: no-repeat;
  // width: 10rem;
  // padding: 1rem 1rem;
  height: 100%;
}
</style>
