# Vue2 数据可视化大屏项目

> 基于 Vue2 + Element UI + ECharts + 51WORLD WDP 的数据可视化大屏项目框架

## 📋 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [核心特性](#核心特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [路由系统](#路由系统)
- [布局系统](#布局系统)
- [组件体系](#组件体系)
- [API 封装](#api-封装)
- [WDP API 集成](#wdp-api-集成)
- [状态管理](#状态管理)
- [Mixins 复用](#mixins-复用)
- [开发指南](#开发指南)
- [最佳实践](#最佳实践)

## 项目简介

这是一个专为数据可视化大屏设计的 Vue2 项目框架,集成了丰富的图表组件、3D 场景交互能力和完善的布局系统。项目采用模块化设计,支持快速开发各类数据可视化应用。

### 适用场景

- 智慧园区数据大屏
- 智慧城市监控中心
- 企业数据驾驶舱
- 物联网设备监控
- 3D 场景可视化应用

## 技术栈

### 核心框架
- **Vue 2.6.11** - 渐进式 JavaScript 框架
- **Vue Router 3.5.2** - 官方路由管理器
- **Vuex 3.6.2** - 状态管理模式

### UI 组件库
- **Element UI 2.15.14** - 桌面端组件库

### 数据可视化
- **ECharts 5.5.0** - 强大的图表库
- **ECharts GL 2.0.9** - 3D 可视化扩展
- **AntV G2 5.2.12** - 数据驱动的可视化图形语法

### 3D 引擎
- **51WORLD WDP API 1.14.0** - 数字孪生平台 API

### 工具库
- **Axios 1.6.8** - HTTP 客户端
- **Sass 1.32.13** - CSS 预处理器
- **Throttle-Debounce 5.0.2** - 节流防抖工具

## 核心特性

✨ **丰富的图表组件** - 集成 ECharts 和 AntV G2,支持柱状图、折线图、饼图、雷达图、仪表盘等多种图表类型

🎨 **灵活的布局系统** - 基于插槽的布局组件,支持头部、底部、侧边栏、工具栏等多种布局模式

🌐 **3D 场景集成** - 深度集成 51WORLD WDP API,支持相机控制、实体操作、自定义交互

📱 **响应式设计** - 自适应不同屏幕尺寸,支持全屏展示

🔧 **完善的工具链** - 统一的 API 封装、Mixins 复用、路由守卫等开发工具

📦 **模块化架构** - 清晰的目录结构,易于维护和扩展

## 项目结构

```
HWLQH-SJ202412200001/
├── public/                      # 静态资源目录
│   ├── config.json             # 公共配置文件
│   ├── favicon.ico             # 网站图标
│   └── index.html              # HTML 模板
├── src/                         # 源代码目录
│   ├── assets/                 # 资源文件
│   │   ├── css/               # 全局样式
│   │   │   ├── main.scss      # 主样式文件
│   │   │   ├── btn.scss       # 按钮样式
│   │   │   ├── dialog.scss    # 弹窗样式
│   │   │   ├── font.scss      # 字体样式
│   │   │   ├── table.scss     # 表格样式
│   │   │   └── webKit.scss    # 滚动条样式
│   │   ├── fonts/             # 字体文件
│   │   ├── images/            # 图片资源
│   │   └── videos/            # 视频资源
│   ├── components/             # 公共组件
│   │   ├── antvCharts/        # AntV 图表组件
│   │   ├── echarts/           # ECharts 图表组件
│   │   ├── card/              # 卡片组件
│   │   ├── table/             # 表格组件
│   │   ├── header/            # 头部组件
│   │   ├── toolBar/           # 工具栏组件
│   │   ├── cartList/          # 列表组件
│   │   ├── flv/               # FLV 视频播放器
│   │   ├── rtsp/              # RTSP 视频播放器
│   │   ├── progress/          # 进度条组件
│   │   └── ...                # 其他通用组件
│   ├── directives/             # 自定义指令
│   │   └── clickDebounce/     # 点击防抖指令
│   ├── layout/                 # 布局组件
│   │   ├── index.vue          # 主布局组件
│   │   ├── header.vue         # 头部布局
│   │   ├── footer.vue         # 底部布局
│   │   ├── scene.vue          # 3D 场景布局
│   │   └── box.vue            # 盒子布局
│   ├── mixins/                 # 混入
│   │   ├── echartsMixin.js    # ECharts 混入
│   │   ├── tableMixin.js      # 表格混入
│   │   ├── listMixin.js       # 列表混入
│   │   └── toolCleanupMixin.js # 工具清理混入
│   ├── plugins/                # 插件
│   │   └── jsmpegPlayer/      # JSMpeg 视频播放器插件
│   ├── router/                 # 路由配置
│   │   └── index.js           # 路由主文件
│   ├── store/                  # Vuex 状态管理
│   │   └── index.js           # Store 主文件
│   ├── types/                  # 类型定义/配置
│   │   ├── echarts/           # ECharts 配置
│   │   ├── antvCharts/        # AntV 配置
│   │   └── defaultData.js     # 默认数据
│   ├── utils/                  # 工具函数
│   │   ├── api/               # API 接口
│   │   ├── wdpapi/            # WDP API 封装
│   │   │   ├── camera.js      # 相机控制
│   │   │   ├── entity.js      # 实体操作
│   │   │   ├── custom.js      # 自定义功能
│   │   │   ├── tool.js        # 工具函数
│   │   │   ├── entityType.js  # 实体类型
│   │   │   └── delete.js      # 删除操作
│   │   ├── request.js         # HTTP 请求封装
│   │   ├── countFontsize.js   # 字体大小计算
│   │   ├── countSize.js       # 尺寸计算
│   │   ├── custom.js          # 自定义工具
│   │   └── dom.js             # DOM 操作
│   ├── views/                  # 页面视图
│   │   ├── index.vue          # 主页面
│   │   ├── page_1/            # 页面模块 1
│   │   ├── page_2/            # 页面模块 2
│   │   ├── page_3/            # 页面模块 3
│   │   ├── page_4/            # 页面模块 4
│   │   ├── page_5/            # 页面模块 5
│   │   ├── page_6/            # 页面模块 6
│   │   ├── page_7/            # 页面模块 7
│   │   ├── page_8/            # 页面模块 8
│   │   ├── page_9/            # 页面模块 9
│   │   ├── wdpWindow/         # WDP 窗口页面
│   │   └── error/             # 错误页面
│   │       ├── 403.vue        # 权限不足
│   │       └── 404.vue        # 页面不存在
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
├── .env                        # 环境变量
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── .gitignore                  # Git 忽略文件
├── babel.config.js             # Babel 配置
├── package.json                # 项目依赖
├── vue.config.js               # Vue CLI 配置
└── README.md                   # 项目文档
```

### 目录说明

#### `/src/assets` - 资源文件
存放项目的静态资源,包括样式文件、字体、图片和视频。

#### `/src/components` - 公共组件
存放可复用的 Vue 组件,按功能分类组织。

#### `/src/layout` - 布局组件
定义页面的整体布局结构,支持灵活的插槽配置。

#### `/src/router` - 路由配置
定义应用的路由规则、路由守卫和导航逻辑。

#### `/src/store` - 状态管理
使用 Vuex 管理全局状态,包括 WDP 应用实例、窗口状态等。

#### `/src/utils` - 工具函数
封装常用的工具函数和 API 接口。

#### `/src/views` - 页面视图
存放各个页面组件,采用模块化组织方式。

## 快速开始

### 环境要求

- Node.js >= 14.x
- npm >= 6.x 或 yarn >= 1.x

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器,支持热重载:

```bash
npm run serve
```

项目将运行在 `http://localhost:3666`

### 生产构建

构建生产环境代码:

```bash
npm run build
```

构建产物将输出到 `dist` 目录

### 代码检查

运行 ESLint 检查代码规范:

```bash
npm run lint
```

## 路由系统

### 路由配置

项目采用 Vue Router 进行路由管理,配置文件位于 `src/router/index.js`。

#### 路由结构

```javascript
const routes = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    redirect: "/page_1",
    meta: {
      title: '数据可视化大屏',
      requiresAuth: false,
      keepAlive: true,
      showInMenu: false
    },
    children: [
      {
        path: "/page_1",
        component: () => import("@/views/page_1/index.vue"),
        redirect: "/page_1/1",
        meta: {
          title: '页面模块一',
          requiresAuth: false,
          keepAlive: true,
          showInMenu: true,
          icon: 'el-icon-data-line'
        },
        children: [
          {
            path: "1",
            name: "page_1_1",
            component: () => import("@/views/page_1/page_1_1/index.vue"),
            meta: {
              title: '数据概览',
              requiresAuth: false,
              keepAlive: true,
              showInMenu: true
            }
          }
        ]
      }
    ]
  }
]
```

### 路由元信息 (Meta)

每个路由可以配置以下元信息:

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | String | 页面标题 |
| `requiresAuth` | Boolean | 是否需要认证 |
| `keepAlive` | Boolean | 是否缓存组件 |
| `showInMenu` | Boolean | 是否在菜单中显示 |
| `icon` | String | 菜单图标 (Element UI 图标类名) |
| `roles` | Array | 允许访问的角色列表 |

### 路由守卫

#### 全局前置守卫

在路由跳转前执行,用于权限验证、登录检查等:

```javascript
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - 数据可视化大屏`;
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      Message.warning('请先登录');
      next(false);
      return;
    }

    // 检查角色权限
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRoles = getUserRoles();
      if (!hasPermission(to.meta.roles, userRoles)) {
        Message.error('权限不足，无法访问该页面');
        next('/403');
        return;
      }
    }
  }

  next();
});
```

#### 全局后置守卫

在路由跳转完成后执行:

```javascript
router.afterEach((to, from) => {
  // 隐藏加载状态
  store.commit('setLoading', false);
  
  // 滚动到页面顶部
  window.scrollTo(0, 0);
});
```

### 添加新路由

1. 在 `src/views` 下创建新的页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 配置路由元信息
4. 如需权限控制,设置 `requiresAuth` 和 `roles`

示例:

```javascript
{
  path: "/new-page",
  name: "NewPage",
  component: () => import("@/views/new-page/index.vue"),
  meta: {
    title: '新页面',
    requiresAuth: true,
    keepAlive: true,
    showInMenu: true,
    icon: 'el-icon-document',
    roles: ['admin', 'user']
  }
}
```

## 布局系统

### Layout 组件

项目提供了灵活的布局组件 `src/layout/index.vue`,支持通过插槽自定义各个区域。

### 布局配置

Layout 组件支持以下 Props:

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `header` | Boolean | false | 是否显示头部 |
| `footer` | Boolean | false | 是否显示底部 |
| `aside` | Boolean | false | 是否显示侧边栏 |
| `main` | Boolean | false | 是否显示主内容区 |
| `scene` | Boolean | false | 是否显示 3D 场景 |
| `headerTool` | Boolean | false | 是否显示头部工具栏 |
| `footerTool` | Boolean | false | 是否显示底部工具栏 |
| `rightTools` | Boolean | false | 是否显示右侧工具栏 |

### 可用插槽

| 插槽名 | 说明 |
|--------|------|
| `header` | 头部内容 |
| `footer` | 底部内容 |
| `aside-left` | 左侧边栏 |
| `aside-right` | 右侧边栏 |
| `aside-left-tools` | 左侧工具栏 |
| `aside-right-tools` | 右侧工具栏 |
| `header-tool` | 头部工具栏 |
| `footer-tool` | 底部工具栏 |
| `scene` | 3D 场景区域 |
| `default` | 主内容区域 |

### 使用示例

```vue
<template>
  <Layout 
    :header="true" 
    :footer="true" 
    :aside="true" 
    :scene="true"
    :headerTool="true"
  >
    <!-- 头部 -->
    <template #header>
      <Header />
    </template>

    <!-- 头部工具栏 -->
    <template #header-tool>
      <HeaderTool />
    </template>

    <!-- 左侧边栏 -->
    <template #aside-left>
      <SideBarLeft />
    </template>

    <!-- 右侧边栏 -->
    <template #aside-right>
      <SideBarRight />
    </template>

    <!-- 3D 场景 -->
    <template #scene>
      <Scene />
    </template>

    <!-- 底部 -->
    <template #footer>
      <Footer />
    </template>
  </Layout>
</template>

<script>
import Layout from '@layout';
import Header from '@/layout/header.vue';
import Footer from '@/layout/footer.vue';
import SideBarLeft from '@/components/sideBarLeft.vue';
import Scene from '@/layout/scene.vue';
import HeaderTool from '@/components/toolBar/headerTool.vue';

export default {
  components: {
    Layout,
    Header,
    Footer,
    SideBarLeft,
    Scene,
    HeaderTool
  }
}
</script>
```

## 组件体系

### 图表组件

#### ECharts 组件

位置: `src/components/echarts/index.vue`

支持的图表类型:
- 柱状图 (Bar)
- 折线图 (Line)
- 饼图 (Pie)
- 雷达图 (Radar)
- 仪表盘 (Gauge)
- 桑基图 (Sankey)
- 3D 柱状图 (3D Bar)

使用示例:

```vue
<template>
  <Echarts :options="chartOptions" />
</template>

<script>
import Echarts from '@/components/echarts/index.vue';
import { getBarOptions } from '@/types/echarts/bar.js';

export default {
  components: { Echarts },
  data() {
    return {
      chartOptions: getBarOptions({
        xData: ['周一', '周二', '周三', '周四', '周五'],
        yData: [120, 200, 150, 80, 70]
      })
    }
  }
}
</script>
```

#### AntV G2 组件

位置: `src/components/antvCharts/index.vue`

支持的图表类型:
- 饼图 (Pie)
- 柱状图 (Column)
- 水波图 (Liquid)

使用示例:

```vue
<template>
  <AntvCharts :options="chartOptions" />
</template>

<script>
import AntvCharts from '@/components/antvCharts/index.vue';
import { getPieOptions } from '@/types/antvCharts/pie.js';

export default {
  components: { AntvCharts },
  data() {
    return {
      chartOptions: getPieOptions({
        data: [
          { type: '分类一', value: 27 },
          { type: '分类二', value: 25 },
          { type: '分类三', value: 18 }
        ]
      })
    }
  }
}
</script>
```

### 卡片组件

#### BaseCard - 基础卡片

位置: `src/components/card/baseCard.vue`

Props:
- `title` (String): 卡片标题
- `icon` (String): 标题图标
- `value` (String/Number): 显示值
- `unit` (String): 单位

使用示例:

```vue
<template>
  <BaseCard 
    title="总数据量" 
    icon="el-icon-data-line"
    :value="12345" 
    unit="条" 
  />
</template>

<script>
import BaseCard from '@/components/card/baseCard.vue';

export default {
  components: { BaseCard }
}
</script>
```

#### CircleCard - 圆形卡片

位置: `src/components/card/circleCard.vue`

用于显示百分比数据的圆形进度卡片。

#### UserCard - 用户卡片

位置: `src/components/card/userCard.vue`

用于显示用户信息的卡片组件。

### 表格组件

#### TableBase - 基础表格

位置: `src/components/table/tableBase.vue`

支持分页、排序、筛选的基础表格组件。

Props:
- `data` (Array): 表格数据
- `columns` (Array): 列配置
- `pagination` (Object): 分页配置

使用示例:

```vue
<template>
  <TableBase 
    :data="tableData" 
    :columns="columns"
    :pagination="pagination"
  />
</template>

<script>
import TableBase from '@/components/table/tableBase.vue';

export default {
  components: { TableBase },
  data() {
    return {
      tableData: [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '李四', age: 30 }
      ],
      columns: [
        { prop: 'id', label: 'ID', width: 80 },
        { prop: 'name', label: '姓名', width: 120 },
        { prop: 'age', label: '年龄', width: 80 }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      }
    }
  }
}
</script>
```

#### TableColor - 彩色表格

位置: `src/components/table/tableColor.vue`

支持根据数据状态显示不同颜色的表格组件。

### 其他通用组件

#### SearchInput - 搜索输入框

位置: `src/components/searchInput.vue`

带搜索图标的输入框组件。

#### ProgressBar - 进度条

位置: `src/components/progressBar/index.vue`

自定义样式的进度条组件。

#### Progress - 进度圈

位置: `src/components/progress/index.vue`

圆形进度指示器组件。

## API 封装

### Request 配置

项目使用 Axios 进行 HTTP 请求封装,配置文件位于 `src/utils/request.js`。

### 基础配置

```javascript
const service = axios.create({
  baseURL: process.env.VUE_APP_MOCK_API_URL,
  timeout: 600000
})
```

### 请求拦截器

在请求发送前进行数据处理:

```javascript
service.interceptors.request.use(
  config => {
    // 处理 Content-Type
    const flag = config.headers['Content-Type'] && 
                 config.headers['Content-Type'].indexOf('application/json') !== -1
    
    if (!flag) {
      // 非 JSON 格式,使用 qs 序列化
      config.data = qs.stringify(config.data)
    } else {
      // JSON 格式,确保有数据对象
      if (config.data === undefined || config.data === null) {
        config.data = {}
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```

### 响应拦截器

统一处理响应数据和错误:

```javascript
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 处理文件下载
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 处理错误响应
    if (response.status !== 200) {
      if (res.msg) {
        Message.error(res.msg)
      }
      return Promise.reject(res)
    }
    
    return res
  },
  error => {
    if (error.response) {
      const response = error.response
      if (response.status == 500) {
        Message.error('网络错误，请检查您的网络')
      } else if (response.data && response.data.msg) {
        Message.error(response.data.msg)
      }
    }
    return Promise.reject(error)
  }
)
```

### API 调用示例

创建 API 模块 `src/utils/api/test.js`:

```javascript
import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/api/users',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function updateUser(id, data) {
  return request({
    url: `/api/users/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}
```

在组件中使用:

```javascript
import { getUserList, createUser } from '@/utils/api/test'

export default {
  methods: {
    async fetchUsers() {
      try {
        const res = await getUserList({ page: 1, size: 10 })
        this.users = res.data
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    },
    
    async addUser() {
      try {
        await createUser({
          name: '张三',
          age: 25
        })
        this.$message.success('创建成功')
        this.fetchUsers()
      } catch (error) {
        console.error('创建用户失败:', error)
      }
    }
  }
}
```

### 环境变量配置

项目支持多环境配置,通过 `.env` 文件管理:

#### `.env.development` - 开发环境

```bash
VUE_APP_BASE_API = http://localhost:3000
VUE_APP_MY_API_URL = http://10.67.8.183:3000
VUE_APP_MOCK_API_URL = http://127.0.0.1:4523/m1/5824754-5510165-default
VUE_APP_WINDOW_BASE_URL = http://10.67.8.191:3666
VUE_APP_WINDOW_VIDEO_BASE_URL = ws://10.67.8.183:9999
VUE_APP_RUN_PORT = 3666
NODE_ENV = 'development'
```

#### `.env.production` - 生产环境

```bash
VUE_APP_BASE_API = https://api.production.com
VUE_APP_MOCK_API_URL = https://api.production.com
NODE_ENV = 'production'
```

在代码中使用环境变量:

```javascript
const apiUrl = process.env.VUE_APP_BASE_API
const runPort = process.env.VUE_APP_RUN_PORT
```

## WDP API 集成

### 简介

项目深度集成了 51WORLD WDP (Web Digital Platform) API,用于实现 3D 场景的交互和控制。

### WDP API 模块

#### Camera API - 相机控制

位置: `src/utils/wdpapi/camera.js`

提供相机位置、角度、视野等控制功能。

**主要方法:**

##### resetCamera - 重置相机

```javascript
import { resetCamera } from '@/utils/wdpapi/camera'

// 重置到默认位置
await resetCamera()

// 重置到指定位置
await resetCamera([113.726, 34.764, 596.292])
```

##### FocusByCustomId - 聚焦到实体

```javascript
import { FocusByCustomId } from '@/utils/wdpapi/camera'

// 聚焦到指定 customId 的实体
await FocusByCustomId('building_001', 0, -40, 0.8)
```

参数说明:
- `customId` (String): 实体的自定义 ID
- `yaw` (Number): 偏航角 (-180~180)
- `pitch` (Number): 俯仰角 (-90~0)
- `distanceFactor` (Number): 视野参数 (0.1~1)

##### FocusByPoints - 聚焦到坐标点

```javascript
import { FocusByPoints } from '@/utils/wdpapi/camera'

// 聚焦到指定坐标
await FocusByPoints([113.726, 34.764, 100], 0, -90, -110)
```

#### Entity API - 实体操作

位置: `src/utils/wdpapi/entity.js`

提供实体的创建、更新、删除等操作。

**主要方法:**

##### createEntity - 创建实体

```javascript
import { createEntity } from '@/utils/wdpapi/entity'

const entityData = {
  customId: 'marker_001',
  type: 'Marker',
  position: [113.726, 34.764, 100],
  properties: {
    name: '标记点1',
    color: '#FF0000'
  }
}

await createEntity(entityData)
```

##### updateEntity - 更新实体

```javascript
import { updateEntity } from '@/utils/wdpapi/entity'

await updateEntity('marker_001', {
  position: [113.727, 34.765, 100],
  properties: {
    color: '#00FF00'
  }
})
```

##### deleteEntity - 删除实体

```javascript
import { deleteEntity } from '@/utils/wdpapi/delete'

await deleteEntity('marker_001')
```

#### Custom API - 自定义功能

位置: `src/utils/wdpapi/custom.js`

提供自定义的 WDP 功能封装。

#### Tool API - 工具函数

位置: `src/utils/wdpapi/tool.js`

提供 WDP 相关的工具函数。

### WDP Mixin 使用

项目为每个页面模块提供了 WDP Mixin,位于 `src/views/page_*/page_*_*/mixins/wdpapi.js`。

使用示例:

```javascript
import wdpapiMixin from './mixins/wdpapi'

export default {
  mixins: [wdpapiMixin],
  
  mounted() {
    // Mixin 中的方法可以直接使用
    this.initWdpScene()
  },
  
  methods: {
    async initWdpScene() {
      // 重置相机
      await this.resetCamera()
      
      // 创建标记点
      await this.createMarker([113.726, 34.764, 100])
    }
  }
}
```

### WDP 初始化流程

1. 在 Vuex Store 中存储 WDP App 实例
2. 通过 Store 获取 App 实例进行操作
3. 使用封装的 API 方法进行场景交互

```javascript
// 在组件中获取 WDP App
const App = this.$store.state.wdpApp

// 调用 WDP 原生 API
await App.CameraControl.UpdateCamera(cameraConfig)
```

## 状态管理

### Vuex Store 结构

项目使用 Vuex 进行全局状态管理,配置文件位于 `src/store/index.js`。

### State 状态

| 状态名 | 类型 | 说明 |
|--------|------|------|
| `wdpApp` | Object | WDP 应用实例 |
| `isShowScene` | Boolean | 是否显示 3D 场景 |
| `isSceneAlready` | Boolean | 场景是否已加载 |
| `isShowWindow` | Object | 窗口显示状态和配置 |
| `wdpConfig` | Object | WDP 配置信息 |
| `windowEid` | String | 窗口实体 ID |
| `windowEidChild` | Object | 子窗口实体 ID |
| `trackPath` | Object | 轨迹路径数据 |
| `isShowWebTwo` | Object | Web 窗口显示状态 |
| `aiBotRouteState` | Object | AI 机器人巡检路线状态 |
| `aiBotWindowId` | String | AI 机器人窗口 ID |
| `setDarkenStatus` | Object | 环境压暗状态 |

### Mutations 方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `wdpApp` | newVal | 设置 WDP 应用实例 |
| `wdpConfig` | newVal | 设置 WDP 配置 |
| `isShowScene` | newVal | 设置场景显示状态 |
| `isSceneAlready` | newVal | 设置场景加载状态 |
| `setWindowEid` | newVal | 设置窗口实体 ID |
| `setWindowEidChild` | newVal | 设置子窗口实体 ID |
| `isShowWindow` | newVal | 设置窗口显示状态 |
| `setTrackPath` | newVal | 设置轨迹路径 |
| `isShowWebTwo` | newVal | 设置 Web 窗口状态 |
| `setAiBotRouteState` | newVal | 设置 AI 机器人路线状态 |
| `setAiBotWindowId` | newVal | 设置 AI 机器人窗口 ID |
| `setDarkenStatus` | newVal | 设置环境压暗状态 |

### 使用示例

#### 在组件中读取状态

```javascript
export default {
  computed: {
    wdpApp() {
      return this.$store.state.wdpApp
    },
    isShowScene() {
      return this.$store.state.isShowScene
    }
  }
}
```

#### 在组件中修改状态

```javascript
export default {
  methods: {
    initWdp(app) {
      // 提交 mutation
      this.$store.commit('wdpApp', app)
    },
    
    toggleScene() {
      this.$store.commit('isShowScene', !this.$store.state.isShowScene)
    },
    
    openWindow(config) {
      this.$store.commit('isShowWindow', {
        isShow: true,
        config: config
      })
    }
  }
}
```

## Mixins 复用

### ECharts Mixin

位置: `src/mixins/echartsMixin.js`

提供 ECharts 图表的通用逻辑,包括自动 resize、销毁等。

使用示例:

```javascript
import echartsMixin from '@/mixins/echartsMixin'

export default {
  mixins: [echartsMixin],
  
  mounted() {
    this.initChart()
  },
  
  methods: {
    initChart() {
      // Mixin 提供的方法
      this.chart = this.createChart(this.$refs.chart)
      this.chart.setOption(this.chartOptions)
    }
  }
}
```

### Table Mixin

位置: `src/mixins/tableMixin.js`

提供表格的通用逻辑,包括分页、排序、筛选等。

### List Mixin

位置: `src/mixins/listMixin.js`

提供列表的通用逻辑,包括数据加载、刷新等。

### Tool Cleanup Mixin

位置: `src/mixins/toolCleanupMixin.js`

提供工具清理的通用逻辑,用于组件销毁时清理资源。

## 开发指南

### 代码规范

项目使用 ESLint 进行代码规范检查,配置文件为 `.eslintrc.js`。

### 命名约定

#### 文件命名
- 组件文件: 使用 PascalCase (如 `BaseCard.vue`)
- 工具文件: 使用 camelCase (如 `request.js`)
- 页面文件: 使用 kebab-case (如 `page-1.vue`)

#### 变量命名
- 常量: 使用 UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- 变量: 使用 camelCase (如 `userName`)
- 组件名: 使用 PascalCase (如 `BaseCard`)

#### 函数命名
- 使用 camelCase
- 动词开头 (如 `getUserInfo`, `handleClick`)

### 组件开发规范

#### 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script>
export default {
  name: 'ComponentName',
  
  components: {},
  
  props: {},
  
  data() {
    return {}
  },
  
  computed: {},
  
  watch: {},
  
  created() {},
  
  mounted() {},
  
  methods: {},
  
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
/* 样式内容 */
</style>
```

#### Props 定义

```javascript
props: {
  title: {
    type: String,
    required: true,
    default: ''
  },
  value: {
    type: [String, Number],
    default: 0
  },
  options: {
    type: Object,
    default: () => ({})
  }
}
```

### 样式编写规范

#### 使用 SCSS

项目使用 SCSS 作为 CSS 预处理器,支持变量、嵌套、混入等特性。

```scss
.component {
  width: 100%;
  height: 100%;
  
  &-header {
    font-size: 16px;
    font-weight: bold;
  }
  
  &-content {
    padding: 20px;
    
    .item {
      margin-bottom: 10px;
    }
  }
}
```

#### 使用 Scoped

组件样式使用 `scoped` 避免样式污染:

```vue
<style lang="scss" scoped>
.component {
  /* 样式只作用于当前组件 */
}
</style>
```

#### 全局样式

全局样式定义在 `src/assets/css/` 目录下:
- `main.scss` - 主样式文件
- `btn.scss` - 按钮样式
- `dialog.scss` - 弹窗样式
- `table.scss` - 表格样式
- `font.scss` - 字体样式

### 性能优化建议

#### 路由懒加载

使用动态 import 实现路由懒加载:

```javascript
{
  path: '/page',
  component: () => import('@/views/page/index.vue')
}
```

#### 组件懒加载

对于大型组件,使用异步组件:

```javascript
components: {
  HeavyComponent: () => import('@/components/HeavyComponent.vue')
}
```

#### 图片优化

- 使用适当的图片格式 (WebP、PNG、JPG)
- 压缩图片大小
- 使用雪碧图减少请求

#### 防抖和节流

对于频繁触发的事件,使用防抖或节流:

```javascript
import { debounce } from 'throttle-debounce'

export default {
  methods: {
    handleSearch: debounce(500, function(keyword) {
      // 搜索逻辑
    })
  }
}
```

#### Keep-Alive 缓存

对于需要缓存的页面,使用 keep-alive:

```vue
<keep-alive>
  <router-view v-if="$route.meta.keepAlive" />
</keep-alive>
<router-view v-if="!$route.meta.keepAlive" />
```

## 最佳实践

### 1. 使用路径别名

项目配置了路径别名,避免使用相对路径:

```javascript
// ❌ 不推荐
import Component from '../../../components/Component.vue'

// ✅ 推荐
import Component from '@/components/Component.vue'
```

可用别名:
- `@` -> `src/`
- `@components` -> `src/components/`
- `@utils` -> `src/utils/`
- `@assets` -> `src/assets/`
- `@images` -> `src/assets/images/`

### 2. 统一错误处理

使用 try-catch 捕获异步错误:

```javascript
async fetchData() {
  try {
    const res = await api.getData()
    this.data = res.data
  } catch (error) {
    console.error('获取数据失败:', error)
    this.$message.error('数据加载失败')
  }
}
```

### 3. 组件通信

- 父子组件: 使用 props 和 $emit
- 跨级组件: 使用 provide/inject 或 Vuex
- 兄弟组件: 使用事件总线或 Vuex

### 4. 避免内存泄漏

在组件销毁时清理资源:

```javascript
export default {
  data() {
    return {
      timer: null,
      chart: null
    }
  },
  
  beforeDestroy() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    // 销毁图表实例
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  }
}
```

### 5. 合理使用计算属性

对于需要计算的数据,使用 computed 而不是 methods:

```javascript
// ✅ 推荐
computed: {
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

// ❌ 不推荐
methods: {
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
```

### 6. 使用 v-if 和 v-show

- `v-if`: 条件渲染,适用于不频繁切换的场景
- `v-show`: 显示隐藏,适用于频繁切换的场景

### 7. 列表渲染使用 key

使用唯一的 key 提高列表渲染性能:

```vue
<div v-for="item in list" :key="item.id">
  {{ item.name }}
</div>
```

### 8. 避免在模板中使用复杂表达式

```vue
<!-- ❌ 不推荐 -->
<div>{{ user.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') }}</div>

<!-- ✅ 推荐 -->
<div>{{ formattedUserName }}</div>

<script>
computed: {
  formattedUserName() {
    return this.user.name
      .split(' ')
      .map(n => n.charAt(0).toUpperCase() + n.slice(1))
      .join(' ')
  }
}
</script>
```

## 常见问题

### 1. 如何配置代理解决跨域问题?

在 `vue.config.js` 中配置 devServer.proxy:

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://backend-server.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

### 2. 如何全局注册组件?

在 `main.js` 中注册:

```javascript
import BaseCard from '@/components/card/baseCard.vue'

Vue.component('BaseCard', BaseCard)
```

### 3. 如何使用自定义指令?

项目已包含点击防抖指令,使用方式:

```vue
<button v-debounce @click="handleClick">点击</button>
```

### 4. 如何调试 WDP 场景?

在浏览器控制台中访问 WDP App 实例:

```javascript
// 获取 App 实例
const app = window.$store.state.wdpApp

// 调用 API
await app.CameraControl.GetCameraInfo()
```

## 许可证

本项目由 Hua<51world> 开发维护。

## 联系方式

如有问题或建议,请联系项目维护者。

---

**Happy Coding! 🎉**
