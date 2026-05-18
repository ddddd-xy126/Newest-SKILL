# 三厂统一交付契约 (Delivery Schema)

> 总监与三厂之间唯一权威的"结构化交付报告"格式定义。
> 所有 `prompts/invoke-*.md` 注入模板与各厂 SKILL.md 的"汇报段落"都必须引用本文件。
> **任何厂在变更字段前，必须先更新本文件并同步 prompts/ 与 state/STATE-SPEC.md**。

---

## 0 · 通用约定

- 报告必须是**单个 JSON 对象**，作为该厂"任务结束"的最终一次发言的最后一段（用 ```json fence 包裹）。
- 顶层字段命名采用小驼峰（camelCase），所有路径用 **POSIX 正斜杠** 与**工程根相对路径**（projectPath 内部）。
- 时间戳统一 ISO 8601 + 时区，如 `"2026-05-07T10:23:00+08:00"`。
- 字段缺省语义：未发生 = 缺省（不要写 `null` 占位）；空集合 = `[]`。
- 所有报告必须包含通用顶层字段：

| 字段 | 类型 | 必填 | 含义 |
|---|---|:--:|---|
| `factory` | `"bs" \| "wdp" \| "dataBinding"` | ✅ | 报告来源工厂 |
| `taskId` | string | ✅ | 与 supervisor `.skill-state.json` 一致 |
| `pageKey` | string | ✅ | 形如 `page_1_1`；批量任务可为 `"*"` |
| `phase` | string | ✅ | 该厂内部阶段标识（取值见各厂段） |
| `status` | `"completed" \| "blocked" \| "partial"` | ✅ | 本次交付的总体结果 |
| `startedAt` / `finishedAt` | string (ISO 8601) | ✅ | 执行起止 |
| `selfCheckPassed` | boolean | ✅ | 该厂内部自检是否全通过（防腐自检 / 阶段-1自检 / key阻断检） |
| `artifacts` | `string[]` | ✅ | 本次新增/修改的文件路径列表 |
| `blockers` | `Blocker[]` | ⛳ | 仅当 `status != "completed"` 时必填 |
| `nextHint` | string | ⛳ | 给总监的人类可读建议（如"请用户确认 key 命名"） |

`Blocker` 子结构：
```json
{
  "code": "B-001",
  "severity": "blocking | warning",
  "message": "说明文字",
  "evidence": ["相关文件路径或行号"],
  "suggestedFix": "建议处理动作（可机读）"
}
```

> **错误码命名空间**：`B-xxx`（BS 厂）/ `W-xxx`（WDP 厂）/ `D-xxx`（数据厂）/ `S-xxx`（supervisor 巡检）。

---

## 1 · BS 厂报告（factory = "bs"）

### 取值表

| 字段 | 取值 |
|---|---|
| `phase` | `"step1"` / `"step2"` / `"step2-patch"` / `"step3"` |
| `currentRound` | 仅 `phase=step1` 时填，取值 `"R1" \| "R2" \| "R3" \| "R4"` |
| `mode` | `"standard" \| "batch"` |

### 完整结构

```json
{
  "factory": "bs",
  "taskId": "T-001",
  "pageKey": "page_1_1",
  "phase": "step2",
  "mode": "standard",
  "status": "completed",
  "startedAt": "2026-05-07T10:00:00+08:00",
  "finishedAt": "2026-05-07T11:30:00+08:00",
  "selfCheckPassed": true,
  "artifacts": [
    "src/views/page_1/page_1_1/index.vue",
    "src/views/page_1/page_1_1/components/CmpEnvStatus.vue"
  ],
  "currentRound": null,
  "components": [
    {
      "componentKey": "cmp_env_status",
      "componentType": "list",
      "filePath": "src/views/page_1/page_1_1/components/CmpEnvStatus.vue",
      "scope": "private",
      "dataArrays": [
        {
          "name": "statusData",
          "keyPresent": true,
          "keys": ["water", "air", "soil"]
        }
      ]
    }
  ],
  "panels": [
    {
      "panelKey": "left-1",
      "panelTitle": "环境状态",
      "side": "left",
      "boxType": "compact",
      "delayTime": 100,
      "heightPercent": 30,
      "componentKey": "cmp_env_status"
    }
  ],
  "checklist": {
    "noDuplicateImports": true,
    "logoFontSize": true,
    "noUnknownDeps": true,
    "resourceSlotMatch": true,
    "noWdpLeak": true,
    "headerRightTypeMatch": true,
    "downstreamKeyOk": true,
    "boxMountOk": true
  },
  "blockers": [],
  "nextHint": "step2 完成，建议进入 supervisor.bs-to-data-key-check 巡检"
}
```

### step2-patch 简化版（仅补 key）
```json
{
  "factory": "bs",
  "taskId": "T-001",
  "pageKey": "page_1_1",
  "phase": "step2-patch",
  "status": "completed",
  "patchedComponents": [
    { "componentKey": "cmp_env_status", "addedKeys": ["water", "air", "soil"] }
  ],
  "selfCheckPassed": true,
  "artifacts": ["..."],
  "startedAt": "...", "finishedAt": "..."
}
```

---

## 2 · 数据厂报告（factory = "dataBinding"）

### 取值表

| 字段 | 取值 |
|---|---|
| `phase` | `"phaseOne"` / `"phaseTwo"` |

### 阶段一（API 封装）
```json
{
  "factory": "dataBinding",
  "taskId": "T-001",
  "pageKey": "*",
  "phase": "phaseOne",
  "status": "completed",
  "startedAt": "...",
  "finishedAt": "...",
  "selfCheckPassed": true,
  "apiFilePath": "src/utils/api/data.js",
  "functionsCount": 18,
  "addedFunctions": ["getOverview", "getEnvStatus", "..."],
  "baseUrlUpdated": false,
  "tokenUpdated": false,
  "artifacts": ["src/utils/api/data.js"],
  "blockers": [],
  "nextHint": "API 封装完成，可在 BS step2 完成后启动阶段二"
}
```

### 阶段二（数据接入）
```json
{
  "factory": "dataBinding",
  "taskId": "T-001",
  "pageKey": "page_1_1",
  "phase": "phaseTwo",
  "status": "completed",
  "startedAt": "...",
  "finishedAt": "...",
  "selfCheckPassed": true,
  "keyCheckSnapshot": {
    "checkId": "S-key-20260507-103300",
    "passed": true
  },
  "bindings": [
    {
      "componentKey": "cmp_env_status",
      "apiFunction": "getEnvStatus",
      "boundFields": ["water", "air", "soil"],
      "trigger": "mounted | onTabChange | ..."
    }
  ],
  "artifacts": ["src/views/page_1/page_1_1/index.vue"],
  "blockers": []
}
```

### 阻断态（key 缺失等）
```json
{
  "factory": "dataBinding",
  "taskId": "T-001",
  "pageKey": "page_1_1",
  "phase": "phaseTwo",
  "status": "blocked",
  "selfCheckPassed": false,
  "blockers": [
    {
      "code": "D-KEY-001",
      "severity": "blocking",
      "message": "组件 cmp_env_status.statusData 数组项缺少 key 字段",
      "evidence": ["src/views/.../CmpEnvStatus.vue:42"],
      "suggestedFix": "调用 BS step2-patch 修补模式，预设 key=['water','air','soil']"
    }
  ],
  "nextHint": "总监应改为调度 BS step2-patch，修复后重跑 supervisor 的 bs-to-data-key-check 巡检"
}
```

---

## 3 · WDP 厂报告（factory = "wdp"）

### 取值表

| 字段 | 取值 |
|---|---|
| `phase` | `"phase-1"` / `"phaseA"` / `"phaseB"` |

### 阶段 -1（MCP 自检）
```json
{
  "factory": "wdp",
  "taskId": "T-001",
  "pageKey": "*",
  "phase": "phase-1",
  "status": "completed",
  "selfCheckPassed": true,
  "mcpProbes": [
    { "tool": "check_health", "passed": true },
    { "tool": "list_skills", "passed": true },
    { "tool": "start_wdp_workflow", "passed": true }
  ],
  "ide": "Trae",
  "tokenConfigured": true,
  "artifacts": [],
  "startedAt": "...", "finishedAt": "..."
}
```

### 阶段 A（MCP 真值产出）
```json
{
  "factory": "wdp",
  "taskId": "T-001",
  "pageKey": "page_1_1",
  "phase": "phaseA",
  "status": "completed",
  "selfCheckPassed": true,
  "demoArtifact": "wdp-demo/bim-room-popup.html",
  "mandatoryCheckpoints": [
    { "name": "objectCategoryConfirmed", "passed": true },
    { "name": "objectIdResolved", "passed": true },
    { "name": "interactionPathPlanned", "passed": true }
  ],
  "artifacts": ["wdp-demo/bim-room-popup.html"],
  "startedAt": "...", "finishedAt": "..."
}
```

### 阶段 B（工程落地）
```json
{
  "factory": "wdp",
  "taskId": "T-001",
  "pageKey": "page_1_1",
  "phase": "phaseB",
  "status": "completed",
  "selfCheckPassed": true,
  "mixinFile": "src/views/page_1/page_1_1/mixins/bimRoomPopupMixin.js",
  "addedProps": [],
  "modifiedBSComponents": [],
  "specApprovedBy": "user",
  "mandatoryCheckpoints": [
    { "name": "noBsPropMutation", "passed": true },
    { "name": "specPlanApproved", "passed": true },
    { "name": "mixinNamingValid", "passed": true }
  ],
  "artifacts": ["src/views/page_1/page_1_1/mixins/bimRoomPopupMixin.js"],
  "startedAt": "...", "finishedAt": "..."
}
```

---

## 4 · 兼容性与版本

- **当前 schema 版本**：`1.0`（与 `state-template.json.version` 同步演进）
- **变更纪律**：
  1. 新增字段必须保持向前兼容（旧报告仍可解析）。
  2. 删除/重命名字段必须 bump major 版本，并在本文件 §5 记录迁移说明。
  3. 各厂上线前必须用本 schema 自检至少 1 个真实报告。

## 5 · 变更日志

| 版本 | 日期 | 变更 |
|---|---|---|
| 1.0 | 2026-05-07 | 首次正式定义；统一三厂报告结构、字段命名与错误码命名空间。 |
