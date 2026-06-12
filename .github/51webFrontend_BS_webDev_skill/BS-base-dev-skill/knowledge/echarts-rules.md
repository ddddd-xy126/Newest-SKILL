# ECharts 图表规范

本文档定义 ECharts 图表组件的封装和尺寸规范。执行面板还原时，本文件由 `sub-brain-b-panel.md` Phase 3 强制读取。

---

## 1. 强制封装规范

所有 ECharts 配置**禁止在页面级文件中直接暴露**，必须封装为独立的 `.vue` 组件。

**标准模板**：
```vue
<template>
  <div class="chart-container">
    <echarts-base :option="chartOption" width="100%" :ratio="ratio" :id="id" />
  </div>
</template>

<script>
import { xxxOption } from "@/types/echarts/xxx.js";
import countFontsize from "@/utils/countFontsize";

export default {
  name: "XxxChart",
  props: {
    data: { type: Object, required: true },
    ratio: { type: String, default: "16/9" },
    id: { type: String, default: "xxxChart" },
  },
  computed: {
    chartOption() {
      return xxxOption(this.data, countFontsize);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
```

## 2. 必传参数（缺一不可）

```html
<echarts-base :option="chartOption" width="100%" :ratio="ratio" :id="id" />
```

| 参数 | 要求 |
|------|------|
| `:option` | 传配置对象（不是 `:config`） |
| `width` | 必须为 `"100%"` |
| `:ratio` | 合理宽高比（如 `"16/9"`、`"2/1"`、`"630/309"`） |
| `:id` | 唯一标识 |

**⛔ 绝对禁止 `ratio="100%"`**

## 3. 尺寸响应式规范

图表内所有尺寸必须使用 `countFontsize(设计稿px值)`：

```javascript
// ✅ 正确：传入设计图上量的 px 值
fontSize: countFontsize(14)
barWidth: countFontsize(20)
padding: [countFontsize(10), countFontsize(15)]

// ❌ 禁止：写死 px 或使用 rem
fontSize: 14
fontSize: "0.875rem"
```

适用范围：`fontSize`、`barWidth`、`itemWidth`、`itemHeight`、`padding`、`margin`、`symbolSize`、`radius` 等所有数值型尺寸属性。


## 4. 图表配置函数（Option）规范

Option 函数统一放置于 `src/types/echarts/` 目录下：

```javascript
// src/types/echarts/bar.js
import countFontsize from "@/utils/countFontsize";

export function barOption(data, countFontsize) {
  return {
    // ECharts option 配置
  };
}
```

- 函数接收 `data` 和 `countFontsize` 参数
- 所有数值型尺寸通过 `countFontsize()` 包裹
- 导出为命名导出（named export）
