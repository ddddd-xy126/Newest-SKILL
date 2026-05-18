<template>
  <div class="container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
              {{ col.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="col in columns" :key="col.key">
              <!-- 支持自定义渲染 -->
              <template v-if="col.render">
                <component :is="col.render" :row="row" :value="row[col.key]" />
              </template>
              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TablePanel", // TODO: 替换为实际组件名
  props: {
    columns: {
      type: Array,
      required: true,
      // 格式: [{ key: 'name', title: '名称', width: '100px' }, ...]
    },
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.table-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
  }

  th {
    background: rgba(255, 255, 255, 0.05);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.65);
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
