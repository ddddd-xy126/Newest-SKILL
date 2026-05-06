/**
 * 路由参数保持工具 - 简化版
 * 在路由跳转时自动保持指定的查询参数
 */

const cachedParams = {};
let persistParams = ['sceneUrl', 'sceneOrder'];

/**
 * Vue 插件
 */
export default {
  install(Vue, options = {}) {
    const router = options.router;
    persistParams = options.params || persistParams;

    // 从 URL 提取参数（兼容 hash 模式：参数在 # 之后）
    const urlParams = new URLSearchParams(window.location.search);
    const hashSearch = window.location.hash.includes('?')
      ? window.location.hash.split('?').slice(1).join('?')
      : '';
    const hashParams = new URLSearchParams(hashSearch);
    persistParams.forEach(key => {
      const value = urlParams.get(key) || hashParams.get(key) || router?.currentRoute?.query?.[key];
      if (value) cachedParams[key] = value;
    });

    // 路由守卫：自动添加参数
    if (router) {
      router.beforeEach((to, from, next) => {
        const newQuery = { ...to.query };
        let changed = false;

        persistParams.forEach(key => {
          if (cachedParams[key] && !newQuery[key]) {
            newQuery[key] = cachedParams[key];
            changed = true;
          } else if (newQuery[key]) {
            cachedParams[key] = newQuery[key];
          }
        });

        changed ? next({ ...to, query: newQuery }) : next();
      });
    }

    // 挂载到 Vue 实例
    Vue.prototype.$routeParams = {
      get: (key) => cachedParams[key],
      set: (key, value) => { cachedParams[key] = value; },
      getAll: () => ({ ...cachedParams })
    };
  }
};
