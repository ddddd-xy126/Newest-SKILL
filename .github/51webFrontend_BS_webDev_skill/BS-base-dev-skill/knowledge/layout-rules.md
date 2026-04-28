# 布局与切图资源映射规范 (Layout Rules)

## 1. 资源路径规范
所有布局相关的核心资源必须且只存放于 `src/assets/images/layout` 目录下。

## 2. 资源命名与映射表
| 资源名称                   | 映射位置                                      | 关键用途                     |
| :------------------------- | :-------------------------------------------- | :--------------------------- |
| `top.png`                  | `src/layout/header.vue`                       | 顶部 Header 整体背景图       |
| `box-bg.png`               | `src/layout/box.vue`                          | `.box-main` 区域背景图       |
| `box-header.png`           | `src/layout/box.vue`                          | `.box-header` 标题区域背景图 |
| `nav-bg.png`               | `src/layout/footer.vue`                       | 底部背景图                   |
| `navItem-bg.png`           | `src/components/header/navItem-header.vue`    | 导航按钮背景图               |
| `navItem-bg-active.png`    | `src/components/header/navItem-header.vue`    | 导航按钮选中背景图           |
| `header-weather.png`       | `src/components/header/setting/weather.vue`   | 顶部天气模块图标             |
| `header-date.png`          | 顶部日期前方的 icon                           | 顶部年月日模块图标           |
| `header-time.png`          | 顶部时间前方的 icon                           | 顶部小时分钟秒模块图标       |
| `header-admin.png`         | 顶部管理员模块图标                            | 顶部管理员模块图标           |
| `header-setting.png`       | `src/components/header/setting/selection.vue` | 顶部设置模块图标             |
| `mask.png`                 | `src/layout/index.vue`                        | 遮罩图                       |
| `leftTool-bg.png`          | `src/components/toolBar/sideBar.vue`          | 左侧工具栏背景图             |
| `leftTool-bg-active.png`   | `src/components/toolBar/sideBar.vue`          | 左侧工具栏激活背景图         |
| `rightTool-bg.png`         | `src/components/toolBar/sideBar.vue`          | 右侧工具栏背景图             |
| `rightTool-bg-active.png`  | `src/components/toolBar/sideBar.vue`          | 右侧工具栏激活背景图         |
| `headerTool-bg.png`        | `src/components/toolBar/headerTool.vue`       | 头部工具栏背景图             |
| `headerTool-bg-active.png` | `src/components/toolBar/headerTool.vue`       | 头部工具栏激活背景图         |
| `footerTool-bg.png`        | `src/components/toolBar/footerTool.vue`       | 底部工具栏背景图             |
| `footerTool-bg-active.png` | `src/components/toolBar/footerTool.vue`       | 底部工具栏激活背景图         |

## 3. 样式修正与“防灾难”指南
- **Body 高度适配铁律（致命点）**：`body` 元素**绝对禁止**设置 `height: 100vh` 或任何固定高度（如 `height: 100%`、`height: 860px` 等）！必须使用 `padding-top` 百分比实现宽高比自适应黑边效果。计算公式：`padding-top = (设计稿高度 ÷ 设计稿宽度) × 100%`。若需适配多种屏幕分辨率，必须通过 `@media (aspect-ratio)` 媒体查询配置多套 `padding-top`（详见第 7 节「Body 宽高比适配规范」）。违反此规则将导致非预设屏幕显示 UI 上下拉伸变形！
- **防遮挡铁律 (致命点)**：所有的背景装饰图（包括遮罩 `mask.png` 或任何非交互的浮层）必须设置 `pointer-events: none;`，否则将导致其下方的图表和按钮无法被点击！
- **Z-Index 层级铁律**：必须严格遵循：Bottom(场景 `z-index: 0`) -> Middle(数据面板 `.layout-aside-left/right` `z-index: 1`) -> Top(导航与工具栏 `z-index: 2`)。
- **Header 比例**：`src/layout/index.vue` 中的 Header 宽高比由用户在布局搭建阶段提供。若用户未指定，则使用默认值 `960 / 47`。子脑 A 在 Step 1 执行前，必须向用户确认是否有自定义 Header 宽高比需求。
- **Header 防挤压保护**：左侧区域（如包含时间、Logo等）必须设置最小宽度（如 `min-width: 300px`），防止屏幕缩小时组件挤压重叠。
- **Box 容器修正**：`.box-header` 宽度必须为 100%，需移除左右外边距；`.box-main` 应用背景图时，必须显式移除原有的 `background-color`。
- **Logo 限制**：Logo 严禁设置 `font-size` 属性。
- **全局字号变量强校验**：凡使用 `font-size: var(--font-size-xx)`，必须先在全局样式表 `src/assets/css/main.scss` 的 `:root` 中确认变量已定义；未定义变量禁止引用。
- **时间组件拆分**：
  - `getCurrentFormattedDateRobust()` 返回 `[年月日, 时分秒, 星期几]`
  - `date.vue` 使用 `formattedDate[0]`
  - `time.vue` 使用 `formattedDate[1]`，截取前5位 (HH:MM)

