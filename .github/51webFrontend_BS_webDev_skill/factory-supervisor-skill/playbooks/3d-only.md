# Playbook: 3d-only

> 只做 3D 场景接入：在已有页面里加 3D 交互（画路径、加 POI、BIM 弹窗等）。

## 适用场景
- 页面骨架已由 BS 厂搭好
- 只需要加 3D 交互能力

## 涉及厂
- 🌐 wdp-secondary-dev-skill（主力）
- 🔌 data-bindingapi-skill（仅当 3D 弹窗需要展示后端业务数据时）

## 标准任务图
```
[A] 🌐 WDP 阶段-1: MCP 启动自检
[B] 🌐 WDP 阶段A: 调 start_wdp_workflow 拿原生 Demo + 真值 API
[C] 🌐 WDP 阶段B: Mixin 落地（提交改动计划 → 用户确认 → 落地）
[D] 🎩 巡检: wdp-to-bs-mixin-check
[E] (可选) 🔌 数据厂阶段一+二: 业务接口封装与接入
[F] 🎩 总监终检
```

## 必填前置物料
- ✅ MCP 已配置（详见 `remote-client/WDP-API-MCP-Deployment-Guide.md`）
- ✅ 目标页面已存在（由 BS 厂或历史已搭好）
- ✅ 已知的对象类别（Hierarchy / Path / Poi / BIM构件 等）与对象 Id 来源
- ⬜ 业务接口文档（仅 3D 弹窗需要时）

## 巡检触发点
- 节点 [C] 完成 → 跑 [wdp-to-bs-mixin-check](../checks/wdp-to-bs-mixin-check.md)
  - 检查 Mixin 是否修改了 BS 已封装组件的 props 接口
  - 检查是否绕过 `toolCleanupMixin / closeAll / performCommonCleanup` 范式

## 状态机记账
- `task.playbook = "3d-only"`
- `factories.bs.status = "completed"`（前置假设已存在）
- `factories.wdp` 全程激活
- `factories.dataBinding` 视实际情况

## 交付标准
- [ ] WDP 所有 mandatoryCheckpoints passed
- [ ] Mixin 符合 `toolObjs` 显式初始化规范
- [ ] 3D 资源在页面切换时正确清理（无残留）
- [ ] 没有引入与 BS 厂冲突的依赖
