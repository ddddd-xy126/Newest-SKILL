# Cross-Check: bs-to-data-key-check

> BS 厂 → 数据接入厂的工业接口巡检。**唯一的硬接口标准**：数组项必埋 `key`。

---

## 触发时机

| 触发节点 | 巡检范围 |
|---|---|
| BS step2（面板还原）单个组件完成 | 仅检查该组件 |
| BS step2（面板还原）全部完成 | 当前 page 的所有组件 |
| 数据厂阶段二启动前 | 当前 page 的所有 `dataSource=api/mock` 组件 |

---

## 检查规则

### Rule 1：扫描组件 data() 中的所有数组
- 解析 `pages[].components[].dataArrays[]`
- 仅对 `applicable=true` 的数组进一步检查（即将被 API 绑定的）

### Rule 2：每个数组项必须有 `key` 字段
- 命名：英文小驼峰（camelCase），仅字母数字
- 同数组内唯一
- 与 UI 文案 / 数组顺序解耦

### Rule 3：禁用的反模式
- ❌ 数组项以 `label`（中文）作为唯一标识
- ❌ 后续映射代码用 `arr[0]` / `arr[1]` 下标定位
- ❌ key 为中文、为空字符串、含特殊符号

---

## 失败时输出格式

```
🔴 跨厂巡检失败：bs-to-data-key-check
─────────────────────────────────────
任务: T-20260427-001
页面: page_1_1
缺 key 的数组（3 个）:

1. 组件: cmp_env_status (EnvStatusGroup.vue)
   数组: statusData
   缺失项数: 3
   建议命名: ["water", "air", "soil"]
   语义来源: data() 中的 label 字段（水环境 / 空气 / 土壤）

2. 组件: cmp_three_dim (ThreeDimChart.vue)
   数组: threeDimensionalData
   缺失项数: 3
   建议命名: ["life", "prod", "eco"]
   语义来源: 设计稿/已有 label

3. 组件: cmp_progress (ProgressList.vue)
   数组: progressData
   缺失项数: 5
   建议命名: ["task1", "task2", "task3", "task4", "task5"]
   语义来源: 暂无清晰语义，需用户提供

建议处理方式（3 选 1）:
[A] 自己回 BS 厂修补（推荐）
    → 总监会调用 BS step2 子脑 B，仅补 key 字段，不动业务结构
[B] 全部采纳建议命名（适用于语义清晰的项）
[C] 自定义命名（自由输入）

阻断点：状态机已生成 blocker B-xxx，数据厂阶段二禁止启动。
```

---

## 后置动作（无论 passed/failed）

1. 写入 `state.tasks[].checkpoints[]`：
   ```jsonc
   {
     "name": "bs-to-data-key-check",
     "trigger": "bs.step2.completed | dataBinding.phaseTwo.starting",
     "passed": false,
     "ranAt": "...",
     "summary": "3 个组件缺 key",
     "details": { /* 上述清单的结构化版本 */ },
     "linkedBlockerId": "B-xxx"
   }
   ```
2. 同步更新 `pages[].components[].dataArrays[].keyPresent`
3. 追加 `history` 事件：
   - passed → `event: "checkpoint-passed"`
   - failed → `event: "checkpoint-failed"` + `event: "blocker-raised"`

---

## 失败 → 修复闭环

```
[巡检失败] → [新建 blocker B-xxx] → [向用户提供 3 选 1]
  ↓
用户选 A → 总监调用 BS step2，注入 prompt：
  "仅补 key 字段，不动 props/UI/逻辑，目标组件清单：[...]"
  ↓
BS 子脑 B 完成 → 重新跑本巡检 → 通过 → blocker.status=resolved
  ↓
[数据厂阶段二启动条件具备]
```

---

## 状态转移图（key 阻断生命周期）

```
                 ┌──────────────────────────┐
                 │  数据厂尝试启动 phaseTwo  │
                 └────────────┬─────────────┘
                              ▼
                 ┌──────────────────────────┐
                 │ supervisor 跑 key-check   │
                 └────────────┬─────────────┘
                              │
              passed=true     │     passed=false
                ┌─────────────┴───────────────┐
                ▼                             ▼
   phaseTwo.in-progress            blocker B-xxx (open)
                                   factories.dataBinding.status=blocked
                                              │
                                              ▼
                                   ┌──────────────────────┐
                                   │ 用户决策：A / B / C    │
                                   └──────────┬───────────┘
                                              ▼
                                   BS step2-patch 修补模式
                                   （仅补 key，不动其他）
                                              │
                                              ▼
                                   重跑 bs-to-data-key-check
                                              │
                                       passed=true
                                              │
                                              ▼
                                   blocker.status=resolved
                                   data.dataBinding.status=in-progress
                                   ──► 进入 phaseTwo
```

---

## 🆘 用户操作指南（"我被卡住了怎么办？"）

> 当你看到 "🔴 跨厂巡检失败：bs-to-data-key-check"，请按下表对照处理。**总监会主动驱动**整个修复流程，你只需要在每个决策点回答一次。

### 第 1 步 · 阅读阻断报告
报告里会列出每个有问题的组件、数组名、缺失项数、**总监已建议好的 key 命名**。先扫一遍，判断这些建议命名是否合理。

### 第 2 步 · 选择修复方式（最多回答一次）

| 选项 | 含义 | 适用场景 | 后续操作 |
|---|---|---|---|
| **A. 自动修补**（推荐） | 总监调用 BS `step2-patch`，**只补 key 不改业务**，使用建议命名 | 命名建议都合理；想最快通过 | 无需再操作；等总监跑完巡检即可 |
| **B. 部分采纳 + 部分自定义** | 你提供一个 mapping，例如：`{ "cmp_env_status.statusData": ["humid","temp","soil"] }`；其他默认 | 部分组件名不准 | 一次性给出 mapping；总监会按你的版本补 |
| **C. 全部自定义** | 你自己手动改组件代码 | 不放心 AI 改组件 | 改完后回复"已修复"，总监会重跑巡检 |

### 第 3 步 · 等待巡检 PASSED
总监会自动重跑 `bs-to-data-key-check`：
- ✅ PASSED → blocker 自动解除 → 数据厂 phaseTwo 启动
- ❌ FAILED again → 总监会再次给出新的清单，回到第 2 步

### 常见问答
**Q: 我能跳过这个检查吗？**
A: 不能。`key` 是数据厂阶段二与 BS 组件的唯一硬接口；缺 key 会导致后续接入用 `arr[0]/arr[1]` 下标硬编码，是高风险反模式。

**Q: 一定要中文转英文吗？key 能用中文吗？**
A: 不能。命名空间限定为英文小驼峰（仅字母数字）。

**Q: 修复后会动我的 UI/样式/props 吗？**
A: 不会。修复模式（`step2-patch`）受 BS 厂强约束："仅补数组项 key，不修改 props / UI / 逻辑"，且会进入 BS 防腐自检。

