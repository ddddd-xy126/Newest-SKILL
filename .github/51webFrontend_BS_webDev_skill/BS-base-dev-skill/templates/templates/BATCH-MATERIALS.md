# 批量模式 · 物料模板（Templates）

> 当 supervisor 路由到 `playbook = batch-mode` 时，用户必须提供 4 份物料。本目录给出**唯一权威**的表头与示例行；所有 .xlsx / .md 都应以此为蓝本生成或导入。
>
> 修改本表头会影响 `sub-brain-b-component.md` / `sub-brain-c-assemble.md` / `playbooks/batch-mode.md`，必须同步更新三处。

---

## ① 组件封装清单（`组件封装清单.xlsx`）

**消费方**：[`brains/sub-brain-b-component.md`](../brains/sub-brain-b-component.md)

**标准表头（顺序固定，列名必须英文小写下划线）**：

```
component_key | component_name | component_type | ui_design_image | component_image | chart_family | ratio | scope | remark
```

| 列 | 类型 | 必填 | 取值 / 含义 |
|---|---|:--:|---|
| `component_key` | string | ✅ | 全局唯一英文小驼峰；下游硬接口 |
| `component_name` | string | ✅ | Vue 组件名（PascalCase） |
| `component_type` | enum | ✅ | `chart` / `list` / `normal` |
| `ui_design_image` | path | ✅ | 设计图路径或 URL（必填） |
| `component_image` | path | ⛳ | 切图原料路径，仅 `chart` 类型常用 |
| `chart_family` | string | ⛳ | 仅 `chart`：bar/line/pie/gauge/radar/... |
| `ratio` | string | ⛳ | 默认尺寸基准；**禁止 `100%`** |
| `scope` | enum | ✅ | `private` / `public` |
| `remark` | string | ⬜ | 自由备注 |

**示例行**：
```
cmp_env_status     | EnvStatusGroup     | list   | docs/ui/page_1_1/env.png    |                    |       | 320x180 | private | 水/气/土三联状态
cmp_passenger_trend| PassengerTrendChart| chart  | docs/ui/page_1_1/passenger.png| docs/cut/passenger.svg | line | 480x260 | private | 折线趋势
cmp_progress_list  | ProgressList       | normal | docs/ui/page_1_1/progress.png|                  |       | 320x420 | private | 任务进度
```

---

## ② 面板挂载清单（`面板挂载清单.xlsx`）

**消费方**：[`brains/sub-brain-c-assemble.md`](../brains/sub-brain-c-assemble.md)

**标准表头**：

```
panel_key | panel_title | page_key | side | order | height_percent | slot_name | position | component_key | component_name | component_type | component_scope | data_source | ratio | delay_time | remark
```

| 列 | 类型 | 必填 | 取值 / 含义 |
|---|---|:--:|---|
| `panel_key` | string | ✅ | 唯一键，形如 `left-1` |
| `panel_title` | string | ✅ | 面板标题（中文允许） |
| `page_key` | string | ✅ | 形如 `page_1_1` |
| `side` | enum | ✅ | `left` / `right` |
| `order` | int | ✅ | 同侧自上而下 1, 2, 3, ... |
| `height_percent` | int | ✅ | 0-95；同侧总和 ≤ 95 |
| `slot_name` | enum | ✅ | `aside-left` / `aside-right`，必须与 `side` 一致 |
| `position` | enum | ✅ | `left` / `right`，必须与 `side` 一致 |
| `component_key` | string | ✅ | 必须能在 ① 中找到对应行 |
| `component_name` | string | ✅ | 与 ① 一致 |
| `component_type` | enum | ✅ | 与 ① 一致 |
| `component_scope` | enum | ✅ | 与 ① 一致 |
| `data_source` | enum | ✅ | `static` / `api` / `mock` |
| `ratio` | string | ⛳ | 可覆盖 ① 默认 |
| `delay_time` | int | ✅ | 同侧自上而下递增 100；首条 100 |
| `remark` | string | ⬜ |  |

**示例行**：
```
left-1 | 环境状态  | page_1_1 | left | 1 | 30 | aside-left | left | cmp_env_status      | EnvStatusGroup     | list   | private | api    | 320x180 | 100 |
left-2 | 客流趋势  | page_1_1 | left | 2 | 35 | aside-left | left | cmp_passenger_trend | PassengerTrendChart| chart  | private | api    | 480x260 | 200 |
right-1| 任务进度  | page_1_1 | right| 1 | 30 | aside-right| right| cmp_progress_list   | ProgressList       | normal | private | api    | 320x420 | 100 |
```

**校验规则**（supervisor 物料校验阶段执行）：
- `side==slot_name 后缀==position` 三者一致
- 同 `page_key + side` 下，`order` 严格递增、`delay_time` 严格 +100
- 同 `page_key + side` 下，`height_percent` 总和 ≤ 95
- `component_key` 在 ① 中必须存在

---

## ③ 接口文档（`接口文档.md`）

**消费方**：[`data-bindingapi-skill`](../../data-bindingapi-skill/SKILL.md) 阶段一

**格式权威源**：[`data-bindingapi-skill/references/api-example.md`](../../data-bindingapi-skill/references/api-example.md)

---

## ④ 页面-API 映射表（`页面-API映射表.md`）

**消费方**：[`data-bindingapi-skill`](../../data-bindingapi-skill/SKILL.md) 阶段二

**格式权威源**：[`data-bindingapi-skill/references/page-api-mapping-example.md`](../../data-bindingapi-skill/references/page-api-mapping-example.md)

---

## 跨清单一致性铁律

1. ① 中的 `component_key` 必须在 ② 中至少出现一行（孤儿组件 → 物料校验失败）。
2. ② 中 `data_source=api` 的行，必须在 ④ 中找到对应 `binding`（绑定缺失 → 物料校验失败）。
3. 三类 enum（`component_type`/`scope`/`side`）必须严格匹配本表，不接受同义词。

> 物料校验在 `playbooks/batch-mode.md` 节点 [A] 由总监统一执行；任一不一致即阻断流水线。
