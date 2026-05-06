# Cross-Check: wdp-to-bs-mixin-check

> WDP 厂 Mixin 落地后的污染检查。确保 3D 交互 Mixin **不破坏** BS 厂封装的组件契约。

---

## 触发时机

- WDP 阶段 B 完成（Mixin 文件落地后）
- 用户手动触发"巡检 3D 改动"

---

## 检查规则

### Rule 1：不得修改 BS 已封装组件的 props 接口
- 扫描 Mixin 中 `this.$refs.xxx` / 子组件调用
- 与 BS 厂 `pages[].components[]` 中记录的 props 签名对比
- 发现新增 / 删除 / 改名 prop 即失败

### Rule 2：必须遵循 WDP 清理范式
- Mixin 必须使用 `toolCleanupMixin`（或等价封装）
- 必须显式初始化 `toolObjs`
- `closeAll` + `performCommonCleanup` 必须存在且在路由切换时被调用

### Rule 3：依赖隔离
- Mixin 不得 import BS 厂私有组件（`@/views/page_x/components/*`）
- 仅允许通过 `props` 或 `$emit` 与 BS 组件通信

### Rule 4：3D 资源不残留
- 检查 `addWINDOWS` 弹窗、Particle、Effects 等是否有对应清理逻辑
- 检查事件监听是否在 destroy 时移除

---

## 失败输出格式

```
🟠 跨厂巡检告警：wdp-to-bs-mixin-check
─────────────────────────────────────
任务: T-20260427-001
Mixin: src/views/page_1/page_1_1/mixins/bimRoomMixin.js

发现问题（2 项）：

1. [BLOCKING] 修改了 BS 组件 props
   - 组件: BimDetailPanel
   - 原 props: { value: String, label: String }
   - Mixin 调用: this.$refs.detail.setData({ extraField })
   - 影响: BS 厂封装契约被破坏，数据厂阶段二可能失效
   - 建议: 通过 $emit('update', payload) 或在 BS 厂扩展 props

2. [WARNING] 缺少 closeAll 清理
   - Mixin 未调用 performCommonCleanup
   - 风险: 路由切换时 3D 弹窗残留
   - 建议: 在 beforeDestroy 中补全

阻断点: 项 1 创建 blocker，禁止任务终检通过。
```

---

## 后置动作

1. 写入 `checkpoints[]`
2. 失败时：
   - BLOCKING 级 → 创建 `severity: blocking` blocker
   - WARNING 级 → 创建 `severity: warning` blocker（不阻断流水线，但终检报告中列出）
3. 追加 history 事件
