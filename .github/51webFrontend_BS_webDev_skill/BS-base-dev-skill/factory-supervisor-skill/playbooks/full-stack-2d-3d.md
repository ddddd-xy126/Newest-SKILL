# Playbook: full-stack-2d-3d

> 包含 3D 场景的全流程剧本（最复杂的剧本）。

## 适用场景
- 项目同时需要 2D 大屏 + 3D 园区/BIM/GIS 场景 + 接真实接口

## 涉及厂
- 🏗️ BS-base-dev-skill（视觉骨架）
- 🌐 wdp-secondary-dev-skill（3D 场景）
- 🔌 data-bindingapi-skill（数据接入）

## 标准任务图
```
[A] 🏗️ BS step1 布局 4 轮                          ← 必须先行
[B] 🏗️ BS step2 组件封装（含 3D 弹窗内的展示组件） ← 依赖 A
[C] 🏗️ BS step3 面板挂载                            ← 依赖 B
[D] 🌐 WDP 阶段-1: MCP 启动自检                     ← 可独立先做
[E] 🌐 WDP 阶段A: 调 start_wdp_workflow 拿原生 Demo ← 依赖 D
[F] 🌐 WDP 阶段B: Mixin 落地（挂到 page）           ← 依赖 A 与 E
[G] 🔌 数据厂阶段一: API 封装                       ← 可与 A/B/D 并行
[H] 🎩 巡检: bs-to-data-key-check                  ← 依赖 B
[I] 🎩 巡检: wdp-to-bs-mixin-check                 ← 依赖 F
[J] 🔌 数据厂阶段二: 接入 2D 面板 + 3D 弹窗组件     ← 依赖 C/F/G/H.passed
[K] 🎩 总监终检                                      ← 依赖 C/F/J
```

## 必填前置物料
- ✅ UI 设计稿 + 切图
- ✅ 接口文档（含 3D 弹窗用到的业务接口）
- ✅ MCP 已配置：`wdp-knowledge-proxy`（含 `WDP_KNOWLEDGE_TOKEN`、`WDP_SERVER_URL`）
- ✅ Node.js 已安装

## 巡检触发点
| 节点 | 巡检 |
|---|---|
| [B] 完成 | bs-to-data-key-check |
| [F] 完成 | wdp-to-bs-mixin-check |
| [J] 启动前 | 复读 [B] 的 key 巡检结果 |

## 协调规则（关键）
- **WDP 阶段 B 不得修改 BS 已封装组件的 props 接口**——只允许通过 Mixin 注入逻辑
- **3D 弹窗中要展示业务数据时**，弹窗本体由 BS 厂封装，数据由数据厂阶段二注入，WDP 厂只负责"什么时候打开/关闭弹窗 + 传 eid"
- **WDP MCP 检查点不通过**严禁进入阶段 B

## 状态机记账
- `task.playbook = "full-stack-2d-3d"`
- 三厂状态字段全部启用

## 交付标准
- [ ] 三厂各自的自检全部通过
- [ ] 跨厂巡检 bs-to-data-key-check + wdp-to-bs-mixin-check 全 passed
- [ ] WDP 所有 mandatoryCheckpoints 通过
- [ ] 3D 场景与 2D 面板交互闭环（点 BIM 弹窗 → 接口数据 → 展示）
