---
name: "wdp-interaction"
description: "Handles WDP 3D scene interactions, API calls (camera, entity, custom), and enforces project-specific mixin patterns. Invoke when user asks to add/modify 3D features, manage scene states (roaming, weather), or use 51WORLD WDP APIs."
---

# WDP 场景交互

## 描述
本 Skill 旨在统一项目中的 WDP (Web 3D Platform) 场景交互开发规范，确保代码结构一致、资源清理彻底、API 调用标准。它涵盖了目录架构、Mixin 编写范式、全局清理逻辑以及底层 API 的封装与扩展规则。

## 使用场景
*   当用户要求实现新的 3D 场景交互功能（如添加 POI、相机漫游、弹窗等）时。
*   当用户询问如何调用特定的 51WORLD WDP API 时。
*   当需要创建或重构涉及 3D 交互的 Vue 组件/Mixin 时。
*   当用户遇到场景资源未清理、状态混乱等问题需要排查时。
*   当需要查询项目已封装的 WDP API 接口及参数时。

## 指令

### 步骤 1：强制环境澄清与目录定位 (MANDATORY Q&A)
**在进行任何实际的文件创建或修改之前，你必须强制向用户提问以澄清前端接入点，绝对禁止自行臆想并创建测试目录！**
*   **必问问题 1 (目标位置)**：请问这个功能需要注入到哪个具体的 Vue 页面路径下？（例如：`src/views/xxx/mixins/wdpapi.js`）
*   **必问问题 2 (触发机制)**：请问这个功能的触发条件是什么？（提示开发者：除了常规的按钮点击、生命周期 `mounted` 之外，您也可以输入更特殊、复杂的触发逻辑，例如 `watch` 数据监听、Vuex 状态变化、总入口文件全局触发、路由守卫等，请直接告诉我您的具体业务要求）
*   **必问问题 3 (确认操作)**：向用户输出详细的改动计划（Plan），**等待用户回复“确认/同意”后，才能使用工具去修改或创建文件。**

在得到用户明确答复后，再按照以下规则确认代码存放位置：
*   **项目架构查询**：如果不确定项目结构，请先调用 `project-architecture` Skill 获取详细信息。
*   **3D 弹窗开发**：如果涉及 3D 场景中的弹窗（如点击 POI 后显示的详情框），请**务必查阅** `wdp-window-dev` Skill，获取关于弹窗类型 (`type1`/`type2`/`type3`)、背景样式 (`bg1`/`bg2`/`bg3`) 以及传参规范的详细指导。
*   **页面布局**：主要交互入口通常在 `src/views/page_x/page_x_x/index.vue`。
    *   **侧边栏 (aside-left-tools)**：对应 `sideBarLeft` 组件，通过 `sideBarListData` 配置按钮（如 AI 机器人、视频周界等）。
    *   **底部栏 (footer-tool)**：对应 `bottomBar` 组件，通过 `footerToolsData` 配置告警列表等。
    *   **交互分发**：点击事件最终调用 `mixins/wdpapi.js` 中的 `toolHandlers` 映射方法。
*   **底层 API 封装**：所有的底层 WDP 交互逻辑应封装在 `src/utils/wdpapi/` 下，按功能模块拆分（`camera.js`, `entity.js`, `custom.js` 等）。严禁在业务代码中直接调用 `wdpApp`。
*   **全局清理逻辑**：如果涉及全局状态（如待机漫游、环境光、压暗），**必须**修改 `src/mixins/toolCleanupMixin.js` 中的 `initSceneClose` 或 `performCommonCleanup`。
    *   `initSceneClose`: 负责场景初始化（开启待机漫游、重置压暗）。
    *   `performCommonCleanup`: 负责通用销毁（停止待机漫游、清空对象）。
*   **业务逻辑**：在 `src/views/page_x/page_x_x/mixins/wdpapi.js` 中编写具体交互。

### 步骤 2：应用标准 Mixin 开发模式
**⚠️ 警告：以下步骤均为强制要求，任何遗漏都将导致运行时报错或内存泄漏！**

编写业务 Mixin 时，**必须严格执行**以下检查清单：

1.  **引入依赖 (MANDATORY)**
    *   **必须**引入 `toolCleanupMixin` 并在 `mixins` 数组中注册。
    *   **必须**从 `@utilsWdpApi` 引入所需方法，严禁直接调用全局对象。
    *   *后果：缺少 Mixin 会导致清理方法未定义；直接调用全局对象破坏架构封装。*

