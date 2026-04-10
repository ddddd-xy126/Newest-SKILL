import { countSize } from "@/utils/countSize.js";
import store from "../../store/index.js";
const data = [
  [117.06218139628594, 31.821275180781807, 0],
  [117.07577368156284, 31.822124558495982, 0],
  [117.06980303633019, 31.81121371210059, 0],
  [117.08437677711551, 31.81182049610212, 0],
];

//批量添加POI点位
export async function addPOI(
  data,
  type,
  coordZOffset = 3,
  entityName = "AI摄像头",
  personnelInfo = null,
  markerConfig = {},
  coordZRef = null
) {
  const App = store.state.wdpApp;
  const sourceUrl = store.state.wdpConfig.sourceUrl;
  let markerSize = [countSize(40), countSize(40)];
  if (markerConfig.markerSize) {
    markerSize = markerConfig.markerSize;
    markerSize = [countSize(markerSize[0]), countSize(markerSize[1])];
  }

  const normal = {
    // ========== 通用样式
    type: "Poi",
    poiStyle: {
      markerNormalUrl: sourceUrl + (markerConfig.markerNormalUrl || "monitor.png"),
      markerActivateUrl: sourceUrl + (markerConfig.markerActivateUrl || "monitor_active.png"),
      markerSize: markerSize,
      labelBgImageUrl: "",
      labelBgSize: [150, 50],
      labelBgOffset: [50, 70], // label可以向上下左右偏移；当[0,0]时，label切图的左上角对齐location (x,y 单位:像素)
      labelContent: [],
      scrollSpeed: 2, // 文本滚动速度(0:不滚动)
      textBoxWidth: 80, // 文本框宽度(默认100)
      labelContentOffset: [5, 5], // labeContent可以向上下左右偏移; 当[0,0]时，labelContent的左上角对齐label的左上角 (x,y 单位:像素)
      labelTop: true, //label是否置于marker顶层
      labelContentJustification: "Left", //文本内容对齐方式: Left, Center, Right
      labelContentAutoWrap: true, //label内容是否自动换行
      scrollPolicy: "default", //文本长度超过文本框时滚动; always: 总是滚动
    },
    bVisible: true,
    visible2D: {
      camera: {
        hideDistance: 3000, //定义实体隐藏的距离(单位:米),相机超过此距离时,实体会被隐藏
        hideType: "default", //实体超出显示距离(none:不显示; default:圆圈显示)
        scaleMode: "2D", //是否受相机的透视影响(2D:不影响; 3D:影响)；透视包括近大远小、overlapOrder生效
      },
      interaction: {
        //被"交互"影响的可见性(POI有效)
        clickTop: true, //当发生点击(优先级高于滑过)时,需要显示在最上层
        hoverTop: true, //当发生滑过时，需要显示在最上层
      },
      entity: {
        overlapOrder: 1, // 跨2D覆盖物类型的层级设置，当scaleMode为2D时生效; 数值越大越在最上层；范围[1~10]
      },
    },
  };

  let dataArr = data.map((e, index) => {
    // 构建customData，如果有人员信息则使用，否则使用默认值
    let customData = {};

    // 如果传入了人员信息，将其添加到customData中
    if (personnelInfo) {
      if (Array.isArray(personnelInfo) && personnelInfo[index]) {
        // 如果人员信息是数组，使用对应索引的信息
        customData = {
          ...personnelInfo[index],
        };
      }
    }
    // console.log('customData',customData)

    return {
      location: e,
      customId: "myId" + entityName + index,
      entityName: entityName + index, //可选
      customData: customData,
    };
  });

  const res = await App.Scene.Create(normal, dataArr, {
    //  [可选] 坐标类型及坐标高度; 最高优先级
    calculateCoordZ: {
      coordZRef: coordZRef, // surface: 表面; ground: 地面; altitude: 海拔
      coordZOffset: coordZOffset, // 高度(单位:米)
    },
  });
  // console.log(res,'添加poi的结果');
  return res;
}
//
// 获取到config 的 resolution 的宽
// 与 3840 做一个 比例
//假如现在是 1920px , 那么就获取到一个 比例 1920/3840  = 0.5
export async function addWINDOWS(
  location,
  entityName,
  customId,
  size = [500, 350],
  coordZOffset = 3,
  windowOptions = {},
  offset = [23, 40],
  isShow = true //二次添加时是否需要清楚第一次的窗口
) {
  const App = store.state.wdpApp;
  if (isShow) {
    const types = ["Window"];
    await App.Scene.Covering.ClearByTypes(types);
  }
  size = [countSize(size[0]), countSize(size[1])];
  offset = [countSize(offset[0]), countSize(offset[1])];


  const baseUrlTitle = window.location.origin + window.location.pathname + window.location.search;
  console.log(baseUrlTitle, 'baseUrlTitle')
  const baseUrl = baseUrlTitle + "#/wdpWindow";
  console.log(baseUrl, 'baseUrl')
  // 构建 wdpWindow 页面的 URL
  // const baseUrl = process.env.VUE_APP_WINDOW_BASE_URL + "/#/wdpWindow";
  // 构建查询参数
  const queryParams = new URLSearchParams({
    type: windowOptions.type || "type1", // 默认类型1
    bgType: windowOptions.bgType || "bg1", // 默认背景类型1
    url: windowOptions.url || "", // RTSP 流地址
    title: windowOptions.title || "默认标题", // 视频标题
    width: `${size[0]}px`,
    height: `${size[1]}px`,
    isShowCloseBtn: windowOptions.isShowCloseBtn !== undefined ? windowOptions.isShowCloseBtn : 'true',
    p_eid: windowOptions.p_eid || null,
    ...windowOptions.customParams, // 其他自定义参数
  });

  const windowUrl = `${baseUrl}?${queryParams.toString()}`;

  console.log("构建的窗口URL31231:", windowUrl);

  const windowObj = new App.Window({
    location: location,
    windowStyle: {
      url: windowUrl,
      size: size, //window大小(单位:像素)
      offset: offset, //x>0,y>0 向右、上偏移(x,y 单位:像素)
    },
    entityName: entityName,
    customId: customId,
    customData: {
      data: windowOptions.customParams,
      windowType: windowOptions.type || "type1",
      rtspUrl: windowOptions.rtspUrl,
    },
    bVisible: true,
    visible2D: {
      camera: {
        hideDistance: 2000, //定义实体隐藏的距离(单位:米),相机超过此距离时,实体会被隐藏
        hideType: "default", //实体超出显示距离(none:不显示; default:圆圈显示)
        scaleMode: "2D", //是否受相机的透视影响(2D:不影响; 3D:影响)
      },
      interaction: {
        //被"交互"影响的可见性(POI有效)
        hoverTop: true, //当发生滑过时，需要显示在最上层
      },
      entity: {
        overlapOrder: windowOptions.overlapOrder || 2, //重叠层级; 数值越大越浮在最上层；范围[1~10]
      },
    },
  });

  const res = await App.Scene.Add(windowObj, {
    calculateCoordZ: {
      coordZRef: windowOptions.coordZRef || "ground", //surface:表面;ground:地面;altitude:海拔
      coordZOffset: coordZOffset, //高度(单位:米)
    },
  });

  return res;
}

