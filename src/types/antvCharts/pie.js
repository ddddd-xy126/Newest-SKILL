
import { Chart } from "@antv/g2";

//基本饼图，可带中间的数据
export function nestedPie(chart, data, container) {
    try {
        const chart = new Chart({
            container,
        });
        //重叠复合图表用 spaceLayer 调用
        const layer = chart.spaceLayer()
        layer
            .interval()
            .data([
                { letter: 'A', frequency: 0.08167 },
                { letter: 'B', frequency: 0.01492 },
                { letter: 'C', frequency: 0.02782 },
                { letter: 'D', frequency: 0.04253 },
                { letter: 'E', frequency: 0.12702 },
                { letter: 'F', frequency: 0.02288 },
                { letter: 'G', frequency: 0.02015 },
            ])
            .attr("x", 75)
            .attr("y", 75)
            .attr("width", 150)
            .attr("height", 150)
            .coordinate({ type: "theta" })
            .transform({ type: "stackY" })
            .legend(false)
            // .scale('color',
            // {
            //     palette: 'blues',
            //     relations: [
            //         // ['E', 'red'], // dog 恒等映射为红色
            //     ],
            // }
            // )
            // "fill"  条件渲染颜色
            .style('fill',
                (datum, index, data) => {
                    const { frequency } = datum;
                    if (frequency > 0.1) return '#3376cd';
                    if (frequency > 0.05) return '#f4bb51';
                    return '#b43a29';
                }
            )
            .style('backgroundImage',
                "url('@images/tools.png')"
            )
            .encode("y", "frequency")
            .encode("color", "letter");
        layer
            .interval()
            .data(data.data)
            .transform({ type: "stackY" })
            .attr("x", 0)
            .attr("y", 0)
            .style("inset", 2)
            .style("radius", 10)
            .attr("width", 300)
            .attr("height", 300)
            .coordinate({ type: "theta", innerRadius: 0.9 })
            .transform({ type: "stackY" })
            .legend(false)
            .scale("color", {
                type: 'ordinal',
                range: ['l(0):0:#37b38e 1:#D9C652', 'l(0):0:#D9C652 1:#f96e3e'],
            })
            .encode("y", "frequency")
            .encode("color", "l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff");

        // 渲染可视化
        chart.render();
        return chart
    } catch (err) {
        console.error(err);
    }


}