2.  **定义数据 (CRITICAL BLOCKER)**
    *   **STOP & CHECK**: Before writing any methods, you **MUST** verify `data()` contains these 3 keys.
    *   `toolObjs`: **必须显式初始化**每个功能 ID 对应的空数组（如 `{ 9: [] }`）。
        *   *错误后果：* `TypeError: Cannot read property 'push' of undefined`。这是**绝对不允许**的低级错误。
        *   *正确示范：* `toolObjs: { 1: [], 2: [], ..., 9: [] }` (即使是空的也要写!)
    *   `toolHandlers`: **必须映射**每个功能 ID 到具体的处理函数。
        *   *错误后果：* 点击按钮无反应。
    *   `toolData`: **必须完整定义**组件所需的 props 数据。
        *   *错误后果：* 组件渲染空白或报错。
    *   **Self-Correction**: 如果你添加了新的 ID (例如 `10`)，**立即**检查 `toolObjs[10]` 是否已初始化。如果没有，**现在就补上**。

3.  **实现清理 (MANDATORY)**
    *   **必须实现** `async closeAll()` 方法。
    *   **必须在首行**调用 `await this.performCommonCleanup()`。
    *   *后果：不调用通用清理会导致场景中残留上次操作的实体（如点位、窗口），造成“鬼影”现象和内存泄漏。*

4.  **对象管理 (MANDATORY)**
    *   调用 `addPOI` / `addWINDOWS` 等接口后，**必须立即**将返回的 `objects` 推入 `this.toolObjs[index]`。
    *   *后果：未收集对象 ID，导致 `closeAll` 无法找到并删除这些实体，用户切换页面后实体依然存在。*

5.  **实体点击事件绑定规范 (MANDATORY)**
    *   **绝对禁止**使用全局事件监听方法（如 `this.App.Interaction.OnPoiClick` 或凭空捏造的引擎方法）来处理单个实体类型的点击！
    *   **必须**在 `addPOI` 等实体创建方法成功后，遍历返回的 `objects` 数组，直接调用每个实体对象上的 `onClick` 方法来绑定事件。
    *   *正确示范：*
        ```javascript
        const poiResult = await addPOI(...);
        if (poiResult.success) {
          this.toolObjs[index].push(...poiResult.result.objects);
          poiResult.result.objects.forEach((poiObj, i) => {
            poiObj.onClick(async () => {
              // 处理该实体的点击事件，例如：this.$store.commit("setActivePoiIndex", i);
            });
          });
        }
        ```

6.  **弹窗功能实现规范 (MANDATORY)**
    *   凡是用户提到的“弹窗显示”功能，除非用户**明文指定**使用 Vue 页面组件实现（如 DOM 层的 `el-dialog` 或 `$message`），否则**一律强制使用** `@utilsWdpApi/entity` 中的 `addWINDOWS` 方法来实现 3D 场景内的弹窗业务！
    *   **严禁**在 3D 场景元素的点击回调中混用前端页面的弹窗组件（如 `this.$message` 或注入 HTML 字符串）。
    *   *正确示范：*
        ```javascript
        const windowParams = { title: "标题", type: "type3", bgType: "bg3", customParams: info, coordZRef: "surface" };
        const windowRes = await addWINDOWS(point, "实体名称", index, [290, 190], zOffset, windowParams);
        if (windowRes.success) {
            this.$store.commit("setWindowEid", windowRes.result.object.Eid);
        }
        ```

### 步骤 3：查阅与使用 API
在开发具体功能时，优先使用以下已封装的 API。

#### 1. 相机控制 (`camera.js`)
| 接口名称 | 描述 | 参数详解 |
| :--- | :--- | :--- |
| `resetCamera` | 重置相机 | `location` (Array): `[lon, lat, height]` |
| `FocusByCustomId` | 聚焦实体 | `customId`, `yaw`, `pitch`, `distanceFactor` |
| `FocusByPoints` | **推荐** 聚焦坐标 | `point`, `distance`, `pitch`, `yaw` |
| `setCameraViewshed` | 可视域分析 | `location` |
| `followEntity` | 跟随实体 | `followParticle`, `config` |
| `setCameraLimit` | 设置限制 | `limitConfig` |

#### 2. 实体管理 (`entity.js`)
| 接口名称 | 描述 | 参数详解 |
| :--- | :--- | :--- |
| `addPOI` | 批量添加 POI | `data` (Array[]), `type`, `coordZOffset`, `entityName`, `personnelInfo`, `markerConfig` |
| `addWINDOWS` | 添加 3D 窗口 | `location`, `windowOptions`, `isShow` (结合 Vuex `windowEid` 使用) |
| `addRange` | 添加区域围栏 | `data`, `config` |
| `addParticle` | 添加粒子 | `location`, `config` |
| `addPath` | 添加路径 | `data`, `config` |
| `coveringMove` | 沿路径移动 | `moveObj`, `pathObj`, `config` |
| `addText3d` | 3D 文字 | `location`, `config` |

