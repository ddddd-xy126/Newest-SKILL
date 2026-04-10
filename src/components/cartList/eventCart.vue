<template>
  <div class="content">
    <div class="person-event" v-for="(item, index) in data" :key="index">
      <img :src="item.img" class="head" />
      <div class="info">
        <p
          v-for="(e, key) in item"
          :key="key"
          
          :class="[
            key === 'date' ? 'date' : '',
            item.carId ? 'has-car-id' : '',
            key === 'name' ? 'field-name' : '',
          ]"
        >
          {{ format(key, e) }}
        </p>
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

  //滚动条样式
  &::-webkit-scrollbar-thumb {
    background-color: #2195e0;
    border-radius: 0;
  }
  //滚动条样式
  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  .person-event {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    background: url(~@assets/images/cartList/background.png) no-repeat;
    background-size: 100% 100%;
    padding: var(--font-size-14);
    margin-bottom: 2%;

    img {
      width: var(--font-size-64);
      aspect-ratio: 1/1;
      margin-bottom: 1%;
    }

    .info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--font-size-45);

      p {
        font-size: var(--font-size-24);
        color: var(--color-primary);
        font-family: var(--font-family-primary-Regular);

        &.date {
          color: var(--color-desc);
        }

        &.field-name {
          width: 3rem;
          display: inline-block;
        }
      }

      p.has-car-id {
        margin-right: 4rem;
      }
    }
  }
}
</style>