## 4. 核心 CSS 与 Vue 模板代码参考 (严格参照执行)

### Header 样式应用 (`header.vue`)
```scss
.header {
  background-image: url("~@images/layout/top.png");
  background-size: 100% 100%;
}
```

### Box 样式应用 (`box.vue`)
```scss
.box-header {
  width: 100%; // 强制全宽
  margin: 0; // 清除边距
  background-image: url("~@images/layout/box-header.png");
  background-size: 100% 100%;
  justify-content: flex-start; // 标题文本靠左
  padding-left: 10%; // 距离左侧 10%
}
.box-main {
  background-image: url("~@images/layout/box-bg.png");
  background-size: 100% 100%;
  // background-color: ...; // 必须移除背景色
}
```

### 导航样式与天气图标应用
```vue
<!-- navItem-header.vue -->
<img class="bgImg" src="@images/layout/nav-bg.png" alt="" />

<!-- weather.vue -->
<img src="@images/layout/header-weather.png" alt="">
```

## 5. 强制挂载规则
- 高度百分比必须直接挂载在 `Box` 的类名上（如 `.box-factory { height: 28%; }`）。
- 绝对禁止 `.content-left` 或 `.content-right` 出现 `height` 属性。
- `Box` 的 `delayTime` 必须遵循同侧自上而下递增 100ms 的原则。
<<<<<<< HEAD

## 6. Box 类型规范

### 6.1 类型说明
`Box` 组件通过 `type` prop 支持四种头部布局模式：

| type | 头部结构 | 适用场景 | icon 来源 |
|:-----|:---------|:---------|:----------|
| `default` | 完全 slot 控制（`header` / `header-en` / `header-right`） | 向后兼容、完全自定义头部 | 外部通过 `header` slot 自行渲染 |
| `compact` | `header-icon` 插槽 + `title`/`subtitle` prop（水平排列） + `header-right` 插槽 | 标题+副标题水平排列+右侧操作按钮 | 外部通过 `header-icon` slot 传入 |
| `banner` | `header-icon` 插槽 + `title`/`subtitle` prop（上下堆叠） + `header-right` 插槽 | 标题+副标题垂直堆叠+右侧操作按钮，适用于标题较长或需要强调层次感的面板 | 外部通过 `header-icon` slot 传入 |
| `simple` | `header-icon` 插槽 + `title` prop | 仅标题、无右侧操作 | 外部通过 `header-icon` slot 传入 |
| `minimal` | 无头部、无分割线 | 纯内容卡片 | 无 |

### 6.2 Props 接口
| prop | type | default | 说明 |
|:-----|:-----|:--------|:-----|
| `type` | String | `"default"` | Box 头部类型，可选 `default`/`compact`/`banner`/`simple`/`minimal` |
| `title` | String | `""` | 标题文字（`compact`/`banner`/`simple` 类型使用） |
| `subtitle` | String | `""` | 副标题文字（`compact`/`banner` 类型使用；`compact` 水平排列，`banner` 上下堆叠） |
| `tag` | String | `""` | 右上角标签 |
| `delayTime` | Number | `0` | 入场动画延迟（ms） |
| `position` | String | `""` | 动画方向（`left`/`right`） |
| `footerBoxStyle` | Object | `{}` | 底部 Box 样式覆盖 |

### 6.3 icon 设计原则
- **icon 始终由外部通过插槽传入**，Box 组件不内建任何 icon 渲染逻辑。
- `compact`/`simple` 类型使用 `header-icon` 具名插槽传入 icon。
- `default` 类型在 `header` slot 中自行组织 icon。
- icon 的图片资源（如 `box-header-icon-bg.png`）由业务页面引用，不由 Box 组件引用。

### 6.4 资源关联
| 资源名称 | 关联类型 | 说明 |
|:---------|:---------|:-----|
| `box-header.png` | 所有非 `minimal` 类型 | `.box-header` 背景图 |
| `box-bg.png` | 所有类型 | `.box-main` 背景图 |
| `box-header-icon-bg.png` | `compact`/`banner`/`simple` | 由业务页面在 `header-icon` slot 中引用 |
| `header-btn.png` | `compact`/`banner`/`default` | 由业务页面在 `header-right` slot 中引用 |

