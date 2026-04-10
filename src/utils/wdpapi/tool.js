import store from "../../store/index";

export async function setSceneWeather(
  weather,
  duration = 3,
  isRealWeather = false
) {
  const App = store.state.wdpApp;

  const res = await App.Environment.SetSceneWeather(
    weather,
    duration,
    isRealWeather
  );
  //   const currentWeather = await App.Environment.GetSceneWeather();
  //   return { res, currentWeather };
  return res;
}

export async function setSceneTime(time, isRealtime) {
  const App = store.state.wdpApp;
  // console.error(App,time,'???????????')
  const res = await App.Environment.SetSkylightTime(time, 3, isRealtime);
  return res;
}

export async function pickPoint(isPick = false, location = "ground") {
  const App = store.state.wdpApp;
  if (isPick) {
    const res = await App.Tools.PickerPoint.StartPickPoint(
      true,
      true,
      location
    );
    return res;
  } else {
    const res = await App.Tools.PickerPoint.EndPickPoint();
    return res;
  }
}

export async function getPoints(location = "surface") {
  const App = store.state.wdpApp;
  const {
    result: { pickedPoints },
  } = await App.Tools.PickerPoint.GetPickedPoints(location);
  //参数: Surface:表面;Ground:地面;Altitude:海拔
  return pickedPoints;
}
