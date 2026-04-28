# Playbook: data-only

> 只做数据接入：项目已有页面骨架，只需要把假数据替换成真接口。

## 适用场景
- 页面 .vue 已存在
- 只需要封装 API 或 / 和 把 data() 替换成接口数据

## 涉及厂
- 🔌 data-bindingapi-skill（唯一）

## 标准任务图
```
[A] 🎩 巡检: 目标页 BS 资产是否存在 + 数组项 key 状态
[B] 🔌 数据厂阶段一: API 封装（如未封装）
[C] 🔌 数据厂阶段二: 接入页面                  ← 依赖 A.passed/B
[D] 🎩 总监终检
```

## 必填前置物料
- ✅ 已有页面文件路径（如 `src/views/page_1/page_1_1/index.vue`）
- ✅ 接口文档（阶段一）或 已存在的 `src/utils/api/xxx.js`（仅阶段二）
- ✅ 页面-API 映射表（阶段二）

## 巡检触发点（唯一）
- 节点 [C] 启动前 → 跑 [bs-to-data-key-check](../checks/bs-to-data-key-check.md)
  - **passed=false 时**：
    - 列出缺 key 的数组 + 建议命名
    - 询问用户：① 自己回 BS 厂改 ② 授权总监按建议补 key（仅限补字段，不动业务结构）
    - **严禁**直接绕过

## 状态机记账
- `task.playbook = "data-only"`
- `factories.bs.status = "completed"`（视为已完工的上游）
- `factories.wdp.status = "not-applicable"`
- `factories.dataBinding` 全程激活

## 交付标准
- [ ] 阶段二所有映射 binding 已落地
- [ ] 所有展示字段保留兜底值
- [ ] 没有用 `arr[index]` 或 `arr.find(label===...)` 的反模式
- [ ] 没有改 props 接口
