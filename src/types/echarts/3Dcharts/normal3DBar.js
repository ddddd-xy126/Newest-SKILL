// 获取每个部分扇形的曲线方程  
export function getParametricEquation(
    startRatio, // 开始角度
    endRatio, // 结束角度
    isSelected,
    isHovered,
    k,
    height
) {
    // 计算
    let midRatio = (startRatio + endRatio) / 2;

    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;

    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
        isSelected = false;
    }

    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    // k = typeof k !== 'undefined' ? k : 1 / 3;
    k = 1;

    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    offsetX -= 0.75; // 向左移动
    offsetY += 0.5;

    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    let hoverRate = isSelected ? 1.05 : 1;
    console.log('height ', height);
    height = isSelected ? 70 : 30;

    // 返回曲面参数方程
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
        },

        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
        },

        x: function (u, v) {
            if (u < startRadian) {
                return (
                    offsetX +
                    Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
            }
            if (u > endRadian) {
                return (
                    offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        y: function (u, v) {
            if (u < startRadian) {
                return (
                    offsetY +
                    Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
            }
            if (u > endRadian) {
                return (
                    offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
        },

        z: function (u, v) {
            if (u < -Math.PI * 0.5) {
                return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
                return Math.sin(u);
            }
            return Math.sin(v) > 0 ? 1 * height : -1;
        }
    };
}

// 生成模拟 3D 饼图的配置项
export function getPie3D(xData, originalData, colors, internalDiameterRatio) { // 透明的空心占比
    let series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    let legendData = [];
    let k =
        typeof internalDiameterRatio !== 'undefined'
            ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
            : 1 / 3;
    // -------------------
    let pieData = [];
    let sum = originalData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let yData = originalData.map(value => {
        return (value / sum) * 100;
    });
    for (let i = 0; i < xData.length; i++) {
        pieData.push(
            {
                name: xData[i],
                value: yData[i],
                itemStyle: {
                    color: colors[i]
                }
            }
        );
        legendData.push({
            name: xData[i],
            textStyle: {
                color: colors[i]
            }
        });
    }
    // ---------
    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;

        let seriesItem = {
            name:
                typeof pieData[i].name === 'undefined'
                    ? `series${i}`
                    : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k: k
            }
        };

        if (typeof pieData[i].itemStyle !== 'undefined') {
            let itemStyle = {};

            typeof pieData[i].itemStyle.color !== 'undefined'
                ? (itemStyle.color = pieData[i].itemStyle.color)
                : null;
            typeof pieData[i].itemStyle.opacity !== 'undefined'
                ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
                : null;

            seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        console.log(series[i]);
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = getParametricEquation(
            series[i].pieData.startRatio,
            series[i].pieData.endRatio,
            false,
            false,
            k,
            series[i].pieData.value
        );

        startValue = endValue;

        legendData.push(series[i].name);
    }


    series.push({
        name: 'pie2d',
        type: 'pie',
        label: {
            opacity: 1,
            fontSize: 12,
            lineHeight: 20,
            textStyle: {
                fontSize: 12
            }
        },
        labelLine: {
            length: 60,
            length2: 60
        },
        startAngle: -50, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['0', '0'],
        center: ['20%', '20%'],
        data: pieData,
        itemStyle: {
            opacity: 0
        }
    });
    let option = {
        legend: {
            data: legendData,
            icon: 'none',
            textStyle: {
                // color: '#fff',
                fontSize: 12
            },
            orient: 'horizontal',
            left: 'center',
            bottom: '0',
            itemGap: 20 // 设置图例项之间的间距
        },
        animation: true,
        tooltip: {
            formatter: (params) => {
                if (
                    params.seriesName !== 'mouseoutSeries' &&
                    params.seriesName !== 'pie2d'
                ) {
                    // console.log(params, '[');
                    let value = option.series[params.seriesIndex].pieData.value;
                    let rate = (value / sum).toFixed(2);
                    return `
                <div style="padding: 10px;">
                  <div style="margin-top: 3%;margin-left: 50%;transform: translateX(-50%)">${params.seriesName}</div>
                  <div style="margin: 10% 10px 0 0px">
                     <div>
                      数量：
                      <span style="margin-left: 2%">${originalData[params.seriesIndex]}</span>
                    </div>
                    <div>
                      占比：
                      <span style="margin-left: 2%">${rate * 100 + '%'}</span>
                    </div>
                  </div>
                </div>
                `;
                }
            },

            backgroundColor: 'transparent',
            padding: [0, 0],
            borderColor: 'transparent',
            textStyle: {
                color: '#fff',
                fontSize: 16
            }
        },
        labelLine: {
            show: false,
            lineStyle: {
                color: 'transparent'
            }
        },
        label: {
            show: false,
            color: 'transparent'
        },
        xAxis3D: {
            min: -1,
            max: 1
        },
        yAxis3D: {
            min: -1,
            max: 1
        },
        zAxis3D: {
            min: -1,
            max: 1
        },
        grid3D: {
            show: false,
            boxHeight: 0.5,
            //top: '30%',
            // bottom: '20%',

            viewControl: {
                distance: 280,
                alpha: 45, // 视角绕 x 轴，即上下旋转的角度
                beta: 60
            }
        },

        series: series
    };
    return option;
}

