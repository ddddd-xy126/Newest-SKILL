# Prompt: 调用数据接入厂的标准措辞

> 总监调用 data-bindingapi-skill 时使用的标准注入提示。
>
> 📜 **交付报告格式唯一权威源**：[`../contracts/delivery-schema.md`](../contracts/delivery-schema.md) §2 数据厂报告。下文处示例仅供快查，字段以 schema 为准。

---

## 通用前缀

```
你正在被【工业链总监】调度。
任务上下文（来自 .skill-state.json）：
- taskId: <T-xxx>
- playbook: <full-stack-2d / data-only / batch-mode / ...>
- 目标 page: <page_1_1>
- 工程根: <projectPath>

请严格遵守 data-bindingapi-skill/SKILL.md 所有协议。
完成后返回结构化交付报告：
{
  "phase": "phaseOne | phaseTwo",
  "status": "completed",
  "apiFilePath": "src/utils/api/data.js",
  "functionsCount": 18,
  "bindings": [
    { "componentKey": "...", "apiFunction": "...", "boundFields": [...] }
  ]
}
```

---

## 阶段一注入
```
<通用前缀>

请执行阶段一: API 封装。
- 输入接口文档: <data-bindingapi-skill/user-input/api-user-input.md 路径>
- 输出 API 文件: <src/utils/api/data.js>
- baseURL 更新: <无 / http://...>
- token 更新: <无 / 已提供>

注意: 本项目使用 @/utils/request，响应拦截已解包一层（取 res.result）。
```

---

## 阶段二注入（关键 — 含 key 巡检结果）
```
<通用前缀>

请执行阶段二: 接入页面数据。
- API 文件: <src/utils/api/data.js>
- 映射关系文档: <user-input/page-api-mapping-user-input-example.md>
- 目标页面: <src/views/page_1/page_1_1/index.vue>

🟢 总监已预跑 bs-to-data-key-check，结果: PASSED
   组件 key 字段齐全清单（可直接 find(it=>it.key===...)）:
   · cmp_env_status.statusData → keys: [water, air, soil]
   · cmp_three_dim.threeDimensionalData → keys: [life, prod, eco]
   · ...

请直接进入步骤 5（导入 API + 编写数据获取方法），跳过 SKILL.md 的步骤 4 阻断点（key 已确认）。
完成后回包，总监将更新 state.factories.dataBinding.phaseTwo。
```

---

## 阶段二被阻断的注入（key 巡检失败 → 不调用，先回 BS）
> 若 bs-to-data-key-check 失败，**总监不会**发起阶段二调用。
> 改而调用 BS 修补模式（见 `invoke-bs.md`），修复完成后再重跑巡检 → 重新发起阶段二。
> 给用户的可读指引详见 [`../checks/bs-to-data-key-check.md`](../checks/bs-to-data-key-check.md) "🆘 用户操作指南"段。
