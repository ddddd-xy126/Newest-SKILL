# 导航效果库 (Nav Types)

> 本文件**只描述导航的"视觉行为 + 数据契约 + 命中关键词"**。资源命名与图片路径请查阅 [`layout-rules.md`](./layout-rules.md)，本文件不复述。

## 1. 效果目录

| 编号 | 中文名 | 视觉行为（一句话） | 二级 | 滚动 | 典型位置 | 模板文件 |
|:----:|:------|:------------------|:----:|:----:|:--------|:--------|
| **NAV-01** | 顶部水平 Tab | 顶部 Header 内一行 N 项平铺，激活项换底图 | 否 | 无 | Header | `templates/components/nav-01.vue` |
| **NAV-02** | 顶部双层（一+二级）| NAV-01 下方再挂一行二级 Tab，联动切换 | 是 | 无 | Header | `templates/components/nav-02.vue` |
| **NAV-03** | 底部胶囊水平 | 底部居中胶囊，N 项平铺，激活项放大/换底 | 可选 | 无 | Footer | `templates/components/nav-03.vue` |
| **NAV-04** | 底部居中弧形转盘 | 弧形居中铺 N 项，激活位**永远在弧线中央**，**双向滚动**，越界项瞬移到对称侧再滑入；激活项放大+换图标+换底；可挂二级弧形圆点 | 是 | 双向 | Footer | `templates/components/nav-04.vue` |
| **NAV-05** | 左下地球弧形轨道 | 沿屏幕左下四分之一圆排 N 项，激活位**永远在弧线顶端**，**单向滚动**，越界项瞬移到对侧屏外再滑入；高光图层跟随激活位**旋转指向** | 否 | 单向 | Footer | `templates/components/nav-05.vue` |
| **NAV-06** | 左侧竖排 Tab | Aside-Left 纵向铺 N 项，激活项换底 | 可选 | 无 | Aside-Left | `templates/components/nav-06.vue` |
| **NAV-07** | 底部水平容器（容器底图+独立项底图+图标）| 底部居中一张 `nav-bg.png` 托底，N 项水平平铺，每项独立 `navItem-bg(-active).png` + 可选 icon，激活项换底图换字色 | 否 | 无 | Footer | `templates/components/nav-07.vue` |

> NAV-03 / NAV-04 / NAV-07 都在底部，区分铁律：
> - **NAV-03**：纯文字胶囊，激活项 `scale` 放大，**无**容器底图、**无** icon。
> - **NAV-04**：弧形布局 + 中心激活 + **双向**滚动动画 + 必带 icon。
> - **NAV-07**：水平平铺 + **无动画**，**有**整体容器底图 + 每项独立底图 + 可选 icon。
> 命中歧义时弹问答面板让用户三选一。

> NAV-04 与 NAV-05 是最容易混淆的两类，区分铁律：
> - **激活位置**：NAV-04 在弧线**中央**；NAV-05 在弧线**顶端**。
> - **滚动方向**：NAV-04 **双向**（点左侧整体右移、点右侧整体左移）；NAV-05 **单向**（点哪个，它就走到顶端）。
> - **装饰图层**：NAV-04 只有底图；NAV-05 多一层**旋转高光**。
> - 命中歧义时，弹问答面板让用户在 NAV-04 / NAV-05 中二选一。

## 2. 命中关键词反查表

| 用户说出的关键词 | 命中编号 |
|:----------------|:--------:|
| 顶部 / Tab / 水平 / 一级导航 | NAV-01 |
| 双层 / 子导航 / 二级 / 顶部联动 | NAV-02 |
| 底部胶囊 / 底部水平 / 横向胶囊 | NAV-03 |
| 转盘 / 弧形居中 / 双向滚动 / 中心激活 / 中心放大 / 带图标的弧形菜单 | NAV-04 |
| 弧形轨道 / 地球 / 左下角 / 高光旋转 / 单向滚动 / 顶端激活 / 四分之一圆 | NAV-05 |
| 左侧 / 竖排 / 侧边导航 | NAV-06 |
| 底部水平 / 带容器底图 / 每项独立底图 / 带图标 / 无动画 / 底部 Tab | NAV-07 |

## 3. 统一调用契约（所有模板必须遵守）

