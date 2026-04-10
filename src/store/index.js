import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  // 定义已有的状态的数据
  state: {
    wdpApp: null,
    isShowScene: false,
    isSceneAlready: false,
    isShowWindow: {
      isShow: false,
      config: {}
    },
    wdpConfig: null,
    windowEid: null, // 添加窗口 EID 状态
    windowEidChild: {
      p_eid: null,
      eid: null,
    },
    trackPath: null,//查看轨迹
    isShowWebTwo: {
      isShow: false,
      config: {}
    },
    // AI机器人巡状态
    aiBotRouteState: null,
    aiBotWindowId: null,

    //存储当前环境压暗状态
    setDarkenStatus: {},
  },
  // 计算状态数据
  getters: {},

  mutations: {
    wdpConfig(state, newVal) {
      state.wdpConfig = newVal;
      console.log(state.wdpConfig, "全局存储wdp用户配置");
    },

    wdpApp(state, newVal) {
      state.wdpApp = newVal;
      console.log(state.wdpApp, "全局app");
    },

    isShowScene(state, newVal) {
      state.isShowScene = newVal;
      console.log(state.isShowScene, "全局isShowScene");
    },

    isSceneAlready(state, newVal) {
      state.isSceneAlready = newVal;
      console.log(state.isSceneAlready, "全局isSceneAlready");
    },

    setWindowEid(state, newVal) {
      state.windowEid = newVal;
      console.log(state.windowEid, "全局windowEid");
    },
    setWindowEidChild(state, newVal) {
      state.windowEidChild = newVal;
      console.log(state.windowEidChild, "全局windowEidChild");
    },
    isShowWindow(state, newVal) {
      state.isShowWindow = { ...newVal };
      console.log(state.isShowWindow, "全局isShowWindow");
    },
    setTrackPath(state, newVal) {
      state.trackPath = newVal;
      console.log(state.trackPath, "全局trackPath");
    },
    isShowWebTwo(state, newVal) {
      state.isShowWebTwo = { ...newVal };
      console.log(state.isShowWebTwo, "全局isShowWebTwo");
    },
    // AI机器人巡检路线状态管理
    setAiBotRouteState(state, newVal) {
      state.aiBotRouteState = newVal;
      console.log(state.aiBotRouteState, "全局AI机器人巡检路线状态");
    },
    setAiBotWindowId(state, newVal) {
      state.aiBotWindowId = newVal;
      console.log(state.aiBotWindowId, "全局aiBotWindowId");
    },

    //存储当前环境压暗状态
    setDarkenStatus(state, newVal) {
      state.setDarkenStatus = newVal;
      console.log(state.setDarkenStatus, "全局setDarkenStatus");
    },
  },

  actions: {},

  modules: {},
});
