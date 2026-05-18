/**
 * ECharts 图表自适应工具函数
 * 
 * 用于根据屏幕宽度自动计算字体大小和颜色
 * 适配大屏可视化项目的响应式需求
 */

/**
 * 自适应字体大小计算
 * 
 * @description 根据设计稿宽度和当前屏幕宽度，等比例计算实际字体大小
 * @param {Number} fontSize - 设计稿字体大小（基于 3840px 设计稿）
 * @returns {Number} 计算后的实际字体大小
 * 
 * @example
 * // 设计稿上 24px 的字体，在不同屏幕上自适应
 * const size = countFontsize(24);
 * 
 * // 在 1920px 屏幕上返回 12
 * // 在 3840px 屏幕上返回 24
 */
export const countFontsize = (fontSize) => {
  // 开发模式开关
  // true: 返回原始字体大小（开发调试用）
  // false: 返回自适应计算后的字体大小（生产环境）
  const isDev = false;

  if (isDev) {
    return fontSize;
  } else {
    // 设计稿宽度（默认 3840px 大屏设计稿）
    const uiWidth = 3840;
    // 当前屏幕宽度
    const width = window.innerWidth;
    // 等比例计算
    return (fontSize * width) / uiWidth;
  }
};

/**
 * 字体颜色生成函数
 * 
 * @description 生成带透明度的白色字体颜色
 * @param {Number} op - 透明度，范围 0-1，默认 0.6
 * @returns {String} rgba 颜色字符串
 * 
 * @example
 * fontColor(0.8)  // 返回 "rgba(255, 255, 255, 0.8)"
 * fontColor()     // 返回 "rgba(255, 255, 255, 0.6)"
 */
export const fontColor = (op = 0.6) => {
  return `rgba(255, 255, 255, ${op})`;
};