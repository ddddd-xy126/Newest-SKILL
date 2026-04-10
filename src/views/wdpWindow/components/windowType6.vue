<template>
    <div class="container">
        <echarts-base class="radar-chart" :option="option" width="100%" ratio="339/212" />
    </div>
</template>

<script>
import echartsBase from "@/components/echarts/index.vue";
import { countFontsize } from "@utils/countFontsize.js";

export default {
    name: "RadarChart",
    components: { echartsBase },
    props: {
        config: {
            type: Object,
            default: () => ({
                categories: [
                    "网络性能",
                    "信号与干扰",
                    "接入成功率",
                    "设备环境",
                    "网络协议",
                    "网络状态",
                ],
                data: [
                    {
                        name: "数据1",
                        value: [99.93, 99.29, 97.91, 98.96, 99.09, 97.77],
                    },
                ],
            }),
        },
    },
    data() {
        return {
            option: null
        };
    },
    created() {
        const { categories, data, total } = JSON.parse(this.config.data);
        if (categories.length && data.length) {
            this.option = this.radarOption(categories, data, total);
        } else {
            this.option = this.radarOption(null, null, null, true); // 默认数据
        }
    },
    methods: {
        radarOption: (categories, data, total) => {
            const colorList = ['33, 149, 224', '255, 158, 68', '255, 99, 132', '54, 162, 235', '153, 102, 255'];
            const indicator = categories.map((category, index) => ({
                name: category,
                max: total,
            }));

            const series = data.map((item, index) => {
                return {
                    type: 'radar',
                    data: [
                        {
                            value: item.value,
                            name: item.name,
                            label: {
                                show: true,
                                color: '#D3DFF6',
                                fontSize: countFontsize(108),
                                formatter: (params) => {
                                    return params.value + '%';
                                }
                            },
                            areaStyle: {
                                color: `rgba(${colorList[index]}, 0.5)`
                            },
                            lineStyle: {
                                color: `rgba(${colorList[index]}, 1)`,
                                width: countFontsize(10)
                            },
                            symbol: 'circle',
                            symbolSize: countFontsize(20),
                            itemStyle: {
                                color: '#fff',
                                borderColor: 'rgba(67, 234, 238, 0.3)',
                                borderWidth: countFontsize(40)
                            }
                        }
                    ]
                }
            });

            return {
                backgroundColor: 'transparent',
                radar: {
                    radius: '70%',
                    splitNumber: 6,
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(99, 108, 129, 0.5)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: [
                                'rgba(182, 189, 202, 0.2)',
                                'rgba(182, 189, 202, 0.6)',
                                'rgba(182, 189, 202, 0.5)',
                                'rgba(182, 189, 202, 0.3)',
                                'rgba(182, 189, 202, 0.2)',
                                'rgba(182, 189, 202, 0.2)',
                            ]
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: [
                                'rgba(83, 83, 110, 0.99)',
                                'rgba(83, 83, 110, 0.95)',
                                'rgba(83, 83, 110, 0.9)',
                                'rgba(83, 83, 110, 0.7)',
                                'rgba(83, 83, 110, 0.3)',
                                'rgba(83, 83, 110, 0)',
                            ]
                        }
                    },
                    indicator,
                    nameGap: countFontsize(132), // 调整标签与雷达图的距离，值越大距离越远
                    name: {
                        textStyle: {
                            fontSize: countFontsize(134), // 你想要的字体大小
                            color: "#C0DCE7"
                        }
                    }
                },
                series
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .radar-chart {
        width: 100%;
        height: 100%;
        z-index: 10;
    }
}
</style>
