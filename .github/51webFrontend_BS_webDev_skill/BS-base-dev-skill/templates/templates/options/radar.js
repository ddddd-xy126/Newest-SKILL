import { countFontsize, fontColor } from "@utils/countFontsize.js";

const defaultRadarData = () => {
  return {
    categories: ["房屋建筑物", "其他设备", "公共设备", "安防设备", "办公设备"],
    data: [
      {
        name: "数据1",
        value: [100, 83, 74, 81, 65],
      },
    ],
  };
};

export const radarOption = (categories, data, isDefault = false) => {
  if (isDefault) {
    const defaultData = defaultRadarData();
    categories = defaultData.categories;
    data = defaultData.data;
  }

  const maxSetting = [150,300, 200, 300, 150];
  const colorList = ['67, 234, 238', '255, 158, 68', '255, 99, 132', '54, 162, 235', '153, 102, 255'];
  const indicator = categories.map((category, index) => ({
    name: category,
    max: maxSetting[index],
    color: fontColor(0.8),
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
              color: fontColor(0.8),
              fontSize: countFontsize(20),
            },
            areaStyle: {
              color: `rgba(${colorList[index]}, 0.5)`
            },
            lineStyle: {
              color: `rgba(${colorList[index]}, 1)`,
              width: 1
            },
            symbol: 'circle',
            symbolSize: 2,
            itemStyle: {
              color: '#fff',
              borderColor: 'rgba(67, 234, 238, 0.3)',
              borderWidth: 5
            }
          }
        ]
      }
  });

  return {
    backgroundColor: 'transparent',
    tooltip: {},
    radar: {
      radius: '62%',
      splitNumber: 6,
      axisLine: {
        lineStyle: {
          color: 'rgba(99, 108, 129, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(99, 108, 129, 0.5)',
            'rgba(99, 108, 129, 1)',
            'rgba(99, 108, 129, 0.95)',
            'rgba(99, 108, 129, 0.88)',
            'rgba(99, 108, 129, 0.88)',
            'rgba(99, 108, 129, 0.5)',
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
            'rgba(83, 83, 110, 0.4)',
            'rgba(83, 83, 110, 0.2)',
          ]
        }
      },
      indicator
    },
    series
  };
};
