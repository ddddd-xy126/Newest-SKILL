import store from "../../store/index";

export async function resetCamera(
  location = [113.72634104391929, 34.764407886177324, 596.2926739765313]
) {
  // const res=await App.CameraControl.GetCameraInfo()
  // console.log(res,'相机信息')
  const App = store.state.wdpApp;
  const jsondata = {
    location,
    locationLimit: [], //设置相机位置区域(至少三个坐标点,三角区域)[选填]
    rotation: {
      pitch: -26.699949264526367,
      yaw: -114.74992370605469
    },
    pitchLimit: [], // 俯仰角, 参考(-90~0)
    yawLimit: [], // 偏航角, 参考(-180~180)
    viewDistanceLimit: [],
    fieldOfView: 90, // 相机视锥横向视角[0, 120]
    controlMode: "RTS", // 控制模式; RTS (飞行模式); TPS (第三人称模式); FPS (第一人称模式)
    flyTime: 1, // 过渡时长(单位:秒)
  };
  // console.error(jsondata, '相机重置参数')
  await App.CameraControl.UpdateCamera(jsondata);
}

export async function FocusByCustomId(customId, yaw = 0, pitch = -40, distanceFactor = 0.8) {
  const App = store.state.wdpApp;
  const jsondata = {
    rotation: {
      pitch: pitch, //俯仰角(-90~0)
      yaw: yaw, //偏航角(-180~180; 0:东; 90:南; -90:北)
    },
    distanceFactor: distanceFactor, //视野参数范围范围[0.1~1]; 占满屏幕百分比
    flyTime: 1, //过渡时长(单位:秒)
  };

  await App.CameraControl.FocusByCustomId(customId, jsondata);
}

export async function FocusByPoints(
  point,
  distance = 0,
  pitch = -90,
  yaw = -110
) {
  console.log(point, 'point')
  const App = store.state.wdpApp;
  // cameraFocusPoints
  const jsondata = {
    targetPosition: point,
    rotation: {
      pitch: pitch, //俯仰角(-90~0)
      yaw: yaw, //偏航角(-180~180; 0:东; 90:南; -90:北)
    },
    distance, //距离(单位:米)
    flyTime: 1, //过渡时长(单位:秒)
  };
  const res = await App.CameraControl.FlyTo(jsondata);
  console.log("聚焦操坐标点:", res);
  return res
}



export async function getCameraInfo() {
  const App = store.state.wdpApp;
  const res = await App.CameraControl.GetCameraInfo();
  console.log(res, '相机信息');
  return res
}

// 可视域
export async function setCameraViewshed(location) {
  const App = store.state.wdpApp;

  const viewshed = new App.Viewshed({
    "location": location,
    "rotator": {
      "pitch": 0, //俯仰角, 参考(-180~180)
      "yaw": 0, //偏航角, 参考(-180~180)
      "roll": 0 //翻滚角, 参考(-180~180)
    },
    "viewshedStyle": {
      "fieldOfView": 20, //可视域水平视角范围(0~120)
      "radius": 30, //半径(单位:米)
      "outline": true, //轮廓
      "hiddenColor": "75fe97ff", //不可见区域颜色(HEXA颜色值)
      "visibleColor": "3cff71ff" //可见区域颜色(HEXA颜色值)
    },
    "bVisible": true,
    "entityName": "myName",
    "customId": "myId1",
    "customData": {
      "data": "myCustomData"
    }
  });

  const res = await App.Scene.Add(viewshed, {
    calculateCoordZ: {
      coordZRef: "ground", //surface:表面;ground:地面;altitude:海拔
      coordZOffset: 10 //高度(单位:米)
    }
  });
  return res
}



// 相机跟随实体
export async function followEntity(followParticle, config = {}) {
  const App = store.state.wdpApp;
  const jsondata = {
    followRotation: {
      pitch: config.pitch || -20, //俯仰角, 参考(-90~0)
      yaw: config.yaw || 12, //偏航角, 参考(-180~180; 0:东; 90:南; -90:北)
    },
    useRelativeRotation: true, //相对实体进行offset
    distance: config.distance || 5,
    bFPS: config.bFPS || true, //true 第一人称视角/false 第三人称视角
    entity: followParticle, //实体对象
  };

  const res = await App.CameraControl.Follow(jsondata);
  return res
}

export async function setCameraLimit(limitConfig = {}) {
  const App = store.state.wdpApp;
  const jsondata = {
    // "locationLimit": [ //设置相机位置区域(至少三个坐标点,三角区域)[选填]
    //   [121.47095414, 31.22534628],
    //   [121.47264982, 31.23423431],
    //   [121.49467492, 31.24871524]
    // ],
    "locationLimit": limitConfig.locationLimit || [],
    "pitchLimit": limitConfig.pitchLimit || [-89, 0], //俯仰角; 取值范围[-90~0]
    "yawLimit": limitConfig.yawLimit || [-180, 179.99899291992188], //偏航角; 取值范围[-180~180]
    "viewDistanceLimit": limitConfig.viewDistanceLimit || [1, 2000] //相机距离实体距离范围
  }

  const res = await App.CameraControl.SetCameraLimit(jsondata);
  return res
  console.log(res);
}