---
name: business-reset-skill
description: 三厂工业链的"反向还原"技能。一键把通过 BS-base-dev-skill / wdp-secondary-dev-skill / data-bindingapi-skill 产出的所有布局、组件、3D Mixin、API 封装、业务图片与配置全部清空，把工程回滚到"只剩框架基建"的纯净基座状态。本技能为破坏性操作，强制执行四道安全闸门（Git 干净度自检 → 快照备份 → Dry-Run 清单 → 用户双确认）后才允许动手，且所有被删/被重写文件均落盘到 `.skill-backup/<sessionId>/`，支持全量/局部/按 scope 三种恢复。适用场景：(1) 项目骨架被业务污染想推倒重来；(2) 想以同一模板派生新项目；(3) demo 演示完毕需要清空示例数据。
---

# 🧹 Business Reset Skill（业务清空 · 基建保留）

> 你是三厂工业链的"逆向施工队"。把 🏗️ BS 厂封装的页面骨架、🌐 WDP 厂注入的 3D Mixin、🔌 数据接入厂生成的 API 封装与数据绑定**全部移除**，让工程回到"基建已具备，但业务为零"的初始基座。
>
> **你的产出物只有"删除"和"重置为模板"两种**，永远不写新业务代码。

---

## 🛑 红线禁令（最高优先级）

1. **严禁**在未经过四道安全闸门（Git 自检 → 快照备份 → Dry-Run → 双确认）前删除任何文件。
2. **严禁**误删 §3「白名单（基建保留）」中的任何文件或目录。
3. **严禁**删除 `node_modules/`、`.git/`、`.vscode/`、`.trae/`（含本技能自身）、`.skill-backup/`（快照仓库）。
4. **严禁**修改 `package.json` 的 `dependencies` / `devDependencies` —— 依赖属于基建。
5. **严禁**为了"图省事"用 `rm -rf src/*` 之类的全量删除指令；必须**逐目录、逐文件**执行白/黑名单比对。
6. **严禁**对 `.skill-state.json`（总监状态机）擅自重置——必须由用户在确认提示中明确选择 "yes/reset-state"。
7. **严禁**跳过快照环节（每一个将被删除/重写的文件，**必须**先写入 `.skill-backup/<sessionId>/files/` 后再动手）；快照写入失败立即 fail-fast，不得带伤继续。
8. **严禁**删除「最小首页骨架」的两个壳文件（`src/views/page_1/index.vue` + `src/views/page_1/page_1_1/index.vue`），但**必须**掏空 `page_1_1/components/`、`page_1_1/mixins/` 整目录以及 `index.vue` 内的所有业务 import / data / methods / mixin 引用。最终形态 = **Layout + Box 占位 + `resetCamera()` hook**；任何业务子组件、业务数据、业务图片 require、业务 wdp mixin、业务 API 调用一律清除。对应路由最少保留一条 children：`/page_1 → page_1/1 → page_1_1`。
   ⚠️ **历史教训（2026-04-27 reset-20260427-142433）**：早期把"硬保留 page_1_1 整目录"误读为"原样不动"，结果 `page_1_1/components/*.vue` 残留 `@/components/card/statisticCard.vue`、`@/utils/api/page_1/index.js`、`@/assets/images/page1/*.png` 等悬空 import，整个工程 build fail。**正确做法**：page_1_1 = **骨架保留，业务清零**——保留 Layout/Box 结构与 scoped 样式（box-1/2/3 高度比例等），其余一律按 §4.9 模板覆写。如需替换/重写新业务，是 BS 厂的职责，不在本技能范围。

---

## 🎯 触发口令（识别意图）

当且仅当用户消息匹配以下任一形式时，进入本技能流程：

- "清空业务代码 / 清空所有业务 / 重置项目"
- "把 skill 生成的东西全删了 / 回到框架基座"
- "保留框架，删掉所有页面/组件/3D/API"
- "走 business-reset-skill / 调用业务清空技能"

不匹配上述意图时，**严禁**主动启动本技能；遇到歧义先反问用户。

---

## 🚦 强制工作流（4 阶段，逐阶段阻断）

### 阶段 0 · 前置握手（缺一不可）

逐项收集，**未完成不得进入阶段 1**：

| 项 | 必填 | 说明 |
|---|---|---|
| `projectPath` | ✅ | 工程根目录绝对路径（用斜杠 `/`） |
| `scope` | ✅ | 清空范围：`all` / `bs-only` / `wdp-only` / `data-only` / `assets-only`（多选用逗号） |
| `keepRouterShell` | ⚪ | 是否保留 `src/router/index.js` 的最小空壳（默认 yes） |
| `keepExampleViews` | ⚪ | 是否保留 `src/views/example/`、`src/views/error/`、`src/views/wdpWindow/`（默认 yes） |
| `resetSkillState` | ⚪ | 是否同步清空 `.skill-state.json` 中的 `tasks` 与 `pages` 节点（默认 no） |
| `backupMode` | ⚪ | 快照策略：`full`（备份被删+被重写的全部文件，**默认**） / `manifest-only`（仅记录 manifest 不存贝文件原本，适合完全依赖 Git 的项目） / `off`（关闭快照，**仅在** `gitStrategy=branch-snapshot` 且用户在对话中原文回复「我以 Git 快照代替文件快照」后生效） |
| `gitStrategy` | ✅ | `commit-first`（推荐：要求用户先 commit 当前改动）/ `branch-snapshot`（先 `git switch -c reset/before-<timestamp>`）/ `force-skip`（用户书面承担风险） |