// 添加区域轮廓
export async function addRange(data, config = {}, coordZRef = 'Ground', coordZOffset = 2) {
  const App = store.state.wdpApp;
  const range = new App.Range({
    polygon2D: {
      coordinates: [data],
    },
    rangeStyle: {
      type: config.type || "stripe", //类型
      fillAreaType: config.fillAreaType || "none", //底部区域填充类型
      height: config.height || 30, //围栏 高度(单位:米)
      strokeWeight: config.strokeWeight || 8, //底部轮廓线宽度(单位:米; 注: 区域中含有内环"innerLoops"时无效)
      color: config.color || "rgba(71,161,181,1)", //HEXA或rgba(0,0,0,0.8)
    },
    entityName: "myRangeName",
    customId: "myRangeId",
    customData: {
      data: "myCustomData",
    },
  });
  //tip::: 向场景中添加实体
  const res = await App.Scene.Add(range, {
    calculateCoordZ: {
      //[可选] 最高优先级
      coordZRef: coordZRef, //Surface:表面;Ground:地面;Altitude:海拔
      coordZOffset: coordZOffset, //高度(单位:米)
    },
  });
  // console.log(res,'添加range的结果');
  return res;
}

export async function addParticle(location, config = {}, coordZRef = "ground", coordZOffset = 5) {
  const App = store.state.wdpApp
  const particle = new App.Particle({
    "location": location || [121.50007292, 31.22579403, 30],
    "rotator": {
      "pitch": config.pitch || 0, //俯仰角, 参考(-180~180)
      "yaw": config.yaw || 30, //偏航角, 参考(-180~180)
      "roll": config.roll || 0 //翻滚角, 参考(-180~180)
    },
    "scale3d": config.scale3d || [30, 30, 30],
    "particleType": config.particleType || "vehicle_taxi",
    "bVisible": true,
    "entityName": config.entityName || "particleName",
    "customId": config.customId || "particleId",
    "customData": {
      "data": "myCustomData"
    }
  });


  const res = await App.Scene.Add(particle, {
    calculateCoordZ: {
      coordZRef: coordZRef, //surface:表面;ground:地面;altitude:海拔
      coordZOffset: coordZOffset //高度(单位:米)
    }
  });
  return res
}

