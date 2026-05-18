<style lang="scss" scoped>
.content-left {
  .box-left-1 { height: 31.5%; }
  .box-left-2 { height: 36.3%; }
  .box-left-3 { height: 23.2%; }
}
.content-right {
  .box-right-1 { height: 30%; }
  .box-right-2 { height: 30%; }
  .box-right-3 { height: 30%; }
}
</style>

<template>
  <Layout :aside="true" :main="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="box-left-1" type="simple" title="火险评估-左1" :delayTime="100" position="left"><div class="box-main-content"></div></Box>
        <Box class="box-left-2" type="simple" title="火险评估-左2" :delayTime="200" position="left"><div class="box-main-content"></div></Box>
        <Box class="box-left-3" type="simple" title="火险评估-左3" :delayTime="300" position="left"><div class="box-main-content"></div></Box>
      </div>
    </template>
    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="box-right-1" type="simple" title="火险评估-右1" :delayTime="100" position="right"><div class="box-main-content"></div></Box>
        <Box class="box-right-2" type="simple" title="火险评估-右2" :delayTime="200" position="right"><div class="box-main-content"></div></Box>
        <Box class="box-right-3" type="simple" title="火险评估-右3" :delayTime="300" position="right"><div class="box-main-content"></div></Box>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";
export default {
  name: "Page4_2",
  components: { Layout, Box },
};
</script>