提问模板（**原文输出**）：

```
检测到「业务清空」意图。本操作不可逆，正式执行前需确认：

Q1. 工程绝对路径（projectPath）= ?
Q2. 清空范围（scope，可多选）：
    [a] all          —— 三厂全部产物
    [b] bs-only      —— 仅 BS 视觉骨架（页面/组件/types/业务图片）
    [c] wdp-only     —— 仅 3D Mixin 与 WDP 业务调用
    [d] data-only    —— 仅 src/utils/api 与页面内 fetch 调用
    [e] assets-only  —— 仅业务图片资源
Q3. 是否保留 router 空壳？(yes/no, 默认 yes)
Q4. 是否保留 example/error/wdpWindow？(yes/no, 默认 yes)
Q5. 是否一并清空 .skill-state.json 中的 tasks/pages？(yes/no, 默认 no)
Q6. Git 策略：commit-first / branch-snapshot / force-skip ?
Q7. 快照策略（backupMode）：full / manifest-only / off ?
      默认 full；选 off 必须同时 gitStrategy=branch-snapshot 且书面确认「我以 Git 快照代替文件快照」。
```

---

### 阶段 1 · 安全闸门（Git 自检）

执行以下检查，任一失败立即停下、报告用户，不得继续：

1. `projectPath` 下存在 `.git/` 目录。否则提示：「工程未纳入 Git 版本控制，强烈建议先 `git init` 并提交一次基线，再回头跑本技能」。
2. 当前工作区干净度（`git status --porcelain`）：
   - 干净 → 通过。
   - 有未提交修改 → 按 `gitStrategy` 处理：
     - `commit-first` → **阻断**，要求用户先 `git add . && git commit -m "<basetag>"`；
     - `branch-snapshot` → 输出建议命令 `git switch -c reset/before-<yyyyMMddHHmm>` 并提示用户执行后重启本技能；
     - `force-skip` → 让用户在对话中**原文回复**「我已知悉风险，强制继续」才放行。

> ⚠️ 不允许 AI 自己执行任何 `git` 写操作（commit / branch / reset），全部交给用户在终端执行；本技能只产出建议命令文本。

---

### 阶段 2 · Dry-Run 清单（强制输出，不得动手）

按 §3 / §4 / §5 三张表的规则，扫描工程实际文件，输出以下 4 段报告，等用户回复 **「确认清空」** 才进入阶段 3：

```
📋 Dry-Run 报告（projectPath: xxx，scope: xxx）

🟥 待删除（共 N 项）
- src/views/page_1/
- src/views/page_2/
- src/components/card/   （除 baseCard.vue 外）
- src/components/cartList/
- src/components/table/
- src/types/page_1/  ... page_8/
- src/utils/api/page_1/  ... page_7/
- src/utils/api/test.js
- src/assets/images/page1/  page1-4/  ... page7/
- src/assets/images/{bghy,bjtx,cartList,cxgk,echarts,klgz,lwts,nxgl,rlyj,table,zcgl,zhaf,zhts,center-left,img,2.png,...}
- 各 page_*/page_*_*/mixins/*.js   （3D Mixin）
- 各 page_*/page_*_*/components/*.vue（页面私有组件）
（…按实际扫描结果完整列出）

🟧 待重写为模板（共 M 项）
- public/config.json                  → 清空 order/url 业务值
- src/router/index.js                 → 仅保留根路由 + 占位 children
- src/views/index.vue                 → 删除 daochengCustom / cameraRoam 等业务调用
- src/layout/scene.vue                → 删除业务 custom 引用，保留场景启动骨架
- src/store/index.js                  → 仅保留 wdpApp/wdpConfig/isShowWindow/windowEid 等通用 state
- src/utils/wdpapi/custom.js          → 仅保留通用 customStatus/customWarningStatus
- src/mock/mock.js                    → 重置为空数组
- mock.json                           → 重置为 {}

🟩 白名单保留（本次不会动）
- package.json / vue.config.js / babel.config.js / public/index.html
- src/main.js / src/App.vue
- src/layout/{box,header,footer,index}.vue
- src/utils/{request,configPath,countSize,countFontsize,custom,dom}.js
- src/utils/wdpapi/{adapter,camera,entity,entityType,delete,tool}.js
- src/mixins/{toolCleanupMixin,toolMixins,echartsMixin,listMixin,tableMixin,gridData,sideBarLeftMixin}.js
- src/directives/**  src/plugins/**
- src/assets/css/**  src/assets/fonts/**  src/assets/videos/**
- src/assets/images/{layout,headerTool,footerTool,nav,sideBarLeft,toolIcon,weather,window,AITool,progress}/
- src/components 框架级文件（详见 §3.2，含 components/echarts/ 通用图表壳）
- src/types/{defaultData.js,echarts/**,antvCharts/**}（图表 option 工厂，属基建）
- src/views/{index.vue,error,example,wdpWindow}（example/error/wdpWindow 受 keepExampleViews 控制）
- .trae/  .vscode/  .git/  node_modules/

📐 影响评估
- 删除文件总数：X 个
- 重写文件总数：Y 个
- 不改动文件总数：Z 个
- 路由表 children 由 N 条 → 0 条（或保留占位）

🔐 请回复：
   ✅「确认清空」     —— 进入阶段 3，开始执行
   ❌「取消」         —— 终止本次任务
   ✏️「调整 xxx」     —— 修改 scope / keep* 参数后重出清单
```

