# 三厂工业链术语表（Glossary）

> 各厂、各文档使用术语经常出现"同义异名"导致 supervisor 解析与协作错位。本表为**唯一权威术语对照表**，所有 SKILL.md / brains / prompts / playbooks / checks / state 文件遇到歧义时，**以本表为准**。
>
> 修改本表前，必须同步更新 [`contracts/delivery-schema.md`](./contracts/delivery-schema.md) 与 [`state/STATE-SPEC.md`](./state/STATE-SPEC.md)。

---

## 1 · 阶段 / 步骤 / 轮次（cross-factory）

| 概念 | supervisor 标准称呼 | BS 厂内部称呼 | WDP 厂内部称呼 | 数据厂内部称呼 |
|---|---|---|---|---|
| 厂内最小执行单元 | **`phase`** | step1/step2/step2-patch/step3 | phase-1/phaseA/phaseB | phaseOne/phaseTwo |
| 步骤内子节奏 | **`subPhase`** | R1/R2/R3/R4（仅 step1） | mandatoryCheckpoints[] | （无） |
| 跨厂调度大节奏 | **`playbook`** | （不感知） | （不感知） | （不感知） |

> 在 [`contracts/delivery-schema.md`](./contracts/delivery-schema.md) 的厂报告中，**统一**使用 `phase` 作为厂内阶段标识；BS step1 的轮次另存为 `currentRound`。

---

## 2 · 状态字段

| 概念 | 标准枚举 | 说明 |
|---|---|---|
| 任务级状态 | `not-started` / `planning` / `in-progress` / `blocked` / `completed` / `aborted` | 写在 `task.status` |
| 厂级状态 | `not-started` / `in-progress` / `blocked` / `completed` / `needs-rework` / `not-applicable` | 写在 `factories.<x>.status` |
| 子阶段状态 | `not-started` / `in-progress` / `completed` | 写在各 `*.status` |
| 单次交付报告状态 | `completed` / `blocked` / `partial` | 写在 schema 顶层 `status` |
| 巡检结果 | `passed=true` / `passed=false` / `passed=null`（未跑） | 写在 `checkpoints[].passed` |
| Blocker 状态 | `open` / `resolved` / `wont-fix` | 写在 `blockers[].status` |
| Blocker 严重度 | `blocking` / `warning` | `severity` |

> ⚠️ **绝对不要**使用 `success` / `done` / `pending` / `failed` 等同义词。

---

## 3 · 阻断与拦截

| 现象 | 标准称呼 | 出处 |
|---|---|---|
| 用户没传设计图就要求开发 | **"无图拦截"**（NoFigure Block） | BS SKILL.md 强拦截协议 1 |
| 用户要求一次性完成所有 step | **"大包大揽拦截"**（Bigbang Block） | BS SKILL.md 强拦截协议 2 |
| MCP 服务未启动 | **"MCP 未就绪"**（MCP-NotReady Block） | WDP 阶段 -1 |
| BS 组件数组缺 key 字段 | **"key 缺失阻断"**（KeyMissing Block） | bs-to-data-key-check |
| WDP Mixin 修改了 BS 组件 props | **"Mixin 污染"**（Mixin-Pollution Block） | wdp-to-bs-mixin-check |

错误码命名空间：
- `B-xxx`：BS 厂自身错误
- `W-xxx`：WDP 厂自身错误
- `D-xxx`：数据厂自身错误
- `S-xxx`：supervisor 巡检发现的跨厂错误

---

## 4 · 资产 / 产物

| 标准称呼 | 同义/曾用 | 说明 |
|---|---|---|
| `artifacts` | "产物清单" / "改动文件" | 各厂报告中文件路径数组（POSIX，工程根相对） |
| `componentKey` | "组件 key" / "cmp_key" | 英文小驼峰；全局唯一；下游硬接口 |
| `panelKey` | "面板 key" | 形如 `left-1`；批量挂载清单主键 |
| `pageKey` | "页面 key" / "page id" | 形如 `page_1_1` |
| `dataArrays` | "data 数组" / "数据源数组" | 组件 `data()` 中将被 API 绑定的数组 |
| `mixinFile` | "Mixin 文件" / "3D 行为文件" | WDP 阶段 B 落地的 Vue mixin 路径 |
| `apiFunction` | "接口函数" / "封装函数" | 数据厂阶段一产出的 axios 函数名 |
| `mandatoryCheckpoints` | "强制检查点" | WDP MCP 返回的不可跳过的校验集合 |

---

## 5 · 模式

| 标准称呼 | 触发条件 | 文档入口 |
|---|---|---|
| **标准模式 (standard)** | 单页/小批量、强交互的设计图驱动 | BS [`sub-brain-b-panel.md`](../BS-base-dev-skill/brains/sub-brain-b-panel.md) |
| **批量模式 (batch)** | 用户提供完整 4 份 Excel/MD 物料 | playbook [`batch-mode.md`](./playbooks/batch-mode.md) + BS [`sub-brain-b-component.md`](../BS-base-dev-skill/brains/sub-brain-b-component.md) + [`sub-brain-c-assemble.md`](../BS-base-dev-skill/brains/sub-brain-c-assemble.md) |
| **修补模式 (patch)** | 跨厂巡检失败回滚到 BS 仅修复（不改业务） | BS step2-patch（见 invoke-bs.md） |

> ⚠️ 三种模式**不可混用**。一次任务进入某模式后必须走完。

---

## 6 · 角色

| 角色名 | 责任 | 文档主体 |
|---|---|---|
| **总监 / supervisor** | 调度、状态机、巡检；不写业务代码 | [`SKILL.md`](./SKILL.md) |
| **BS 主脑 / Master-Brain** | BS 厂入口；路由到子脑；防腐自检 | [`BS-base-dev-skill/SKILL.md`](../BS-base-dev-skill/SKILL.md) |
| **子脑 A**（layout） | 布局骨架（4 轮渐进） | sub-brain-a-layout.md |
| **子脑 B（panel · 标准）** | 面板封装+组装一体化 | sub-brain-b-panel.md |
| **子脑 B（component · 批量）** | 仅消费组件清单做批量封装 | sub-brain-b-component.md |
| **子脑 C（assemble · 批量）** | 仅消费挂载清单做批量挂载 | sub-brain-c-assemble.md |
| **WDP 调度器** | MCP 自检 + 阶段 A/B + Mixin 落地 | wdp-secondary-dev-skill |
| **数据厂** | API 封装 + 数据接入 | data-bindingapi-skill |
