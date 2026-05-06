# 页面-API 映射关系（示例模板）

> **这是一个示例文件**，展示用户应提供的页面-API 映射关系文档的格式。
> 使用 data-bindingapi-skill 时，请参照此格式创建你自己的映射文件。

## API 接口清单

所有接口定义在 `src/utils/api/xxx.js`，导入格式：

```javascript
import { functionName } from "@/utils/api/xxx";
```

---

## 页面映射

### 示例页面 A — 首页（`src/views/home/index.vue`）

| API 函数 | 用途 | 目标组件 | 状态 |
|---------|------|---------|------|
| `getBaseInfoAPI` | 页面基础数据 | KPI 卡片区域 | ✅ 已接入 |
| `getChartDataAPI` | 图表数据 | ECharts 折线图组件 | ❌ 未接入 |

字段映射（API 返回字段 → 组件数据源，统一用 `key` 定位）：
```
# 标量字段
 totalCount   → cardData.total
 growthRate   → cardData.rate

# 数组字段（项须带 key）
 waterEnvironmentStatus  → statusData[key=water].statusText
 parkGreenArea           → gridData[key=parkGreen].value

# JSON 字符串（需先 JSON.parse）
 parsed["生活服务"]     → threeDimensionalData[key=life].percent
```

> **🔴 key 规范**：数组型数据源统一用 `target[key=xxx].field` 指向每一项，禁止按下标 / 按 label 定位。组件 `data()` 中数组项必须预先补齐英文小驼峰 `key` 字段，详见 SKILL.md。

现有组件：
- `KpiCardGroup` — KPI 卡片组（当前硬编码 4 条数据）
- `TrendChart` — 趋势折线图（当前硬编码模拟数据）

---

### 示例页面 B — 详情页（`src/views/detail/index.vue`）

| API 函数 | 用途 | 目标组件 | 状态 |
|---------|------|---------|------|
| `getDetailAPI` | 详情数据（需传 id 参数） | 详情面板 | ❌ 未接入 |
| `getHistoryAPI` | 历史数据（placeId, timeType） | 折线图 | ❌ 未接入 |
| `getListAPI` | 列表数据 | 表格组件 | ❌ 未接入 |

---

## 编写要求

请在你的映射文件中包含以下内容：

1. **API 接口文件路径** — 指明接口函数定义在哪个文件
2. **页面分组** — 按页面路径列出所属的 API
3. **表格字段**：
   - `API 函数`：导出的函数名
   - `用途`：简要说明接口返回什么数据
   - `目标组件`：数据应绑定到哪个组件
   - `状态`：✅ 已接入 / ❌ 未接入
4. **字段映射**（可选）：API 返回字段名 → 组件中 data 属性名的对应关系
5. **现有组件**（可选）：列出页面中已有的子组件及其当前数据状态

## 注意事项

- 带参数的接口请标注参数名和来源（如"用户选择"、"路由参数"、"默认值"）
- POST 请求请注明需要传 JSON body
- 如果页面尚无子组件，请标注"需新建"