### 6.5 模板速查
```vue
<!-- compact：标题+副标题+右侧按钮+外部传入icon -->
<Box type="compact" title="低空空域" subtitle="Airspace Grid" :delayTime="100" position="right">
  <template v-slot:header-icon>
    <span class="box-header-icon"></span>
  </template>
  <template v-slot:header-right>
    <span class="header-btn">按钮</span>
  </template>
  <div class="box-main-content"></div>
</Box>

<!-- banner：标题+副标题上下堆叠+右侧按钮+外部传入icon -->
<Box type="banner" title="能源管理监测" subtitle="Energy Management Monitoring" :delayTime="100" position="left">
  <template v-slot:header-icon>
    <span class="box-header-icon"></span>
  </template>
  <template v-slot:header-right>
    <span class="header-btn">检测可视</span>
  </template>
  <div class="box-main-content"></div>
</Box>

<!-- simple：仅标题+外部传入icon -->
<Box type="simple" title="资产监测" :delayTime="100" position="left">
  <template v-slot:header-icon>
    <span class="box-header-icon"></span>
  </template>
  <div class="box-main-content"></div>
</Box>

<!-- minimal：无头部 -->
<Box type="minimal" :delayTime="100">
  <div class="box-main-content"></div>
</Box>
```
=======
- 使用任意 `var(--font-size-xx)` 前必须执行“先定义后引用”校验：先查 `main.scss` 变量定义，再写样式引用。
## 7. Body 宽高比适配规范（防拉伸铁律）

### 7.1 核心原则
- **禁止项**：`body` 上**绝对不允许**出现 `height: 100vh`、`height: 100%` 或任何固定高度声明。
- **必须项**：使用 `padding-top` 百分比撑开 `body` 高度，公式为 `padding-top = (高 ÷ 宽) × 100%`。
- **适配项**：若存在第二套适配分辨率，必须通过 `@media (aspect-ratio)` 媒体查询配置第二套 `padding-top`。

### 7.2 计算步骤
1. **主设计稿**：取设计稿原始尺寸 `W1 × H1`，计算 `paddingTop1 = (H1 / W1) × 100`，保留两位小数，单位 `%`。
2. **适配目标**：取适配目标分辨率 `W2 × H2`，计算 `paddingTop2 = (H2 / W2) × 100`，保留两位小数，单位 `%`。
3. **媒体查询分界点**：取两套宽高比的中间值作为分界，`breakpoint = ((W1/H1) + (W2/H2)) / 2`，转为整数比 `breakpoint × 1000 / 1000`。
4. **默认值**：`body` 的默认 `padding-top` 使用主设计稿的值（`paddingTop1`）。
5. **媒体查询**：
   - `@media (max-aspect-ratio: breakpoint)` → `padding-top: paddingTop1%`（窄屏/标准屏使用主设计稿比例）
   - `@media (min-aspect-ratio: breakpoint)` → `padding-top: paddingTop2%`（宽屏使用适配目标比例）

### 7.3 CSS 参考代码
以设计稿 `2296×774` + 适配目标 `2898×860` 为例：
```scss
html {
  background-color: transparent;
  display: flex;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100vw;
  height: 100vh;
  font-size: 0.7vw;
  overflow: hidden;
}

body {
  margin: 0;
  width: 100%;
  /* padding-top = 774 / 2296 × 100 = 33.71% */
  padding-top: 33.71%;
  background-color: transparent;
  position: relative;
  font-family: var(--font-family-primary-Light);
  overflow: hidden;
  /* ⛔ 绝对禁止出现 height: 100vh 或任何固定高度！ */
}

/* 适配 2296×774（宽高比 ≈ 2.97:1）— 窄屏 */
@media (max-aspect-ratio: 3148/1000) {
  body {
    padding-top: 33.71%;
  }
}

/* 适配 2898×860（宽高比 ≈ 3.37:1）— 宽屏 */
@media (min-aspect-ratio: 3148/1000) {
  body {
    padding-top: 29.7%;
  }
}

#app {
  position: absolute;
  background-color: transparent;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### 7.4 分界点计算示例
```
设计稿: 2296×774 → 宽高比 = 2296/774 ≈ 2.966
适配屏: 2898×860 → 宽高比 = 2898/860 ≈ 3.370
分界点 = (2.966 + 3.370) / 2 ≈ 3.168 → 取整为 3148/1000
```

### 7.5 自查清单（代码生成后必须逐项校验）
- [ ] `body` 上**没有** `height: 100vh` 或任何固定高度
- [ ] `body` 上**有** `padding-top: XX%`（值 = 设计稿高/宽 × 100）
- [ ] 存在两条 `@media (aspect-ratio)` 媒体查询，分别覆盖窄屏和宽屏的 `padding-top`
- [ ] `#app` 使用 `position: absolute; top: 0; left: 0; width: 100%; height: 100%` 填满 body
- [ ] `html` 上有 `height: 100vh`（html 可以，body 不可以）>>>>>>> e002d9d465afdfa2d0ceefdbbd38559563cd8377
