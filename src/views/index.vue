<template>
  <Layout :header="true" :footer="true" :main="true" :scene="true">
    <template v-slot:header>
      <div class="content-header">
        <Header></Header>
        <!-- <button class="camera" @click="getCaerma">相机位置</button> -->
      </div>
    </template>

    <router-view></router-view>

    <template v-slot:scene>
      <div class="content-scene">
        <Scene></Scene>
      </div>
    </template>

    <template v-slot:footer>
      <div class="content-footer">
        <Footer></Footer>
      </div>
    </template>
  </Layout>
</template>

<script>
import { mapState } from "vuex";
import Layout from "@/layout/index.vue";
import Header from "@/layout/header.vue";
import Footer from "@/layout/footer.vue";
import Scene from "@/layout/scene.vue";

export default {
  name: "FrontEndIndex",
  components: {
    Layout,
    Header,
    Scene,
    Footer,
  },

  computed: {
    ...mapState(["isShowScene", "isShowWindow"]),
  },
  methods: {},
};
</script>
