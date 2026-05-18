# 状态机规范（State Machine Spec）

> 总监 SKILL 的核心治理资产。所有跨厂调度、跨对话续传、跨厂巡检都依赖这份状态机。

---

## 1. 文件位置与生命周期

- **文件名**：`.skill-state.json`
- **位置**：用户工程根目录（即 `projectPath` 下，**不是** skill 目录下）
- **创建时机**：用户首次唤起总监 + 通过协议 0 环境预检后立即创建
- **更新时机**：每次状态迁移、每次跨厂巡检、每次任务交接，**必须**写盘
- **建议加入 .gitignore**（含开发态信息，不入版本库）
- **禁止**：手动编辑（出错时由总监走"修复模式"重建）

---

## 2. 顶层结构

```jsonc
{
  "version": "1.0",                     // schema 版本
  "projectPath": "D:/path/to/project",  // 工程绝对路径
  "createdAt": "2026-04-27T10:00:00Z",
  "updatedAt": "2026-04-27T11:30:00Z",
  "currentTaskId": "T-20260427-001",    // 当前活跃任务

  "globalEnv": { ... },                 // 项目级环境状态（见 §3）
  "tasks": [ ... ]                      // 任务列表（见 §4）
}
```

---

## 3. `globalEnv` — 环境预检快照

```jsonc
{
  "node": "ok",                  // ok | missing | unknown
  "echarts": "ok",               // ok | missing | unknown
  "mainScss": "ok",              // ok | missing | unknown
  "requestUtil": "ok",           // ok | missing | unknown  (src/utils/request.js)
  "layoutImagesDir": "ok",       // ok | missing | unknown
  "mcp": "ready",                // ready | not-ready | not-applicable | unknown
  "lastEnvCheckAt": "2026-04-27T10:00:00Z",
  "notes": []                    // 自由字符串数组，记录预检中的备注
}
```

**枚举语义**：
- `ok` — 检查通过
- `missing` — 检查未通过（必须在依赖该项的厂启动前修复）
- `not-applicable` — 本项目不需要（如纯 2D 项目的 mcp）
- `unknown` — 还没检查

---

## 4. `tasks[]` — 任务列表

每个任务 = 一次完整需求（如"做智慧园区大屏"）。

```jsonc
{
  "id": "T-20260427-001",          // 任务唯一 id
  "title": "智慧园区大屏",
  "playbook": "full-stack-2d-3d",  // 走的剧本（见 playbooks/）
  "status": "in-progress",         // 见 §4.1
  "createdAt": "...",
  "updatedAt": "...",

  "pages": [ ... ],                // 涉及的页面（见 §5）
  "checkpoints": [ ... ],          // 跨厂巡检记录（见 §6）
  "blockers": [ ... ],             // 当前阻断项（见 §7）
  "history": [ ... ]               // 事件流水（见 §8）
}
```

### 4.1 任务级 status 枚举
- `not-started` — 已创建，未启动任何厂
- `planning` — 总监正在产出任务图，等用户确认
- `in-progress` — 至少一个厂在工作
- `blocked` — 有 blocker 未解决（任意一项 blocker.status=open）
- `completed` — 所有 page 全部完工 + 终检通过
- `aborted` — 用户主动中止

---

## 5. `pages[]` — 页面级状态

每个页面独立追踪三厂进度：

```jsonc
{
  "pageKey": "page_1_1",
  "title": "智慧生态总览",
  "filePath": "src/views/page_1/page_1_1/index.vue",
  "factories": {
    "bs":          { ... },   // 见 §5.1
    "wdp":         { ... },   // 见 §5.2
    "dataBinding": { ... }    // 见 §5.3
  },
  "components": [ ... ]       // 见 §5.4
}
```

### 5.1 `factories.bs` — BS 厂状态
```jsonc
{
  "status": "in-progress",     // not-started | in-progress | blocked | completed | needs-rework
  "currentStep": "step2",      // step1 | step2 | step3 | null
  "step1_layout": {
    "status": "completed",
    "currentRound": null,      // R1 | R2 | R3 | R4 | null
    "rounds": {
      "R1": { "status": "completed", "completedAt": "..." },
      "R2": { "status": "completed", "completedAt": "..." },
      "R3": { "status": "completed", "completedAt": "..." },
      "R4": { "status": "completed", "completedAt": "..." }
    }
  },
  "step2_components": {
    "status": "in-progress",
    "totalCount": 8,
    "completedCount": 5,
    "excelPath": ".../组件封装清单.xlsx"
  },
  "step3_mount": {
    "status": "not-started",
    "totalPanels": 6,
    "completedPanels": 0,
    "excelPath": null
  },
  "artifacts": [              // BS 厂产出文件清单
    "src/views/page_1/page_1_1/index.vue",
    "src/views/page_1/page_1_1/components/PassengerTrendChart.vue"
  ],
  "lastSelfCheckAt": "...",   // 最近一次"防腐自检"时间
  "selfCheckPassed": true
}
```

