<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .tag {
    display: flex;
    justify-content: center;
    align-items: center;
    // margin: 0 auto;
    // width: 70%;
    aspect-ratio: 216/80;
    background-image: url(~@images/table/table_base_tag.png);
    background-repeat: no-repeat;
    background-position: center center; // 两张图都居中
    // background-size: 99.01% 75.68%, 87.13% 97.3%; // 根据实际调整
    background-size: 80% 80%; // 根据实际调整

    .font-color-gradient-blue {
      font-size: var(--font-size-24);
      font-family: var(--font-family-primary-Medium);
    }

    .tag-text {
      background: var(--gradient-text);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
    }
  }

  .stat {
    color: #86e0ed;
    font-size: var(--font-size-32);
    font-family: var(--font-family-primary-Medium);
  }

  .err {
    color: #ff5c57;
  }

  .track {
    display: block;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-size: var(--font-size-28);
    font-family: var(--font-family-primary-Regular);
    background-image: url(~@images/zcgl/gj_Bg.png);
    background-size: 100% 100%;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .track:hover {
    background-image: url(~@images/zcgl/gj_activeBg.png);
  }

  .acTrack {
    background-image: url(~@images/zcgl/gj_activeBg.png);
    opacity: 0.9;
  }

  .track.disabled {
    opacity: 0.5;
    cursor: not-allowed; //显示禁用光标
    filter: grayscale(50%); //元素转换为灰度图像
    pointer-events: none; //阻止鼠标交互
  }

  // 新增：文字省略号样式
  .text-ellipsis {
    font-size: var(--font-size-28);
    font-family: var(--font-family-primary-Regular);
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 自定义表格样式
// 去除表格顶部的分割线

:deep(.el-table) {
  height: 100%;
}

:deep(.el-table__body-wrapper) {
  max-height: 100% !important;
  overflow-y: scroll !important;
  overflow-x: hidden !important;
}

:deep(.el-table::before) {
  display: none;
}

// 设置表格头部区域背景
:deep(.el-table__header-wrapper) {
  position: relative;
  background-color: transparent;
  border-bottom: 1px solid rgba(33, 149, 224, 0.8);
  background-color: rgba(33, 149, 224, 0.2);
  overflow: visible;
}

// 左侧竖线
:deep(.el-table__header-wrapper)::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2.5px; // 溢出一半
  width: 1px;
  height: 5px;
  background: #c0dce7;
  z-index: 2;
}

// 右侧竖线
:deep(.el-table__header-wrapper)::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -2.5px; // 溢出一半
  width: 1px;
  height: 5px;
  background: #c0dce7;
  z-index: 2;
}

:deep(.el-table__body tr) {
  // background-color: rgba(170, 165, 165, 0.2) !important;
  // transition: background-color 0.2s;
  cursor: default;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf, .el-table th.el-table__cell) {
  cursor: default;
}

// 设置每一行的背景色为半透明黑色，并添加行底色
:deep(.el-table__row) {
  background-color: rgba(255, 255, 255, 0.03) !important;
  // height: 1rem !important; // 设置行高为60px
}

// 设置表格body为分离模式，并添加行间距
:deep(.el-table__body) {
  border-collapse: separate;
  border-spacing: 0 var(--font-size-16);
  padding-bottom: 13%;
}
</style>

<template>
  <div class="container">
    <el-table :data="displayTableData" style="width: 100%" :header-cell-style="{
      'text-align': 'center',
      color: 'var(--color-secondary)',
      'font-size': 'var(--font-size-28)',
    }" :cell-style="{
        'text-align': 'center',
        'background-color': 'transparent',
        'font-size': 'var(--font-size-32)',
      }">
      <el-table-column v-for="(item, key) in tableHeaders" :key="key" :prop="key" :label="item[key]"
        :width="item.width">
        <template slot-scope="scope">
          <span v-if="key === 'status'" class="tag">
            <span class="font-color-gradient-blue">{{
              formatStatus(scope.row[key])
            }}</span>
          </span>
          <span v-else-if="key === 'operate'">
            <span :class="[
              scope.row[key] ? 'track acTrack' : 'track',
              { disabled: scope.$index !== 0 },
            ]" @click="
                scope.$index === 0
                  ? handleTrackClick(scope.$index, scope.row)
                  : null
                ">轨迹</span>
          </span>
          <span v-else-if="key === 'stat'">
            <span :class="scope.row[key] === 0 ? 'stat' : 'stat err'">{{
              formatStat(scope.row[key])
            }}</span>
          </span>
          <span v-else class="text-ellipsis">{{ scope.row[key] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tableMixin } from "@mixin/tableMixin";
import { deleteTypes } from "@utilsWdpApi/delete";
import { customStatus } from "@utilsWdpApi/custom";
import { addPOI } from "@utilsWdpApi/entity";

export default {
  name: "UserTable",
  mixins: [tableMixin],
  props: {
    tableHeaders: {
      type: Object,
      default: () => { },
    },
    tableData: {
      type: Array,
      // 表格数据（根据tableHeaders）
      default: () => [],
    },
    poiArray: {
      type: Array,
      // 资产盘点数组
      default: () => [],
    },
  },
  data() {
    return {
      maxHeight: "26.9%",
      localTableData: [], // 本地数据副本
    };
  },
  computed: {
    // 使用本地数据副本作为表格数据源
    displayTableData() {
      return this.localTableData;
    },
  },
  watch: {
    // 监听props变化，同步到本地数据
    tableData: {
      handler(newVal) {
        this.localTableData = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    // setTimeout(() => {
    //   console.log(this.displayTableData, "1--------1", this.tableHeaders);
    // }, 1000);
  },
  methods: {
    // 处理轨迹点击事件
    async handleTrackClick(index, row) {
      const isSelected = !row.operate;
      if (isSelected) {
        // 第一次点击：显示轨迹
        await deleteTypes(["Poi"]);
        await addPOI([[113.71302516510399, 34.77231422379289, 19.107943379714744], [113.71268061364853, 34.772682031155014, 22.462484010742227]], '资产', 20, '资产', null, {
          markerNormalUrl: 'assets_path_normal.png',
          markerActivateUrl: 'assets_path_normal.png'
        }, 'ground');
        await customStatus("ZCGL_ZCPD", true);
        this.$set(this.localTableData[index], "operate", true);
      } else {
        // 第二次点击：隐藏轨迹
        await customStatus("ZCGL_ZCPD", false);
        this.$set(this.localTableData[index], "operate", false);
      }
    },
  },
};
</script>
