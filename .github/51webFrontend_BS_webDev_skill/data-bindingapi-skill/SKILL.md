---
name: data-bindingapi-skill
description: 两阶段数据接入技能。阶段一：解析用户提供的 Markdown 接口文档，批量生成符合项目规范的 Axios API 封装函数；阶段二：将已封装的 API 接口接入到页面视图组件中，替换硬编码数据为动态接口数据。适用场景：(1) 用户提供后端接口文档，需要批量生成 API 封装代码；(2) API 封装完成后，需要在页面组件中导入并调用接口、将返回数据绑定到 UI 组件上。支持单独执行某一阶段，也支持两阶段连续执行。
---

# Data BindingAPI Skill

两阶段数据接入技能：**阶段一** 批量封装 API 接口函数 → **阶段二** 将 API 数据接入页面组件。

---

## 🔗 上下游契约（与 BS / WDP 两厂的对接边界）

本 skill 在工业链中处于**下游收尾工序**，负责把"假数据驱动的页面"变成"真数据驱动的可上线大屏"。在开始任何阶段前，必须确认上游产物满足以下契约：

### 上游 = `BS-base-dev-skill`（视觉骨架厂）
- ✅ 产物为 vue2 选项式 API、`@/utils/request` axios 封装、`src/types/` ECharts 工厂函数
- ✅ **凡 `list` / `normal` 类组件，`data()` 中数组项必须已埋好英文小驼峰 `key` 字段**（详见 BS 厂 `knowledge/component-standards.md` 第 0 节）
- ✅ 所有展示字段已带兜底值（`"--"` / `0` / `[]`）
- ✅ BS 厂 step2（面板还原）完成后，总监会立即跑 `bs-to-data-key-check` 巡检
- ❌ 若上游缺 `key`，本 skill 阶段二 `key` 阻断点会暂停流程，要求用户回 BS 厂补齐

### 上游 = `wdp-secondary-dev-skill`（3D 场景厂）
- 仅当 3D 场景中需要叠加业务后端数据时（如点击 BIM 房间弹窗展示传感器历史）才介入
- WDP 引擎自身的实体 ID（`eid` / `nodeId` / `featureId`）**不属于本 skill 的范畴**，不要去封装它们
- 本 skill 仅负责"业务后端 HTTP 接口"那一层

### 下游 = 项目可上线
- 本 skill 阶段二完成后即交付，不再做样式调整、不再改 props 接口

### 🔗 向总监回报的交付契约
本 skill 每个阶段（phaseOne / phaseTwo）完成后，必须在最后一段输出标准化交付报告 JSON，**格式严格以** [`factory-supervisor-skill/contracts/delivery-schema.md`](../factory-supervisor-skill/contracts/delivery-schema.md) §2 数据厂报告为准（`factory="dataBinding"`）。key 缺失被阻断时必须返回 `status="blocked"` + `blockers[]`（错误码命名空间 `D-xxx`）。

---

## 第一步：确认用户意图和必要信息

根据用户的描述判断需要执行哪个阶段（或两个阶段连续执行）：

| 用户意图 | 执行阶段 | 需要的信息 |
|---------|---------|-----------|
| "帮我封装这些接口" | 仅阶段一 | 接口文档 |
| "帮我把数据接入页面" | 仅阶段二 | API 文件路径 + 映射文件 + 目标页面 |
| "帮我封装接口并接入页面" | 阶段一 → 阶段二 | 接口文档 + 映射文件 + 目标页面 |

### 输入文件规则

- **阶段一**：优先读取 [api-user-input.md](user-input/api-user-input.md)，如果文件存在且非空，直接作为接口文档输入，不再询问用户
- **阶段二**：优先读取 [page-api-mapping-user-input-example.md](user-input/page-api-mapping-user-input-example.md)，如果文件存在且非空，直接作为映射关系输入
- **两阶段衔接**：阶段一完成后需暂停，向用户确认生成结果无误后，再执行阶段二

如果 user-input 文件不存在或为空，使用以下提问：

> 请提供以下信息：
>
> **如果需要封装 API（阶段一）**：
> 1. 后端接口文档（Markdown 格式，参见 [api-example.md](references/api-example.md)）
> 2. 生成的 API 文件路径（如 `src/utils/api/data.js`）
> 3. （可选）baseURL 或 token 更新
>
> **如果需要接入页面数据（阶段二）**：
> 1. 已封装的 API 接口文件路径（如 `src/utils/api/data.js`）
> 2. 页面-API 映射关系文件（参见 [page-api-mapping-example.md](references/page-api-mapping-example.md)）
> 3. 需要接入数据的目标页面

---

# 阶段一：批量封装 API 接口

解析用户提供的 Markdown 接口文档，批量生成符合项目规范的 Axios API 函数。

## 规范