### 5.2 `factories.wdp` — WDP 厂状态
```jsonc
{
  "status": "in-progress",     // not-started | in-progress | blocked | completed | not-applicable
  "phase": "B",                // -1 | 0 | A | B | null
  "mcpReady": true,            // 是否通过阶段 -1 自检
  "currentRequirement": "BIM 房间点击弹窗",
  "demoArtifact": "...",       // MCP 阶段 A 产出的原生 Demo 路径
  "mixinFile": "src/views/page_1/page_1_1/mixins/bimRoomMixin.js",
  "mandatoryCheckpoints": [    // MCP 返回的强制检查点
    { "name": "enforce_routing_check",       "passed": true },
    { "name": "enforce_official_docs_read",  "passed": true },
    { "name": "enforce_context_memory_check","passed": true },
    { "name": "enforce_object_ids_valid",    "passed": false, "reason": "..." }
  ],
  "lastUpdatedAt": "..."
}
```

### 5.3 `factories.dataBinding` — 数据接入厂状态
```jsonc
{
  "status": "in-progress",     // not-started | in-progress | blocked | completed | not-applicable
  "phaseOne": {
    "status": "completed",
    "apiDocPath": "data-bindingapi-skill/user-input/api-user-input.md",
    "apiFilePath": "src/utils/api/data.js",
    "functionsCount": 18,
    "completedAt": "..."
  },
  "phaseTwo": {
    "status": "blocked",
    "reason": "BS 厂部分组件缺 key 字段",
    "mappingDocPath": ".../page-api-mapping-user-input-example.md",
    "totalBindings": 24,
    "completedBindings": 0,
    "keyAudit": {                   // ← 关键：跨厂巡检结果
      "passed": false,
      "missingArrays": [
        {
          "componentKey": "cmp_env_status",
          "componentPath": "src/views/page_1/page_1_1/components/EnvStatusGroup.vue",
          "arrayName": "statusData",
          "missingItemCount": 3,
          "suggestedKeys": ["water", "air", "soil"]
        }
      ],
      "ranAt": "..."
    }
  }
}
```

### 5.4 `components[]` — 组件级清单（用于 key 巡检）
```jsonc
{
  "componentKey": "cmp_passenger_trend",
  "componentName": "PassengerTrendChart",
  "type": "chart",                        // chart | list | normal
  "scope": "private",                     // private | public
  "filePath": "src/views/page_1/page_1_1/components/PassengerTrendChart.vue",
  "dataArrays": [                         // data() 中的所有数组（巡检用）
    {
      "name": "statusData",
      "applicable": true,                 // 是否会被 API 绑定
      "keyPresent": true,                 // 项是否带 key
      "keys": ["water", "air", "soil"],
      "lastAuditAt": "..."
    }
  ],
  "dataSource": "api",                    // static | api | mock
  "apiFunction": "getEnvStatusAPI",       // 由数据接入厂阶段二填入
  "apiBound": false                       // 是否已完成阶段二接入
}
```

---

## 6. `checkpoints[]` — 跨厂巡检记录

```jsonc
{
  "name": "bs-to-data-key-check",     // checks/ 目录下的检查名
  "trigger": "bs.step2.completed",    // 触发节点
  "passed": false,
  "ranAt": "...",
  "summary": "3 个组件缺 key",
  "details": { ... },                 // 任意 JSON
  "linkedBlockerId": "B-001"          // 若失败，链到 blocker
}
```

巡检规则见 [checks/](../checks/) 目录。

---

## 7. `blockers[]` — 阻断项

```jsonc
{
  "id": "B-001",
  "raisedAt": "...",
  "raisedBy": "supervisor:bs-to-data-key-check",
  "severity": "blocking",            // blocking | warning
  "status": "open",                  // open | resolved | wont-fix
  "title": "数据接入厂阶段二被 key 缺失阻断",
  "detail": "...",
  "suggestedAction": "回到 BS 厂 step2 给 EnvStatusGroup 的 statusData 补齐 key=water/air/soil",
  "resolvedAt": null,
  "resolution": null
}
```

