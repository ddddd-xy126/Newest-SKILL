import { Chart } from '@antv/g2';
import { countFontsize } from "@utils/countFontsize.js";
export function liquid(chart, data, container, backgroundFill, hideDefaultContent) {
    try {
        const chart = new Chart({
            container,
            autoFit: true,
            padding: [0, 0, 0, 0]
        });
        // console.log('data', data)
        const percent = ((data.value / 1) * 100).toFixed(2) + '%';
        chart.liquid().data(data.value).style({
            backgroundFill: `r(0.5, 0.5, 0.5) 0:${backgroundFill}80 0.3:${backgroundFill}70  1:${backgroundFill}00`,
            fill: `l(90) 0:${backgroundFill} 0.1:${backgroundFill}80 0.2:${backgroundFill}50 0.3:${backgroundFill}25 0.5:${backgroundFill}00 1:${backgroundFill}00`,
            outlineBorder: 0,
            outlineDistance: 0,
            contentFontSize: countFontsize(25),
            contentFontWeight: 400,
            contentDy: 5,
            waveLength: 60,
            waveCount: 5,
            contentFill: '#fff',
            ...(hideDefaultContent ? { contentText: `${data.name || ''}\n\n${percent}` } : {})
        });

        chart.render();
    } catch (error) {
        console.log(error);
    }
}