> Dry-Run 输出必须**忠实于工程实际扫描结果**，不允许凭模板凭空列项；扫描到工程里没有的文件就不写进清单。

---

### 阶段 3 · 执行清空（按 scope 分块，逐块写盘）

收到「确认清空」后，首先初始化快照，然后**严格按以下顺序**执行（顺序保证依赖关系不被打断）：

#### Step 3.0 · 初始化快照（备份仓库，**任何写盘动作之前的第 0 步**）
- 生成 `sessionId = reset-yyyyMMdd-HHmmss`。
- 创建 `<projectPath>/.skill-backup/<sessionId>/` 与子目录 `files/`。
- 将 `.skill-backup/` 写入项目根 `.gitignore`（如已存在则跳过）。
- 写入 `meta.json`（记录本次入参：`projectPath / scope / keepRouterShell / keepExampleViews / resetSkillState / gitStrategy / backupMode / gitHead`，其中 `gitHead` 由 AI 提示用户贴出 `git rev-parse HEAD` 输出结果）。
- 初始化空 `manifest.json`：`{ "sessionId": "...", "createdAt": "...", "operations": [] }`。
- 默认 `backupMode=full`：后续每一次删/写之前都要 `copy_file_to_backup()` + `append_manifest_entry()`。
- `backupMode=manifest-only`：仅追加条目到 `manifest.json`（`snapshotPath` 为 `null`），不存实际文件。
- `backupMode=off`：跳过快照，但 `manifest.json` 仍须记录操作以供审计。

> **每条 manifest 条目的 schema**：
> ```json
> { "op": "delete | rewrite", "path": "src/views/page_1", "isDir": true,
>   "step": "3.2", "scope": "bs",
>   "snapshotPath": ".skill-backup/<sessionId>/files/src/views/page_1",
>   "sha256": "<仅文件记>", "timestamp": "2026-04-27T10:00:00Z" }
> ```

#### Step 3.1 · 删除业务 Mixin（WDP 厂产物，先删，避免页面删完后引用悬空）
- 扫描所有 `src/views/page_*/page_*_*/mixins/*.js`，逐文件删除。
- 扫描 `src/mixins/`：仅删除非白名单的（白名单见 §3.4），其余保留。

#### Step 3.2 · 删除业务页面（BS 厂产物）
- 删除 `src/views/page_2/` ~ `src/views/page_8/`（**整目录**，含 `index.vue`、子页面、`components/`、`mixins/`）。
- 删除 `src/views/page_1/page_1_2/` ~ `src/views/page_1/page_1_5/`（仅保留 page_1_1）。
- ⛔ **保留外壳，掏空业务**（红线 #8）：
  - `src/views/page_1/index.vue` 不动（仅作 router-view 中转壳）。
  - `src/views/page_1/page_1_1/`：**仅保留 `index.vue` 一个文件**，并按 §4.9 模板覆写其内容。
    - 删除 `src/views/page_1/page_1_1/components/`（整目录，含 dutyOfficer / alarmStatistic / alarmProgress / shelter 等业务子组件）。
    - 删除 `src/views/page_1/page_1_1/mixins/`（整目录，含业务 wdp mixin `0-wdpapi.js` / `wdpapi.js`）。
    - 重写 `index.vue`：移除 `wdpApiMixin`、业务子组件 import、业务 data、`require('@/assets/images/page1/*')`、`closeAll` / `sideBarSelectItem` 等业务方法；仅保留 Layout/Box 结构、scoped 样式、`mounted` 中的 `resetCamera()`。
- 若 `keepExampleViews=no`，再删除 `src/views/{example,error,wdpWindow}/`。

