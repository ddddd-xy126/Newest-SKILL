<style lang="scss" scoped>
.content-left {
  .box-left-1 {
    height: 50%;
  }

  .box-left-2 {
    height: 36%;
  }
}

.content-right {
  .box-right-1 {
    height: 30%;
  }

  .box-right-2 {
    height: 36%;
  }
}
</style>

<template>
  <Layout :aside="true" :main="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="box-left-1" type="simple" title="智慧停车-左1" :delayTime="100" position="left"
          :bgImage="require('@/assets/images/ui_material/page_1_4/box1.png')">
          <div class="box-main-content"></div>
        </Box>
        <Box class="box-left-2" type="simple" title="智慧停车-左2" :delayTime="200" position="left"
          :bgImage="require('@/assets/images/ui_material/page_1_4/box2.png')">
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>
    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="box-right-1" type="simple" title="智慧停车-右1" :delayTime="100" position="right"
          :bgImage="require('@/assets/images/ui_material/page_1_4/box3.png')">
          <div class="box-main-content"></div>
        </Box>
        <Box class="box-right-2" type="simple" title="智慧停车-右2" :delayTime="200" position="right"
          :bgImage="require('@/assets/images/ui_material/page_1_4/box4.png')">
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
  name: "Page1_4",
  components: { Layout, Box },
};
</script>
