<template>
  <div id="player"></div>
</template>

<script>
import WdpApi from "wdpapi";
import { addWINDOWS, addPath } from "@utilsWdpApi/entity";
import { deleteTypes, ClearByEids } from "@utilsWdpApi/delete.js";
import { resetCamera } from "@utilsWdpApi/camera.js";
import { FocusByCustomId, FocusByPoints } from "@utilsWdpApi/camera";
import { mapState } from "vuex";
import { customWarningStatus, setStandbyMode } from "@utilsWdpApi/custom";

import toolCleanupMixin from "@/mixins/toolCleanupMixin.js";
// import { loadConfig } from "@/utils/configPath.js";

export default {
  name: "scene",
  mixins: [toolCleanupMixin],
  data() {
    return {
      App: null,
      config: {
        url: "",
        order: "",
      },
      defaultTypes: ["Poi", "Window", "Range", "Particle"],
    };
  },

  computed: {
    ...mapState(["windowEid", "windowEidChild", "isShowWindow", "trackPath"]),
  },

  async created() {
    // 加载外部配置文件
    return
    try {
      const response = await fetch("./config.json");
      this.config = await response.json();
      // this.config = await loadConfig();
      this.loadConfig();
      const obj = {
        id: "player", //渲染容器dom id
        url: this.config.url, //[可选] 渲染服务地址
        order: this.config.order, //[可选] 场景order
        resolution: this.config.resolution, //[可选] 场景输出分辨率
        debugMode: "normal", //[可选] none:不打印日志, normal:普通日志
        keyboard: {
          //[可选]
          normal: false, //[可选] 键盘事件(wasd方向)开启关闭
          func: false, //[可选] 浏览器F1~F12功能键开启关闭
        },
      };

      if (this.config.isNeedFullScreen) {
        obj.resolution = [innerWidth, innerHeight];
      }

      this.App = new WdpApi(obj);

      this.$store.commit("wdpApp", this.App);
      this.$store.commit("wdpConfig", this.config);

      this.App.Renderer.Start().then((res) => {
        const _this = this;

        if (res.success) {
          this.App.Renderer.RegisterEvent([
            {
              name: "onVideoReady",
              func: async function () {
                // 视频流链接成功
              },
            },
          ]);
          this.App.Renderer.RegisterSceneEvent([
            {
              name: "OnWdpSceneIsReady",
              func: async function (res) {
                if (res.result.progress === 100) {
                  // 场景加载完成
                  console.log("场景加载完成");
                  //场景默认操作
                  _this.sceneDefault();
                }
              },
            },
            {
              name: "OnEntityClicked",
              func: async function (res) {
                // Entity被点击事件回调; 包含数据信息与实体对象
                console.log("OnEntityClicked://", res.result.position);

                // addWINDOWS(
                //   res.result.position,
                //   res.result.object.Eid,
                //   res.result.object.Eid
                // );
              },
            },
            {
              name: "OnMouseEnterEntity",
              func: async function (res) {
                // Entity被点击事件回调; 包含数据信息与实体对象
              },
            },
            {
              name: "OnMouseOutEntity",
              func: async function (res) {
                // Entity被点击事件回调; 包含数据信息与实体对象
              },
            },
            {
              name: "OnWebJSEvent",
              func: async function (data) {
                const obj = JSON.parse(data.result.args);

                if (obj.name === "closeThePage") {
                  console.log(obj, "当前选中弹窗自定义参数");
                  await ClearByEids([
                    obj.p_eid !== "null"
                      ? _this.windowEidChild.eid
                      : _this.windowEid,
                  ]);
                } else if (obj.name === "showTheDevice") {
                  console.log(obj, "123123123");
                  if (obj.data.status) {
                    const windowParams = {
                      title: "设施详情",
                      type: "type5",
                      bgType: "bg5_1",
                      p_eid: _this.windowEid,
                      coordZRef: "surface",
                      overlapOrder: 5,
                      customParams: { ...obj.data },
                    };
                    const res = await addWINDOWS(
                      obj.location.split(",").map(Number),
                      "设施详情",
                      Math.random(),
                      [300, 440],
                      20,
                      windowParams,
                      [320, 160],
                      false
                    );
                    _this.$store.commit("setWindowEidChild", {
                      p_eid: _this.windowEid,
                      eid: res.result.object.Eid,
                    });
                  } else {
                    // 关闭弹窗
                    await ClearByEids([
                      obj.p_eid !== "null"
                        ? _this.windowEidChild.eid
                        : _this.windowEid,
                    ]);
                  }

                } else if (obj.name === "showTheVedio") {
                  _this.$store.commit("isShowWindow", {
                    isShow: true,
                    config: { title: obj.title, url: obj.url },
                  });
                }
                else if (obj.name === "showThePath") {
                  // const pathResult = await addPath(
                  //   obj.data.pathPoi,
                  //   obj.data.otherConfig
                  // );
                  // if (obj.data.otherConfig.isCheckCamera) {
                  //   FocusByPoints(
                  //     [
                  //       113.71279006370693, 34.77230878673877,
                  //       9.133486872637963,
                  //     ],
                  //     0,
                  //     -17.100780487060547,
                  //     -116.35055541992188
                  //   );
                  // }
                  // _this.$store.commit(
                  //   "setTrackPath",
                  //   pathResult.result.object.Eid
                  // );
                  if (obj.title === "人员警示列表告警") {
                    // status为true时开启轨迹，为false时关闭轨迹
                    if (obj.status) {
                      await customWarningStatus("BJTX_RYJSLB", "Road", true);
                      await FocusByPoints([113.71278614602184, 34.772332367487401, 9.0745043454509045], 0, -27.300609588623047, -129.35079956054688)
                    } else {
                      await customWarningStatus("BJTX_RYJSLB", "Road", false);
                    }
                  }
                  else if (obj.title === "车辆警示列表告警") {
                    if (obj.status) {
                      await customWarningStatus("BJTX_CLJSLB", "Road", true);
                      await FocusByPoints([113.73240332434885, 34.773882846105934, 48.502817909577956], 0, -58.549808502197266, -116.30038452148438)
                    } else {
                      await customWarningStatus("BJTX_CLJSLB", "Road", false);
                    }


                  } else if (obj.title === "资产非法外出告警") {
                    if (obj.status) {
                      await customWarningStatus("ZCGL_FFWCGJ", "Road", true);
                    } else {
                      await customWarningStatus("ZCGL_FFWCGJ", "Road", false);
                    }
                  }
                }
              },
            },
            {
              name: "ZHAF_JQRXGGJ_HighlightRobot",
              func: async function (res) {
                console.log("ZHAF_JQRXGGJ_HighlightRobot", res);
                const data = _this.$store.state.isShowWebTwo.config;
                console.log("当前选中弹窗自定义参数", data);
                if (_this.$store.state.aiBotWindowId === 8) {
                  _this.$store.commit("isShowWebTwo", {
                    isShow: !_this.$store.state.isShowWebTwo.isShow,
                    config: data,
                  });
                }
                if (_this.$store.state.aiBotWindowId === 1) {
                  _this.$store.commit("isShowWebTwo", {
                    isShow: !_this.$store.state.isShowWebTwo.isShow,
                    config: data,
                  });
                }
              },
            },
          ]);
        } else {
          console.error("启动失败, 请刷新重试!");
          this.$message.error("启动失败, 请等待几秒后刷新重试!");
          this.$store.commit("isSceneAlready", false);
        }
      });
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  },

  beforeDestroy() {
    if (this.App) {
      this.App.Renderer.Stop();
      this.$store.commit("isSceneAlready", false);
    }
  },

  methods: {
    async sceneDefault() {
      this.$store.commit("isSceneAlready", true);
      // 场景初始化,包括镜头重置等操作
      this.initSceneClose();

      // // 删除已有实体
      // deleteTypes(this.defaultTypes);

      // // 相机位置重置
      // console.log("相机初始化");
      // resetCamera();
      // Default: 相机初始Limit; Free: 无Limit限制

      // console.log(res);
    },
    loadConfig() {
      try {
        // const urlParams = new URLSearchParams(window.location.search);
        const urlParams = this.$route.query;
        const urlSceneUrl = urlParams.sceneUrl;
        const urlSceneOrder = urlParams.sceneOrder;
        const urlAgentHostUrl = urlParams.agentHostUrl;
        if (urlSceneUrl) {
          this.config.url = urlSceneUrl;
        }
        if (urlSceneOrder) {
          this.config.order = urlSceneOrder;
        }
        if (urlAgentHostUrl) {
          this.config.agentHostUrl = urlAgentHostUrl;
        }
        console.log("加载配置成功:", this.config);
      } catch (error) {
        console.log("加载配置失败:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#player {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
