---
name: "wdp-secondary-dev-skill"
description: "WDP 3D 前端二次开发的项目落地枢纽。上游意图识别与原子 Demo 产出全部交由 WDP MCP（wdp-knowledge-proxy）完成，本地只负责两件事：批量需求排期（task-scheduling）、把 MCP 产出的原生 Demo 转化为符合本项目规范的 Vue Mixin 代码（project-development）。凡遇 WDP 相关需求，必须首先调用本技能进行编排。"
---

# WDP Secondary Dev Orchestrator（项目落地枢纽）

## 🎯 描述

本技能是本项目 WDP 3D 前端二次开发的**项目落地枢纽**。

本技能**不再自行承担**意图识别与原子能力（API 知识库、官方真值文档、单例 Demo 生成）职责——这些全部由已接入的 **WDP MCP 服务**（`wdp-knowledge-proxy`）提供。本技能只保留两项本地核心能力：

1. **批量排期层**（`sub-skills/task-scheduling.md`）：把不规范的清单/JSON 批量需求拆解成可执行任务并与用户就缺失数据完成问答。
2. **项目开发层**（`sub-skills/project-development.md`）：接过 MCP 产出的原生 JS/HTML 单例 Demo，按本项目目录架构、Mixin 范式、清理约束落地为 Vue 代码。

---

## 🧭 MCP 工具调用说明

本技能依赖 **WDP MCP 服务**（`wdp-knowledge-proxy`，已在 `.vscode/mcp.json` 注册）。关键工具：

- `start_wdp_workflow` — WDP 开发总入口，负责意图路由、官方真值文档定位、原子能力产物产出。**必须首先调用**。
- `query_knowledge` — 关键词检索 WDP 知识库。
- `get_skill_content` — 读取指定 skill 的官方真值内容。
- `list_skills` — 列举 MCP 侧可用 skill。
- `enforce_routing_check` / `enforce_context_memory_check` / `enforce_object_ids_valid` — 编码前的强制检查点。

**调用规范：**
- 调用 `start_wdp_workflow` 时**必须**传入 `projectPath`（本工程绝对路径），用于创建工程级缓存。
- MCP 返回的 `mandatoryCheckpoints` 必须依次调用，未通过检查点**严禁**进入阶段 B（项目开发）。
- 不接受"本地兜底":MCP 连接失败时必须停下来反馈用户，**严禁**用本地静态假数据绕过。

---

## 🚦 阶段 -1：MCP 启动自检（每次唤起本技能的第 1 步，强制阻断）

> **触发时机**：用户任何一次唤起本技能（无论单点需求还是批量清单），在进入阶段 0/阶段 A 之前，**必须**先完成 MCP 启动自检。自检未通过时，**严禁**直接读取任何子脑、严禁调用任何 MCP 工具、严禁动手写代码。

### 1. 自检动作（自动）

按顺序执行下面 3 个探测，任何一步**有结果**就视为通过：

1. 优先尝试调用 MCP 工具 `check_health`，若返回正常 → MCP 在线，进入阶段 0/A。
2. 否则尝试调用 `list_skills`，若返回 skill 列表 → MCP 在线，进入阶段 0/A。
3. 否则尝试调用 `start_wdp_workflow`（仅用 `user_requirement="健康检查"` + `projectPath` 探活），若正常返回 → MCP 在线，进入阶段 0/A。

> 上述任一调用抛出诸如 `MCP server "wdp-knowledge-proxy" not found` / `tool not registered` / `connection refused` / `ENOENT` / `获取工具定义失败` 等错误 → **判定 MCP 未启动**，进入下方"问答引导启动"流程。

### 2. 问答引导启动（MCP 未启动时强制走完）

> **【🔴 红灯】** 在 MCP 未恢复在线之前，**严禁**回答任何 WDP 业务问题、严禁臆造 API、严禁让用户"先用本地 demo 顶一下"。下面的问答必须**逐项**与用户确认，缺失即问，不允许跳问。

向用户原文输出以下提示，并按编号收集回答：

```
检测到 WDP MCP 服务（wdp-knowledge-proxy）尚未就绪，无法继续 WDP 二次开发流程。
为了启动 MCP，我需要确认以下信息（请逐项回复）：

Q1. 你当前使用的 IDE 是哪一个？
    A. Trae        B. Cursor        C. Cline (VS Code)
    D. Windsurf    E. Claude Desktop F. 其他（请说明）

Q2. 本机是否已安装 Node.js（终端执行 `node -v` 能输出版本号）？
    A. 已安装（请贴出版本号）
    B. 未安装 / 不确定

Q3. 远程客户端（remote-client）目录是否就在本工程下使用？默认绝对路径为：
    d:/webDevFrontProject/BS-SKILL-BUDDY/.trae/51webFrontend_BS_webDev_skill/remote-client/mcp-proxy-client.js
    A. 是，使用此默认路径
    B. 否，我已把 remote-client 移动到其他位置（请贴出绝对路径）

Q4. 你是否已经从管理员处申请到 WDP_KNOWLEDGE_TOKEN？
    A. 已有 token（无需贴出，本助手不需要明文）
    B. 还没有 → 请先联系管理员申请，再回到这里

Q5. 服务器地址 WDP_SERVER_URL 使用默认值 `http://code.51aes.com` 即可吗？
    A. 是，使用默认
    B. 否，我有内网/自建地址（请贴出）