> 任意 `status=open` 的 `severity=blocking` blocker 存在时，**总监不得推进流水线**，必须先驱动用户解决。

---

## 8. `history[]` — 事件流水（审计 & 续传依据）

```jsonc
{
  "ts": "2026-04-27T10:15:00Z",
  "actor": "supervisor",              // supervisor | bs | wdp | dataBinding | user
  "event": "task-created",            // 见下表
  "detail": { ... }
}
```

### 标准事件类型
| event | 触发方 | 含义 |
|---|---|---|
| `env-checked` | supervisor | 协议 0 环境预检完成 |
| `task-created` | supervisor | 任务创建 |
| `playbook-confirmed` | user | 用户确认任务图 |
| `factory-invoked` | supervisor | 调用某厂开工 |
| `bs-round-completed` | bs | BS 厂某轮完成 |
| `bs-step-completed` | bs | BS 厂某步骤完成 |
| `wdp-phase-completed` | wdp | WDP 厂某阶段完成 |
| `data-phase-completed` | dataBinding | 数据厂某阶段完成 |
| `checkpoint-passed` | supervisor | 跨厂巡检通过 |
| `checkpoint-failed` | supervisor | 跨厂巡检失败（同时新建 blocker） |
| `blocker-raised` | supervisor | 出现阻断 |
| `blocker-resolved` | supervisor | 阻断解除 |
| `factory-handoff` | supervisor | 一厂交活 → 下一厂启动 |
| `task-completed` | supervisor | 任务全部完工 |
| `task-aborted` | user | 用户中止 |

---

## 9. 状态迁移图（核心约束）

### 9.1 BS 厂迁移
```
not-started ──[step1.R1 启动]──► in-progress(step1.R1)
in-progress(R1) ──[用户确认]──► in-progress(R2) ──► R3 ──► R4
in-progress(step1.R4) ──[step1 自检通过]──► step1.completed
step1.completed ──► in-progress(step2)
in-progress(step2) ──[每个组件 key 巡检通过]──► step2.completed
step2.completed ──► in-progress(step3)
in-progress(step3) ──► step3.completed ──► factories.bs.status = completed
```

### 9.2 WDP 厂迁移
```
not-started ──[阶段 -1 自检]──► mcpReady=true
mcpReady=true ──► phase=A ──[拿到原生 Demo]──► phase=B
phase=B ──[Mixin 落地 + 用户确认]──► completed
任意阶段失败 ──► blocked + 新建 blocker
```

### 9.3 数据接入厂迁移
```
phaseOne.not-started ──► phaseOne.in-progress ──► phaseOne.completed
phaseTwo.not-started ──[预检：bs-to-data-key-check]──► 
  ├─ passed=true  ──► phaseTwo.in-progress ──► phaseTwo.completed
  └─ passed=false ──► blocked（newBlocker B-xxx）
```

---

## 10. 写盘规则（防止状态机崩坏）

1. **原子写**：先写 `.skill-state.json.tmp`，再 rename，避免半写损坏
2. **每次更新必须更新 `updatedAt`**
3. **必须同时追加 `history` 事件**——状态变化但无事件 = 数据不一致
4. **写入前校验**：所有 enum 字段、所有 id 引用必须合法
5. **保留最近 200 条 history**，超出滚动归档到 `.skill-state.history.json`

---

## 11. 修复模式（状态机损坏时）

当读取 `.skill-state.json` 失败或检测出不一致：
1. 总监**立即停止**调度，向用户报告
2. 进入"修复模式"问答：
   - "检测到状态机损坏，请确认当前任务进度：A/B/C 厂分别走到哪一步？"
3. 基于用户回答 + 实际项目文件扫描重建 state
4. 重建后追加一条 `history.event = "state-rebuilt"`

---

## 12. 字段写入责任表（避免漏字段 / 错主体）

> **唯一原则**：每个字段只能由其唯一的"责任主体"写入；下游厂只回报 JSON（遵循 [`../contracts/delivery-schema.md`](../contracts/delivery-schema.md)），由 **supervisor 落盘**到 state。

