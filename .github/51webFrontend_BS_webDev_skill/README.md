# 51webFrontend BS WebDev Skill · 三厂工业链总览

> 一句话：**这是一整套"前端可视化大屏 + 3D 场景 + 数据接入"的 AI 协作工厂**。把设计稿、切图、接口文档丢进来，三家厂分工合作，最后交付一个真数据驱动、可上线的大屏页面。

这份 README 写给：第一次接手项目的实习生 / 想搞清楚 "这一堆 skill 到底咋配合" 的产品/老板 / 准备临时救火的同事。

---

## 🎩 总部：先认识一下总监

> **如果你只肯记住一个入口，那就记住总监。**

[**🎩 factory-supervisor-skill**](factory-supervisor-skill/) 是三厂之上的项目经理 + 质量主管。你丢一句需求过去，他干 4 件事：

1. **听需求** — 识别意图、归类到 5 个标准剧本之一
2. **排计划** — 拆成任务图，给你看，等你点头
3. **派活** — 调用对应的厂，把"已知信息"打包好交过去（不让你被三厂各问一遍）
4. **记账 + 验收** — 维护项目状态机 `.skill-state.json`，每个厂交活时跑跨厂巡检

他自己一行业务代码都不写。以后你只要这样：

```
嚇总监，<projectPath: D:/your/project>
我要做一个智慧园区大屏，包含 3D 园区图和实时数据接入。
```

总监最大亮点是**一套认真的状态机**（文件持久化 / 原子写盘 / 完整事件流水 / 阻断驱动 / 损坏自愈），关掉 IDE 明天接着干不会丢上下文。详见 [factory-supervisor-skill/README.md](factory-supervisor-skill/README.md) 与 [factory-supervisor-skill/state/STATE-SPEC.md](factory-supervisor-skill/state/STATE-SPEC.md)。

---

## 🏭 一、三厂全景：总监手下的三家工厂

我们把整套技能体系拆成 **3 家工艺不同的工厂 + 1 个总监**，每家各干一段活，总监统一调度：

| 代号 | 文件夹 | 一句话定位 | 类比 |
|---|---|---|---|
| **🎩 总监** | [factory-supervisor-skill/](factory-supervisor-skill/) | 项目经理 + 质量主管。意图识别 / 任务编排 / 状态机 / 跨厂巡检 | 总部辦公室 |
| **🏗️ 视觉骨架厂** | [BS-base-dev-skill/](BS-base-dev-skill/) | 把设计稿变成"假数据驱动的 Vue 页面骨架 + 组件 + 挂载" | 装修队 |
| **🌐 3D 场景厂** | [wdp-secondary-dev-skill/](wdp-secondary-dev-skill/) | 把"在 3D 大世界里加交互"的需求落成 Vue Mixin | 园林造景队 |
| **🔌 数据接入厂** | [data-bindingapi-skill/](data-bindingapi-skill/) | 把后端接口封装好、把假数据全部换成真数据 | 水电工 |

**周边支撑设施**（不属于厂，但支撑工厂运行）：
- [remote-client/](remote-client/) — WDP MCP 远程客户端，3D 场景厂干活前必须先把它在 IDE 里挂上
- [test-template/](test-template/) — 测试用例模板（验收 demo 与 master skill 校验清单）

### 1.1 工业链全景图（总监 + 三厂协作）

```
                          ┌──────────────────────────┐
   用户一句话 ─────────►  │  🎩 总监 SKILL            │
                          │  · 意图识别 / 任务编排    │
                          │  · 读写 .skill-state.json │
                          │  · 跨厂巡检               │
                          └────┬───────┬───────┬─────┘
                               │       │       │
                   注入 prompt │       │ 注入  │ 注入
                               ▼       ▼       ▼
   设计稿+切图 ──►   🏗️ BS 厂 ──► 🌐 WDP 厂  ──► 🔌 数据接入厂
                       (4 轮渐进)    (需 MCP)     (阶段一 + 二)
                               │       │       │
                   返回交付报告 │       │       │
                               ▼       ▼       ▼
                          ┌──────────────────────────┐
                          │  🎩 总监接收 → 跨厂巡检    │
                          │  → 写盘 → 阻断/放行        │
                          └────────────┬─────────────┘
                                       ▼
                  ✅ 真数据驱动的可上线大屏 + 3D 场景
```

> 没有总监也能跑——你可以直接喊单个厂干活；但有了总监，跨厂的 key 字段、Mixin 污染、环境校验自动闭环，**谁都骗不了**。

