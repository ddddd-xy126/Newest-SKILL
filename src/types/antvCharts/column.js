
import { Chart } from "@antv/g2";

export function baseColumn(chart, data, container) {
    try {
        chart = new Chart({
            container
        });

        chart.options({
            type: "interval",
            autoFit: true,
            data: data.data,
            encode: { x: "letter", y: "frequency" },
        });


        chart.render();

    } catch (err) {
        console.log(err);
    }
}




