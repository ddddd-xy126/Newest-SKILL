import store from "../../store/index";

export async function deleteTypes(types) {
  const App = store.state.wdpApp;
  const res = await App.Scene.ClearByTypes(types);
  return res;
}

export async function deleteObjs(objs) {
  const App = store.state.wdpApp;
  const res = await App.Scene.Delete(objs);
  return res;
}

export async function ClearByEids(eids) {
  const App = store.state.wdpApp;
  const res = await App.Scene.ClearByEids(eids);
  return res;
}