### 1.2 三厂 + 总监的 6 条铁律

1. **优先找总监** — 丢需求不要自己选厂，让总监识别、排期、调度。
2. **不能跳工序** — 没骨架，3D 和数据都没地方挂。骨架先行。
3. **每一厂都有自己的 SKILL.md** — 总监只调度，不改各厂内部规则。
4. **数据流向单向** — BS → WDP → data-binding，反向不行（数据接入厂不会改组件结构）。
5. **数组项 key 是三厂的"工业接口标准"** — BS 厂封装组件时埋好 → 数据接入厂依赖它做映射，详见 [§3.3](#33-工业接口标准数组项-key)。
6. **3D 场景厂必须先启动 MCP** — 没启动就没法干活，详见 [wdp-secondary-dev-skill/SKILL.md](wdp-secondary-dev-skill/SKILL.md) 阶段 -1。

### 1.3 一个最常见的真实案例

> 老板：「做一个智慧园区大屏，左侧三个面板看实时空气/水质/土壤监测，中间一张 3D 园区地图，点击 BIM 房间弹出传感器历史曲线。」

```
Step 1 → 🏗️ BS 厂   搭骨架（左 3 面板 + 中间预留地图坑），封装空气/水质/土壤组件（数组项埋好 key=water/air/soil）
Step 2 → 🌐 WDP 厂   在中间地图坑里挂 3D Mixin，实现 BIM 点击 → 弹窗显示
Step 3 → 🔌 数据厂   阶段一封装 realTimeQueryAPI / getSoilHistoryAPI；阶段二把假数据全部替换成真接口
```

---

## 🏗️ 二、各厂详细介绍

### 2.1 🏗️ BS 厂（视觉骨架厂） — `BS-base-dev-skill/`

**它是干啥的**：把设计稿和切图变成"会跑的 Vue 大屏页面"，但里面装的还是**假数据**。

**架构**：1 个主脑 + 3 个子脑（A 搭骨架 / B 做组件 / C 挂载），全部听 [BS-base-dev-skill/SKILL.md](BS-base-dev-skill/SKILL.md) 调度。

**典型产物**：
- 路由文件
- `src/views/page_X/page_X_X/index.vue` 页面骨架
- `src/views/page_X/components/*.vue` 私有组件、`src/components/` 公共组件
- 假数据 `data()`，但**所有 `list/normal` 数组项已经埋好 `key` 字段**

**行业能力解决了啥**：
- 4 轮渐进式（骨架 → 字号 → Box 精修 → 全局组件）→ 改一处不崩全屏
- Excel 批量清单 → 老板说"再来 20 个面板"也不慌
- 切图按命名 → AI 自动识别要开哪些工具栏

**详细使用手册**：[BS-base-dev-skill/README.md](BS-base-dev-skill/README.md)

---

### 2.2 🌐 WDP 厂（3D 场景厂） — `wdp-secondary-dev-skill/`

**它是干啥的**：在 BS 厂搭好的页面里**注入 3D 交互**——画路径、加 POI、点 BIM 弹窗、放粒子效果，等等。

**架构**：本地只保留 2 个子脑（`task-scheduling` 排期 / `project-development` 落地），其余意图识别 + 原子 Demo 产出**全部交由远程 WDP MCP 服务（`wdp-knowledge-proxy`）**。

**强依赖**：
- 必须在 IDE 里先把 `remote-client/mcp-proxy-client.js` 配置好并启动（MCP 启动自检流程见 [wdp-secondary-dev-skill/SKILL.md](wdp-secondary-dev-skill/SKILL.md) 阶段 -1）
- 必须有 Node.js + 管理员发的 `WDP_KNOWLEDGE_TOKEN`

**典型产物**：
- 一份 Vue Mixin（如 `mixins/forestFireMixin.js`），符合 `toolCleanupMixin`、`toolObjs` 显式初始化、`closeAll + performCommonCleanup` 的清理范式
- 在指定页面里挂上这个 Mixin，3D 交互直接生效

**行业能力解决了啥**：
- 把"3D API 一拍脑袋拼凑"变成"MCP 真值文档驱动"——禁止凭记忆拼 API
- 阶段 -1 自检 + 问答引导启动，新人不会因为 MCP 没装好就抓瞎

**详细使用手册**：[wdp-secondary-dev-skill/SKILL.md](wdp-secondary-dev-skill/SKILL.md)

---

### 2.3 🔌 数据接入厂 — `data-bindingapi-skill/`

**它是干啥的**：把"假数据驱动"的页面变成"真接口驱动"。两阶段：

| 阶段 | 输入 | 输出 |
|---|---|---|
| **阶段一：封装 API** | Markdown 接口文档（含响应 JSON 示例） | 一份符合本项目规范的 `src/utils/api/xxx.js`（基于 `@/utils/request` 的 axios 封装） |
| **阶段二：接入页面** | API 文件 + 页面-API 映射表 | 把目标 .vue 的 `data()` 替换成真接口数据，加 loading/兜底/错误静默 |

**架构**：极简——1 个 SKILL.md + 2 个目录（`references/` 标准样例 / `user-input/` 用户进料）。

**强约定（也就是 BS 厂必须配合的"工业接口"）**：
- 阶段二依赖 BS 厂组件 `data()` 数组项已埋 `key`，缺失即**硬阻断**，输出缺失清单 + 建议命名，等用户确认后才动手
- 字段映射统一写为 `apiField → target[key=xxx].field`，禁止按下标/按 label 定位
- 响应数据统一取 `res.result`（拦截器已解包一层）
- catch 只 `console.error`，不弹窗、不中断

**典型产物**：
- 一份 `src/utils/api/data.js`（含 GET/POST/Path/FormData/Mock 五种规范封装）
- 一批被改造的 `.vue` 文件：`mounted` 里多了 `fetchXxx()`、`data()` 不再硬编码

**详细使用手册**：[data-bindingapi-skill/SKILL.md](data-bindingapi-skill/SKILL.md)

---

## 🧰 三、共用支撑设施 & 工业接口标准

### 3.1 周边设施
| 路径 | 角色 | 谁会用到 |
|---|---|---|
| [remote-client/](remote-client/) | WDP MCP 远程客户端代码 + 部署指南 | 🌐 WDP 厂启动前必装 |
| [remote-client/WDP-API-MCP-Deployment-Guide.md](remote-client/WDP-API-MCP-Deployment-Guide.md) | MCP 在 Trae/Cursor/Cline/Windsurf/Claude Desktop 各 IDE 的配置详解 | 🌐 WDP 厂用户必读 |
| [remote-client/WDP-API-MCP-User-Manual-optimized.md](remote-client/WDP-API-MCP-User-Manual-optimized.md) | MCP 用户输入范式手册 | 🌐 WDP 厂用户必读 |
| [test-template/](test-template/) | 验收测试模板（大屏底座 + 引擎交互） | 三厂交付前回归用 |

### 3.2 三厂共同遵守的项目约定
- **技术栈**：Vue 2 选项式 API + axios（`@/utils/request`）
- **基准 rem**：`src/main.scss` 中 `html { font-size: Xvw; }`
- **图表**：ECharts，配置走 `src/types/` 工厂函数避免引用污染
- **响应包**：`{ success, result, message }`，取数统一 `res.result`
- **生命周期**：`mounted` 起请求，`catch` 静默 `console.error`

### 3.3 工业接口标准：数组项 `key`

> 这是 BS 厂和数据接入厂之间**唯一的硬接口约定**。理解了它，你就理解了三厂为什么能丝滑协作。

| 维度 | 内容 |
|---|---|
| **谁产出** | 🏗️ BS 厂的子脑 B（做组件）封装时就要埋 |
| **谁消费** | 🔌 数据接入厂阶段二的字段映射 |
| **写在哪** | `list / normal` 类组件的 `data()` 中的**每一个数组项** |
| **命名规则** | 英文小驼峰、同数组内唯一、与 UI 文案 / 顺序解耦 |
| **缺失后果** | 数据接入厂阶段二**硬阻断**，输出缺失清单 + 建议命名，停下来等用户确认 |

**反例**（BS 厂封装时漏了 → 下游崩）：
```javascript
statusData: [
  { label: "水环境", statusText: "良好" },  // ❌ 没 key
  { label: "空气",   statusText: "优" },
]
```

**正例**（BS 厂封装时就埋好 → 下游一气呵成）：
```javascript
statusData: [
  { key: "water", label: "水环境", statusText: "良好" },  // ✅
  { key: "air",   label: "空气",   statusText: "优" },
]
// 数据接入厂阶段二只需写：
// waterEnvironmentStatus → statusData[key=water].statusText
// airEnvironmentStatus   → statusData[key=air].statusText
```

> 详细规则见 [BS-base-dev-skill/knowledge/component-standards.md](BS-base-dev-skill/knowledge/component-standards.md) 第 0 节，以及 [data-bindingapi-skill/SKILL.md](data-bindingapi-skill/SKILL.md) 的 `key 规范` 章节。

---

## 🚦 四、按你想干的事，跳到对应教程

> 还是用人情味问法：**你今天想干啥？**

> 💡 **懒人通道**：以下场景全都可以**直接喊总监**——`"嗨总监，<projectPath: ...> + 你的需求"`，他会自动归类剧本、调度三厂、跑跨厂巡检。详见 [factory-supervisor-skill/README.md](factory-supervisor-skill/README.md)。下面表格是给"想自己手动调度"的同学看的。

| 我想… | 走哪条流水线 | 总监剧本 | 详细教程 |
|---|---|---|---|
| 从 0 开发一个**纯 2D 可视化大屏页面** | BS 厂 → 数据接入厂 | `full-stack-2d` | [§4.1](#41-纯-2d-大屏页面骨架到真数据) |
| 从 0 开发**带 3D 的大屏** | BS → WDP → 数据接入厂 | `full-stack-2d-3d` | [§4.1](#41-纯-2d-大屏页面骨架到真数据) + [§4.2](#42-给页面加-3d-交互) |
| 在已有页面里**加 3D 场景交互** | WDP 厂（→ 数据接入厂可选） | `3d-only` | [§4.2](#42-给页面加-3d-交互) |
| **批量做** 20 个面板 + 全部接真数据 | BS 厂批量 → 数据接入厂批量 | `batch-mode` | [§4.3](#43-批量做大屏-真数据全套) |
| 只想**新封装几个后端接口** | 数据接入厂阶段一 | `data-only` | [§4.4](#44-只封装一批接口) |
| 把**已有页面的假数据替换为真接口** | 数据接入厂阶段二 | `data-only` | [§4.5](#45-只把假数据换成真数据) |
| 项目刚起，**啥环境都没** | 先看下面 §4.0 | (env-precheck) | [§4.0](#40-新项目启动前的清单) |

---

### 4.0 新项目启动前的清单

按顺序检查以下东西，缺啥补啥：

1. **Node.js**（命令行 `node -v` 能输出版本号）
2. **Vue 2 项目脚手架**（能 `npm run serve`）
3. **`echarts` 已安装** — `npm install echarts`
4. **`src/main.scss`** 里写好 `html { font-size: Xvw; }`
5. **`src/utils/request.js`** 是 axios 封装且响应拦截器已解包一层（取 `res.result`）
6. **目录** `src/assets/images/layout/` 已建好（哪怕是空的）
7. **如果要用 3D 场景**：把 [remote-client/](remote-client/) 配置到 IDE 的 MCP，并向管理员申请 `WDP_KNOWLEDGE_TOKEN`

详细见 [BS-base-dev-skill/knowledge/new-project-setup.md](BS-base-dev-skill/knowledge/new-project-setup.md) 与 [remote-client/WDP-API-MCP-Deployment-Guide.md](remote-client/WDP-API-MCP-Deployment-Guide.md)。

---

### 4.1 纯 2D 大屏页面（骨架到真数据）

**你要准备**：1 张设计稿截图 + 切图（按命名表放进 `src/assets/images/layout/`）+ 后端接口文档（Markdown）。

**全流程**：

| 步骤 | 找哪家厂 | 你说什么 | AI 给你啥 |
|---|---|---|---|
| 1. 搭骨架 | 🏗️ BS 厂 | "用 BS-base-dev-skill 帮我建一个新页面"（附设计稿） | 走 4 轮渐进式（R1→R2→R3→R4），最终一个能跑的页面骨架 |
| 2. 做组件 | 🏗️ BS 厂 | "执行步骤 2，按这份组件清单批量封装"（附 Excel） | 一堆封装好的 .vue 组件，**数组项已埋 key** |
| 3. 挂载 | 🏗️ BS 厂 | "执行步骤 3，按这份挂载清单批量挂载"（附 Excel） | 完整的"假数据驱动"页面 |
| 4. 封装 API | 🔌 数据接入厂 | "用 data-bindingapi-skill 帮我封装这些接口"（附接口文档 .md） | `src/utils/api/data.js` |
| 5. 接入页面 | 🔌 数据接入厂 | "把数据接入页面，这是映射表 .md" | 修改后的 .vue：`mounted` 调接口，假数据全部替换 |

**详细每一步参考**：
- BS 厂步骤 1~3 → [BS-base-dev-skill/README.md](BS-base-dev-skill/README.md) §4
- 数据接入厂步骤 4~5 → [data-bindingapi-skill/SKILL.md](data-bindingapi-skill/SKILL.md)

---

### 4.2 给页面加 3D 交互

**前提**：页面骨架已由 BS 厂搭好。

**你要做的事**：

1. **先启动 MCP**（最重要）：
   - 在 IDE 配置 `wdp-knowledge-proxy`（看 [remote-client/WDP-API-MCP-Deployment-Guide.md](remote-client/WDP-API-MCP-Deployment-Guide.md)）
   - AI 第一次接活时会自动做"阶段 -1 启动自检"，没启动会用问答面板引导你
2. **跟 AI 说**：
   > "用 wdp-secondary-dev-skill，在 page_1_1 加上 BIM 房间点击弹窗。`projectPath: D:/your/project`"
3. **AI 走的流程**：
   - 阶段 -1：MCP 自检
   - 阶段 A：调 MCP `start_wdp_workflow` 拿原生 Demo + 真值 API
   - 阶段 B：把原生 Demo 改造成项目规范 Vue Mixin（**写文件前会让你确认改动计划**）
4. **如果 3D 弹窗里要展示业务后端数据** → 接着走 §4.5（数据接入厂阶段二接入弹窗组件的字段）

详细见 [wdp-secondary-dev-skill/SKILL.md](wdp-secondary-dev-skill/SKILL.md)。

---

### 4.3 批量做大屏 + 真数据全套

**适合场景**：老板说"这周做完 20 个面板，下周接接口"。

**全流程**（每一步都可以暂停验收）：

```
① 准备物料：
   ├─ 设计稿 + 切图
   ├─ 组件封装 Excel（BS 厂用）
   ├─ 面板挂载 Excel（BS 厂用）
   ├─ 接口文档 .md         （数据接入厂用）
   └─ 页面-API 映射表 .md   （数据接入厂用）

② 🏗️ BS 厂：步骤 1 搭骨架（4 轮）→ 步骤 2 批量封装组件 → 步骤 3 批量挂载
   交付物：完整页面（数组项已埋 key，假数据驱动）

③ 🔌 数据接入厂：阶段一封装 API → 阶段二批量接入
   阶段二会先扫描所有目标组件，缺 key 就硬阻断
   通过后批量替换 → 真数据驱动
```

**Excel 字段说明**：见 [BS-base-dev-skill/README.md §4.3](BS-base-dev-skill/README.md#43-批量做大屏从设计图--清单--成品页)。

**接口文档与映射表样例**：见 [data-bindingapi-skill/references/](data-bindingapi-skill/references/)。

---

### 4.4 只封装一批接口

**你要做的事**：

1. 把接口文档按规范写在 [data-bindingapi-skill/user-input/api-user-input.md](data-bindingapi-skill/user-input/api-user-input.md)（格式抄 [api-example.md](data-bindingapi-skill/references/api-example.md)）
2. 至少给 1 个接口的真实响应 JSON 示例
3. 跟 AI 说：
   > "用 data-bindingapi-skill 帮我封装接口，输出到 `src/utils/api/data.js`"

**AI 给你**：一份分模块带注释、覆盖 GET/POST/Path/FormData/Mock 的标准 axios 封装。

---

### 4.5 只把假数据换成真数据

**前提**：API 文件已存在 + BS 厂组件 `data()` 数组项**已埋 key**。

**你要做的事**：

1. 把映射关系填进 [data-bindingapi-skill/user-input/page-api-mapping-user-input-example.md](data-bindingapi-skill/user-input/page-api-mapping-user-input-example.md)（格式抄 [page-api-mapping-example.md](data-bindingapi-skill/references/page-api-mapping-example.md)）
2. 跟 AI 说：
   > "用 data-bindingapi-skill 阶段二，按映射表把数据接入 `page_1_1`"
3. AI 会先扫描数组 key：
   - **齐了** → 直接接入，最后给你 diff
   - **缺了** → 输出缺失清单 + 建议命名，停下来等你回复"采纳建议"或自己起名

---

## 🆘 五、跨厂踩坑速查

| 现象 | 通常原因 | 去哪儿修 |
|---|---|---|
| 数据接入时 AI 提示"缺 key 字段" | BS 厂当初没埋 | 让 BS 厂或自己补；规则见 [§3.3](#33-工业接口标准数组项-key) |
| WDP 报"MCP 工具未注册" | MCP 没启动 / 配置错 | 走 [WDP 阶段 -1 自检](wdp-secondary-dev-skill/SKILL.md) Q1~Q5 |
| 接口数据接入后 UI 空白 | 兜底值没写 / 取错路径 | 检查兜底值 + 确保用 `res.result` |
| 改了一个组件其它页面跟着崩 | props 没分层、没埋 key | 查 [BS knowledge/project-arch.md](BS-base-dev-skill/knowledge/project-arch.md) + 第 0 节 |
| AI 说"请上传设计稿" | 你没贴图就让 BS 厂干活 | 把图粘进对话框 |
| AI 说"请选择步骤 1/2/3" | 你说了"一键做完" | 老老实实选一个步骤 |
| 三厂相互踩脚（不该发生） | 跨厂越权 | 重读各厂 SKILL.md 顶部"上下游契约" |

---

## 🛠️ 六、维护与扩展

| 想干啥 | 改哪里 |
|---|---|
| 加新工具栏类型 | [BS-base-dev-skill/knowledge/layout-rules.md](BS-base-dev-skill/knowledge/layout-rules.md) |
| 加新图表类型 | [BS-base-dev-skill/knowledge/chart-library.md](BS-base-dev-skill/knowledge/chart-library.md) + [templates/options/](BS-base-dev-skill/templates/options/) |
| 改 3D 厂的意图识别规则 | 改不了——那部分在远程 MCP 服务端，本地只能改子脑指令 |
| 加新 axios 封装模板 | [data-bindingapi-skill/references/api-patterns.md](data-bindingapi-skill/references/api-patterns.md) |
| 改 key 命名规则 | [BS-base-dev-skill/knowledge/component-standards.md](BS-base-dev-skill/knowledge/component-standards.md) 第 0 节（**必须同步告知数据接入厂**） |
| 加新业务剧本（如"BIM 拆分模式"） | [factory-supervisor-skill/playbooks/](factory-supervisor-skill/playbooks/) 新增一个 `.md` |
| 加新跨厂巡检 | [factory-supervisor-skill/checks/](factory-supervisor-skill/checks/) 新增一个 `.md`，并在 SKILL 协议 5 注册 |
| 改状态机 schema | [factory-supervisor-skill/state/STATE-SPEC.md](factory-supervisor-skill/state/STATE-SPEC.md)（**改了要写迁移方案**） |
| 重置某个项目的状态 | 删除该项目根的 `.skill-state.json`，下次总监会自动重建 |

> 状态机文件 `.skill-state.json` 放在**用户工程根**而非 skill 仓库。建议加进 `.gitignore`。

---

## 📮 七、目录速查

```
51webFrontend_BS_webDev_skill/
├── README.md                       ← 你正在看
│
├── factory-supervisor-skill/       🎩 总监（项目经理 + 状态机）
│   ├── SKILL.md                    八大协议主指令
│   ├── README.md                   人类版手册
│   ├── playbooks/                  5 个标准剧本
│   ├── checks/                     3 个跨厂巡检
│   ├── state/                      状态机规范 + 模板
│   └── prompts/                    调用各厂的标准 prompt
│
├── BS-base-dev-skill/              🏗️ 视觉骨架厂
│   ├── SKILL.md                    主脑指令
│   ├── README.md                   人类版手册
│   ├── brains/                     A/B/C 三个子脑
│   ├── knowledge/                  9 本规则字典
│   └── templates/                  组件 / option / utils 模具
│
├── wdp-secondary-dev-skill/        🌐 3D 场景厂
│   ├── SKILL.md                    含阶段 -1 MCP 自检 + 阶段 A/B
│   └── sub-skills/                 task-scheduling / project-development
│
├── data-bindingapi-skill/          🔌 数据接入厂
│   ├── SKILL.md                    阶段一 + 阶段二 + key 阻断点
│   ├── references/                 标准格式样例
│   └── user-input/                 用户实际进料
│
├── remote-client/                  🛰️ WDP MCP 远程客户端
│   ├── mcp-proxy-client.js
│   ├── WDP-API-MCP-Deployment-Guide.md
│   └── WDP-API-MCP-User-Manual-optimized.md
│
└── test-template/                  🧪 验收测试模板
    ├── 大屏底座相关测试模板与结果/
    └── 引擎交互相关测试模板与结果/
```

---

> 看完还是懵？最快的入门法：**打开 IDE，把设计稿截图丢进对话框，跟 AI 说"嗨总监，&lt;projectPath: ...&gt; 帮我搭这个大屏页面"**——让总监带着三厂跑一遍，比读十遍文档管用。
