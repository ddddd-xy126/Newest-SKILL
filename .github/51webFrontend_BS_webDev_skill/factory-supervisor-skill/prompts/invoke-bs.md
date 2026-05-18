# Prompt: 调用 BS 厂的标准措辞

> 总监调用 BS-base-dev-skill 时使用的标准注入提示。
>
> 📜 **交付报告格式唯一权威源**：[`../contracts/delivery-schema.md`](../contracts/delivery-schema.md) §1 BS 厂报告。下文处示例仅供快查，字段以 schema 为准。

---

## 通用前缀（所有 BS 调用都加）

```
你正在被【工业链总监】调度。
任务上下文（来自 .skill-state.json）：
- taskId: <T-xxx>
- playbook: <full-stack-2d / batch-mode / ...>
- 目标 page: <page_1_1>
- 已完成的步骤: <step1.completed | step2.in-progress (5/8) | ...>
- 工程根: <projectPath>

请严格遵守 BS-base-dev-skill/SKILL.md 的所有协议（无图拦截、防超载、4 轮渐进、防腐自检）。
完成后必须返回结构化交付报告：
{
  "step": "step2",
  "status": "completed",
  "artifacts": ["path1.vue", "path2.vue"],
  "rounds": null,
  "selfCheckPassed": true,
  "components": [
    { "componentKey": "...", "filePath": "...", "dataArrays": [{ "name": "...", "keyPresent": true, "keys": [...] }] }
  ]
}
```

---

## 各步骤专用注入

### 调用 BS step1（布局）
```
<通用前缀>

请执行 step1: 布局搭建。
- 当前轮次: R1（首次）/ <用户指定 Rx>
- UI 设计稿: <用户已提供>
- 工具栏勾选: <左 / 右 / 顶 / 底>
- 一/二级路由: <从面板回答带入>
- 切图清单: 已扫描 <projectPath>/src/assets/images/layout/，包含: [top.png, box-bg.png, ...]
```

### 调用 BS step2（面板还原）
```
<通用前缀>

请执行 step2: 面板还原（组件封装 + 组装挂载）。
- UI 设计图: <已提供 / 路径>
- 目标页面: <page_1_1>
- 前置产物: step1 布局骨架已完成

🔴 强制约束（来自总监）：
1. 凡 list/normal 组件，data() 中所有数组项必须埋 key 字段。
2. ECharts 组件必须私有化封装，ratio 不得为 "100%"，字号用 countFontsize()。
3. Box 必须传 position，同侧 delayTime 递增 100ms，高度总和 ≤95%。
完成后总监将立即跑 bs-to-data-key-check 巡检。
```

### 调用 BS step2 修补模式（仅补 key，触发自跨厂巡检失败）
```
<通用前缀>

请执行 step2 修补模式：仅补齐数组项 key 字段，不修改 props / UI / 逻辑。

需修补的组件清单：
1. <componentKey> @ <filePath>
   - 数组: <arrayName>
   - 缺失项数: 3
   - 用户已确认 key 命名: ["water", "air", "soil"]
2. ...

完成后回包：
{ "step": "step2-patch", "status": "completed", "patchedComponents": [...] }
```
