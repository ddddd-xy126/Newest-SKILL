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
    const uiWidth = 1920;
    // 当前屏幕宽度
    const width = window.innerWidth;
    // 等比例计算
    return (fontSize * width) / uiWidth;
  }
};

/**
 * WDP 弹窗专用尺寸换算
 *
 * 弹窗在独立 iframe 中渲染，viewport width = 弹窗像素宽度。
 * 根字号被设为 1.8vw，pxToRem / countFontsize 均失效。
 *
 * 本函数将设计稿 px 值按 (实际 viewport / 设计宽度) 等比缩放为真实像素，
 * 供 ECharts option 等需要 JS 数值的场景使用。
 *
 * @param {number} px        - 设计稿上的 px 值
 * @param {number} designWidth - 设计稿弹窗宽度，默认 314
 * @returns {number} 实际像素值（最小 1px）
 *
 * 用法：
 *   import { wPx } from "@/utils/wdpWindowScale";
 *   fontSize: wPx(10)       // 314 设计宽
 *   fontSize: wPx(10, 250)  // 250 设计宽
 */
export const wPx = (px, designWidth = 314) =>
  Math.max(1, Math.round(px * window.innerWidth / designWidth));