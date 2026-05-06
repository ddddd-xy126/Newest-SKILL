# 新项目 ECharts 环境配置指南

本文档指导在全新的 Vue 项目中配置 ECharts 图表开发环境。

## 1. 安装依赖

```bash
npm install echarts
```

## 2. 创建目录结构

```
src/
├── components/
│   └── echarts/
│       └── index.vue          # 基础渲染组件
├── types/
│   └── echarts/
│       └── bar.js             # 柱状图配置项
├── utils/
│   └── countFontsize.js       # 工具函数
└── views/
    └── your-page/
        └── components/
            └── yourChart.vue  # 私有化图表组件
```

## 3. 创建基础渲染组件

将 `assets/templates/echarts-base.vue` 复制到 `src/components/echarts/index.vue`

## 4. 创建工具函数

将 `assets/utils/countFontsize.js` 复制到 `src/utils/countFontsize.js`

## 5. 创建配置项文件

将 `assets/options/bar.js` 复制到 `src/types/echarts/bar.js`

## 6. 配置路径别名

在 `vue.config.js` 或 `vite.config.js` 中配置：

```javascript
// vue.config.js (Vue CLI)
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      }
    }
  }
};
```

```javascript
// vite.config.js (Vite)
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    }
  }
});
```

## 7. 使用图表

参考 `assets/templates/chart-wrapper.vue` 创建私有化图表组件，然后在页面中引用。
