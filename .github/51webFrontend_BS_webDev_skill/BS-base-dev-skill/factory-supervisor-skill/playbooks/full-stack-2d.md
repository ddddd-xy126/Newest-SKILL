# Playbook: full-stack-2d

> 纯 2D 大屏从 0 到上线的完整剧本。

## 适用场景
- 用户需求**不涉及 3D 场景**
- 包含视觉 + 接口数据接入

## 涉及厂
- 🏗️ BS-base-dev-skill（视觉骨架）
- 🔌 data-bindingapi-skill（数据接入）

## 标准任务图
```
[A] 🏗️ BS step1 布局 4 轮（R1→R2→R3→R4）       ← 必须先行
[B] 🏗️ BS step2 组件封装（数组项必埋 key）     ← 依赖 A
[C] 🏗️ BS step3 面板挂载                        ← 依赖 B
[D] 🔌 数据厂阶段一: API 封装                   ← 可与 A/B 并行
[E] 🎩 总监巡检: bs-to-data-key-check          ← 依赖 B
[F] 🔌 数据厂阶段二: 接入页面                   ← 依赖 C/D/E.passed
[G] 🎩 总监终检                                  ← 依赖 C/F
```

## 必填前置物料
- ✅ UI 设计稿
- ✅ 切图（按命名表放入 `src/assets/images/layout/`）
- ✅ 后端接口文档（Markdown，至少含 1 份响应 JSON 示例）
- ⬜（批量场景）组件封装 Excel + 面板挂载 Excel
- ⬜（批量场景）页面-API 映射表 .md

## 巡检触发点
- 节点 [B] 完成 → 必跑 [bs-to-data-key-check](../checks/bs-to-data-key-check.md)
- 节点 [F] 启动前 → 复读最近一次 key 巡检结果，passed=false 即阻断

## 状态机记账
- `task.playbook = "full-stack-2d"`
- 每个 page 在 `pages[]` 单独追踪
- `factories.wdp.status = "not-applicable"`

## 交付标准
- [ ] BS 防腐自检通过（无重复 import、无未装库）
- [ ] 所有 `list/normal` 组件数组项齐 key
- [ ] 所有展示字段已用真接口或保留兜底值
- [ ] 数据厂阶段二 catch 静默 + console.error
