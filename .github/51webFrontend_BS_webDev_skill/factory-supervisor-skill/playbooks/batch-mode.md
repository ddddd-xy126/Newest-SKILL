# Playbook: batch-mode

> 批量模式：用户提供 Excel 清单，一次产出 N 个组件 + N 个面板挂载 + N 个接口接入。

## 适用场景
- 老板说"这周做完 20 个面板"
- 必须使用 Excel 清单驱动

## 涉及厂
- 🏗️ BS-base-dev-skill（批量步骤 2 + 步骤 3）
- 🔌 data-bindingapi-skill（批量阶段一 + 阶段二）
- 🌐 WDP（可选，仅含 3D 时）

## 标准任务图
```
[A] 🎩 物料校验: 4 份 Excel/.md 是否齐
        ① 组件封装清单.xlsx
        ② 面板挂载清单.xlsx
        ③ 接口文档.md
        ④ 页面-API 映射表.md
[B] 🏗️ BS step1: 骨架（如未完成，按 page_key 逐个走 4 轮）
[C] 🏗️ BS step2: 批量封装（消费组件清单）
[D] 🏗️ BS step3: 批量挂载（消费挂载清单）
[E] 🔌 数据厂阶段一: 批量封装 API（消费接口文档）  ← 与 [B][C] 并行
[F] 🎩 巡检: bs-to-data-key-check（全量扫描所有产出组件）
[G] 🔌 数据厂阶段二: 批量接入（消费映射表）        ← 依赖 D/E/F.passed
[H] 🎩 总监终检 + 交付报告
```

## 必填前置物料（批量场景必须 4 份齐全）
1. **组件封装清单 Excel**：标准表头见 [`BS-base-dev-skill/brains/sub-brain-b-component.md`](../../BS-base-dev-skill/brains/sub-brain-b-component.md) 「批量模板对齐规则」段（专用于批量模式 · 不要与标准模式 `sub-brain-b-panel.md` 混淆）
2. **面板挂载清单 Excel**：标准表头见 [`BS-base-dev-skill/brains/sub-brain-c-assemble.md`](../../BS-base-dev-skill/brains/sub-brain-c-assemble.md) 「批量需求输入规范」段
3. **接口文档 Markdown**：格式见 [`data-bindingapi-skill/references/api-example.md`](../../data-bindingapi-skill/references/api-example.md)
4. **页面-API 映射表 Markdown**：格式见 [`data-bindingapi-skill/references/page-api-mapping-example.md`](../../data-bindingapi-skill/references/page-api-mapping-example.md)

> 📋 **统一速查 / 示例行**：[`BS-base-dev-skill/templates/BATCH-MATERIALS.md`](../../BS-base-dev-skill/templates/BATCH-MATERIALS.md) 集中给出 4 份物料的完整列定义、示例行与跨清单一致性铁律，作为唯一权威源；本 playbook 与各子脑文件中的描述若出现冲突，**以 BATCH-MATERIALS.md 为准**。

> ℹ️ **为什么批量模式不调用 `sub-brain-b-panel.md`？**
> 标准模式的 `b-panel` 是「封装+挂载合并执行」的一体化流程，适合单页/小批量、强交互的设计图驱动场景；批量模式必须把封装和挂载拆开，才能精准消费两份独立 Excel、严格控制 token 和断点续传节奏，因此固定走 `b-component` → `c-assemble` 两阶段。

## 物料校验铁律
- 组件清单的 `component_key` 必须能在挂载清单中找到对应行
- 挂载清单中 `data_source=api` 的行，必须能在映射表中找到对应 binding
- 任意一份缺失或不一致 → 阻断 [A]，要求用户补齐

## 巡检触发点
- 每跑完 BS step2 一行 → 局部 key 巡检（早发现早返工）
- 节点 [F] → 全量 key 巡检
- 节点 [G] 启动前 → 复读 [F] 结果

## 状态机记账（批量特化）
- `task.playbook = "batch-mode"`
- `pages[]` 中每个页面的 `factories.bs.step2_components.totalCount` / `completedCount` 严格更新
- 每完成一个组件 → 写一条 `history.event = "bs-component-built"`，便于断点续传

## 交付标准
- [ ] 所有 Excel 行 100% 处理完毕（成功 + 失败行明细）
- [ ] 失败行有清晰错误码（B001~B008）+ 修复建议
- [ ] 数据厂阶段二的所有 binding 已落地
- [ ] 总监输出"批量交付报告"（含改动文件清单）