#### Step 3.3 · 删除业务组件（BS 厂产物）
按 §3.2 黑名单逐项删除：
- 整目录删除：`src/components/{card,cartList,table}/`（注意 `card/baseCard.vue` 默认随目录一起删，不做转移）。
- **保留**：`src/components/echarts/`（`index.vue` / `index_3DPie.vue` 是通用图表底层壳，属基建）。
- 单文件删除：见 §3.2 文件级黑名单。

#### Step 3.4 · 清理业务图表绑定数据（BS 厂产物）
- 删除 `src/types/page_1/` ~ `page_8/`（页面专属的 option 实参/数据）。
- **保留**：`src/types/defaultData.js`、`src/types/echarts/**`（`bar/gauge/line/pie/radar/sankey/3Dcharts`）、`src/types/antvCharts/**`（`column/liquid/pie`）—— 这些是图表 option 工厂函数，属基建底层。

#### Step 3.5 · 删除业务 API（数据接入厂产物）
- 删除 `src/utils/api/page_1/` ~ `page_7/`、`src/utils/api/test.js`。
- 整个 `src/utils/api/` 目录**保留为空目录**（占位）。

#### Step 3.6 · 删除业务图片（BS / 数据接入厂产物）
按 §3.3 资源黑名单删除业务专用切图目录与零散图。

#### Step 3.7 · 重写关键文件为模板（§4 重写模板表）
- `public/config.json`、`src/router/index.js`、`src/views/index.vue`、`src/layout/scene.vue`、`src/store/index.js`、`src/utils/wdpapi/custom.js`、`src/mock/mock.js`、`mock.json`、**`src/views/page_1/page_1_1/index.vue`（§4.9，红线 #8）** 严格按 §4 给出的模板覆写。共 **9** 个文件。
- 覆写前**必须先** `read_file` 读出原始内容 → `copy_file_to_backup()` 写入快照 → `append_manifest_entry({op: "rewrite", ...})` → 生成 diff → 写入新内容。
- 覆写前必须交出 diff，避免误覆盖用户已自行修改的部分（用户保留段落须显式询问）。

#### Step 3.8 · 状态机重置（仅当 `resetSkillState=yes`）
- 读取 `.skill-state.json`：先 `copy_file_to_backup()` + `append_manifest_entry({op: "rewrite", path: ".skill-state.json"})`，再将 `tasks` 设为 `[]`，`pages` 设为 `{}`，保留 `globalEnv`、`projectPath`、`schemaVersion`、`createdAt`，更新 `updatedAt`，并在 `history` 追加一条 `business-reset` 事件（关联本次 `sessionId`）。
- 否则跳过。

#### Step 3.9 · 生成恢复脚本与快照封口
- 在 `.skill-backup/<sessionId>/` 生成：
  - `restore.ps1`（Windows）与 `restore.sh`（POSIX）：实现 `--all`、`--scope=<bs|wdp|data|assets>`、`--path=<glob>`、`--dry-run`、`--list` 五个参数（详见 §8）。
  - `README.md`：列出本次 sessionId、入参、常用恢复命令示例。
- 封口 `manifest.json`：写入 `closedAt`，计算 `summary` 字段（`deletedFiles / deletedDirs / rewrittenFiles / totalBytes`）。

---

### 阶段 4 · 自检与交付

执行完毕后必须出具一份验收报告：

```
✅ 业务清空完成

· sessionId：reset-2026MMdd-HHmmss
· 快照位置：.skill-backup/<sessionId>/（files: X 个 / manifest 条目: Y 条）
· 已删除：N 个文件 / M 个目录
· 已重写：K 个模板文件
· 已保留：白名单全部命中
· 路由 children 数：0（或占位 1 条）
· 残留风险：
  - src/views/index.vue 是否仍有业务 import 残留 → 已自检（pass / fail）
  - src/layout/scene.vue 是否仍有业务 custom 调用 → 已自检（pass / fail）
  - src/store/index.js 业务 state 是否清干净 → 已自检（pass / fail）
  - src/views/page_1/page_1_1/ 是否被掏空（仅剩 index.vue 模板，无 components/、无 mixins/、无业务 import）→ 已自检（pass / fail）  ← 红线 #8
  - 是否有 import 指向已删除路径（语法/lint 风险）→ 已 grep 检查

🧰 如需反悔（参见 §8）：
  全量恢复：pwsh -File .skill-backup/<sessionId>/restore.ps1 -all
  按范围恢复：pwsh -File .skill-backup/<sessionId>/restore.ps1 -scope wdp
  按路径恢复：pwsh -File .skill-backup/<sessionId>/restore.ps1 -path "src/views/page_1/**"
  预览（不写盘）：-dryRun
  查看清单：-list

🚀 建议下一步：
1. 运行 `npm run serve` 验证基座可启动；首页应渲染 Layout 空壳
2. 运行 `git status` 查看变更，确认 diff 范围与预期一致
3. 如需重新接入业务：调用 🎩 factory-supervisor-skill 启动新一轮工业链
```

