# 页面-API 映射关系

> 请根据实际需求修改本文件，补充字段映射、目标组件、接入状态等信息。
> 格式规范参见 [page-api-mapping-example.md](../references/page-api-mapping-example.md)。

## API 接口清单

所有接口定义在 `src/utils/api/data.js`，导入格式：

```javascript
import { functionName } from "@/utils/api/data";
```

---

## 页面映射

### Page 2 — 智慧生态（`src/views/page_4/page_4_1/index.vue`）

| API 函数                | 用途         | 目标组件                                                 | 状态      |
| ----------------------- | ------------ | -------------------------------------------------------- | --------- |
| `realTimeQueryAPI` | 水质总览 | EnvGauge 水质总览组件        | ❌ 未接入 |
| `realTimeQueryAPI` | 水质管理 | EnvManageGrid 水质管理组件           | ❌ 未接入 |
| `realTimeQueryAPI` | 空气总览 | EnvGauge 空气总览组件                          | ❌ 未接入 |
| `realTimeQueryAPI` | 空气管理 | EnvManageGrid 空气管理组件                              | ❌ 未接入 |
| `realTimeQueryAPI` | 土壤总览 | EnvGauge 土壤总览组件                              | ❌ 未接入 |
| `realTimeQueryAPI` | 土壤管理 | EnvManageGrid 土壤管理组件 | ❌ 未接入 |

现有组件：

- `EnvGauge` — 环境仪表盘（props: `value` 0-100 数值, `label` 等级标签文字）
- `EnvManageGrid` — 环境管理网格（props: `gridData` 数组，每项含 `icon`/`label`/`value`）

字段映射：

```
# API: realTimeQueryAPI({ pointType: "空气监测站" | "微型水质监测站" | "土壤传感器" })
# 返回 result 为监测站数组，只取 result[0]（第一个站点对象）接入面板
# result[0] 含 pointId, name, airQuality, pointstates, realTimeList[]
# realTimeList 每项: { code, name, value, unit }

# ========== 空气总览（EnvGauge key=airOverview） ==========
# 传 pointType="空气监测站" 调用 realTimeQueryAPI，取 result[0]

result[0].realTimeList[code=kqzlzs].value  → rightPanels[key=airOverview].props.value
result[0].airQuality                        → rightPanels[key=airOverview].props.label（拼接"空气等级"前缀）

# ========== 空气管理（EnvManageGrid key=airManage） ==========
result[0].realTimeList[code=a34004].value   → gridData[label=PM2.5].value    （单位 μg/m³）
result[0].realTimeList[code=a34002].value   → gridData[label=PM10].value     （单位 μg/m³）
result[0].realTimeList[code=aqi].value      → gridData[label=AQI].value      （无单位）
result[0].realTimeList[code=a19705].value   → gridData[label=O₃].value       （单位 μg/m³）

# ========== 水质总览（EnvGauge key=waterOverview） ==========
# 传 pointType="微型水质监测站" 调用 realTimeQueryAPI，取 result[0]
# wqB 为水质等级数值（如 "6"=劣Ⅴ类, "4"=Ⅳ类, "3"=Ⅲ类, "2"=Ⅱ类, "1"=Ⅰ类）
# waterLevel 为水质等级文字（如 "劣Ⅴ类水"、"Ⅳ类水"）
result[0].wqB                               → rightPanels[key=waterOverview].props.value（需映射为 0-100 分值）
result[0].waterLevel                        → rightPanels[key=waterOverview].props.label（拼接"水质等级"前缀）

# ========== 水质管理（EnvManageGrid key=waterManage） ==========
# 传 pointType="微型水质监测站" 调用 realTimeQueryAPI，取 result[0].realTimeList
result[0].realTimeList[code=w01009].value   → gridData[label=DO].value         （溶解氧，单位 mg/L）
result[0].realTimeList[code=w21011].value   → gridData[label=TP].value         （总磷，单位 mg/L）
result[0].realTimeList[code=w21003].value   → gridData[label=NH₃-N].value      （氨氮，单位 mg/L）
result[0].realTimeList[code=w01019].value   → gridData[label=CODMn].value      （高锰酸盐指数，单位 mg/L）

# ========== 土壤总览（EnvGauge key=soilOverview） ==========
# 传 pointType="土壤传感器" 调用 realTimeQueryAPI，取 result[0]
# 土壤无独立综合等级字段，可用湿度(a010021)作为 0-100 仪表盘数值
result[0].realTimeList[code=a010021].value  → rightPanels[key=soilOverview].props.value（湿度%，直接作为 0-100 数值）
"土壤状况适宜"                               → rightPanels[key=soilOverview].props.label（可根据 PH/湿度判定文字）

# ========== 土壤管理（EnvManageGrid key=soilManage） ==========
# 传 pointType="土壤传感器" 调用 realTimeQueryAPI，取 result[0].realTimeList
result[0].realTimeList[code=a010021].value  → gridData[label=含水率].value      （湿度，单位 %）
result[0].realTimeList[code=w01001].value   → gridData[label=PH值].value        （PH，无单位）
result[0].realTimeList[code=w010101].value  → gridData[label=土壤温度].value     （温度，单位 ℃）
result[0].realTimeList[code=w010141].value  → gridData[label=肥力状况].value     （电导率 uS/cm，可映射为肥力等级文字）
```

> 说明：
> - `realTimeQueryAPI` 通过不同 `pointType` 参数区分监测站类型（空气/水质/土壤）
> - 返回数组含多个站点，**统一只取 result[0]（第一个站点）**接入面板
> - `realTimeList` 中通过 `code` 字段定位指标项，**不按数组下标**
> - 空气站已知 code：`a34004`(PM2.5)、`a34002`(PM10)、`a21004`(NO₂)、`a01008`(风向)、`a01007`(风速)、`a19705`(臭氧)、`aqi`(AQI)、`kqzlzs`(空气质量指数)、`sywrw`(首要污染物)、`wrain`(雨量)
> - 水质站已知 code：`w01001`(pH)、`w01009`(溶解氧)、`w01010`(温度)、`w01012`(浊度)、`w01014`(电导率)、`w21011`(总磷)、`w21003`(氨氮)、`w01019`(高锰酸盐指数)
> - 土壤站已知 code：`w010101`(温度)、`a010021`(湿度)、`w010141`(电导率)、`w01001`(PH)、`h001`(氮)、`h002`(磷)、`h003`(钾)


--- 
## 注意事项

无
