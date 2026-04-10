import { deleteObjs, deleteTypes } from "@utilsWdpApi/delete";
import { ClearByEids } from "@utilsWdpApi/delete";
import { resetCamera } from "@utilsWdpApi/camera";
import { setSceneTime } from "@utilsWdpApi/tool.js";
import {
  customStatus, splitBuildByName, setStandbyMode,changeDarkColor
} from "@utilsWdpApi/custom";
/**
 * 工具清理混入
 * 提供通用的工具对象清理方法，避免在各个页面重复编写相同的清理逻辑
 */
export default {
  data() {
    return {
      types: ["Window", "Path", "Poi", "Range", "Particle", "Text3D","Viewshed"],
      allCustome: ['ZCGL_ZCPD','ZHAF_AIJQR_DarkenScence', 'ZHAF_AFGT_DarkenBuilding', 'ZHAF_HeatMap_Person', 'ZHAF_JQRXGGJ_HighlightRobot', 'ZHAF_SPZJ'],
      darkColorConfig: [
        "便捷通行_车辆闸机颜色",
        "便捷通行_车位统计颜色",
        "便捷通行_班车信息颜色",
        "网络体验_六边形分析颜色",
        "孤立显示建筑颜色"
      ]
    }
  },
  methods: {

    //进入场景初始化
    async initSceneClose() {
      await this.deleteByTypes(this.types);
      // await resetCamera();
      await setSceneTime("08:30",false);
      // 开启待机漫游
      await setStandbyMode(true);

      // 设置压暗颜色配置
      // 遍历调用修改颜色
      for (const paramName of this.darkColorConfig) {
        await changeDarkColor(paramName, "949494");
      }

      // 取消场景压暗
      // this.allCustome.forEach(async (item) => {
      //   await customStatus(item, false);
      // });

      // 取消场景拆楼
      // await splitBuildByName("SH_HWLQH_F12", 10);
      
      // 取消小车
      // await aiBotRoute(this.aiBotStatus.runningId, "Stop", 1);
    },

    /**
     * 通用的beforeDestroy清理逻辑
     * 包含清空工具对象、执行关闭处理、重置摄像头、删除指定类型等操作
     */
    async performCommonCleanup() {
      // 停止待机漫游
      await setStandbyMode(false);

      // 清空所有工具对象
      await this.clearAllToolObjs();

      // // 重置摄像头
      // resetCamera();

      // 根据类型删除
      await this.deleteByTypes(this.types);

      // 根据Eid删除window
      // console.log(
      //   "删除对象!!!!!!!!!!!!!!!!!!!:",
      //   this.$store.state.windowEid
      // );
      await ClearByEids([this.$store.state.windowEid]);
    },

    /**
     * 清空所有工具对象
     * 遍历toolObjs中的所有对象并删除，然后清空数组
     */
    async clearAllToolObjs() {
      for (const key in this.toolObjs) {
        if (this.toolObjs[key] && this.toolObjs[key].length > 0) {
          await this.deleteByObjs(this.toolObjs[key]);
          this.toolObjs[key] = [];
        }
      }
    },

    /**
     * 删除指定类型的对象
     * @param {Array} types - 要删除的类型数组
     */
    async deleteByTypes(types) {
      try {
        const res = await deleteTypes(types);
        if (res.success) {
          console.log("删除操作成功:", res);
        } else {
          console.error("删除操作失败:", res);
        }
      } catch (error) {
        console.error("删除操作失败:", error);
      }
    },

    /**
     * 删除指定的对象
     * @param {Array} objs - 要删除的对象数组
     */
    async deleteByObjs(objs) {
      const res = await deleteObjs(objs);
      if (res.success) {
        console.log("删除对象操作成功:", res);
      } else {
        console.error("删除对象操作失败:", res);
      }
    }
  }
};