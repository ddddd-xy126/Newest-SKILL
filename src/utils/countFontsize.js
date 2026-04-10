export const countFontsize = (fontSize) => {
  //约定自适应模式

  const isDev = false; //false

  //如果main.scss中使用了vw来迎合客户大屏自适应，那么这里的isDev要改为false

  if (isDev) {
    return fontSize;
  } else {
    const uiWidth = 3840;
    const width = window.innerWidth;
    return (fontSize * width) / uiWidth;
  }
  
};

export const fontColor = (op = 0.6) => {
  return `rgba(255, 255, 255 , ${op})`;
}