任意「自检 fail」必须回头修复或显式提示用户处理，不得静默交付。

---

## §3 白名单 / 黑名单（执行依据）

### §3.1 白名单 · 工程根 & 框架文件（**绝不删除**）

```
package.json  package.json.md5  babel.config.js  vue.config.js
project.config.json  project.private.config.json  README.md
public/index.html  public/demo-poi-window-follow-path.html
src/main.js  src/App.vue
src/views/page_1/index.vue                                  （最小首页骨架壳，原样保留）
src/views/page_1/page_1_1/index.vue                         （骨架壳，按 §4.9 模板覆写——掏空业务）
# ⚠️ page_1_1/components/ 与 page_1_1/mixins/ 必须删除，不在白名单
src/router/index.js                  （重写为模板，不删）
src/store/index.js                   （重写为模板，不删）
src/layout/{box,header,footer,index,scene}.vue
src/utils/{request,configPath,countSize,countFontsize,custom,dom}.js
src/utils/wdpapi/{adapter/**,camera.js,entity.js,entityType.js,delete.js,tool.js}
src/utils/wdpapi/custom.js           （重写为模板，不删）
src/directives/**  src/plugins/**
src/assets/css/**  src/assets/fonts/**  src/assets/videos/**
src/types/defaultData.js  src/types/echarts/**  src/types/antvCharts/**
src/components/echarts/**            （通用图表底层壳）
.trae/**  .vscode/**  .git/**  node_modules/**
```

### §3.2 框架级 components（**保留**，不在删除清单内）

```
src/components/AITool.vue
src/components/bottomBar.vue
src/components/boxContent.vue
src/components/categorySelector.vue
src/components/center.vue
src/components/demoDemandPanel.vue
src/components/horizonButton.vue
src/components/searchBox.vue
src/components/searchInput.vue
src/components/setUpSwitch.vue
src/components/sideBarLeft.vue
src/components/splitBuilding.vue
src/components/header/**
src/components/toolBar/**
src/components/sideBarLeft/**
src/components/progress/**
src/components/progressBar/**
src/components/flv/**
src/components/rtsp/**
src/components/echarts/**             （ECharts 通用底层壳：index.vue / index_3DPie.vue，属基建）
src/components/antvCharts/index.vue   （AntV 通用图表壳，属基建）
```

> **黑名单（删除）**：上面以外的 `src/components/**`，重点目录为 `card/`、`cartList/`、`table/`。
> ❗ `components/echarts/` 与 `components/antvCharts/` 是项目图表底层 wrapper，属基建，**永远不删**。

### §3.3 资源图片黑名单（**删除**）

```
src/assets/images/{page1,page1-4,page1-5,page2,page2-2,page2-3,page3,page4,page4-3,page5-1,page5-2,page6,page7}/
src/assets/images/{bghy,bjtx,cartList,cxgk,echarts,klgz,lwts,nxgl,rlyj,table,zcgl,zhaf,zhts,center-left,img}/
src/assets/images/2.png
src/assets/images/底部遮罩.png
src/assets/images/toilet.png
src/assets/images/deviceImg.webp
src/assets/images/pieDefaultImage.png
```

> 资源白名单（保留）：`layout/`、`headerTool/`、`footerTool/`、`nav/`、`sideBarLeft/`、`toolIcon/`、`weather/`、`window/`、`AITool/`、`progress/`、`card/`（基础卡片底图）以及根目录通用按钮图（`leftBtn*.png`、`rightBtn*.png`、`fullscreen.png`、`mask.png`、`search.png`、`setting.png`、`tools.png`、`right_side_tool_six.png`、`sideToolBox*.png`）。

### §3.4 mixins 白名单（**保留**）

```
src/mixins/toolCleanupMixin.js     —— WDP 工具清理基类，3D 厂强依赖
src/mixins/toolMixins.js           —— 工具栏通用混入
src/mixins/echartsMixin.js         —— 图表通用混入
src/mixins/listMixin.js            —— 列表通用混入
src/mixins/tableMixin.js           —— 表格通用混入
src/mixins/gridData.js             —— Grid 通用混入
src/mixins/sideBarLeftMixin.js     —— 左侧栏混入
```

> 出现在 `src/mixins/` 之外（如 `src/views/.../mixins/`）的全部视为业务 Mixin → 删除。

---

## §4 重写模板（覆写 8 个关键文件）

> 执行 Step 3.7 时，**逐文件读 → diff → 写**。模板内容是"最低可用基线"，需要保留任何项目自定义都先与用户确认。

### 4.1 `public/config.json`
```json
{
  "url": "",
  "order": "",
  "sourceUrl": "",
  "resolution": [1920, 1080],
  "isNeedFullScreen": false,
  "defaultCameraCoord": []
}
```

