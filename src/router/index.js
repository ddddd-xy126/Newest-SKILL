/**
 * Vue Router 路由配置 - 包含路由守卫
 *
 * 路由结构:
 * / (根路径)
 * ├── /page_1 (第一个页面模块)
 * │   ├── /page_1/1 (子页面1)
 * │   ├── /page_1/2 (子页面2)
 * │   ├── /page_1/3 (子页面3)
 * │   └── /page_1/4 (子页面4)
 * ├── /page_2 (第二个页面模块)
 * ├── /page_3 (第三个页面模块)
 * └── /page_4 (第四个页面模块)
 *
 * @author Hua<51world>
 */

import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from "element-ui";
import store from "@/store"; // 引入 Vuex store

// 注册 Vue Router 插件
Vue.use(VueRouter);

// 解决 Vue Router 重复导航的警告问题
// 重写 push 方法，捕获并忽略重复导航错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

/**
 * 路由配置数组
 * 采用嵌套路由结构，支持多级页面导航
 */
const routes = [
  {
    path: "/",
    component: () => import("@/views/index.vue"),
    redirect: "/page_1",
    meta: {
      title: "数据可视化大屏",
      requiresAuth: false, // 是否需要认证
      keepAlive: true, // 是否缓存组件
      showInMenu: false, // 是否在菜单中显示
    },
    children: [
      {
        path: "/page_1",
        component: () => import("@/views/page_1/index.vue"),
        redirect: "/page_1/1",
        meta: {
          title: "综合态势",
          requiresAuth: false,
          keepAlive: true,
          showInMenu: true,
        },
        children: [
          {
            path: "1",
            name: "page_1_1",
            component: () => import("@/views/page_1/page_1_1/index.vue"),
            meta: {
              title: "综合态势",
              requiresAuth: false,
              keepAlive: true,
              showInMenu: true,
            },
          },
        ],
      },
      {
        path: "/page_2",
        component: () => import("@/views/page_2/index.vue"),
        redirect: "/page_2/1",
        meta: {
          title: "综合安防",
          requiresAuth: false,
          keepAlive: true,
          showInMenu: true,
        },
        children: [
          {
            path: "1",
            name: "page_2_1",
            component: () => import("@/views/page_2/page_2_1/index.vue"),
            meta: {
              title: "综合安防",
              requiresAuth: false,
              keepAlive: true,
              showInMenu: true,
            },
          },
        ],
      },
      {
        path: "/page_3",
        component: () => import("@/views/page_3/index.vue"),
        redirect: "/page_3/1",
        meta: {
          title: "便捷通行",
          requiresAuth: false,
          keepAlive: true,
          showInMenu: true,
        },
        children: [
          {
            path: "1",
            name: "page_3_1",
            component: () => import("@/views/page_3/page_3_1/index.vue"),
            meta: {
              title: "便捷通行",
              requiresAuth: false,
              keepAlive: true,
              showInMenu: true,
            },
          },
        ],
      },
      {
        path: "/page_4",
        component: () => import("@/views/page_4/index.vue"),
        redirect: "/page_4/1",
        meta: {
          title: "能效管理",
          requiresAuth: false,
          keepAlive: true,
          showInMenu: true,
        },
        children: [
          {
            path: "1",
            name: "page_4_1",
            component: () => import("@/views/page_4/page_4_1/index.vue"),
            meta: {
              title: "能效管理",
              requiresAuth: false,
              keepAlive: true,
              showInMenu: true,
            },
          },
        ],
      },
    ],
  },
  // 404 错误页面
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: "页面不存在",
      requiresAuth: false,
      showInMenu: false,
    },
  },
  // 403 权限不足页面
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403.vue"),
    meta: {
      title: "权限不足",
      requiresAuth: false,
      showInMenu: false,
    },
  },
  // 通配符路由，重定向到404页面
  {
    path: "*",
    redirect: "/404",
  },
];

// 创建路由实例
const router = new VueRouter({
  mode: "hash",
  routes,
});

/**
 * 检查用户是否有访问权限
 * @param {Array} requiredRoles 需要的角色权限
 * @param {Array} userRoles 用户拥有的角色
 * @returns {Boolean} 是否有权限
 */
function hasPermission(requiredRoles, userRoles) {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * 获取用户认证状态
 * @returns {Boolean} 是否已认证
 */
function isAuthenticated() {
  // 这里可以检查 token、session 等
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token;
}

/**
 * 获取用户角色
 * @returns {Array} 用户角色数组
 */
function getUserRoles() {
  // 从 store 或 localStorage 获取用户角色
  const userInfo =
    store.getters.userInfo ||
    JSON.parse(localStorage.getItem("userInfo") || "{}");
  return userInfo.roles || ["guest"];
}

/**
 * 全局前置守卫
 * 在路由跳转前进行权限验证、登录检查等
 */
router.beforeEach((to, from, next) => {
  console.log("路由跳转:", from.path, "->", to.path);

  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - 数据可视化大屏`;
  }

  // 显示加载状态
  if (store.state.loading !== undefined) {
    store.commit("setLoading", true);
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      Message.warning("请先登录");
      // 可以跳转到登录页面
      // next('/login');
      // 或者显示登录弹窗
      next(false); // 阻止跳转
      return;
    }

    // 检查角色权限
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRoles = getUserRoles();
      if (!hasPermission(to.meta.roles, userRoles)) {
        Message.error("权限不足，无法访问该页面");
        next("/403"); // 跳转到权限不足页面
        return;
      }
    }
  }

  // 记录访问日志
  console.log(`用户访问页面: ${to.path}, 时间: ${new Date().toLocaleString()}`);

  // 继续路由跳转
  next();
});

/**
 * 全局后置守卫
 * 在路由跳转完成后执行，用于隐藏加载状态、记录访问统计等
 */
router.afterEach((to, from) => {
  // 隐藏加载状态
  if (store.state.loading !== undefined) {
    store.commit("setLoading", false);
  }

  // 记录页面访问统计
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "GA_MEASUREMENT_ID", {
      page_path: to.path,
    });
  }

  // 滚动到页面顶部
  window.scrollTo(0, 0);

  console.log("路由跳转完成:", to.path);
});

/**
 * 路由错误处理
 * 捕获路由过程中的错误
 */
router.onError((error) => {
  console.error("路由错误:", error);
  Message.error("页面加载失败，请刷新重试");

  // 隐藏加载状态
  if (store.state.loading !== undefined) {
    store.commit("setLoading", false);
  }
});

/**
 * 路由实例方法扩展
 */

/**
 * 安全的路由跳转方法
 * @param {String|Object} location 跳转位置
 * @param {Function} onComplete 成功回调
 * @param {Function} onAbort 失败回调
 */
router.safePush = function (location, onComplete, onAbort) {
  return this.push(location, onComplete, onAbort).catch((err) => {
    if (err.name !== "NavigationDuplicated") {
      console.error("路由跳转失败:", err);
      Message.error("页面跳转失败");
    }
  });
};

/**
 * 检查当前路由是否匹配
 * @param {String} path 路径
 * @returns {Boolean} 是否匹配
 */
router.isCurrentRoute = function (path) {
  return this.currentRoute.path === path;
};

/**
 * 获取面包屑导航数据
 * @returns {Array} 面包屑数组
 */
router.getBreadcrumb = function () {
  const matched = this.currentRoute.matched;
  return matched
    .filter((item) => item.meta && item.meta.title)
    .map((item) => ({
      title: item.meta.title,
      path: item.path,
    }));
};

export default router;