### 3.1 Props
```js
{
  list: { type: Array, required: true },         // 主导航数据，结构见 §4
  initialActiveId: { type: [String, Number] },   // 可选，初始激活项 id
  options: { type: Object, default: () => ({}) },// 形态专属可选项（弧度、半径等），有默认值
}
```

### 3.2 Events
```js
@nav-change   payload: { item, index, level: 'primary' | 'secondary' }
```

### 3.3 业务隔离铁律（严禁违反）
- 模板内部**不直接 `$router.push`**、**不读 `$route`**、**不依赖 vuex / mixins / API 调用**。
- 路由同步（监听 `$route` 反推 `isActive`）、跳转、特殊业务钩子（如场景加载、POI 渲染）全部留在**父组件**（`src/layout/footer.vue` 或 `header.vue`）。
- 父组件通过 `:list` / `@nav-change` 与模板通信，模板内部只负责视觉与动画。
- 这样跨项目复用时不会因为路由结构差异返工。

## 4. list 数据结构分档

### 4.1 简单档（NAV-01 / NAV-03 / NAV-05 / NAV-06）
```js
[
  { id: 1, name: "园区概览", path: "/page_1", pathPrefix: "/page_1" },
  // ...
]
```

### 4.1b 简单+图标档（NAV-07）
```js
[
  {
    id: 1,
    name: "综合概览",
    path: "/page_1/1",
    pathPrefix: "/page_1",
    icon: require("@/assets/images/layout/navItem-icon1.png"), // 可选
  },
  // ...
]
```

### 4.2 图标档（NAV-04）
```js
[
  {
    id: 1,
    name: "景区态势",
    path: "/page_1",
    iconNor: require("@/assets/images/nav/icon1.png"),
    iconActive: require("@/assets/images/nav/icon1_active.png"),
    childList: [   // 可选，提供则启用二级
      { id: 1, name: "总览", path: "/page_1/1" },
      // ...
    ],
  },
  // ...
]
```

### 4.3 双层档（NAV-02）
```js
[
  {
    id: 1,
    name: "概览",
    path: "/page_1",
    children: [
      { id: 1, name: "数据", path: "/page_1/1" },
      { id: 2, name: "指标", path: "/page_1/2" },
    ],
  },
  // ...
]
```

## 5. 视觉行为详写（动画细节）

### NAV-04 底部居中弧形转盘
- **几何**：N 项沿弧形铺开，角度区间 `[startAngle, endAngle]`（默认 `[-20°, 20°]`），半径按 `viewportWidth * 0.42` 动态计算并 `clamp(560, 1300)`。
- **激活位**：永远是 offset=0 的中心位置，激活项 `scale(1.1)` + 切换激活图标 + 激活背景图。
- **滚动**：点击任意 `offset ≠ 0` 的项，整体偏移 `-offset`。
- **环绕**：滚动前先扫描"将越界"的槽位，瞬移（`no-transition`）到对称侧的等候区，再统一释放过渡。
- **二级**：激活项的 `childList` 经过 `setTimeout` 延迟（约 680ms，与动画时长对齐）后铺成弧形圆点；圆点也沿弧形排布（半径略大于主导航）。
- **可调 options**：`startAngle`、`endAngle`、`arcRadiusRatio`、`arcRadiusMin`、`arcRadiusMax`、`transitionDuration`、`secondaryDelay`。

### NAV-05 左下地球弧形轨道
- **几何**：N 项沿 6 个预设 `curvePositions` 点排布（含 2 个屏幕外的进出点），覆盖左下四分之一圆。
- **激活位**：永远是 offset=0 的弧线顶端位置。
- **滚动**：单向——点击 `offset=k` 的项，所有项 `offset -= k`，激活项归位到顶端。
- **环绕**：越界项（`offset < 0` 或 `> total-1`）瞬移到对侧屏幕外，再按 `staggerDelay` 错峰滑入最终位置。
- **高光**：独立 `nav-bg-highlight` 图层，`transform: rotate()` 跟随激活位角度旋转；切换时先瞬切到被点项角度，再平滑回到激活位角度，制造"高光跟随转过去"的视觉。
- **可调 options**：`curvePositions`、`transitionDuration`、`staggerDelay`、`highlightOffsetCorrection`。

