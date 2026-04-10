/**
 * 获取config.json文件的正确路径
 * 根据环境和部署路径动态计算
 * @returns {string} config.json的路径
 */
export function getConfigPath() {
  // 开发环境直接使用根路径
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境，使用根路径: /config.json');
    return '/config.json';
  }

  // 生产环境：获取当前页面的路径，提取应用根目录
  const pathname = window.location.pathname;
  console.log('当前路径:', pathname);

  // 从路径中提取应用根目录
  // 例如: /0ecb6b052d97f0cb41b638a77f02d551/page_1/1 -> /0ecb6b052d97f0cb41b638a77f02d551/
  const pathSegments = pathname.split('/').filter(segment => segment);
  let appBasePath = '/';

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    // 判断第一个路径段是否为页面路由（如 page_1, page_2 等）
    // 如果是页面路由，说明应用部署在根目录
    if (firstSegment.startsWith('page_')) {
      appBasePath = '/';
      console.log('检测到页面路由，应用部署在根目录');
    } else {
      // 否则第一个路径段是应用目录
      appBasePath = `/${firstSegment}/`;
      console.log('检测到应用目录:', firstSegment);
    }
  }

  const configPath = `${appBasePath}config.json`;
  console.log('生产环境，计算出的config路径:', configPath);
  return configPath;
}

/**
 * 加载config.json配置文件
 * @returns {Promise<Object>} 配置对象
 */
export async function loadConfig() {
  try {
    const response = await fetch(getConfigPath());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    console.log('配置加载成功:', config);
    return config;
  } catch (error) {
    console.error('配置加载失败:', error);
    throw error;
  }
}