### 4.2 `src/router/index.js`（最小空壳 + 首页骨架）
```javascript
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    redirect: "/page_1",
    meta: { title: "大屏基座", keepAlive: true },
    children: [
      {
        path: "/page_1",
        component: () => import("@/views/page_1/index.vue"),
        redirect: "/page_1/1",
        meta: { title: "首页", keepAlive: true },
        children: [
          {
            path: "1",
            name: "page_1_1",
            component: () => import("@/views/page_1/page_1_1/index.vue"),
            meta: { title: "总览", keepAlive: true },
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({ mode: "hash", routes });
export default router;
```

> `keepRouterShell=no` 在本技能中不再生效（被红线 #8 覆盖）——首页骨架及其路由条目必须保留。

### 4.3 `src/views/index.vue`（壳）
- **保留**：`Layout` + `Header` + `Footer` + `Scene` + `SideBarLeft` + `AITool` + `Center` 的占位结构与 slot。
- **删除**：所有业务方法（`getCaerma`、`onSideBarChange` 业务分支）、业务 import（`daochengCustom`、`cameraRoam`、`seasonSwitch`、`getCameraInfo` 内业务参数等）。
- **保留**：`sideBarLeftMixin`（基础混入）、`mapState` 中的 `isShowWindow`。

### 4.4 `src/layout/scene.vue`
- 保留：`WdpApi` 实例化、`fetch ./config.json`、`Renderer.Start`、`OnWdpSceneIsReady` 注册、`toolCleanupMixin`。
- 删除：`addPath`、`addWINDOWS` 业务调用、`customWarningStatus`、`setStandbyMode`、`FocusByCustomId/Points` 等业务函数 import 中**仅在业务中使用**的部分；**保留**通用清理函数（`deleteTypes`、`ClearByEids`、`resetCamera`）。

### 4.5 `src/store/index.js`
保留通用 `state`：
```javascript
state: {
  wdpApp: null,
  isShowScene: false,
  isSceneAlready: false,
  isShowWindow: { isShow: false, config: {} },
  wdpConfig: null,
  windowEid: null,
  windowEidChild: { p_eid: null, eid: null },
  asideCollapsed: false,
}
```
删除：`droneEid`、`trackPath`、`isShowWebTwo`、`aiBotRouteState`、`aiBotWindowId`、`setDarkenStatus`、`activePoiIndex`、`parkingLotLoaded`、`SequenceID`，以及对应的 `mutations` / `actions` / `getters`。

### 4.6 `src/utils/wdpapi/custom.js`
仅保留 2 个通用执行壳：
```javascript
import store from "../../store/index";

// 通用 CustomApi 状态接口
export async function customStatus(apiFuncName, status) {
  const App = store.state.wdpApp;
  return App.Customize.RunCustomizeApi({
    apiClassName: "CustomApi",
    apiFuncName,
    args: { State: status },
  });
}

// 通用 CustomApi 警示接口（带 ID）
export async function customWarningStatus(apiFuncName, id, status) {
  const App = store.state.wdpApp;
  return App.Customize.RunCustomizeApi({
    apiClassName: "CustomApi",
    apiFuncName,
    args: { ID: id, State: status },
  });
}
```
删除：`splitBuildByName`、`daochengCustom`、`cameraRoam`、`seasonSwitch`、`setStandbyMode` 等所有以业务名前缀命名的导出。

### 4.7 `src/mock/mock.js`
```javascript
// 业务清空后由用户按需补充
export default [];
```

### 4.8 `mock.json`
```json
{}
```

### 4.9 `src/views/page_1/page_1_1/index.vue`（最小首页骨架壳）

> 红线 #8 的具体落地。`page_1_1/components/` 与 `page_1_1/mixins/` 整目录已在 Step 3.2 删除；本文件**必须**按下方模板覆写——保留 Layout/Box 结构、保留 scoped 样式（box-1/2/3 高度比例，便于后续 BS 厂直接接业务），其余一律清零。

```vue
<template>
  <!--
    page_1_1 · 业务已清空，保留 Layout 骨架
    by business-reset-skill (sessionId: <reset-YYYYMMDD-HHmmss>)
    左右两侧各 3 个 Box 占位；恢复业务请调用 supervisor 重新生成。
  -->
  <Layout :aside="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="box-1" :delayTime="100" position="left">
          <template v-slot:header><h1>占位 1</h1></template>
          <div class="box-main-content"></div>
        </Box>
        <Box class="box-2" :delayTime="200" position="left">
          <template v-slot:header><h1>占位 2</h1></template>
          <div class="box-main-content"></div>
        </Box>
        <Box class="box-3" :delayTime="300" position="left">
          <template v-slot:header><h1>占位 3</h1></template>
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>

    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="box-1" :delayTime="100" position="right">
          <template v-slot:header><h1>占位 4</h1></template>
          <div class="box-main-content"></div>
        </Box>
        <Box class="box-2" :delayTime="200" position="right">
          <template v-slot:header><h1>占位 5</h1></template>
          <div class="box-main-content"></div>
        </Box>
        <Box class="box-3" :delayTime="300" position="right">
          <template v-slot:header><h1>占位 6</h1></template>
          <div class="box-main-content"></div>
        </Box>
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";
import { resetCamera } from "@/utils/wdpapi/camera.js";

export default {
  name: "page_1_1",
  components: { Layout, Box },
  async mounted() {
    // 仅保留通用相机复位，作为"业务接入前"的安全 hook
    await resetCamera();
  },
};
</script>

<style lang="scss" scoped>
/* 保留原始高度比例，便于后续 BS 厂直接接入业务而无需重调布局 */
.content-left, .content-right { width: 100%; height: 100%; }
.box-main-content { width: 100%; height: 100%; }
.content-left  { .box-1 { height: 27.5%; } .box-2 { height: 31.65%; } .box-3 { height: 21.5%; } }
.content-right { .box-1 { height: 22%;   } .box-2 { height: 22.2%;  } .box-3 { height: 20.5%; } }
</style>
```

