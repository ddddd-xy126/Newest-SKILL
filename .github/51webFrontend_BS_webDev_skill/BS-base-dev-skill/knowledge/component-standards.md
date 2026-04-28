# 组件封装规范

本文档定义面板组件的封装标准和代码规范。

## 目录

0. [🔗 下游对接铁律：数组项必埋 `key`](#-下游对接铁律数组项必埋-key)
1. [封装原则](#封装原则)
2. [目录结构](#目录结构)
3. [组件分类](#组件分类)
4. [代码规范](#代码规范)
5. [图表组件规范](#图表组件规范)
6. [表格组件规范](#表格组件规范)
7. [列表组件规范](#列表组件规范)
8. [复合组件规范](#复合组件规范)

---

## 🔗 下游对接铁律：数组项必埋 `key`

> **本节是 BS 厂（视觉骨架）与 data-bindingapi-skill（数据接入厂）之间的工业接口标准。**
> 凡是后续会被真实接口数据回填的组件，封装时**每个数组型 data 项都必须预留 `key` 字段**——data-binding 厂阶段二依赖这个 `key` 做字段映射，缺失会触发硬阻断、整条流水线停摆。

### 适用范围
所有 `component_type=list` 或 `component_type=normal` 的组件，**只要 props 或 data() 里有数组**（卡片组、状态组、网格组、步骤组、三维占比组……），数组中每一项都必须带 `key`。

### `key` 命名铁律
- **英文小驼峰**（camelCase），仅字母数字，**严禁中文/特殊符号**
- **同一数组内唯一**，语义化（如 `hotelRate`、`parkGreen`、`water`、`air`、`soil`）
- **与 UI 文案、数组顺序解耦**——UI 改文案、调顺序，`key` 不变
- **与后端字段不必同名**——映射关系由 data-binding 厂在外部映射文档里声明

### ❌ 错误示范（封装后会被下游打回返工）
```javascript
// 没 key，下游只能靠下标或中文 label 定位 → 硬阻断
data() {
  return {
    statusData: [
      { label: "水环境", statusText: "良好" },
      { label: "空气", statusText: "优" },
      { label: "土壤", statusText: "适宜" },
    ],
    gridData: [
      { icon: "leaf", label: "园区绿化", value: "--" },
      { icon: "drop", label: "用水量",   value: "--" },
    ],
  };
}
```

### ✅ 正确示范（封装时就埋好 key）
```javascript
data() {
  return {
    statusData: [
      { key: "water", label: "水环境", statusText: "良好" },
      { key: "air",   label: "空气",   statusText: "优" },
      { key: "soil",  label: "土壤",   statusText: "适宜" },
    ],
    gridData: [
      { key: "parkGreen", icon: "leaf", label: "园区绿化", value: "--" },
      { key: "water",     icon: "drop", label: "用水量",   value: "--" },
    ],
  };
}
```

### 子脑 B / C 必须执行
- **子脑 B（做组件）**：封装 `list/normal` 组件时，所有 data 数组项 **必须**带 `key`，并在组件文件顶部注释里列出 `key` 表（供后续映射文档引用）。
- **子脑 C（挂载）**：当挂载清单中 `data_source=api` 或 `mock` 时，主脑收尾自检**必须**扫描该组件 data 数组是否齐 key，缺失即报错回退。

### 兜底值规范（同样为下游服务）
所有可视化字段都要有兜底默认值，避免接口异常时 UI 空白：
- 字符串字段：`"--"`
- 数字字段：`0`
- 数组字段：`[]`

> 兜底值由 BS 厂在封装时就写好；data-binding 厂阶段二只负责"覆盖"，不负责补兜底。

---

## 封装原则

### 1. 单一职责

每个组件只负责一个功能，避免组件过于复杂。

### 2. 数据驱动

组件通过 props 接收数据，内部不直接请求接口。

### 3. 可配置性

通过 props 暴露必要的配置项，支持灵活定制。

### 4. 复用优先

优先复用已有组件，避免重复造轮子。

---

## 目录结构

### 私有化组件

仅当前页面使用的组件：

```
src/views/页面名/
├── index.vue
├── components/
│   ├── chartA.vue      # 图表组件
│   ├── tableB.vue      # 表格组件
│   └── listC.vue       # 列表组件
└── mixins/
    └── dataMixin.js    # 数据处理混入
```

### 公有化组件

多页面复用的组件：

```
src/components/
├── echarts/            # 图表基础组件
│   └── index.vue
├── table/              # 表格组件
│   └── scrollTable.vue
├── list/               # 列表组件
│   └── scrollList.vue
└── card/               # 卡片组件
    └── statCard.vue
```

---

## 组件分类

### 私有化 vs 公有化决策

| 场景 | 封装方式 | 位置 |
|------|----------|------|
| 仅当前页面使用 | 私有化 | `views/页面/components/` |
| 2个以上页面使用 | 公有化 | `src/components/` |
| 高度定制化 | 私有化 | `views/页面/components/` |
| 通用功能 | 公有化 | `src/components/` |

### 组件类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 图表组件 | 封装 ECharts 图表 | 柱状图、折线图、饼图 |
| 表格组件 | 数据表格展示 | 静态表格、滚动表格 |
| 列表组件 | 列表数据展示 | 简单列表、滚动列表 |
| 卡片组件 | 数字/状态卡片 | 统计卡片、状态卡片 |
| 复合组件 | 多组件组合 | 图表+列表组合 |

---

## 代码规范

### 尺寸与布局规范

#### 步骤1：计算项目rem基准

**查找配置：** `main.scss` 中 `html { font-size: Xvw; }`

**计算公式：**
```
1rem = Xvw × (屏幕宽度 ÷ 100)

示例：font-size: 0.36vw
3840px屏 → 1rem = 0.36 × 38.4 = 13.824px
1920px屏 → 1rem = 0.36 × 19.2 = 6.912px
```

**px转rem：** `目标rem = px值 ÷ 1rem的px值`

#### 步骤2：确定px值来源

**优先级：**

1. **用户提供设计稿** - 直接使用标注px值
2. **图片分析** - 估算元素占屏比例计算
3. **AI分析尺寸** - **必须明确目标屏幕尺寸**

**AI分析规则：**
- 先判断目标屏幕（1920px或3840px）
- 基于该屏幕给出px值
- **关键**：认为1920屏下16px → 若实际屏3840，应给32px

**常见尺寸参考：**

| 元素 | 1920屏 | 3840屏 | 计算rem（÷13.824） |
|------|--------|--------|-------------------|
| 大标题 | 20-28px | 40-56px | 2.89-4.05rem |
| 小标题 | 14-18px | 28-36px | 2.03-2.60rem |
| 正文 | 12-16px | 24-32px | 1.74-2.31rem |
| 大数值 | 24-30px | 48-60px | 3.47-4.34rem |

#### 步骤3：应用到代码

| 场景 | 用法 | 说明 |
|------|------|------|
| **CSS样式** | `font-size: (px ÷ 1rem的px)rem;` | 原生CSS用rem |
| **ECharts** | `fontSize: countFontsize(目标屏幕px)` | 传入目标屏的px |
| **容器** | `width: 100%; height: 30%;` | 百分比或rem |

**countFontsize工具原理：**
```javascript
// countFontsize.js
const uiWidth = 3840;  // 目标屏幕
const width = window.innerWidth;  // 实际屏幕
return fontSize * width / uiWidth;
// 传入40 → 1920屏显示20，3840屏显示40
```

**使用示例：**
```javascript
// 假设uiWidth=3840，AI判断某文字在3840屏下应是32px
textStyle: {
  fontSize: countFontsize(32)  // 在1920屏会自动显示16px
}
```

**❌ 禁止：**
- CSS中写死px值
- ECharts中使用rem
- 混淆目标屏幕尺寸

#### 步骤4：计算合理尺寸

**布局分配：**
- 容器约束：实际高度 = 容器高度 - padding - 边框
- 内容分配：标题30-35%，主内容60-65%，预留5-10%
- 间距控制：使用百分比或rem

**完整示例：**

```vue
<template>
  <div class="data-overview">
    <div class="data-title">{{ title }}</div>
    <div class="data-value">{{ value }}</div>
    <div class="data-update">更新：{{ updateTime }}</div>
  </div>
</template>

<style lang="scss" scoped>
/* 
  已知：1rem = 13.824px (3840屏)
  假设：AI分析这是3840屏，标题32px，数值60px，更新时间24px
*/
.data-overview {
  .data-title {
    font-size: 2.31rem;  /* 32 ÷ 13.824 */
  }
  .data-value {
    font-size: 4.34rem;  /* 60 ÷ 13.824 */
  }
  .data-update {
    font-size: 1.74rem;  /* 24 ÷ 13.824 */
  }
}
</style>
```

### 命名规范

**文件命名**：小驼峰，语义化
```
✅ stackBar.vue
✅ scrollTable.vue
✅ statCard.vue
❌ chart1.vue
❌ component.vue
```

**组件名**：大驼峰
```javascript
export default {
  name: "StackBar",  // ✅
  name: "stackBar",  // ❌
}
```

### Props 规范

```javascript
props: {
  // 必须指定类型
  data: {
    type: Object,
    required: true,
  },
  // 可选参数需要默认值
  ratio: {
    type: String,
    default: "16/9",  // ✅ 合理的宽高比
  },
  id: {
    type: String,
    default: "chart",
  },
}
```

### 模板规范

```vue
<template>
  <div class="container">
    <!-- 组件内容 -->
  </div>
</template>
```

- 根元素使用 `class="container"`
- 避免内联样式
- 使用语义化类名

### 样式规范

```scss
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  // 其他样式
}
</style>
```

- 必须使用 `scoped`
- 容器默认 100% 宽高
- 使用 SCSS 预处理器

---

## 图表组件规范

### 标准结构

```vue
<template>
  <div class="container">
    <BaseChart :option="chartOption" width="100%" :ratio="ratio" :id="id" />
  </div>
</template>

<script>
import { chartOptionFn } from "@/types/echarts/xxx.js";
import BaseChart from "@components/echarts/index.vue";

export default {
  name: "ChartName",
  components: { BaseChart },
  props: {
    data: {
      type: Object,
      required: true,
    },
    ratio: {
      type: String,
      default: "16/9",  // 重要：必须设置合理默认值
    },
    id: {
      type: String,
      default: "chartId",
    },
  },
  computed: {
    chartOption() {
      // 调用配置项函数生成 option
      return chartOptionFn(this.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
```

### 关键注意事项

1. **Echarts 组件必需参数**
   - 使用 `:option` 传递配置（不是 `:config`）
   - 必须传入 `width="100%"`
   - `ratio` 格式为 `"宽/高"` 字符串（如 `"16/9"`）
   - ID 通过方法生成，避免模板字符串
   - 确保每个图表 ID 唯一

2. **使用 computed 生成 option**
   - 响应式更新
   - 数据变化自动重绘

3. **调用 echarts-builder skill**
   - 图表创建使用 `echarts-builder` skill
   - 复用已有配置项函数

---

## 表格组件规范

### 静态表格

```vue
<template>
  <div class="container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    columns: {
      type: Array,
      required: true,
      // [{ key: 'name', title: '名称' }, ...]
    },
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>
```

### 滚动表格

```vue
<template>
  <div class="container" @mouseenter="pause" @mouseleave="resume">
    <div class="scroll-wrapper" :style="{ transform: `translateY(${offset}px)` }">
      <!-- 表格内容 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrollTable",
  props: {
    data: Array,
    speed: { type: Number, default: 50 },  // 滚动速度 ms
  },
  data() {
    return {
      offset: 0,
      timer: null,
    };
  },
  methods: {
    startScroll() { /* 滚动逻辑 */ },
    pause() { clearInterval(this.timer); },
    resume() { this.startScroll(); },
  },
};
</script>
```

---

## 列表组件规范

### 简单列表

```vue
<template>
  <div class="container">
    <ul class="list">
      <li v-for="(item, index) in data" :key="index" class="list-item">
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SimpleList",
  props: {
    data: {
      type: Array,
      required: true,
      // [{ label: '项目1', value: '100' }, ...]
    },
  },
};
</script>
```

### 滚动列表

与滚动表格类似，添加自动滚动逻辑。

---

## 复合组件规范

### 组合方式

```vue
<template>
  <div class="container">
    <div class="chart-area">
      <ChartComponent :data="chartData" />
    </div>
    <div class="list-area">
      <ListComponent :data="listData" />
    </div>
  </div>
</template>

<script>
import ChartComponent from "./chartComponent.vue";
import ListComponent from "./listComponent.vue";

export default {
  name: "CompositePanel",
  components: { ChartComponent, ListComponent },
  props: {
    data: {
      type: Object,
      required: true,
      // { chart: {...}, list: [...] }
    },
  },
  computed: {
    chartData() { return this.data.chart; },
    listData() { return this.data.list; },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-area {
  flex: 1;
}
.list-area {
  height: 40%;
}
</style>
```

### 布局建议

| 组合类型 | 布局方式 |
|----------|----------|
| 上下组合 | `flex-direction: column` |
| 左右组合 | `flex-direction: row` |
| 网格组合 | `display: grid` |

---

## 组件复用检查清单

创建新组件前，检查以下内容：

- [ ] 是否已有类似组件可复用？
- [ ] 是否可以通过配置现有组件实现？
- [ ] 组件是否需要公有化？
- [ ] Props 设计是否合理？
- [ ] 是否遵循命名规范？
- [ ] 是否添加了必要的默认值？