export async function addPath(data, config = {}) {
  const App = store.state.wdpApp;
  const path = new App.Path({
    polyline: {
      coordinates: data,
    },
    pathStyle: {
      type: config.type || "arrow",
      width: config.width || 3, //线宽(单位:米)
      color: config.color || "rgba(255, 255, 255, 1)",
      passColor: config.passColor || "rgba(220, 184, 94, 1)", //仅在type为"flow"时有效
    },
    bVisible: true,
    entityName: config.entityName || "默认路径",
    customId: config.customId || "path_01",
    customData: {
      data: "myCustomData",
    },
  });

  console.log('======?>', config)

  const res = await App.Scene.Add(path, {
    calculateCoordZ: {
      coordZRef: config.coordZRef || "", //surface:表面;ground:地面;altitude:海拔
      coordZOffset: config.coordZOffset || '' //高度(单位:米)
    }
  });
  return res;
}

export async function coveringMove(moveObj, pathObj, config = {}) {
  const App = store.state.wdpApp;
  // ========== 实体(小车) 沿路径移动
  const obj = new App.Bound({
    moving: moveObj, //移动的实体对象
    path: pathObj, //路径对象
    boundStyle: {
      time: 120, //总时长(单位:秒)
      bReverse: false, //是否反向移动(true/false)；false为正向移动，true为反向移动
      bLoop: true, //是否循环(true/false)；true为循环移动，false为到达终点后终止
      bVisible: true, //是否可见(true/false)；同时控制实体和路径的可见性
      state: "play", //play:移动; pause:暂停; stop:停止
    },
    offset: {
      // 原始设置清空，使用自动匹配，相对位置调整用offset
      left: config.left || 0, //实体相对路径走向的左右调整，左+，右-，单位：米
      forward: config.forward || 0, //实体沿着路径的前后调整，前+，后-，单位：米
      up: config.up || 0, //实体相对路径走向的垂直上下，上+，下-，单位：米
    },
    rotator: {
      // 原始设置清空，使用自动匹配，相对角度调整用rotator
      // "pitch": 0, //相对路径的俯仰角，上+，下-，参考(-180~180)
      // "yaw": 30, //相对路径的偏航角, 左+，右-，参考(0沿路径, -180~180)
      // "roll": 0 //相对路径的翻滚角,左+，右-， 参考(-180~180)
    },
  });
  await App.Scene.Add(obj);
}

export async function addText3d(location, config = {}, coordZRef = "ground", coordZOffset = 20) {
  const App = store.state.wdpApp;
  const text3d = new App.Text3D({
    "location": location || [121.46434372, 31.23499129, 60],
    "rotator": {
      "pitch": config.pitch || 0, //俯仰角, 参考(-180~180)
      "yaw": config.yaw || 0, //偏航角, 参考(-180~180)
      "roll": config.roll || 0 //翻滚角, 参考(-180~180)
    },
    "scale3d": config.scale3d || [100, 30, 30],
    "text3DStyle": {
      "text": config.text || "3D文字",
      "color": config.color || "ff00ff", //HEX或rgba(0,0,0)
      "type": config.type || "plain", //样式(plain; reflection; metal)
      "outline": config.outline || 0.4, //轮廓(单位:百分比), 取值范围[0~1]
      "portrait": config.portrait || false, //纵向(true/false)
      "space": config.space || 0.1 //间距(单位:米)
    },
    "bVisible": true,
    "entityName": config.entityName || "myName",
    "customId": config.customId || "myId1",
    "customData": {
      "data": "myCustomData"
    }
  });

  const res = await App.Scene.Add(text3d, {
    calculateCoordZ: {
      coordZRef: coordZRef, //surface:表面;ground:地面;altitude:海拔
      coordZOffset: coordZOffset //高度(单位:米)
    }
  });
  return res;
}

export async function addParabola(data, config = {}, coordZRef = "ground", coordZOffset = 0) {
  const App = store.state.wdpApp;
  const parabola = new App.Parabola({
    parabola: {
      coordinates: data, // [start, end]
    },
    parabolaStyle: {
      color: config.color || "rgba(255, 165, 0, 1)", // Default orange
      width: config.width || 10,
      topHeight: config.topHeight || 100,
      speed: config.speed || 1.0,
    },
    bVisible: true,
    entityName: config.entityName || "Parabola",
    customId: config.customId || "Parabola_" + Date.now(),
    customData: {
      data: "ParabolaData"
    }
  });

  const res = await App.Scene.Add(parabola, {
    calculateCoordZ: {
      coordZRef: coordZRef,
      coordZOffset: coordZOffset
    }
  });
  return res;
}