**禁止保留项**（覆写时必须清除）：
- ❌ 业务子组件 import：`dutyOfficer / alarmStatistic / alarmProgress / shelter / sideBarLeft / boxContent` 等
- ❌ 业务 wdp mixin：`import wdpApiMixin from './mixins/wdpapi.js'`
- ❌ 业务图片 require：`require('@/assets/images/page1/*')`
- ❌ 业务数据：`dutyOfficerList / alarmTodayData / resourceGuaranteeData`
- ❌ 业务方法：`closeAll / sideBarSelectItem / toolsSelectItem`
- ❌ 业务 API import：`getAlarmHistoryDataAPI` 等

**强制保留项**：Layout/Box 结构 + scoped 样式 + `resetCamera()` mounted hook。

---

## §5 边界与豁免

1. **共享业务组件迁移豁免**：若用户主动声明 `src/components/card/baseCard.vue` 等"虽在黑名单目录但实为通用件"需保留，必须在阶段 0 的 Q-自定义豁免里收集，进入白名单临时清单，本次执行不删。
2. **TypeScript / D.TS / sass 文件**：本项目暂未启用，不在清空范围。
3. **已经被 git ignore 的本地缓存文件**（如 `dist/`、`.cache/`）不属于本技能职责。
4. **远程客户端**（`.trae/.../remote-client/`）属于 MCP 基建，**绝不删除**。
5. **本技能自身所在的 `.trae/51webFrontend_BS_webDev_skill/` 整体**保留——清业务≠拆工厂。

---

## §6 与三厂 / 总监的协作纪律

- 本技能**不路由**到 BS / WDP / data 任何子脑（它们只管"造"，不管"拆"）。
- 本技能**可被** 🎩 `factory-supervisor-skill` 显式调度（playbook 名为 `business-reset`）。被总监调度时：
  - 总监负责把 `projectPath` 与 `gitStrategy` 传入。
  - 总监在阶段 4 收到本技能的验收报告后，写入 `.skill-state.json.history`，并把 `pages` / `tasks` 标记为 reset（仅当用户同意）。
- 本技能完成后，如用户立刻要重新建业务：**让总监重新走环境预检 + 意图识别**，不允许直接续跑历史任务。

---

## §7 输出风格

- 每个阶段结束时都要对用户明确"当前在哪一阶段、下一步要做什么"。
- 不输出"差不多删完了"这类含糊措辞——所有数字、文件清单都要可核对。
- 出错（如目标文件读取失败、写盘冲突）立刻 fail-fast，不静默吞错。

---

## §8 快照与恢复（反悔、局部回退、完全还原）

本节是与§3~§6 同等优先级的硬规范。快照是本技能"卸责征"（deniability）的唯一依据，出事只看它。

### 8.1 快照仓库布局

```
<projectPath>/
  .skill-backup/
    <sessionId>/                 ← reset-yyyyMMdd-HHmmss
      meta.json                  ← 本次入参 + gitHead
      manifest.json              ← 所有操作的有序流水（op/path/scope/step/snapshotPath/sha256）
      files/                     ← 镜像式保存被删/被重写文件的原始版，路径与 src/... 完全一致
        src/views/page_1/...     ← 例：整目录镜像
        src/utils/api/test.js    ← 例：单文件镜像
      restore.ps1                ← Windows 恢复脚本
      restore.sh                 ← POSIX 恢复脚本
      README.md                  ← sessionId、入参、常用命令示例
```

- `.skill-backup/` 始终被写入项目根 `.gitignore`，不进版本库。
- 多个 sessionId 同时存在 → 代表历史多次重置，用户随时可跳回任意一次。

### 8.2 manifest.json 范例

