<style lang="scss" scoped>
.pie-chart {
    width: 100%;
    height: 100%;
}
</style>

<template>
    <div :ref="`pie3D_${id}`" class="pie-chart"></div>
</template>

<script>

import * as echarts from 'echarts';
import { getPie3D, getParametricEquation } from '@/types/echarts/3Dcharts/normal3DBar.js';
import 'echarts-gl';

export default {
    name: 'custom3Dpie',
    components: {},
    props: {
        id: {
            type: Number,
            default: 1
        },
        title: {
            type: String,
            default: '3D饼图'
        },
        dataOption: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            pie3DChart: null,
            intervalId: null,
            options: {},
            pipeYData: []
        };
    },
    mounted() {
        this.drawPie3D();
    },
    methods: {
        drawPie3D() {
            this.pie3DChart = echarts.init(this.$refs[`pie3D_${this.id}`]);

            const colors = this.dataOption.map(item => item.color);
            const xData = this.dataOption.map(item => item.label);
            const originalData = this.dataOption.map(item => item.data);


            let sum = originalData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            this.pipeYData = originalData.map(value => {
                return (value / sum) * 100;
            });
            this.option = getPie3D(xData, originalData, colors, 0.8);
            this.pie3DChart.setOption(this.option);
            // this.loopSelect();


            let hoveredIndex = '';
            let selectedIndex = '';
            const that = this;
            // 监听 mouseover，近似实现高亮（放大）效果
            this.pie3DChart.on('click', function (params) {
                selectedIndex = params.seriesIndex;
                that.option.series.forEach((item, index) => {
                    if (item.pieData) {
                        item.pieStatus.selected = selectedIndex === index;
                        item.parametricEquation = getParametricEquation(item.pieData.startRatio, item.pieData.endRatio, item.pieStatus.selected, false, 1, that.pipeYData[selectedIndex]);
                    }
                });

                // 使用更新后的 option，渲染图表
                that.pie3DChart.setOption(that.option);
            });
        },
        loopSelect() {
            const that = this;
            let index = 0;
            this.intervalId = setInterval(() => {
                console.log('that.pie3DChart ', that.pie3DChart);
                if (that.pie3DChart) {
                    that.option.series.forEach((item, i) => {
                        if (item.pieData) {
                            item.pieStatus.selected = i === index;
                            item.parametricEquation = getParametricEquation(item.pieData.startRatio, item.pieData.endRatio, item.pieStatus.selected, false, 1, that.pipeYData[index]);
                        }
                    });
                    that.pie3DChart.setOption(this.option);
                    that.pie3DChart.dispatchAction({
                        type: 'showTip',
                        name: '进行中'
                    });
                    if (index === 2) {
                        index = 0;
                    } else {
                        index++;
                    }
                }
            }, 3000);
        }
    },
    beforeDestroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
};
</script>