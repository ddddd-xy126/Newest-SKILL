# WDP MCP 用户输入范式手册

简洁高效的输入范式，快速启动 WDP 开发工作流。

---

## 对象类别和对象 Id

### 常见对象类别

- `Hierarchy`：场景里的普通模型或层级实体
- `Path`：路径对象，用来画路线、轨迹、巡检路线
- `Poi`：点位标注
- `Window`：信息窗、弹窗、面板挂点
- `Particle`：粒子对象，比如烟雾、火焰、喷泉
- `Effects`：特效对象，偏视觉效果，不是普通模型
- `BIM构件`：BIM 单体、构件、楼层、房间、专业模型对象
- `GIS要素`：GIS 图层里的点线面要素

### 常见对象 Id

- `eid`：实体 Id（来自创建返回值、实体查询、屏幕拾取）
- `entityName`：实体名称（来自场景已有模型名、创建时指定）
- `customId`：自定义 Id（来自项目约定）
- `seedId`：平台模型编号（来自平台资源发布信息）
- `nodeId`：BIM 构件 Id（来自 BIM 查询、点击回调）
- `featureId`：GIS 要素 Id（来自 GIS 点击事件）

### 无对象 Id 时

```
当前还没有准确对象 Id。
请先帮我判断应该通过什么方式获取【你需要的对象，包括已知的id信息】：
1. 创建返回值
2. 屏幕拾取
3. 事件回调
4. 实体查询
5. BIM 构件查询
6. GIS 要素点击或查询
```

### 清理链路提示

如果需求涉及**创建对象、注册事件、启动动画**等操作，**退出页面或卸载时需要对应的清理动作**（如删除对象、解绑事件、停止动画）。请在需求描述中说明是否需要自动清理，或提供手动清理方式。

---

## 场景 1：加载知识库

**用途**：新对话开始，了解 WDP 知识库机制，指定当前任务的缓存路径

**输入范式**：
```
调用start_wdp_workflow：了解WDP知识库机制

projectPath: 【你的工程路径】
```

**示例**：
```
调用start_wdp_workflow：了解WDP知识库机制

projectPath: D:/Projects/智慧园区
```

**说明**：
- `projectPath` 是**必需参数**，用于确定本地缓存位置
- 在该目录下自动创建 `.wdp-cache/` 文件夹
- 不同工程使用不同缓存，避免混淆
- **如不填写会报错并提示**

**错误提示**：
```
❌ 错误：缺少 projectPath 参数

【必需】请在输入中指定工程路径，用于创建本地缓存。

示例：
调用start_wdp_workflow：了解WDP知识库机制

projectPath: D:/Projects/你的工程目录
```

---

## 场景 2：需求大纲解析

**用途**：有需求文档，产出结构化分析

**输入范式**：
```
调用start_wdp_workflow：解析【需求文件路径】

在projectPath: 【你的工程路径】下生成需求分析文档
```

**示例**：
```
调用start_wdp_workflow：解析D:/Projects/智慧园区/需求文档.md

在projectPath: 【D:/Projects/智慧园区】下生成需求分析文档 
```

---

## 场景 3：单个需求描述解析

**用途**：只有自然语言需求，整理成结构化说明

**输入范式**：
```
调用start_wdp_workflow：【需求描述】

projectPath: 【你的工程路径】
对象类别：【Hierarchy/Path/Poi/Window/Particle/Effects/BIM构件/GIS要素/暂无】
对象 Id：【eid/entityName/customId/seedId/nodeId/featureId/暂无】
坐标参数：【有则填，无则写"暂无"】
```

**示例**：
```
调用start_wdp_workflow：实现BIM模型高亮和房间标注功能

projectPath: D:/Projects/智慧园区
对象类别：BIM构件
对象 Id：暂无
坐标参数：暂无
```

---

## 场景 4：开始编码

**用途**：需求已确认，准备写代码

**输入范式**：
```
调用start_wdp_workflow：开始编码【一句话描述目标】

projectPath: 【你的工程路径】
对象类别：【Hierarchy/Path/Poi/Window/Particle/Effects/BIM构件/GIS要素/不涉及】
对象 Id：【eid/entityName/customId/seedId/nodeId/featureId/不涉及】
```

