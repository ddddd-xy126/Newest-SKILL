# 组件封装规范

本文档定义面板组件的封装标准和代码规范。执行面板还原时，本文件由 `sub-brain-b-panel.md` Phase 3 强制读取。

## 目录

0. [🔗 下游对接铁律：数组项必埋 `key`](#-下游对接铁律数组项必埋-key)
1. [封装与目录规范](#封装与目录规范)
2. [代码规范](#代码规范)

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

## 封装与目录规范

- **单一职责**：每个组件只负责一个功能
- **数据驱动**：组件通过 `props` 接收数据，**严禁在组件内部写死业务数据或直接请求接口**

**存放位置**：
- 私有组件（仅当前页面）→ `src/views/页面名/components/`
- 公有组件（跨页面复用）→ `src/components/{类型目录}/`

---

## 代码规范

### 尺寸规范

项目通过 `html { font-size: Xvw }` 实现等比缩放，1rem 恒等于设计稿上 16px 的视觉尺寸。

- **CSS 尺寸**（字号、间距、宽高）：使用 `pxToRem(设计稿px值)`，直接传入设计图上量的数值
- **ECharts 尺寸**（fontSize、padding 等）：使用 `countFontsize(设计稿px值)`
- **wdp弹窗 尺寸**：如果封装的是 wdp 弹窗面板，尺寸使用 `wPx` 函数（而非 `pxToRem`），普通组件使用css函数，图表组件使用js工具。
- **禁止**直接写 `px`（`border`、`box-shadow` 等装饰性属性除外）

### 命名规范

- **文件命名**：PascalCase（如 `StackBar.vue`、`ScrollTable.vue`）
- **组件 name**：PascalCase，与文件名一致
- **import 路径必须与文件名大小写完全一致**，否则 Linux 环境编译失败

### Props 与样式

- Props 必须指定类型，可选参数需默认值
- 必须使用 `<style lang="scss" scoped>`
- 容器默认 `width: 100%; height: 100%;`

### 补充约定


- 使用项目实际的路径别名引用资源（如 `@`）