# ECharts 图表与尺寸换算规范 (ECharts & Panel Rules)

## 1. 尺寸计算速查 (REM & CountFontsize)

**第一步：计算项目rem基准**
查找 `main.scss` 中的 `html { font-size: Xvw; }`
例如：`font-size: 0.36vw`，屏幕 3840px -> 1rem = 13.824px

**第二步：应用到代码**
- **CSS 样式**：使用 `font-size: (px ÷ 1rem的px)rem;`
- **ECharts 配置**：必须使用 `fontSize: countFontsize(目标屏幕的px值)`，绝对禁止在 ECharts 中使用 rem。

## 2. ECharts 组件强制封装规范

所有的 ECharts 配置禁止在页面级直接调用，必须封装为独立的 Vue 组件，并使用 `echarts-base` 模板包裹。

```vue
<template>
  <div class="chart-container">
    <echarts-base :option="chartOption" width="100%" :ratio="ratio" :id="id" />
  </div>
</template>
```

**⚠️ 关键参数要求：**
- `width="100%"` 必需
- `ratio` 必须设置合理宽高比（如 `"16/9"`），**绝对禁止使用 `"100%"` 作为 ratio**。
- `:option` 传配置（而不是 `:config`）。

## 3. 面板高度分配原则
左右两侧面板高度总和建议为 87%（预留间距）。
示例：
```scss
.left-1 { height: 25%; }
.left-2 { height: 20%; }
.left-3 { height: 42%; } // 总计 87%
```

## 4. 新项目适配清单
1. 安装依赖：`npm install echarts`
2. 复制基础渲染组件：`templates/components/echarts-base.vue` -> `src/components/echarts/index.vue`
3. 复制工具函数：`templates/utils/countFontsize.js` -> `src/utils/`
4. 复制配置项：`templates/options/*.js` -> `src/types/echarts/`

## 5. 交付前尺寸检查清单
- [ ] 已确认目标屏幕尺寸（1920 或 3840）
- [ ] 已从 `main.scss` 计算 1rem 对应 px
- [ ] CSS 样式使用 rem，ECharts 使用 `countFontsize`
- [ ] 图表组件使用 `:option`，不是 `:config`
- [ ] `ratio` 合理且非 `"100%"`