- **导入模块**：必须从 `@/utils/request` 导入封装的 `request` 实例
- **函数命名**：基于接口英文名称或 URL 路径驼峰命名，以 `API` 结尾（如 `getUserInfoAPI`）；Mock 接口加下划线前缀（如 `_getUserInfoAPI`）
- **方法参数**：
  - `GET` / `DELETE`：使用 `params` 传递 URL Query 参数
  - `POST` / `PUT`：使用 `data` 传递 Request Body 参数
  - 支持设置 Headers（如 JSON 体需要 `Content-Type: application/json`）
- **返回格式**：`export function` 导出，直接返回 Axios Promise
- **注释**：每个函数上方添加 `//` 注释说明用途和参数

## API 生成模板

具体模板见 [api-patterns.md](references/api-patterns.md)，包含以下类型：
- 默认 GET 请求（Query 参数）
- POST 请求（JSON Body）
- FormData POST/PUT 请求
- 路径传参（Path Variables）
- Mock 接口

## 环境变量和 Token 更新

如果用户提供了 `token` 或 `baseURL`：
- **Token**：检查 `src/utils/api/test.js` 或请求拦截文件，更新为新 token
- **baseURL**：检查 `public/config.json` 或 `.env` 文件，更新 API 地址

## 响应数据示例约束

- 用户必须提供**至少一个接口的实际响应 JSON 数据**
- 如果未提供，主动提醒用户补充
- 响应示例用于确定响应体层级结构和字段名称
- 在生成的代码注释中列出关键字段信息

## 输入示例

用户应提供的 Markdown 接口文档格式见 [api-example.md](references/api-example.md)。

## 阶段一工作流程

1. **解析接口文档** — 提取接口路径、方法、参数、描述
2. **按模块分组** — 根据文档中的模块划分添加注释分隔符
3. **生成 API 代码** — 套用 api-patterns.md 模板生成函数
4. **写入目标文件** — 输出到用户指定的 API 文件路径
5. **更新环境配置** — 如需更新 token/baseURL，同步修改配置文件

---

# 阶段二：接入页面数据

将阶段一封装好的（或已有的）API 接口接入到页面组件，替换硬编码数据为动态接口数据。

## 前置条件

- API 接口文件已存在（由阶段一生成或已有）
- 用户提供页面-API 映射关系文件（格式见 [page-api-mapping-example.md](references/page-api-mapping-example.md)）
- **组件 `data()` 中所有被数据绑定的数组项必须带有稳定的 `key` 字段**（见下文「`key` 规范」）

## `key` 规范（🔴 强制约定）

批量数据接入时，**所有数组型数据源（`statusData` / `gridData` / `cyData` / `progressData` / `threeDimensionalData` 等）的每一项都必须携带一个稳定的 `key` 字段**，作为 API 字段映射的唯一锚点。

### 为什么必须用 key

- ❌ 按**下标**映射：数组顺序调整会错位，新增/删除项破坏映射
- ❌ 按**中文 label / name**映射：UI 文案变更（如"酒店入住率"→"酒店入住"）直接断链
- ✅ 按 `key` 映射：key 是稳定的英文标识符，与 UI 文案、数组顺序解耦

### key 命名规则

- 英文小驼峰（camelCase），仅字母数字，避免中文/特殊符号
- 同一数组内唯一，语义化（如 `hotelRate`、`parkGreen`、`water`）
- 与 API 字段**不需要**同名（映射关系在 md 文档里显式声明即可）

### 映射书写标准

字段映射统一写为 `apiField → target[key=xxx].field`，所有页面、所有数组一致：

```
# 示例：生态核心亮点
waterEnvironmentStatus     → statusData[key=water].statusText
parkGreenArea              → gridData[key=parkGreen].value

# 示例：JSON 字符串字段需先 JSON.parse 后再按中文键取值
parsed["生活服务"]         → threeDimensionalData[key=life].percent
```

### 执行流程约束

阶段二开始前，按以下顺序检查：

1. **扫描目标页面 `data()` 中的数组**，列出所有被 API 映射覆盖、但项中缺 `key` 的数组。
2. **🔴 若存在缺失 → 强制阻断，向用户请示**：
   - **严禁**静默自动补 key、严禁猜测 key 命名。
   - 必须输出一份缺失清单，形如：

     ```
     [需要补齐 key 的数组]
     - src/views/page_1/page_1_1/index.vue
       · rightPanels[0].props.threeDimensionalData  （3 项缺 key）
         建议命名：life / prod / eco
       · rightPanels[2].props.statusData             （3 项缺 key）
         建议命名：water / air / soil
     ```
   - 每个缺失数组给出「建议 key 命名」供用户采纳或修改。
   - **等待用户回复**：确认采纳建议 / 提供自定义 key / 明确授权由 AI 按建议补齐。用户未回复前，**不得修改源码、不得开始绑定**。
3. **用户确认后**：按最终 key 补齐 `data()` 中的数组项（保持 UI、props 接口不变），再进行数据绑定。
4. **生成数据绑定代码时**：统一使用 `arr.find(it => it.key === "xxx")` 定位目标项，禁止用 `arr[index]` 或 `arr.find(it => it.label === ...)`。

