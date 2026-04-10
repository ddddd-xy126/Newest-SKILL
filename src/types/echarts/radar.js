import { defaultRadarData } from '../defaultData.js'
import { countFontsize, fontColor } from "@utils/countFontsize.js";



export const radarOption = (categories, data,total, isDefault = false) => {
  
  console.log('radarOption', categories, data);
  if (isDefault) {
    const defaultData = defaultRadarData();
    categories = defaultData.categories;
    data = defaultData.data;
  }


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
            fontSize: countFontsize(18),

          },
          areaStyle: {
            color: `rgba(${colorList[index]}, 0.5)`
          },
          lineStyle: {
            color: `rgba(${colorList[index]}, 1)`,
            width: 1
          },
          symbol: 'circle',
          symbolSize: countFontsize(5),
          itemStyle: {
            color: '#fff',
            borderColor: 'rgba(67, 234, 238, 0.3)',
            borderWidth: 6
          }
        }
      ]
    }
  });

  return {
    backgroundColor: 'transparent',
    tooltip: {},
    radar: {
      radius: '60%',
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
      nameGap: countFontsize(32), // 调整标签与雷达图的距离，值越大距离越远
      name: {
        textStyle: {
          fontSize: countFontsize(24), // 你想要的字体大小
          color: "#C0DCE7"
        }
      }
    },
    series
  };
};