### 12.1 全局字段
| 字段 | 责任主体 | 触发时机 |
|---|---|---|
| `version` | supervisor | 创建文件时一次写入；schema 升级时由"修复模式"迁移 |
| `projectPath` | supervisor | 协议 0 拿到工程路径后立即写入 |
| `createdAt` | supervisor | 文件首次创建 |
| `updatedAt` | supervisor | **每次** 写盘前更新 |
| `currentTaskId` | supervisor | 协议 2 创建/切换任务时 |
| `globalEnv.*` | supervisor | 协议 1 环境预检后整体覆写；后续若 `mcp` 状态变化由 WDP 阶段-1 反馈触发 |

### 12.2 BS 厂字段（factories.bs）
| 字段 | 责任主体 | 触发时机 / 数据来源 |
|---|---|---|
| `status` / `currentStep` | supervisor | 收到 BS 交付报告后，依据 `phase` 推导 |
| `mode` | supervisor | 协议 2 任务图确认时定值（`standard` / `batch`） |
| `step1_layout.rounds.Rx.status` | supervisor | BS 报告 `phase=step1` + `currentRound=Rx` 用户确认进入下一轮时 |
| `step1_layout.rounds.Rx.completedAt` | supervisor | 同上，用 BS 报告的 `finishedAt` |
| `step2_components.totalCount` | supervisor | 批量模式：协议 2 物料校验时从 Excel 行数填入；标准模式：BS 首次交付 step2 报告时 |
| `step2_components.completedCount` | supervisor | 每个 BS step2 报告 `components[].length` 累加 |
| `step3_mount.totalPanels` / `completedPanels` | supervisor | 同 step2 同理 |
| `artifacts` | supervisor | 合并 BS 报告 `artifacts` 字段（去重） |
| `lastSelfCheckAt` / `selfCheckPassed` | supervisor | 直接来自 BS 报告同名字段 |

### 12.3 WDP 厂字段（factories.wdp）
| 字段 | 责任主体 | 触发时机 / 数据来源 |
|---|---|---|
| `status` / `phase` | supervisor | 来自 WDP 报告 `phase` + `status` |
| `mcpReady` | supervisor | WDP 报告 `phase=phase-1` 且 `selfCheckPassed=true` 时设 true |
| `currentRequirement` | supervisor | 任务图中"当前活跃 WDP requirement" |
| `demoArtifact` | supervisor | 来自 WDP 报告（phaseA） `demoArtifact` |
| `mixinFile` | supervisor | 来自 WDP 报告（phaseB） `mixinFile` |
| `mandatoryCheckpoints` | supervisor | 直接复制 WDP 报告 `mandatoryCheckpoints[]`，不要拆分 |
| `lastUpdatedAt` | supervisor | 每次 WDP 报告写入时刷新 |

### 12.4 数据厂字段（factories.dataBinding）
| 字段 | 责任主体 | 触发时机 / 数据来源 |
|---|---|---|
| `status` | supervisor | 综合 phaseOne/phaseTwo 状态 |
| `phaseOne.*` | supervisor | 来自数据厂 phaseOne 报告（`apiFilePath` / `functionsCount`） |
| `phaseTwo.totalBindings` / `completedBindings` | supervisor | 来自数据厂 phaseTwo 报告 `bindings[].length` 与累计 |
| `phaseTwo.keyAudit` | supervisor | **由总监自己跑** `bs-to-data-key-check` 巡检产出，不接受数据厂代写 |
| `phaseTwo.reason` | supervisor | 当 `status=blocked` 时，从数据厂报告 `blockers[0].message` 复制 |

### 12.5 跨切面字段
| 字段 | 责任主体 | 备注 |
|---|---|---|
| `pages[].components[]` | supervisor | 由 BS 报告 `components[]` 合并；`apiFunction` / `apiBound` 由数据厂 phaseTwo 报告补充 |
| `checkpoints[]` | supervisor | 巡检完成后追加（不允许厂自行写入） |
| `blockers[]` | supervisor | 任何来源的阻断都通过 supervisor 创建/解决；厂只负责在交付报告 `blockers[]` 中说明 |
| `history[]` | supervisor | 任何状态变化必须同步追加事件，违反者视为协议 7 违规 |

### 12.6 厂端纪律（防越权）
- ✅ 厂只产出 [`contracts/delivery-schema.md`](../contracts/delivery-schema.md) 定义的 JSON 报告。
- ❌ 厂**严禁**直接读写 `.skill-state.json`（避免并发写、字段格式漂移、时序错乱）。
- ✅ 厂内部若需要持久化（如批量模式断点），应使用厂自己的工作目录 / 临时文件，不要污染状态机。

