# 项目架构与路由规范 (Project Architecture)

## 1. 目录结构
```
src/
├── assets/              # 静态资源 (含 css 和 images/layout)
├── components/         # 可复用公有组件
├── layout/             # 主布局容器 (index.vue, box.vue)
├── views/              # 业务页面视图
│   ├── index.vue       # 全局外壳
│   ├── page_X/         # 一级路由功能模块
│   │   └── page_X_X/   # 二级路由页面
│   │       ├── index.vue      # 业务页面入口
│   │       └── components/    # 页面私有化组件
├── store/              # 全局状态管理 (index.js)
├── utils/              # 工具函数 (含图表/通用方法)
├── router/             # 路由配置 (index.js)
```

## 2. 路由与组件互斥强规则 (防报错与冲突)
- **路由 Meta 三必写**：在 `router/index.js` 注册路由时，其 `meta` 对象必须包含：`title` (页面标题)、`showInMenu` (是否显示在导航)、`keepAlive` (是否缓存)。
- **导航 ID 唯一性**：`navList` 中的每个导航项必须拥有全局唯一的 `id`。
- **主导航互斥原则**：页面中应当只有一个主路由导航组件生效。当迁移导航位置（如从顶部移到底部）时，**必须在新位置新增并注释掉旧位置代码**，严禁双开。
- **NavItem 传参陷阱 (致命点)**：使用 `<NavItem>` 导航组件时，接收的 prop 名称必须是 `:item`，**绝对严禁传递 `:navData`**，否则会导致导航渲染为空！

## 3. Props 分层隔离原则
- `src/views/index.vue`（全局外壳）：仅负责全局框架，只管理 `:header`, `:footer`, `:main`, `:scene`。严禁在此处开启 `aside` 等侧边栏遮挡主导航。
- 子页面 (`page_X/page_X_1/index.vue`)：负责局部内容，只管理 `:headerTool`, `:footerTool`, `:leftTools`, `:rightTools`, `:aside`, `:main`。

## 4. 区域与插槽映射表 (严格遵循位置与 CSS 定位)
| 区域         | 插槽名              | 对应组件示例                         | 关键定位信息 (CSS)                                                                |
| :----------- | :------------------ | :----------------------------------- | :-------------------------------------------------------------------------------- |
| **顶部**     | `header`            | `src/layout/header.vue`              | **Top: 0**, Z-Index: 2, 宽高比 960/47                                             |
| **底部**     | `footer`            | `src/layout/footer.vue`              | **Bottom: 0**, Width: 100%, Padding-bottom: 4.6%, Z-Index: 2                      |
| **左侧栏**   | `aside-left`        | `Box` 组件容器                       | **Left: 0**, Top: 8.5%, Width: 自定义或从 UI 图自动计算, Height: 89%, Z-Index: 1  |
| **右侧栏**   | `aside-right`       | `Box` 组件容器                       | **Right: 0**, Top: 8.5%, Width: 自定义或从 UI 图自动计算, Height: 89%, Z-Index: 1 |
| **顶部工具** | `header-tool`       | `headerTool.vue`                     | **Top: 9%**, Left: 50% (居中), Width: 42%, Z-Index: 2                             |
| **底部工具** | `footer-tool`       | `footerTool.vue`                     | **Bottom: 8%**, Left: 50% (居中), Width: 42%, Z-Index: 2                          |
| **左侧工具** | `aside-left-tools`  | `src\components\toolBar\sideBar.vue` | **Left: 22%**, Bottom: 8%, Z-Index: 1 (位于左侧栏外侧)                            |
| **右侧工具** | `aside-right-tools` | `src\components\toolBar\sideBar.vue` | **Right: 22%**, Bottom: 8%, Z-Index: 1 (位于右侧栏外侧)                           |
| **场景背景** | `scene`             | `src/layout/scene.vue`               | Full Screen, Z-Index: 0                                                           |

## 5. 路由结构与重定向约束
- 根路径通常重定向到首个一级模块（如 `/page_1`）。
- 父级模块路由应重定向到其第一个子页（如 `/page_1` -> `/page_1/1`）。
- 新增路由必须保持嵌套路由结构清晰，避免平铺导致导航状态错乱。
- `meta` 字段与导航配置必须同步，避免菜单显示与路由权限不一致。

推荐路由树示例：
```
/
├─ /page_1 (redirect -> /page_1/1)
│  ├─ /page_1/1
│  └─ /page_1/2
├─ /page_2 (redirect -> /page_2/1)
│  └─ /page_2/1
├─ /404
└─ /403
```

路由配置硬约束：
- 每个业务页必须具备 `meta.title`、`meta.showInMenu`、`meta.keepAlive`。
- 父级路由无实际页面时必须配置 redirect，不允许空壳路径落地。
- 导航菜单项与路由路径一一对应，禁止“菜单有项但无路由”或“路由存在但菜单错误暴露”。

## 6. 状态与技术栈约束（非 WDP）
- 状态管理建议集中于 `src/store/index.js`，用于菜单显隐、面板状态、全局主题等页面态。
- 布局与路由规则适配 Vue2 体系，保持与现有组件选项式 API 风格一致。
- 图表层默认采用 ECharts，组件层遵循“私有优先、复用上收”的分层策略。