示例绑定代码：

```javascript
async fetchData() {
  try {
    const res = await getXxxAPI();
    const data = res.result || {};
    const setByKey = (arr, key, field, val) => {
      const item = arr.find((it) => it.key === key);
      if (item && val !== undefined && val !== null) item[field] = val;
    };
    setByKey(this.statusData, "water", "statusText", data.waterEnvironmentStatus);
    setByKey(this.statusData, "air",   "statusText", data.airEnvironmentStatus);
    setByKey(this.gridData,   "parkGreen", "value", data.parkGreenArea);
  } catch (err) {
    console.error("获取数据失败:", err);
  }
}
```

## 阶段二工作流程

1. **读取 API 文件** — 解析所有导出的接口函数名称、请求路径、方法和参数
2. **读取映射关系文件** — 确认接口与页面/组件的对应关系
3. **分析目标组件现有数据结构** — 读取页面组件 `data()` 中的硬编码数据
4. **🔴 `key` 字段预检查（阻断点）** — 任何被 API 绑定的数组，若项中缺 `key`，**必须先输出缺失清单 + 建议命名并等待用户确认**，严禁静默补齐后直接绑定（见上方 `key` 规范）
5. **导入 API 并编写数据获取方法** — 按接入模式绑定
6. **处理字段映射** — API 返回字段名 → `target[key=xxx].field`，统一用 `find(it => it.key === ...)` 定位
7. **添加加载状态和错误兑底**

## 接入模式

### 模式 A：直接赋值（简单数据卡片）

适用于头部卡片、基础统计面板等 KPI 展示场景。

```javascript
import { getXxxAPI } from "@/utils/api/xxx";

export default {
  data() {
    return {
      cardValue: "--",  // 默认的兜底占位值
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const res = await getXxxAPI();
        const data = res.result || {};
        this.cardValue = data.fieldName ?? "--";
      } catch (err) {
        console.error("获取数据失败:", err);
      }
    },
  },
};
```

### 模式 B：字段映射（多卡片批量填充）

适用于多字段配置驱动的卡片列表。

```javascript
async fetchData() {
  try {
    const res = await getXxxAPI();
    const data = res.result || {};
    const fieldMap = {
      localKey1: "apiFieldName1",
      localKey2: "apiFieldName2",
    };
    this.cards.forEach((card) => {
      const field = fieldMap[card.key];
      if (field && data[field] !== undefined) {
        card.value = String(data[field]);
      }
    });
  } catch (err) {
    console.error("获取数据失败:", err);
  }
},
```

### 模式 C：列表/图表数据绑定

适用于 ECharts 图表、表格、列表渲染。

```javascript
async fetchChartData() {
  try {
    const res = await getXxxAPI();
    const list = res.result?.dataList || [];
    // 转换为图表所需格式
    this.chartOption.series[0].data = list.map(item => ({
      name: item.name,
      value: item.value,
    }));
  } catch (err) {
    console.error("获取图表数据失败:", err);
  }
},
```

### 模式 D：带路径参数的 API 调用

适用于有动态参数（placeId、year 等）的接口。

```javascript
async fetchDetail(placeId) {
  try {
    const res = await getXxxAPI(placeId);
    const data = res.result || {};
    this.detailData = data;
  } catch (err) {
    console.error("获取详情失败:", err);
  }
},
```

## 响应数据结构约定

本项目 API 响应统一格式：

```json
{
  "success": true,
  "result": { ... },
  "message": ""
}
```

取数据时统一用 `res.result`，不要用 `res.data.result`（因为 Axios 拦截器已解包一层）。

## 关键约束

- **兜底值**：所有展示字段必须有默认值（`"--"` 或 `0` 或 `[]`），防止接口异常时 UI 空白
- **错误静默**：`catch` 中仅 `console.error`，不弹窗不中断，保证页面可用
- **不修改 API 文件**：阶段二只负责「调用」接口，不创建或修改 API 接口文件
- **保持组件 props 接口不变**：替换 data 数据源，不改变子组件的 props 结构
- **图表配置工厂函数**：ECharts 配置从 `src/types/` 导入工厂函数获取新对象，避免引用污染

---

## 参考文件

| 文件 | 用途 |
|------|------|
| [api-patterns.md](references/api-patterns.md) | 阶段一：API 封装代码模板 |
| [api-example.md](references/api-example.md) | 阶段一：用户输入的接口文档示例格式 |
| [api-user-input.md](user-input/api-user-input.md) | 阶段一：当前项目的接口文档（用户填写） |
| [page-api-mapping-example.md](references/page-api-mapping-example.md) | 阶段二：页面-API 映射关系文件格式模板 |
| [page-api-mapping-user-input-example.md](user-input/page-api-mapping-user-input-example.md) | 阶段二：当前项目的映射关系（用户填写） |
