<style lang="scss" scoped></style>
<template>
    <div class="charts" ref="container" :style="`width: ${width}; height: ${height}`">
    </div>

</template>
<script>


import { baseColumn } from "@/types/antvCharts/column.js"
import { nestedPie } from "@/types/antvCharts/pie.js"
import { liquid } from "@/types/antvCharts/liquid.js"

export default {

    props: {
        id: {
            type: Number,
            default: () => null,
        },

        data: {
            type: Object,
            default: () => null,
        },

        width: {
            type: String,
            default: () => "100%",
        },

        height: {
            type: String,
            default: () => "100%",
        },

        backgroundColor: {
            type: String,
            default: () => "#fff",
        },

        type: {
            type: String,
            default: () => "",
            validator: function (value) {
                return ['column', 'nestPie', 'liquid'].includes(value)
            }
        },

        hideDefaultContent: {
            type: Boolean,
            default: () => false,
        }
    },
    data() {
        return {
            CHART_TYPES: {
                COLUMN: 'column',
                NEST_PIE: 'nestPie',
                LIQUID: 'liquid',
            },
            chart: null
        };
    },
    mounted() {

        switch (this.type) {
            case this.CHART_TYPES.COLUMN:
                baseColumn(this.chart, this.data, this.$refs.container);
                break;
            case this.CHART_TYPES.NEST_PIE:
                // 确保 nestedPie 是同步函数，或在 async 函数中使用
                this.chart = nestedPie(this.chart, this.data, this.$refs.container);
                // 如果需要定时更新（取消注释并添加清理逻辑）
                break;
            case this.CHART_TYPES.LIQUID:
                // 确保 liquid 是同步函数，或在 async 函数中使用
                this.chart = liquid(this.chart, this.data, this.$refs.container, this.backgroundColor, this.hideDefaultContent);

                break;
            default:
                console.warn('未指定有效的图表类型，支持类型：column/nestPie/liquid');
                break;
        }

    },

    methods: {
        updateBarChart(chart) {
            const interval = chart.getNodesByType('interval');
            interval.forEach(e => {
                // 模拟并且更新 Interval 的数据
                const newData = e.data().map((d) => ({
                    ...d,
                    frequency: Math.random() * 400 + 100,
                }));

                e.data(newData);
            });

            // 重新渲染
            chart.render();
        }
    },


};
</script>