#### 3. 定制功能 (`custom.js`)
| 接口名称 | 描述 | 参数详解 |
| :--- | :--- | :--- |
| `customStatus` | 通用开关(压暗) | `apiFuncName`, `status` |
| `splitBuildByName` | 拆楼 | `build_id`, `floor` |
| `setStandbyMode` | 待机漫游 | `state` (Boolean) |
| `changeDarkColor` | 修改压暗颜色 | `parameterName`, `color` |
| `cameraFOV` | 相机可视域 | `id`, `type`, `state`, `location`... |
| `customFn` | 通用自定义调用 | `apiFuncName`, `config` |

#### 4. 工具与删除 (`tool.js`, `delete.js`)
| 接口名称 | 描述 |
| :--- | :--- |
| `setSceneWeather` | 设置天气 |
| `setSceneTime` | 设置时间 |
| `pickPoint` | 拾取坐标 |
| `deleteTypes` | 按类型删除 |
| `deleteObjs` | 删除对象实例 |

### 步骤 5：扩展新 API (当接口不存在时)
如果上述封装不满足需求：
1.  **查阅文档**: 务必通过 **WDP MCP** 工具获取官方 API 定义，严禁凭记忆编造接口名/参数：
    *   用 `query_knowledge` 按关键词检索，或用 `get_skill_content` 按路径读取 MCP 侧 `official_api_code_example/official-*.md` 的官方真值文档。
    *   如仍不确定对应的 skill 路径，先调用 `start_wdp_workflow`（或 `list_skills`）拿到路由结果，再按返回的 `mandatoryCheckpoints` 读取真值。
2.  **封装**: 在 `src/utils/wdpapi/` 下寻找合适的分类文件（`camera.js`, `entity.js`, `custom.js` 等）进行封装。
    *   如果现有文件均不匹配，请模仿现有结构**新建一个分类文件**（例如 `weather.js`），并在其中导出新函数。
    ```javascript
    // 示例：src/utils/wdpapi/newCategory.js
    import store from "../../store/index.js";
    
    export async function newFeature(param) {
      const App = store.state.wdpApp;
      return await App.Namespace.Method(param);
    }
    ```
3.  **使用**: 在具体的业务 Mixin（如 `src/views/page_1/page_1_1/mixins/wdpapi.js`）中引入并使用该 API。
    ```javascript
    import { newFeature } from "@utilsWdpApi/newCategory";
    ```

## 常见问题排查

### 1. 坐标跳转失效
*   **现象**：点击列表项，相机无反应或报错。
*   **排查**：检查 `FocusByPoints` 参数是否正确，确保坐标数组格式为 `[lon, lat, height]`。
    ```javascript
    await FocusByPoints(coord, ...);
    ```

### 2. 未初始化 toolObjs 导致 undefined 报错
*   **现象**：控制台报错 `TypeError: Cannot read properties of undefined (reading 'push')`，通常发生在 `handleCustomPoi` 或其他业务方法中。
*   **原因**：新增了功能 ID（如 `9`），并在 `toolHandlers` 中注册了方法，但忘记在 `data.toolObjs` 中初始化对应的空数组（如 `9: []`）。导致 `this.toolObjs[index]` 为 `undefined`。
*   **解决方案**：在 `data` 中找到 `toolObjs` 对象，补充缺失的 ID 初始化。
    ```javascript
    toolObjs: {
      1: [],
      // ...
      9: [], // 必须显式初始化
    }
    ```

## 示例

### 标准 Mixin 代码结构
```javascript
// src/views/page_1/page_1_1/mixins/wdpapi.js
import { addPOI } from "@utilsWdpApi/entity";
import { FocusByPoints } from "@utilsWdpApi/camera";
import toolCleanupMixin from "../../../../mixins/toolCleanupMixin";

export default {
  mixins: [toolCleanupMixin],
  data() {
    return {
      // 1. 处理器映射(必须)
      toolHandlers: { 1: this.handlePoi },
      // 2. 数据配置(必须)
      toolData: {
        1: {
          data: [[113.71, 34.77, 0]],
          cameras: [{ position: [113.71, 34.77, 50], pitch: -20, yaw: 0 }],
          markerConfig: { markerSize: 2 }
        }
      },
      // 3. 对象存储 (必须)
      toolObjs: { 1: [] }
    };
  },
  methods: {
    // 4. 必须实现的清理方法
    async closeAll() {
      await this.performCommonCleanup(); // 调用通用清理
      // 处理其他业务状态，如 Vuex
      this.$store.commit("isShowWindow", { isShow: false });
    },
    
    // 5. 业务逻辑
    async handlePoi(data, index) {
      const res = await addPOI(data.data, "type", 0, "name", null, data.markerConfig);
      if (res.success) {
        // 关键：收集对象以便清理
        this.toolObjs[index].push(...res.result.objects);
        
        // 绑定交互
        this.toolObjs[index].forEach((obj, i) => {
           obj.onClick(async () => {
             await FocusByPoints(data.data[i], 50, -20, 0);
           });
        });
      }
    }
  }
}
```
