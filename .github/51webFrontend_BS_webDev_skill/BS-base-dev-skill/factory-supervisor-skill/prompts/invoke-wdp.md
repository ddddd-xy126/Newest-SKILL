# Prompt: 调用 WDP 厂的标准措辞

> 总监调用 wdp-secondary-dev-skill 时使用的标准注入提示。

---

## 通用前缀

```
你正在被【工业链总监】调度。
任务上下文（来自 .skill-state.json）：
- taskId: <T-xxx>
- playbook: <full-stack-2d-3d / 3d-only>
- 目标 page: <page_1_1>
- 工程根 projectPath: <绝对路径>
- MCP 状态: <ready / not-ready>
- 已知 BS 资产（不允许修改其 props）:
  · BimDetailPanel @ <path>，props: { value, label }
  · ...

请严格遵守 wdp-secondary-dev-skill/SKILL.md 所有协议（阶段 -1 MCP 自检 / 阶段 A MCP 真值产出 / 阶段 B 用户确认后落地）。
完成后必须返回结构化交付报告：
{
  "phase": "B",
  "status": "completed",
  "mixinFile": "src/views/.../mixins/xxxMixin.js",
  "addedProps": [],
  "modifiedBSComponents": [],
  "mandatoryCheckpoints": [
    { "name": "...", "passed": true }
  ]
}
```

---

## 阶段 -1 自检注入
```
<通用前缀>

请先执行阶段 -1: MCP 启动自检。
- 已知 IDE: <Trae / Cursor / ...>
- 已知 mcp-proxy-client.js 路径: <绝对路径>
- 已知 WDP_KNOWLEDGE_TOKEN: <用户已配置 / 未配置>

如自检失败，按 SKILL.md 的 Q1~Q5 引导用户启动后再上报。
```

---

## 阶段 A 注入
```
<通用前缀>

请执行阶段 A: 调用 start_wdp_workflow。
- user_requirement: <从 task 抽取，如"BIM 房间点击弹窗">
- projectPath: <绝对路径>
- 对象类别: <Hierarchy / Path / Poi / Window / BIM构件 / 暂无>
- 对象 Id: <eid / nodeId / 暂无>

依次完成所有 mandatoryCheckpoints。任一 isError=true 立即停止并上报。
```

---

## 阶段 B 注入
```
<通用前缀>

请执行阶段 B: 项目工程化落地。
- 阶段 A 产出的原生 Demo: <路径或贴出>
- 目标挂载页: <page_1_1>
- 🔴 禁止修改 BS 组件 props（清单见前缀）

落地前必须先输出 /spec 计划报告（目标页面、触发机制、改动文件清单）等用户确认。
完成后总监将立即跑 wdp-to-bs-mixin-check 巡检。
```