### NAV-01 / NAV-02 / NAV-03 / NAV-06
- 平铺型，无滚动动画。
- 激活反馈仅靠 `isActive` 切换底图/字色/字重。
- 详见各自模板文件的 TODO 注释（占位骨架，等真实样本补全）。

### NAV-07 底部水平容器
- **结构**：外层 `nav-container` 内一张 `nav-bg.png` 绝对定位托底，`nav-list` 在 `z-index:1` 横向 `flex` 铺 N 项。
- **项**：每项一个 `item` div，`background-image` 普通态 `navItem-bg.png` / 激活态 `navItem-bg-active.png`，内含可选 `icon` + `<h3>` 文字。
- **激活反馈**：仅切底图 + 字色（普通 `rgba(192,220,231,0.85)` → 激活 `#ffffff`），无动画、无 scale。
- **icon**：单图（仅普通态一张），不区分激活/普通；如需双态请改用 NAV-04 的图标档结构。
- **可调 options**：暂无，容器宽度 / 项间距 / padding 通过覆盖 SCSS 调整（模板内已用 TODO 标记）。
- **来源**：真实项目 `footer.vue` + `navItem-footer.vue` 抽取通用化。

## 6. 父容器装载范例

### Footer 装载 NAV-05
```vue
<!-- src/layout/footer.vue -->
<template>
  <div class="footer">
    <Nav05 :list="navList" @nav-change="onNavChange" />
  </div>
</template>

<script>
import Nav05 from "@/components/nav/nav-05.vue";
export default {
  components: { Nav05 },
  data() {
    return {
      navList: [
        { id: 1, name: "园区概览", path: "/page_1", pathPrefix: "/page_1" },
        { id: 2, name: "优质生活", path: "/page_2", pathPrefix: "/page_2" },
        { id: 3, name: "智能生产", path: "/page_3", pathPrefix: "/page_3" },
        { id: 4, name: "智慧生态", path: "/page_4", pathPrefix: "/page_4" },
      ],
    };
  },
  methods: {
    onNavChange({ item }) {
      if (this.$route.path !== item.path) this.$router.push(item.path);
    },
  },
};
</script>
```

### Footer 装载 NAV-04（带二级 + 业务钩子）
```vue
<template>
  <div class="footer">
    <Nav04 :list="navList" @nav-change="onNavChange" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addPOI } from "@utilsWdpApi/entity";
import Nav04 from "@/components/nav/nav-04.vue";

export default {
  components: { Nav04 },
  data() { return { navList: /* 图标档结构 */ }; },
  computed: { ...mapState(["isSceneAlready"]) },
  methods: {
    onNavChange({ item, level }) {
      // 一级跳到第一个二级路由；二级直接跳
      const target = level === "primary" && item.childList?.length
        ? item.childList[0].path
        : item.path;
      if (this.$route.path !== target) this.$router.push(target);

      // 业务钩子全部留在父组件
      if (level === "primary" && this.isSceneAlready && item.id === 1) addPOI();
    },
  },
};
</script>
```

## 7. 选用决策树

```
┌─ 设计图导航在 Header？
│  ├─ 只有一行 → NAV-01
│  └─ 一+二级两行 → NAV-02
│
├─ 设计图导航在 Footer？
│  ├─ 平铺胶囊（纯文字、无容器底图、无 icon）→ NAV-03
│  ├─ 平铺水平 + 容器底图 + 每项独立底图 + 可选 icon + 无动画 → NAV-07
│  ├─ 弧形居中 + 中心激活 + 双向滚动 → NAV-04
│  └─ 弧形左下 + 顶端激活 + 高光旋转 → NAV-05
│
└─ 设计图导航在左侧侧边？
   └─ NAV-06
```

## 8. 维护规则

- 新增形态：编号续接 NAV-07/08/...，必须同时在 §1 目录、§2 命中关键词、§4 数据结构、§5 视觉行为四处登记。
- 占位骨架（NAV-01/02/03/06）遇到首个真实样本时，必须**用样本回填**而不是凭空补全，并在 PR 注释中标注样本来源。
- 任何形态的"业务钩子"出现在模板内部都视为污染，必须重构回父组件。
