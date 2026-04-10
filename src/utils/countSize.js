import store from '@/store/index.js';
export const countSize = (size) => {
    const width = store.state.wdpConfig.resolution[0];
    const uiWidth = 1920;
    return width / uiWidth * size;
};
