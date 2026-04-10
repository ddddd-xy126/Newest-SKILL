export const defaultBaseBarOptionData = () => {
  return {
    name: "默认数据",
    data: [
      { value: 10, name: "默认1" },
      { value: 10, name: "默认2" },
    ],
  };
};

export const defaultDiffBarOptionData = () => {
  return {
    text: "默认数据",
    subtext: "默认数据sub",
    data: [
      { value: 10, name: "默认1" },
      { value: 10, name: "默认2" },
    ],
  };
};

//基础柱状图
export const defaultGradientColumnOptionData = () => {
  return {
    text: "设备数据",
    unit: "单位：台",
    // orientation: "horizontal", // 控制方向，"vertical"（垂直）或 "horizontal"（水平）
    orientation: "vertical", // 控制方向，"vertical"（垂直）或 "horizontal"（水平）
    color: "rgba(70, 137, 221, 1)",
    data: [
      { name: "A1层", value: 210 },
      { name: "A2层", value: 180 },
      { name: "A3层", value: 50 },
      { name: "B1层", value: 420 },
      { name: "B2层", value: 320 },
      { name: "C1层", value: 190 },
      { name: "C2层", value: 50 },
      { name: "环道", value: 320 },
    ],
  };
};

//水平柱状图
export const defaultHorizontalColumnOptionData = () => {
  return {
    orientation: "horizontal",
    color: "rgb(131, 217, 230, 1)",
    data: [
      { name: "A-305", value: 23 },
      { name: "A-308", value: 32 },
      { name: "A-310", value: 42 },
      { name: "A-312", value: 39 },
      { name: "A-316", value: 30 },
      { name: "茶水间", value: 27 },
    ],
  };
};

//任务状态颜色列表
export const taskStatusColorList = () => {
  return [
    "rgba(71, 140, 228, 1)",
    "rgba(121, 203, 214, 1)",
    "rgba(169, 134, 61, 1)",
  ];
};

// 任务状态柱状图数据
export const taskStatusColumnData = () => {
  return {
    text: "任务状态统计",
    // orientation: "vertical",
    orientation: "horizontal",
    data: [
      {
        date: "2024-10-06",
        values: [
          { name: "已完成", value: 400 },
          { name: "处理中", value: 160 },
          { name: "待处理", value: 200 },
        ],
      },
      {
        date: "2024-10-07",
        values: [
          { name: "已完成", value: 700 },
          { name: "处理中", value: 200 },
          { name: "待处理", value: 50 },
        ],
      },
      {
        date: "2024-10-08",
        values: [
          { name: "已完成", value: 230 },
          { name: "处理中", value: 410 },
          { name: "待处理", value: 200 },
        ],
      },
    ],
    yAxis: {
      max: 800,
      interval: 200,
    },
  };
};


//三个环形嵌套
export const defaultNestedRingData = () => {
  return {
    text: "三层环形嵌套",
    data: [
      {
        label: "外层",
        percent: "65.8%",
      },
      {
        label: "中层",
        percent: "30.0%",
      },
      {
        label: "内层",
        percent: "15.0%",
      },
    ],
  };
};

//进度条数据
export const defaultProgressBarData = () => {
  return {
    text: "进度",
    data: [
      {
        status: "占用中",
        value: 1097,
        percent: 53,
      },
      {
        status: "空闲中",
        value: 965,
        percent: 40,
      },
      {
        status: "紧急",
        value: 130,
        percent: 75,
      },
      {
        status: "一般",
        value: 70,
        percent: 35,
      },
    ],
  };
};

//对应圆形进度图表 默认数据
export const defaultCircleProgressData = () => {
  return {
    value: 75,
    max: 100,
    title: "默认进度",
    unit: "%",
  };
};

//对应柱状图 简单柱形图 数据
export const defaultSimpleColumn = () => {
  return {
    text: "简单柱形图",
    data: [
      { letter: "A", frequency: 0.08167 },
      { letter: "B", frequency: 0.01492 },
      { letter: "C", frequency: 0.02782 },
      { letter: "D", frequency: 0.04253 },
      { letter: "E", frequency: 0.12702 },
      { letter: "F", frequency: 0.02288 },
      { letter: "G", frequency: 0.02015 },
      { letter: "H", frequency: 0.06094 },
      { letter: "I", frequency: 0.06966 },
      { letter: "J", frequency: 0.00153 },
      { letter: "K", frequency: 0.00772 },
      { letter: "L", frequency: 0.04025 },
      { letter: "M", frequency: 0.02406 },
      { letter: "N", frequency: 0.06749 },
      { letter: "O", frequency: 0.07507 },
      { letter: "P", frequency: 0.01929 },
      { letter: "Q", frequency: 0.00095 },
      { letter: "R", frequency: 0.05987 },
      { letter: "S", frequency: 0.06327 },
      { letter: "T", frequency: 0.09056 },
      { letter: "U", frequency: 0.02758 },
      { letter: "V", frequency: 0.00978 },
      { letter: "W", frequency: 0.0236 },
      { letter: "X", frequency: 0.0015 },
      { letter: "Y", frequency: 0.01974 },
      { letter: "Z", frequency: 0.00074 },
    ],
  };
};

// 单折线数据
export const defaultSimpleLine = () => {
    return {
        xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        yData: [
            {
                name: '系列1',
                data: [20, 50, 25, 40, 25, 35, 50, 60, 70, 60, 70, 90]
            }
        ]
    }
}

// 多折线数据
export const defaultStackLine = () => {
    return {
        xData: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'],
        yData: [
            {
                name: '系列1',
                data: [230, 332, 201, 134, 90, 230, 210, 180]
            },
            {
                name: '系列2',
                data: [320, 232, 201, 234, 190, 330, 310, 280]
            },
            {
                name: '系列3',
                data: [320, 332, 301, 334, 290, 430, 410, 380]
            }
        ]
    }
}

export const defaultStackLineColorList = () => {
    return [
        '#2195E0', '#86E0ED', '#FEC551'
    ]
}

// 雷达图默认数据
export const defaultRadarData = () => {
    return {
        categories: ['房屋建筑物', '其他设备', '公共设备', '安防设备', '办公设备'],
        data: [
            {
                name: "数据1",
                value: [100, 83, 74, 81, 65]
            },
            // {
            //     name: "数据2",
            //     value: [50, 143, 195, 200, 60]
            // }
        ]
    };
};

// 定义默认颜色
export const defaultRingPieColors = () => {
    return ['117, 224, 253', '88, 178, 251', '250, 225, 72', '254, 191, 109', '38, 235, 169', '15, 29, 230', '252, 82, 167', '154, 96, 180'];
}
// 环形图默认数据
export const defaultRingPieData = () => {
    return {
        totalValue: 2103,
        totalLabel: '学生总数',
        categoryData: [
          { name: '专科生', value: 566 },
          { name: '本科生', value: 1387 },
          { name: '研究生', value: 100 },
          { name: '留学生', value: 50 }
        ]
      }
}


export const defaultColorList = () => {
    return [
        '78, 151, 245', '109, 158, 216', '254, 197, 81', '254, 191, 109', '38, 235, 169', '15, 29, 230', '252, 82, 167', '154, 96, 180'
    ]
}