**示例**：
```
调用start_wdp_workflow：开始编码实现BIM模型高亮功能

projectPath: D:/Projects/智慧园区
对象类别：BIM构件
对象 Id：nodeId（通过BIM.Query获取）
```

**说明**：
- 调用 `start_wdp_workflow` 启动编码工作流
- 系统会自动完成所有必要检查（读取skill、验证路由、验证官方文档、验证对象Id等）
- 检查通过后，会告知计划修改的文件和验证方式，确认后开始编码

**复杂需求提示**：
如果需求涉及多个功能联动（如车辆巡检、跟拍、多系统联动），AI 会自动进行意图编排和任务拆解，可能需要多轮对话完成。请按 AI 提示逐步提供信息。

---

## 场景 5：问题修复

**用途**：报错、异常、效果不对

**输入范式**：
```
调用start_wdp_workflow排查：【问题描述】

projectPath: 【你的工程路径】
对象类别：【Hierarchy/Path/Poi/Window/Particle/Effects/BIM构件/GIS要素/不涉及】
对象 Id：【eid/entityName/customId/seedId/nodeId/featureId/不涉及】
```

**示例**：
```
调用start_wdp_workflow排查：BIM高亮不生效，点击模型无反应

projectPath: D:/Projects/智慧园区
对象类别：BIM构件
对象 Id：nodeId
```

---

## 场景 6：续接进度

**用途**：长任务中断，查看当前状态

**输入范式**：
```
调用enforce_context_memory_check，然后继续
```

或简化为：
```
检查状态后继续
```

---

## 场景 7：回到主线

**用途**：处理完临时需求后，回到主线继续开发

**输入范式**：
```
调用start_wdp_workflow：回到主线【一句话描述】

projectPath: 【你的工程路径】
对象类别：【Hierarchy/Path/Poi/Window/Particle/Effects/BIM构件/GIS要素/不涉及】
对象 Id：【eid/entityName/customId/seedId/nodeId/featureId/不涉及】
```

**示例**：
```
调用start_wdp_workflow：回到主线实现GIS地图底图加载

projectPath: D:/Projects/智慧园区
对象类别：GIS要素
对象 Id：不涉及
```

**说明**：
- 调用 `start_wdp_workflow` 回到主线工作流
- 系统会自动恢复之前的上下文状态

---

## 速查表

| 场景 | 输入范式 |
|------|---------|
| 加载知识库 | `调用start_wdp_workflow：了解WDP知识库机制` |
| 需求大纲解析 | `调用start_wdp_workflow：解析【文件路径】` |
| 单个需求解析 | `调用start_wdp_workflow：【需求描述】` |
| 开始编码 | `调用start_wdp_workflow：开始编码【目标】` |
| 问题修复 | `调用start_wdp_workflow排查：【问题描述】` |
| 续接进度 | `检查状态后继续` |
| 回到主线 | `调用start_wdp_workflow：回到主线【目标】` |

---

## 参数说明

### projectPath（工程路径）
- 用于确定本地缓存位置
- 在该目录下自动创建 `.wdp-cache/` 文件夹
- 不同工程使用不同缓存，避免混淆
- 示例：`projectPath: D:/Projects/智慧园区`

### 对象类别
- `Hierarchy`：普通模型或层级实体
- `Path`：路径对象
- `Poi`：点位标注
- `Window`：信息窗、弹窗
- `Particle`：粒子对象
- `Effects`：特效对象
- `BIM构件`：BIM 单体、构件、楼层、房间
- `GIS要素`：GIS 图层里的点线面要素
- `不涉及`：不涉及对象操作

### 对象 Id
- `eid`：实体 Id
- `entityName`：实体名称
- `customId`：自定义 Id
- `seedId`：平台模型编号
- `nodeId`：BIM 构件 Id
- `featureId`：GIS 要素 Id
- `不涉及`：不涉及对象操作
- `暂无`：还没有准确对象 Id

---

**版本**：WDP MCP 1.0.0