```

### 3. 根据回答输出"针对性的安装/配置指令"

收集完 Q1~Q5 后，按 IDE 给出**精确到配置文件路径**的 MCP 注册片段，并要求用户：
1. 确认 Node.js 可用（Q2=B 时先指引安装 Node.js LTS）。
2. 把 `mcp-proxy-client.js` 的绝对路径替换进 `args`（Windows 路径用正斜杠 `/`，或双反斜杠 `\\`）。
3. 把 `WDP_KNOWLEDGE_TOKEN`、`WDP_SERVER_URL` 填入 `env`。
4. **保存配置文件并重启 IDE**（Trae/Cursor/Windsurf/Claude Desktop 均需重启使 MCP 生效）。

各 IDE 的配置文件路径与 JSON 片段，**严格**以 `remote-client/WDP-API-MCP-Deployment-Guide.md` 中"在 IDE 中配置 MCP"章节为唯一真值，禁止凭记忆改写。常见落点：

| IDE | 配置文件 | 备注 |
|:---|:---|:---|
| Trae | 工程内 `.trae/mcp.json` 或 IDE 设置面板的 MCP Servers | 与 Cursor 格式兼容 |
| Cursor | `%USERPROFILE%/.cursor/mcp.json` | Settings → MCP → Add new MCP server |
| Cline (VS Code) | `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` | 需要包含 `autoApprove` 列表 |
| Windsurf | `%USERPROFILE%/.windsurf/mcp_config.json` | Settings → AI Settings → MCP Servers |
| Claude Desktop | `%APPDATA%/Claude/claude_desktop_config.json` | Settings → Developer → Edit Config |

最小可用片段（替换 `【绝对路径】` 与 `【你的Token】`）：

```json
{
  "mcpServers": {
    "wdp-knowledge-proxy": {
      "command": "node",
      "args": ["【绝对路径】/remote-client/mcp-proxy-client.js"],
      "env": {
        "WDP_SERVER_URL": "http://code.51aes.com",
        "WDP_KNOWLEDGE_TOKEN": "【你的Token】"
      },
      "disabled": false,
      "autoApprove": [
        "start_wdp_workflow",
        "query_knowledge",
        "get_skill_content",
        "list_skills",
        "check_health",
        "enforce_routing_check",
        "enforce_official_docs_read",
        "enforce_context_memory_check",
        "enforce_object_ids_valid"
      ]
    }
  }
}
```

### 4. 重启后再次自检

引导用户重启 IDE 后，**主动重新执行步骤 1 的 3 个探测**：

- 通过 → 在回复中明确告知"✅ MCP 已就绪"，再进入阶段 0/A。
- 仍失败 → 严格按 `WDP-API-MCP-Deployment-Guide.md` 的"故障排查"章节逐项问答（先问哪一类报错），常见判定：
  1. `获取工具定义失败` → `WDP_SERVER_URL` 错误或服务器不可达，回到 Q5 重新确认。
  2. `Cannot find module` / `ENOENT` → `args` 路径错误，回到 Q3 重新确认。
  3. `node: command not found` → Node.js 未装好，回到 Q2。
  4. `401 / 403` → Token 无效或未配置，回到 Q4。
  5. 工具列表不更新 → 等待 60 秒缓存过期或重启 IDE。

### 5. 自检禁令

- **严禁**在 MCP 未就绪时调用 `start_wdp_workflow` 之外的任何 WDP 业务流程，更不得拼凑"伪 API 答复"。
- **严禁**为了赶进度而帮用户**直接修改**其 IDE 配置文件——必须把 JSON 片段交给用户，由用户本人写入并重启。
- **严禁**跳过 Q1~Q5 直接给一个通用配置；必须按 IDE 类型给出精确路径。
- **严禁**让用户"绕过 token"或"使用空 token 跑一下"——token 必须从管理员处申请。

> 自检通过后，方可进入下文的阶段 0 / 阶段 A / 阶段 B。

---

## ⚠️ 强制流转纪律（MANDATORY ROUTING RULES）

本技能落地路径为 **阶段 -1 → 阶段 0 →（阶段 A → 阶段 B）**，严禁跳过任何阻断点：

### 阶段 -1：MCP 启动自检（前置门禁，详见上文）
- **动作**：每次唤起本技能的第 1 件事，先按上文「阶段 -1：MCP 启动自检」执行 3 步探测。
- **【🚨 阻断】**：探测失败时，必须先按 Q1~Q5 问答引导用户启动 MCP，并等待重启后重测通过，**才**允许继续下文任何流程。

### 阶段 0：批量需求排期（仅当用户输入为清单/JSON 批量需求时触发）
- **动作**：用户输入一套不规范的清单、列表或 JSON 格式的批量需求。
- **必读子脑**：立即读取并严格执行 `sub-skills/task-scheduling.md`。
- **目标**：拆解为独立任务单元，通过问答补齐缺失数据（或确认使用 Mock），出具《执行计划报告》。
- **【强制阻断】**：《执行计划报告》出具后**必须停下来等待用户确认**。用户确认后，**逐个 Task 串行**进入阶段 A → 阶段 B，严禁跨任务合并、严禁跳阶段。

> 如果用户输入的是单点需求（非批量清单），直接跳过阶段 0，从阶段 A 开始。

### 阶段 A：MCP 驱动的单例产出（意图识别 + 原子 Demo，由 MCP 一次完成）
- **动作**：调用 MCP 工具 `start_wdp_workflow`，把用户的业务需求（或阶段 0 拆出的单个 Task）按照 WDP MCP 用户手册的输入范式提交。
- **必传参数**：
  - `user_requirement`：用户原始需求描述
  - `projectPath`：本工程根目录的绝对路径
  - 如已知对象类别/对象 Id/坐标，需在需求描述中补充（范式参见 MCP 侧用户手册）
- **执行约束**：
  1. 严格按 MCP 返回的 `mandatoryCheckpoints` 依次调用强制检查工具（路由检查、官方文档检查、上下文记忆检查、对象 Id 合法性检查等）。
  2. 任一检查 `isError=true`，**禁止**进入阶段 B，必须先按 MCP 提示补齐。
  3. MCP 最终产出：一份带骨架、带 UI 反馈的**原生 JS/HTML 单例 Demo**，以及对应的 WDP API 真值链路说明。
- **【🔴 红灯】**：MCP 未正常返回产物之前，**严禁**凭记忆/猜测拼装 WDP API；**严禁**跳过 MCP 直接去写 Vue 代码。

### 阶段 B：项目工程化落地
- **动作**：拿到阶段 A 的原生 Demo 后，准备写进现有 Vue 工程时。
- **必读子脑**：立即读取并严格执行 `sub-skills/project-development.md`。
- **目标**：把原生代码转化为符合本项目规范的 Vue Mixin（`toolCleanupMixin`、`toolObjs` 显式初始化、`closeAll` + `performCommonCleanup`、`addWINDOWS` 3D 弹窗规范等）。
- **【终极阻断】**：执行写文件操作前，**必须**输出一份 `/spec` 计划报告（目标页面、触发机制、改动文件清单），**等待用户明确确认同意后才能动手**。

---

## 📂 核心资产说明

本目录改造后只保留两个子脑，不再维护任何 API 字典、场景库、编译产物、官方真值副本、终端直调脚本：

- `sub-skills/task-scheduling.md` — 批量排期子脑（阶段 0）
- `sub-skills/project-development.md` — 项目开发子脑（阶段 B）

所有 WDP API 官方真值、业务场景库、原子 Demo 骨架、意图识别规则均由 **MCP 端**提供，本地不再留任何副本。

---

## 📝 启动示例

**示例 1：单点业务需求**
> 用户：我要实现一个视频周界

1. 非批量，跳过阶段 0 → 直接阶段 A。
2. 调用 `start_wdp_workflow`，传入 `user_requirement=实现一个视频周界` + `projectPath=<本工程>`，按范式补全对象类别/对象 Id。
3. 依序通过 MCP 要求的强制检查点，拿到原生 Demo + API 真值链路。
4. 进入阶段 B → 读取 `sub-skills/project-development.md`，先澄清目标页面/触发机制/改动计划并等用户确认，再落地为 Vue Mixin。

**示例 2：批量清单需求**
> 用户：帮我处理这批需求：1. 画条线，2. 加个点，3. 做个热力图

1. 识别为批量 → 进入阶段 0，读取 `sub-skills/task-scheduling.md`，拆解、问答、出具《执行计划报告》并等待确认。
2. 用户确认后，对 Task 1「画条线」执行阶段 A（调用 `start_wdp_workflow`）→ 阶段 B（项目落地）。
3. Task 1 完成并确认后，再处理 Task 2、Task 3，**串行执行，严禁合并**。

---

## 🔒 本技能核心禁令

1. **严禁**未完成阶段 -1 的 MCP 启动自检（或自检失败时未引导用户启动），就进入阶段 0/A/B。
2. **严禁**在 MCP 未就绪时凭记忆回答 WDP 业务问题、拼凑 WDP API、伪造 demo。
3. **严禁**在本地重建已删除的 API 字典、场景库、官方真值副本。需要 API 信息一律走 MCP。
4. **严禁**在阶段 A 未产出原生 Demo 的情况下直接进入阶段 B 写 Vue 代码。
5. **严禁**在阶段 B 未得到用户对改动计划的明确确认的情况下写文件。
6. **严禁**用 `setTimeout`、静默 `try/catch` 等手段掩盖 MCP 报错或阶段 A 的 API 不确定性。
7. **严禁**绕开用户直接改写其 IDE 的 MCP 配置文件——配置片段交给用户，由用户保存并重启 IDE。