```json
{
  "sessionId": "reset-20260427-103015",
  "createdAt": "2026-04-27T10:30:15Z",
  "closedAt":  "2026-04-27T10:30:42Z",
  "meta": {
    "projectPath": "d:/webDevFrontProject/BS-SKILL-BUDDY",
    "scope": ["all"],
    "keepRouterShell": true,
    "keepExampleViews": true,
    "resetSkillState": false,
    "backupMode": "full",
    "gitStrategy": "commit-first",
    "gitHead": "a1b2c3d"
  },
  "summary": { "deletedFiles": 87, "deletedDirs": 12, "rewrittenFiles": 8, "totalBytes": 1342211 },
  "operations": [
    { "op": "delete",  "path": "src/views/page_1", "isDir": true,
      "step": "3.2", "scope": "bs",
      "snapshotPath": ".skill-backup/reset-20260427-103015/files/src/views/page_1",
      "timestamp": "2026-04-27T10:30:18Z" },
    { "op": "rewrite", "path": "src/store/index.js", "isDir": false,
      "step": "3.7", "scope": "framework",
      "snapshotPath": ".skill-backup/reset-20260427-103015/files/src/store/index.js",
      "sha256": "…", "timestamp": "2026-04-27T10:30:35Z" }
  ]
}
```

### 8.3 三种恢复模式

| 模式 | 命令 | 语义 |
|---|---|---|
| **全量恢复** | `restore.ps1 -all` | 逐条反演 manifest：`delete` 项从 `files/` 拷回；`rewrite` 项用快照覆盖当前文件。完成后工程状态等同于本次 reset 执行前。 |
| **按 scope 恢复** | `restore.ps1 -scope wdp` ｜ 可选值：`bs / wdp / data / assets / framework` | 仅恢复 manifest 中 `scope` 匹配的项（例如只要 3D Mixin 回来，其他保持被清空状态）。 |
| **按路径恢复** | `restore.ps1 -path "src/views/page_1/**"` | 仅恢复 glob 命中的项；支持多个 `-path`。 |

辅助参数：
- `-dryRun`：打印将要恢复的文件清单，不写盘。
- `-list`：输出本快照中所有可恢复条目与 scope 统计，供用户选择。
- `-force`：默认状态下，若目标位置在恢复后会覆盖"用户在清空后又新增的文件"，脚本 **必须**交互式由用户确认；加 `-force` 跳过确认。

### 8.4 脚本行为阐述（AI 生成 `restore.ps1` / `restore.sh` 时须遵守）

必须实现以下逻辑，顺序不得调整：

1. 校验脚本与 `manifest.json` 同在一目录，读取并解析 manifest。
2. 根据 `-all / -scope / -path` 筛出待恢复条目。
3. **倒序**遵行 manifest（先 `rewrite` 后 `delete`的上下游依赖按原则反转；脚本里严格按 `operations.reverse()` 处理）。
4. 每一项：
   - 验证 `snapshotPath` 存在；丢失 → 报错且跳过（不强制中断）。
   - `op=delete`：如目标路径现在还存在（表示用户后来又创建了同名文件），进入互交询问，除非 `-force`。确认后从 `files/` 镜像拷回。
   - `op=rewrite`：直接用快照覆盖目标文件。
5. 输出详细报告：恢复成功 X 项 / 跳过 Y 项 / 冲突 Z 项 / 耗时。
6. **不得**刪除 `.skill-backup/<sessionId>/` 本身——多次恢复/部分恢复场景下快照仍需可用。

### 8.5 多次 reset 与多 sessionId

- 每次唤起本技能都生成独立的 sessionId，不覆盖历史。
- **默认仅保留最近 3 次快照**；超过后 AI 必须在收尾报告中清单出"可清理的旧快照"，交用户决定是否手动删除（严禁自动删，防止误删仅存的那份）。
- 多 sessionId 互相独立。若用户要「跳回两代之前」，只要在对应 `<sessionId>/restore.ps1 -all` 即可。

### 8.6 快照依赖与 Git 的关系

- 快照本身不依赖 Git，**任何**项目都可恢复。
- Git（`branch-snapshot` / `commit-first`）作为第二道保险，定位「用户后来手动调改后又后悔」这类场景。
- 本技能**不**负责调用任何 `git restore` / `git reset`；所有 Git 操作付给用户手动执行，仅输出建议命令。

### 8.7 快照限制与警示

- `.skill-backup/<sessionId>/` 的存在不意味着 "reset 可以随意动手"——阶段 0~2 仍须全走完。
- 恢复**不会**还原 `npm install` 添加的依赖变更（在本技能中本就不动 `package.json`，所以不是问题）。
- 恢复**不会**逆转用户在本技能执行后**手动**对其他文件的修改——这是 Git 的职责。

> **一句话记住**：进口 = 阶段 0。1 错恶的 sessionId 可能造成错误恢复——**每次跳回不同代本前要检查 sessionId 与 meta.json**。

---

> 本技能的座右铭：**只删该删的，重写可重写的，剩下的一根毫毛都不动；动过的每一拼，快照里都走得回。**
