import store from "../../store/index";

export async function splitBuildByName(build_id, floor) {
  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: "SplitBuildByName",
    args: {
      guid: "",
      build_id: build_id || "SH_HWLQH_F12",
      floor: floor || 0,
    },
  };
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}




//定制的状态接口 : ZHAF_AIJQR_DarkenScence,   ZHAF_AFGT_DarkenBuilding  ZHAF_HeatMap_Person
export async function customStatus(apiFuncName, status) {
  console.log("customStatus被调用了！！！！！！！！！！！！！:", apiFuncName, status);
  if (status && apiFuncName != "ZCGL_ZCPD") {
    console.log(apiFuncName, status);
    // 全局存入当前压暗
    store.commit("setDarkenStatus", {
      apiFuncName: apiFuncName,
      status: status,
    });
  }

  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: apiFuncName,
    args: {
      State: status,
    },
  };

  const res = await App.Customize.RunCustomizeApi(jsondata);

  return res;
}

// 定制警示接口【便捷通行-人员警示、车辆警示】
export async function customWarningStatus(apiFuncName, id, status) {
  console.log("customWarningStatus被调用了！！！！！！！！！！！！！:", apiFuncName, id, status);
  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: apiFuncName,
    args: {
      ID: id,
      State: status,
    },
  };

  const res = await App.Customize.RunCustomizeApi(jsondata);

  return res;
}

// 底纹特效 ZHAF_SPZJYJ_SpawnEffect
/**
 * @param {string} apiFuncName
 * @param {string} id 特效唯一标识符
 * @param {string} state create创建 delete删除
 * @param {Array} location
 * @param {string} scale 特效缩放
 */
export async function spawnEffect(
  apiFuncName,
  id = "1",
  state,
  location,
  scale
) {
  console.log("spawnEffect被调用了！！！！！！！！！！！！！:", apiFuncName, id, state, location, scale);
  const App = store.state.wdpApp;
  if (Array.isArray(location)) {
    location = location.join(",");
  }
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: apiFuncName,
    args: {
      ID: id,
      State: state,
      Location: location,
      Scale: scale,
    },
  };
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}
/*ID:1,2,3  分别代表三条路线
State： Play,Pause,Unpause,Stop
Rate:1  1代表跑完一整个路线需要100s,可根据需要修改，输入浮点类型即可
CameraLocation：相机偏移位置，单位:cm,输入格式x,y,z  (默认值:-600,0,400)
CameraRotation：相机偏移角度，单位：°,输入格式 pitch,yaw  (默认值:-15,0)
*/
export async function aiBotRoute(id, state, rate) {
  console.log("aiBotRoute被调用了！！！！！！！！！！！！！:", id, state, rate);
  const App = store.state.wdpApp;

  // 将AI机器人状态存储到Vuex全局状态中
  store.commit("setAiBotRouteState", state);

  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: "ZHAF_AIJQR_InspectionRoute",
    args: {
      ID: id,
      State: state,
      Rate: rate,
      CameraLocation: "-600,0,400",
      CameraRotation: "-15,0",
    },
  };
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}

export async function setStandbyMode(state) {
  console.log("setStandbyMode被调用了！！！！！！！！！！！！！:", state);
  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: "Demo_StandbyMode",
    args: {
      State: state,
    },
  };
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}

export async function customFn(apiFuncName, config) {
  console.log("customFn被调用了！！！！！！！！！！！！！:", apiFuncName, config);
  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    "apiClassName": "CustomApi",
    "apiFuncName": apiFuncName,
    "args": config || {
      "State": false
    }
  }
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}

export async function changeDarkColor(parameterName, color) {
  console.log("changeDarkColor被调用了！！！！！！！！！！！！！:", parameterName, color);
  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: "ChangeDarkColor",
    args: {
      ParameterName: parameterName,
      Color: color,
    },
  };
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}

export async function cameraFOV(id, type, state, location, rotation, scale) {
  console.log("cameraFOV被调用了！！！！！！！！！！！！！:", id, type, state, location, rotation, scale);
  const App = store.state.wdpApp;
  // customApi
  const jsondata = {
    apiClassName: "CustomApi",
    apiFuncName: "Camera_FOV",
    args: {
      ID: id,
      Type: type,
      State: state,
      Location: location,
      Rotation: rotation,
      Scale: scale,
    },
  };
  const res = await App.Customize.RunCustomizeApi(jsondata);
  return res;
}