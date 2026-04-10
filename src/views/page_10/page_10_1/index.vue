<style lang="scss" scoped>
.content-left {
  .left-1 {
    height: 22%;
  }
  .left-2 {
    height: 22%;
  }
  .left-3 {
    height: 22%;
  }
  .left-4 {
    height: 22%;
  }
}

.content-right {
  .right-1 {
    height: 22%;
  }
  .right-2 {
    height: 22%;
  }
  .right-3 {
    height: 22%;
  }
  .right-4 {
    height: 22%;
  }
}
</style>

<template>
  <Layout :aside="true" :main="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="left-1" type="simple" title="网络管理" :delayTime="100" position="left">
          <div class="box-main-content"></div>
        </Box>

        <Box class="left-2" type="simple" title="面板标题" :delayTime="200" position="left">
          <div class="box-main-content"></div>
        </Box>

        <Box class="left-3" type="simple" title="面板标题" :delayTime="300" position="left">
          <div class="box-main-content"></div>
        </Box>

        <Box class="left-4" type="simple" title="面板标题" :delayTime="400" position="left">
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>

    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="right-1" type="simple" title="面板标题" :delayTime="100" position="right">
          <div class="box-main-content"></div>
        </Box>

        <Box class="right-2" type="simple" title="面板标题" :delayTime="200" position="right">
          <div class="box-main-content"></div>
        </Box>

        <Box class="right-3" type="simple" title="面板标题" :delayTime="300" position="right">
          <div class="box-main-content"></div>
        </Box>

        <Box class="right-4" type="simple" title="面板标题" :delayTime="400" position="right">
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";

export default {
  name: "Page10_1",
  components: {
    Layout,
    Box,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
